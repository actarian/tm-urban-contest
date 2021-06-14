import { Directive, getContext } from 'rxcomp';

export class DisabledDirective extends Directive {

	onChanges() {
		const { node } = getContext(this);
		// console.log('DisabledDirective.onChanges', this.disabled);
		if (this.disabled === true) {
			node.disabled = this.disabled;
			node.setAttribute('disabled', this.disabled);
		} else {
			delete node.disabled;
			node.removeAttribute('disabled');
		}
	}

}

DisabledDirective.meta = {
	selector: 'input[disabled],textarea[disabled]',
	inputs: ['disabled'],
};
