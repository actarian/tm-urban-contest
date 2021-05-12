export class UrbanForm {

	constructor(node) {
		this.node = node;
		this.currentStep = 0;
		this.onNext = this.onNext.bind(this);
		this.onPrev = this.onPrev.bind(this);
		const steps = this.steps = Array.prototype.slice.call(node.querySelectorAll('.steps__item'));
		const nexts = this.nexts = Array.prototype.slice.call(node.querySelectorAll('.btn--next'));
		nexts.forEach(next => {
			next.addEventListener('click', this.onNext);
		});
		const prevs = this.prevs = Array.prototype.slice.call(node.querySelectorAll('.btn--prev'));
		prevs.forEach(prev => {
			prev.addEventListener('click', this.onPrev);
		});
		this.update();
	}

	destroy() {
		const nexts = this.nexts;
		nexts.forEach(next => {
			next.removeEventListener('click', this.onNext);
		});
		const prevs = this.prevs;
		prevs.forEach(prev => {
			prev.removeEventListener('click', this.onPrev);
		});
	}

	update() {
		this.steps.forEach((step, i) => {
			i === this.currentStep ? step.classList.add('active') : step.classList.remove('active');
		});
	}

	onNext() {
		if (this.currentStep < 3) {
			this.currentStep++;
		}
		this.update();
	}

	onPrev() {
		if (this.currentStep > 0) {
			this.currentStep--;
		}
		this.update();
	}

	static items = [];

	static init() {
		return this.items = Array.prototype.slice.call(document.querySelectorAll('[urban-form]')).map(node => new UrbanForm(node));
	}

	static destroy() {
		return this.items.forEach(item => item.destroy());
	}
}
