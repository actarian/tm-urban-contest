import { Module } from 'rxcomp';
import { DropdownItemDirective } from './dropdown/dropdown-item.directive';
import { DropdownDirective } from './dropdown/dropdown.directive';
import { EnvPipe } from './env/env.pipe';
import { FlagPipe } from './flag/flag.pipe';
import { HtmlPipe } from './html/html.pipe';
import { IdDirective } from './id/id.directive';
import { LabelForDirective } from './label-for/label-for.directive';
import { LabelPipe } from './label/label.pipe';
import { TitleDirective } from './title/title.directive';

const factories = [
	DropdownDirective,
	DropdownItemDirective,
	IdDirective,
	LabelForDirective,
	TitleDirective,
];

const pipes = [
	EnvPipe,
	FlagPipe,
	HtmlPipe,
	LabelPipe,
];

export class CommonModule extends Module { }

CommonModule.meta = {
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
