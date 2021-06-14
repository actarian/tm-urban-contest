import { Component } from 'rxcomp';

export class TestComponent extends Component {

	onTest(event) {
		this.test.next(event);
	}

	onReset(event) {
		this.reset.next(event);
	}

}

TestComponent.meta = {
	selector: 'test-component',
	inputs: ['form'],
	outputs: ['test', 'reset'],
	template: /* html */ `
	<div class="test-component" *if="!('production' | flag)">
		<div class="test-component__title">development mode</div>
		<code [innerHTML]="form.value | json"></code>
		<button type="button" class="btn--submit" (click)="onTest($event)"><span>test</span></button>
		<button type="button" class="btn--submit" (click)="onReset($event)"><span>reset</span></button>
	</div>
	`
};
