import { Component } from 'rxcomp';
import { fromEvent, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AssetType } from '../asset/asset';

export class UploadItemComponent extends Component {

	onInit() {
		// console.log('UploadItemComponent.onInit', this.item);
		if (this.item.preview === null) {
			this.read$(this.item.file).pipe(
				takeUntil(this.unsubscribe$),
			).subscribe(preview => {
				this.item.preview = preview;
				this.pushChanges();
			});
		}
	}

	read$(file) {
		const reader = new FileReader();
		const reader$ = fromEvent(reader, 'load').pipe(
			switchMap(event => {
				const blob = event.target.result;
				if (this.item.type.name === AssetType.Image.name) {
					return this.resize$(blob);
				} else {
					return of(blob);
				}
			}),
		);
		reader.readAsDataURL(file);
		return reader$;
	}

	resize$(blob) {
		return new Promise((resolve, reject) => {
			const img = document.createElement('img');
			img.onload = function() {
				const MAX_WIDTH = 320;
				const MAX_HEIGHT = 240;
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				let width = img.width;
				let height = img.height;
				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height;
						height = MAX_HEIGHT;
					}
				}
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0, width, height);
				const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
				resolve(dataUrl);
			};
			img.onerror = function(error) {
				reject(error);
			};
			img.src = blob;
		});
	}

	onPause() {
		this.pause.next(this.item);
	}

	onResume() {
		this.resume.next(this.item);
	}

	onCancel() {
		this.cancel.next(this.item);
	}

	onRemove() {
		this.remove.next(this.item);
	}
}

UploadItemComponent.meta = {
	selector: '[upload-item]',
	outputs: ['pause', 'resume', 'cancel', 'remove'],
	inputs: ['item'],
	template: /* html */`
	<div class="upload-item" [class]="{ 'error': item.error, 'success': item.success }">
		<div class="picture">
			<img [lazy]="item.preview" [size]="{ width: 320, height: 240 }" *if="item.preview && item.type.name === 'image'" />
			<video [src]="item.preview" *if="item.preview && item.type.name === 'video'"></video>
			<svg class="spinner" width="24" height="24" viewBox="0 0 24 24" [class]="{ uploading: item.uploading }" *if="item.uploading"><use xlink:href="#spinner"></use></svg>
		</div>
		<div class="name">{{item.name}}</div>
		<!--
		<div class="group--info">
			<div>progress: {{item.progress}}</div>
			<div>size: {{item.size}} bytes</div>
			<div>current speed: {{item.currentSpeed}} bytes/s</div>
			<div>average speed: {{item.averageSpeed}} bytes/s</div>
			<div>time ramining: {{item.timeRemaining}}s</div>
			<div>paused: {{item.paused}}</div>
			<div>success: {{item.success}}</div>
			<div>complete: {{item.complete}}</div>
			<div>error: {{item.error}}</div>
		</div>
		-->
		<!--
		<div class="group--cta" *if="!item.complete && item.uploading">
			<div class="btn--pause" (click)="onPause()">pause</div>
			<div class="btn--resume" (click)="onResume()">resume</div>
			<div class="btn--cancel" (click)="onCancel()">cancel</div>
		</div>
		-->
		<div class="group--cta">
			<div class="btn--remove" (click)="onRemove()" *if="!item.complete">remove</div>
		</div>
	</div>
	`,
};
