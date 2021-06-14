
export class Utils {

	static merge(target, source) {
		if (typeof source === 'object') {
			Object.keys(source).forEach(key => {
				const value = source[key];
				if (typeof value === 'object' && !Array.isArray(value)) {
					target[key] = this.merge(target[key], value);
				} else {
					target[key] = value;
				}
			});
		}
		return target;
	}

}
