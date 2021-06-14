import { isPlatformBrowser } from 'rxcomp';
import { BehaviorSubject, combineLatest, EMPTY, fromEvent, merge, of, ReplaySubject } from 'rxjs';
import { delayWhen, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { Asset, assetTypeFromPath } from '../asset/asset';
import { AssetService } from '../asset/asset.service';

export class UploadItem {

	constructor(file) {
		this.file = file;
		this.name = file.name;
		this.type = assetTypeFromPath(file.name);
		this.progress = 0;
		this.size = file.size;
		this.uploading = false;
		this.paused = false;
		this.success = false;
		this.complete = false;
		this.error = null;
		this.preview = null;
	}

}

export class UploadEvent {
	constructor(options) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class UploadStartEvent extends UploadEvent { }

export class UploadCompleteEvent extends UploadEvent { }

export class UploadAssetEvent extends UploadEvent { }

export class UploadService {

	constructor() {
		this.concurrent$ = new BehaviorSubject(0);
		this.items$ = new BehaviorSubject([]);
		this.events$ = new ReplaySubject(1);
	}

	upload$() {
		const items = this.items$.getValue();
		const uploadItems = items.filter(item => !item.uploading);
		return combineLatest(uploadItems.map(item => this.uploadItem$(item)));
	}

	uploadItem$(item) {
		// max 4 concurrent upload
		item.uploading = true;
		this.events$.next(new UploadStartEvent({ item }));
		const files = [item.file];
		return of(files).pipe(
			delayWhen(() => this.concurrent$.pipe(
				filter(x => x < 4)
			)),
			tap(() => this.concurrent$.next(this.concurrent$.getValue() + 1)),
			first(),
			switchMap(files => AssetService.upload$(files)),
			switchMap((uploads) => {
				const upload = uploads[0];
				item.uploading = false;
				item.complete = true;
				const asset = Asset.fromUrl(upload.url);
				this.events$.next(new UploadCompleteEvent({ item, asset }));
				return AssetService.assetCreate$(asset).pipe(
					tap(asset => {
						this.remove(item);
						this.events$.next(new UploadAssetEvent({ item, asset }));
						this.concurrent$.next(this.concurrent$.getValue() - 1);
					}),
				);
			}),
		);
		/*
		// concurrent upload
		return AssetService.upload$([item.file]).pipe(
			// tap(upload => console.log('upload', upload)),
			switchMap((uploads) => {
				const upload = uploads[0];
				item.uploading = false;
				item.complete = true;
				const asset = Asset.fromUrl(upload.url);
				this.events$.next(new UploadCompleteEvent({ item, asset }));
				return AssetService.assetCreate$(asset).pipe(
					tap(asset => {
						this.remove(item);
						this.events$.next(new UploadAssetEvent({ item, asset }));
					}),
				);
			}),
		);
		*/
	}

	addItems(files) {
		if (files && files.length) {
			// console.log('addItems', files);
			const items = this.items$.getValue();
			const newItems = Array.from(files).map(file => new UploadItem(file));
			items.push(...newItems);
			this.items$.next(items);
		}
	}

	remove(item) {
		const items = this.items$.getValue();
		const index = items.indexOf(item);
		if (index !== -1) {
			items.splice(index, 1);
		}
		this.items$.next(items);
	}

	removeAll() {
		// !!!
		this.items$.next([]);
	}

	drop$(input, dropArea) {
		if (isPlatformBrowser && input) {
			dropArea = dropArea || input;
			const body = document.querySelector('body');
			return merge(fromEvent(body, 'drop'), fromEvent(body, 'dragover')).pipe(
				map((event) => {
					// console.log('UploadService.drop$', event);
					event.preventDefault();
					if (event.target === dropArea) {
						this.addItems(event.dataTransfer.files);
					}
					return this.items$;
				}),
			);
		} else {
			return EMPTY;
		}
	}

	change$(input) {
		if (isPlatformBrowser && input) {
			return fromEvent(input, 'change').pipe(
				switchMap((event) => {
					if (input.files.length) {
						this.addItems(input.files);
						input.value = '';
					}
					return this.items$;
				}),
			);
		} else {
			return EMPTY;
		}
	}

	files$(files) {
		return combineLatest(Array.from(files).map((file, i) => this.file$(file, i)));
	}

	file$(file, i) {
		return this.read$(file, i).pipe(
			switchMap(() => this.uploadFile$(file)),
		);
	}

	/*
	static files$(files) {
		const fileArray = Array.from(files);
		this.previews = fileArray.map(() => null);
		const uploads$ = fileArray.map((file, i) => this.read$(file, i).pipe(
			switchMap(() => this.uploadFile$(file)),
		));
		return combineLatest(uploads$);
	}
	*/

	read$(file, i) {
		const reader = new FileReader();
		const reader$ = fromEvent(reader, 'load').pipe(
			tap(event => {
				const blob = event.target.result;
				this.resize(blob, (resized) => {
					this.previews[i] = resized;
					// console.log('resized', resized);
					this.pushChanges();
				});
			}),
		);
		reader.readAsDataURL(file);
		return reader$;
	}

	uploadFile$(file) {
		return AssetService.upload$([file]).pipe(
			// tap(upload => console.log('upload', upload)),
			switchMap((uploads) => {
				const upload = uploads[0];
				/*
				id: 1601303293569
				type: 'image/jpeg'
				file: '1601303293569_ambiente1_x0_y2.jpg'
				originalFileName: 'ambiente1_x0_y2.jpg'
				url: '/uploads/1601303293569_ambiente1_x0_y2.jpg'
				*/
				const asset = Asset.fromUrl(upload.url);
				return AssetService.assetCreate$(asset);
			}),
		);
	}

	resize(blob, callback) {
		if (typeof callback === 'function') {
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
				callback(dataUrl);
			};
			img.src = blob;
		}
	}

	supported() {
		return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();
		function supportFileAPI() {
			var input = document.createElement('input');
			input.type = 'file';
			return 'files' in input;
		}
		function supportAjaxUploadProgressEvents() {
			var xhr = new XMLHttpRequest();
			return !!(xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
		}
		function supportFormData() {
			return !!window.FormData;
		}
	}

}
