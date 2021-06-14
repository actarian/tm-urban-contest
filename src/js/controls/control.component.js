import { Component, getContext } from 'rxcomp';

export class ControlComponent extends Component {

	onChanges() {
		const { node } = getContext(this);
		// console.log(this, node, this.control);
		const control = this.control;
		const flags = control.flags;
		Object.keys(flags).forEach((key) => {
			flags[key] ? node.classList.add(key) : node.classList.remove(key);
		});
	}

}

ControlComponent.meta = {
	selector: '[control]',
	inputs: ['control']
};
