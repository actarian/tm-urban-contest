import { from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class HttpResponse {

	get static() {
		return this.url.indexOf('.json') === this.url.length - 5;
	}

	constructor(response) {
		this.data = null;
		if (response) {
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.ok = response.ok;
			this.redirected = response.redirected;
		}
	}
}

export class HttpService {

	static http$(method, url, data, format = 'json', userPass = null) {
		const methods = ['POST', 'PUT', 'PATCH'];
		let response_ = null;
		// url = this.getUrl(url, format);
		const options = {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
		}
		if (userPass) {
			// options.mode = 'no-cors';
			options.credentials = 'include';
			userPass = window.btoa(userPass);
			options.headers['Authorization'] = `Basic ${userPass}`;
		}
		options.headers = new Headers(options.headers);
		return from(fetch(url, options).then((response) => {
			response_ = response;
			// console.log(response);
			try {
				const contentType = response.headers.get('content-type');
				let typedResponse;
				if (contentType && contentType.indexOf('application/json') !== -1) {
					typedResponse = response.json();
				} else {
					typedResponse = response.text();
				}
				if (response.ok) {
					return typedResponse;
				} else {
					return typedResponse.then(data => {
						return Promise.reject(data);
					});
				}
			} catch (error) {
				if (response.ok) {
					console.warn('HttpService.http$', 'Cannot parse response');
					return Promise.resolve();
				} else {
					return Promise.reject(error);
				}
			}
		})).pipe(
			catchError(error => {
				return throwError(this.getError(error, response_));
			})
		);
	}

	/*
	// !!! todo mapping response.data
	static http$(method, url, data, format = 'json') {
		const methods = ['POST', 'PUT', 'PATCH'];
		const body = (data && methods.indexOf(method) !== -1) ? JSON.stringify(data) : undefined;
		const queryString = (data && methods.indexOf(method) !== -1) ? Object.keys(data).map(function(key) {
			return key + '=' + encodeURI(data[key]);
		}).join('&') : undefined;
		if (queryString) {
			url = `${url}?${queryString}`;
		}
		let response_ = null;
		return from(fetch(url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: body,
		}).then((response) => {
			response_ = new HttpResponse(response);
			try {
				const contentType = response.headers.get('content-type');
				let typedResponse;
				if (contentType && format === 'json' && contentType.indexOf('application/json') !== -1) {
					typedResponse = response.json();
				} else if (format === 'blob') {
					typedResponse = response.blob();
				} else {
					typedResponse = response.text();
				}
				return typedResponse.then(data => {
					response_.data = data;
					if (response.ok) {
						return Promise.resolve(response_);
					} else {
						return Promise.reject(response_);
					}
				});
			} catch(error) {
				if (response.ok) {
					console.warn('HttpService.http$', 'Cannot parse response');
					return Promise.resolve(response_);
				} else {
					return Promise.reject(this.getError(error, response_));
				}
			}
		})).pipe(
			catchError(error => {
				return throwError(this.getError(error, response_));
			}),
		);
	}
	*/

	static get$(url, data, format) {
		const query = this.query(data);
		return this.http$('GET', `${url}${query}`, undefined, format);
	}

	static delete$(url) {
		return this.http$('DELETE', url);
	}

	static post$(url, data) {
		return this.http$('POST', url, data);
	}

	static put$(url, data) {
		return this.http$('PUT', url, data);
	}

	static patch$(url, data) {
		return this.http$('PATCH', url, data);
	}

	static query(data) {
		return ''; // todo
	}

	static getError(object, response) {
		let error = typeof object === 'object' ? object : {};
		if (!error.status) {
			error.status = response ? response.status : 0;
		}
		if (!error.statusCode) {
			error.statusCode = response ? response.status : 0;
		}
		if (!error.statusMessage) {
			error.statusMessage = response ? response.statusText : object;
		}
		// console.log('HttpService.getError', error, object);
		return error;
	}

}
