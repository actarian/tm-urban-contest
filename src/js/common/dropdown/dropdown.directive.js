import { Directive, getContext } from 'rxcomp';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

let DROPDOWN_ID = 1000000;

export class DropdownDirective extends Directive {

	get id() {
		return this.dropdown || this.id_ || (this.id_ = DropdownDirective.nextId());
	}

	onInit() {
		const { node } = getContext(this);
		const trigger = node.getAttribute('dropdown-trigger');
		this.trigger = trigger ? node.querySelector(trigger) : node;
		this.opened = null;
		this.onClick = this.onClick.bind(this);
		this.onDocumentClick = this.onDocumentClick.bind(this);
		this.openDropdown = this.openDropdown.bind(this);
		this.closeDropdown = this.closeDropdown.bind(this);
		this.addListeners();
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(id => {
			// console.log('DropdownDirective', id, this['dropdown-item']);
			if (this.id === id) {
				node.classList.add('dropped');
			} else {
				node.classList.remove('dropped');
			}
		});
	}

	onClick(event) {
		const { node } = getContext(this);
		if (this.opened === null) {
			this.openDropdown();
		} else {
			const dropdownItemNode = node.querySelector('[dropdown-item]');
			// console.log('dropdownItemNode', dropdownItemNode);
			if (!dropdownItemNode) { // if (this.trigger !== node) {
				this.closeDropdown();
			}
		}
	}

	onDocumentClick(event) {
		const { node } = getContext(this);
		const clickedInside = node === event.target || node.contains(event.target);
		if (!clickedInside) {
			this.closeDropdown();
		}
	}

	openDropdown() {
		if (this.opened === null) {
			this.opened = true;
			this.addDocumentListeners();
			DropdownDirective.dropdown$.next(this.id);
			this.dropped.next(this.id);
		}
	}

	closeDropdown() {
		if (this.opened !== null) {
			this.removeDocumentListeners();
			this.opened = null;
			if (DropdownDirective.dropdown$.getValue() === this.id) {
				DropdownDirective.dropdown$.next(null);
				this.dropped.next(null);
			}
		}
	}

	addListeners() {
		this.trigger.addEventListener('click', this.onClick);
	}

	addDocumentListeners() {
		document.addEventListener('click', this.onDocumentClick);
	}

	removeListeners() {
		this.trigger.removeEventListener('click', this.onClick);
	}

	removeDocumentListeners() {
		document.removeEventListener('click', this.onDocumentClick);
	}

	onDestroy() {
		this.removeListeners();
		this.removeDocumentListeners();
	}

	static nextId() {
		return DROPDOWN_ID++;
	}

}

DropdownDirective.meta = {
	selector: '[dropdown]',
	inputs: ['dropdown', 'dropdown-trigger'],
	outputs: ['dropped']
};

DropdownDirective.dropdown$ = new BehaviorSubject(null);
