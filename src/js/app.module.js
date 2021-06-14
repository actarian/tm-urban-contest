import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import { AppComponent } from './app.component';
import { CommonModule } from './common/common.module';
import { ControlsModule } from './controls/controls.module';
import { UrbanEnterComponent } from './urban-enter/urban-enter.component';
import { UrbanFormComponent } from './urban-form/urban-form.component';
import { UrbanVideoComponent } from './urban-video/urban-video.component';

export class AppModule extends Module { }

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
		CommonModule,
		ControlsModule,
	],
	declarations: [
		UrbanEnterComponent,
		UrbanFormComponent,
		UrbanVideoComponent,
	],
	bootstrap: AppComponent,
};
