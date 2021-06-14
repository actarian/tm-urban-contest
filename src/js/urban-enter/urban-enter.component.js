import { Component, getContext } from 'rxcomp';

export class UrbanEnterComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		this.node = node;
		this.onScroll = this.onScroll.bind(this);
		window.addEventListener('scroll', this.onScroll);
		this.onScroll();
	}

	onDestroy() {
		window.removeEventListener('scroll', this.onScroll);
	}

	onScroll() {
		const w = window.innerWidth;
		const h = window.innerHeight;
		const node = this.node;
		const rect = node.getBoundingClientRect();
		let pow = Math.max(0, Math.min(1, 1 - (rect.top - h / 2) / (h / 2)));
		if (pow > 0) {
			node.classList.add('enter');
		} else {
			node.classList.remove('enter');
		}
	}
}

UrbanEnterComponent.meta = {
	selector: '[urban-enter]',
};
