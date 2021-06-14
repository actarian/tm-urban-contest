import { Component, getContext } from 'rxcomp';

export class UrbanVideoComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		this.node = node;
		this.onClick = this.onClick.bind(this);
		node.addEventListener('click', this.onClick);
	}

	onDestroy() {
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

}

UrbanVideoComponent.meta = {
	selector: '[urban-video]',
};
