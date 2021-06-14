import { Module } from 'rxcomp';
import { ControlCheckboxComponent } from './control-checkbox.component';
import { ControlCustomSelectComponent } from './control-custom-select.component';
import { ControlFileComponent } from './control-file.component';
import { ControlTextComponent } from './control-text.component';
import { ErrorsComponent } from './errors.component';
import { TestComponent } from './test.component';

const factories = [
	ControlCheckboxComponent,
	ControlCustomSelectComponent,
	ControlFileComponent,
	ControlTextComponent,
	ErrorsComponent,
	TestComponent,
];

const pipes = [
];

export class ControlsModule extends Module { }

ControlsModule.meta = {
	imports: [
	],
	declarations: [
		...factories,
		...pipes,
	],
	exports: [
		...factories,
		...pipes,
	],
};
