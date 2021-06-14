import { LabelPipe } from '../common/label/label.pipe';
import { ControlComponent } from './control.component';

export class ErrorsComponent extends ControlComponent {

	getLabel(key, value) {
		const label = LabelPipe.transform(`error_${key}`);
		return label;
	}

}

ErrorsComponent.meta = {
	selector: 'errors-component',
	inputs: ['control'],
	template: /* html */ `
	<div class="inner" [style]="{ display: control.invalid && control.touched ? 'block' : 'none' }">
		<div class="error" *for="let [key, value] of control.errors">
			<span [innerHTML]="getLabel(key, value)"></span>
			<!-- <span class="key" [innerHTML]="key"></span> <span class="value" [innerHTML]="value | json"></span> -->
		</div>
	</div>
	`
};
