import { Directive, getContext } from 'rxcomp';

export class LabelForDirective extends Directive {

	onChanges() {
		const { node } = getContext(this);
		node.setAttribute('for', this.labelFor);
	}

}

LabelForDirective.meta = {
	selector: '[labelFor]',
	inputs: ['labelFor']
};
