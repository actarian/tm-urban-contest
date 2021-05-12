export class UrbanVideo {

	constructor(node) {
		this.node = node;
		this.onClick = this.onClick.bind(this);
		node.addEventListener('click', this.onClick);
	}

	destroy() {
		const node = this.node;
		node.removeEventListener('click', this.onClick);
	}

	onClick() {
		const node = this.node;
		const video = node.querySelector('video');
		if (video.paused) {
			video.play();
			node.classList.add('playing');
		} else {
			video.pause();
			node.classList.remove('playing');
		}
	}

	static items = [];

	static init() {
		return this.items = Array.prototype.slice.call(document.querySelectorAll('[urban-video]')).map(node => new UrbanVideo(node));
	}

	static destroy() {
		return this.items.forEach(item => item.destroy());
	}
}
