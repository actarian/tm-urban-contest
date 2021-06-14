import { Component, getContext } from 'rxcomp';
import { fromEvent, interval, merge, race } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

export class InputValueComponent extends Component {

	onInit() {
		this.label = this.label || 'label';
		this.value = this.value || 0;
		this.precision = this.precision || 3;
		this.increment = this.increment || 1 / Math.pow(10, this.precision);
		this.disabled = this.disabled || false;
		this.increment$('.btn--more', 1)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((event) => {
				// console.log('InputValueComponent.increment$', event);
				this.value += event;
				this.update.next(this.value);
				this.pushChanges();
			});
		this.increment$('.btn--less', -1)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((event) => {
				// console.log('InputValueComponent.increment$', event);
				this.value += event;
				this.update.next(this.value);
				this.pushChanges();
			});
		const { node } = getContext(this);
		const input = this.input = node.querySelector('input');
		// fromEvent(input, 'change')
		merge(
			fromEvent(input, 'input')
		).pipe(takeUntil(this.unsubscribe$)).subscribe(event => this.onInputDidChange(event));
		merge(
			fromEvent(input, 'blur'),
			fromEvent(input, 'keydown').pipe(
				filter(event => (event.key === 'Enter' || event.keyCode === 13)),
			)
		).pipe(takeUntil(this.unsubscribe$)).subscribe(event => this.onInputDidBlur(event));
		// fromEvent(node, 'focus').pipe(takeUntil(this.unsubscribe$)).subscribe(event => this.onFocus(event));
	}

	onInputDidChange(event) {
		// const node = getContext(this).node;
		// const value = node.value === '' ? null : node.value;
		event.target.value = event.target.value.replace(/[^\d|\.|-]/g, '');
		// console.log('InputValueComponent.onInputDidChange', event.target.value);
		/*
		const value = parseFloat(event.target.value);
		if (this.value !== value) {
			if (value !== NaN) {
				this.value = value;
				this.update.next(this.value);
			}
		}
		*/
	}

	onInputDidBlur(event) {
		// this.control.touched = true;
		// console.log('InputValueComponent.onInputDidBlur', event.target.value);
		const value = parseFloat(this.input.value);
		if (this.value !== value) {
			if (value !== NaN) {
				this.value = value;
				this.update.next(this.value);
			} else {
				this.input.value = this.getValue();
			}
		}
	}

	increment$(selector, sign) {
		const { node } = getContext(this);
		const element = node.querySelector(selector);
		let m, increment;
		return race(fromEvent(element, 'mousedown'), fromEvent(element, 'touchstart')).pipe(
			tap(() => {
				increment = this.increment;
				m = 16;
			}),
			switchMap((e) => {
				return interval(30).pipe(
					filter((i) => {
						return i % m === 0;
					}),
					map(() => {
						const i = increment * sign;
						// increment = Math.min(this.increment * 100, increment * 2);
						m = Math.max(1, Math.floor(m * 0.85));
						return i;
					}),
					// startWith(increment * sign),
					takeUntil(race(fromEvent(element, 'mouseup'), fromEvent(element, 'touchend')))
				);
			})
		);
	}

	getValue() {
		return this.value.toFixed(this.precision);
	}

	setValue(sign) {
		this.value += this.increment * sign;
		this.update.next(this.value);
		this.pushChanges();
	}

}

InputValueComponent.meta = {
	selector: 'input-value',
	outputs: ['update'],
	inputs: ['value', 'label', 'precision', 'increment', 'disabled'],
	template: /* html */ `
		<div class="group--control" [class]="{ disabled: disabled }">
			<input type="text" class="control--text" [placeholder]="label" [value]="getValue()" [disabled]="disabled" />
			<div class="control--trigger">
				<div class="btn--more" (click)="setValue(1)">+</div>
				<div class="btn--less" (click)="setValue(-1)">-</div>
			</div>
		</div>
	`
};
