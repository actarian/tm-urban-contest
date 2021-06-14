import { Component } from 'rxcomp';
import { FormAbstractCollectionDirective, FormControl, FormGroup, Validators } from 'rxcomp-form';

export class ControlsComponent extends Component {

	get group() {
		if (this.formGroup) {
			return this.formGroup;
		} else {
			if (!this.host) {
				throw ('missing form collection');
			}
			return this.host.control;
		}
	}

	getControl(name) {
		return this.group.get(name);
	}

}

ControlsComponent.meta = {
	selector: '[controls]',
	inputs: ['formGroup', 'fields'],
	hosts: { host: FormAbstractCollectionDirective },
	template: /* html */`
		<div *for="let field of fields">
			<div *if="['text', 'email', 'url'].indexOf(field.type) !== -1" control-text [control]="getControl(field.name)" [label]="field.label | label"></div>
			<div *if="field.type == 'select'" control-select [control]="getControl(field.name)" [label]="field.label | label"></div>
			<div *if="field.type == 'custom-select'" control-custom-select [control]="getControl(field.name)" [label]="field.label | label"></div>
			<div *if="field.type == 'textarea'" control-textarea [control]="getControl(field.name)" [label]="field.label | label"></div>
			<div *if="field.type == 'checkbox'" control-checkbox [control]="getControl(field.name)" [label]="field.label | label"></div>
			<input *if="field.type == 'hidden'" [name]="field.name" [formControl]="getControl(field.name)" value="" type="text" style="display:none !important;" />
		</div>
	`,
};

export function fieldsToFormControls(fields) {
	const controls = fields.reduce((p, c, i) => {
		const validators = [];
		if (c.required) {
			validators.push(c.type === 'checkbox' ? Validators.RequiredTrueValidator() : Validators.RequiredValidator());
		}
		if (c.type === 'email') {
			validators.push(Validators.EmailValidator());
		}
		if (c.type === 'url') {
			validators.push(Validators.PatternValidator('(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})'));
		}
		if (c.pattern != null) {
			validators.push(Validators.PatternValidator(c.pattern));
		}
		p[c.name] = new FormControl((c.value != null ? c.value : null), validators);
		if (c.type === 'select' || c.type === 'custom-select') {
			const options = (c.options || []).slice();
			options.unshift({ id: null, name: 'select', }); // LabelPipe.transform('select')
			p[c.name].options = options;
		}
		return p;
	}, {});
	return controls;
}

export function fieldsToFormGroup(fields) {
	return new FormGroup(fieldsToFormControls(fields));
}

export function patchFields(fields, form) {
	const testValues = fields.reduce((p, c, i) => {
		if (c.test) {
			p[c.name] = c.test;
		}
		return p;
	}, {});
	form.patch(testValues);
}
