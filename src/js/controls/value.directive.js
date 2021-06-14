import { Directive, getContext } from 'rxcomp';

export class ValueDirective extends Directive {

	onChanges(changes) {
		const { node } = getContext(this);
		// console.log('ValueDirective.onChanges', this.value);
		node.value = this.value;
		node.setAttribute('value', this.value);
	}

}

ValueDirective.meta = {
	selector: '[value]',
	inputs: ['value'],
};
