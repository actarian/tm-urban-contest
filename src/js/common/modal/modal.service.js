import { from, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export class ModalEvent {

	constructor(data) {
		this.data = data;
	}

}

export class ModalResolveEvent extends ModalEvent { }
export class ModalRejectEvent extends ModalEvent { }

export class ModalService {

	static hasModal = false;

	static open$(modal) {
		return this.getTemplate$(modal.src).pipe(
			map(template => {
				return { node: this.getNode(template), data: modal.data, modal: modal };
			}),
			tap(node => {
				this.modal$.next(node);
				this.hasModal = true;
			}),
			switchMap(node => this.events$),
			tap(_ => this.hasModal = false)
		)
	}

	static load$(modal) {

	}

	static getTemplate$(url) {
		return from(fetch(url).then(response => {
			return response.text();
		}));
	}

	static getNode(template) {
		const div = document.createElement('div');
		div.innerHTML = template;
		const node = div.firstElementChild;
		return node;
	}

	static reject(data) {
		this.modal$.next(null);
		this.events$.next(new ModalRejectEvent(data));
	}

	static resolve(data) {
		this.modal$.next(null);
		this.events$.next(new ModalResolveEvent(data));
	}

}

ModalService.modal$ = new Subject();
ModalService.events$ = new Subject();
