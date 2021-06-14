import { isPlatformBrowser } from 'rxcomp';
import { combineLatest, EMPTY, from, fromEvent, merge } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Asset } from '../asset/asset';
import { AssetService } from '../asset/asset.service';

export class DropService {

	static drop$(input) {
		if (isPlatformBrowser && input) {
			const body = document.querySelector('body');
			return merge(fromEvent(body, 'drop'), fromEvent(body, 'dragover')).pipe(
				map((event) => {
					// console.log('DropService.drop$', event);
					event.preventDefault();
					if (event.target === input) {
						input.files = event.dataTransfer.files;
					}
					return;
				}),
			);
		} else {
			return EMPTY;
		}
	}

	static change$(input) {
		if (isPlatformBrowser && input) {
			return fromEvent(input, 'change').pipe(
				filter((event) => input.files && input.files.length),
				map((event) => Array.from(input.files)),
			);
		} else {
			return EMPTY;
		}
	}

	static asset$(input, previews = []) {
		return this.change$(input).pipe(
			switchMap((files) => {
				previews.length = files.length;
				previews.fill(null);
				// output.previews = files.map(() => null);
				const uploads$ = files.map((file, i) => this.read$(file, i, previews).pipe(
					map(() => file),
					switchMap((file) => AssetService.upload$([file])),
					switchMap((uploads) => {
						const upload = uploads[0];
						const asset = Asset.fromUrl(upload.url);
						return AssetService.assetCreate$(asset);
					}),
				));
				return combineLatest(uploads$);
			}),
		);
	}

	static read$(file, i, previews = []) {
		const reader = new FileReader();
		const reader$ = fromEvent(reader, 'load').pipe(
			switchMap(event => {
				const blob = event.target.result;
				return this.resize$(blob);
			}),
			tap(resized => {
				previews[i] = resized;
			}),
		);
		reader.readAsDataURL(file);
		return reader$;
	}

	static resize$(blob) {
		return from(this.resize_(blob));
	}

	static resize_(blob) {
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
			img.onerror = function() {
				reject(blob);
			}
			img.src = blob;
		});
	}
}
