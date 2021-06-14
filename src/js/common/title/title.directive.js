import { Directive, getContext } from 'rxcomp';

export class TitleDirective extends Directive {
	set title(title) {
		if (this.title_ !== title) {
			this.title_ = title;
			const { node } = getContext(this);
			title ? node.setAttribute('title', title) : node.removeAttribute('title');
		}
	}
	get title() {
		return this.title_;
	}
}

TitleDirective.meta = {
	selector: '[[title]]',
	inputs: ['title'],
};
