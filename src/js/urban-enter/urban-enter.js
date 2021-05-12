export class UrbanEnter {

	constructor(node) {
		this.node = node;
		this.currentStep = 0;
		this.onScroll = this.onScroll.bind(this);
		window.addEventListener('scroll', this.onScroll);
		this.onScroll();
	}

	destroy() {
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

	static items = [];

	static init() {
		return this.items = Array.prototype.slice.call(document.querySelectorAll('[urban-enter]')).map(node => new UrbanEnter(node));
	}

	static destroy() {
		return this.items.forEach(item => item.destroy());
	}
}
