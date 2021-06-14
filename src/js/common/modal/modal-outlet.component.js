import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from './modal.service';

export class ModalOutletComponent extends Component {
	get modal() {
		return this.modal_;
	}

	set modal(modal) {
		// console.log('ModalOutletComponent set modal', modal, this);
		const { module } = getContext(this);
		if (this.modal_ && this.modal_.node) {
			module.remove(this.modal_.node, this);
			this.modalNode.removeChild(this.modal_.node);
		}
		if (modal && modal.node) {
			this.modal_ = modal;
			this.modalNode.appendChild(modal.node);
			const instances = module.compile(modal.node);
		}
		this.modal_ = modal;
		this.pushChanges();
	}

	onInit() {
		const { node } = getContext(this);
		this.modalNode = node.querySelector('.modal-outlet__modal');
		ModalService.modal$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(modal => {
			this.modal = modal;
		});
	}

	reject(event) {
		ModalService.reject();
	}
}

ModalOutletComponent.meta = {
	selector: '[modal-outlet]',
	template: /* html */ `
	<div class="modal-outlet__container" [class]="{ active: modal }">
		<div class="modal-outlet__background" (click)="reject($event)"></div>
		<div class="modal-outlet__modal"></div>
	</div>
	`
};
