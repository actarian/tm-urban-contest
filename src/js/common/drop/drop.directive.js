import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';

export class DropDirective extends Directive {

	onInit() {
		const { module, node, parentInstance, selector } = getContext(this);
		const event = 'drop';
		const event$ = fromEvent(node, event).pipe(shareReplay(1));
		const expression = node.getAttribute(`(${event})`);
		if (expression) {
			const outputFunction = module.makeFunction(expression, ['$event']);
			event$.pipe(
				takeUntil(this.unsubscribe$)
			).subscribe(event => {
				module.resolve(outputFunction, parentInstance, event);
			});
			fromEvent(node, 'dragover').pipe(
				takeUntil(this.unsubscribe$)
			).subscribe(event => event.preventDefault());
		} else {
			parentInstance[`${event}$`] = event$;
		}
		// console.log('DropDirective.onInit', 'selector', selector, 'event', event);
	}

}

DropDirective.meta = {
	selector: `[(drop)]`,
};
