import { Directive, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { DropdownDirective } from './dropdown.directive';

export class DropdownItemDirective extends Directive {

	get id() {
		return this['dropdown-item'];
	}

	onInit() {
		const { node } = getContext(this);
		node.classList.add('dropdown-item');
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(id => {
			// console.log('DropdownItemDirective', id, this['dropdown-item']);
			if (this.id === id) {
				node.classList.add('dropped');
			} else {
				node.classList.remove('dropped');
			}
		});
	}

}

DropdownItemDirective.meta = {
	selector: '[dropdown-item], [[dropdown-item]]',
	inputs: ['dropdown-item']
};
