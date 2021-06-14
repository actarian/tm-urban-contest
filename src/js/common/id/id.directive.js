import { Directive, getContext } from 'rxcomp';

export class IdDirective extends Directive {

	onChanges() {
		const { node } = getContext(this);
		node.setAttribute('id', this.id);
	}

}

IdDirective.meta = {
	selector: '[id]',
	inputs: ['id']
};
