import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import { AppComponent } from './app.component';
import { CommonModule } from './common/common.module';
import { ControlsModule } from './controls/controls.module';
import { UrbanFormComponent } from './urban-form/urban-form.component';

export class AppModule extends Module { }

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
		CommonModule,
		ControlsModule,
	],
	declarations: [
		UrbanFormComponent,
	],
	bootstrap: AppComponent,
};
