import { ControlComponent } from './control.component';

export class ControlCheckboxComponent extends ControlComponent {

	onInit() {
		this.label = this.label || 'label';
	}

	setTouched(event) {
		this.control.touched = true;
	}
}

ControlCheckboxComponent.meta = {
	selector: '[control-checkbox]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--checkbox" [class]="{ required: control.validators.length }">
			<input type="checkbox" class="control" [id]="control.name" [formControl]="control" [value]="true" />
			<label [labelFor]="control.name" (click)="setTouched($event)">
				<svg class="icon icon--checkbox"><use xlink:href="#checkbox"></use></svg>
				<svg class="icon icon--checkbox-checked"><use xlink:href="#checkbox-checked"></use></svg>
				<span [innerHTML]="label | html"></span>
			</label>
			<span class="required__badge" [innerHTML]="'required' | label"></span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
