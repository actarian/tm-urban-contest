
export class FormService {

	static toSelectOptions(options) {
		options = options.slice().map(x => ({ id: x.value, name: x.label }));
		options.unshift({ id: null, name: 'select' });
		return options;
	}

}
