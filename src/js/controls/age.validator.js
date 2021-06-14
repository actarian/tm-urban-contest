import { FormValidator } from 'rxcomp-form';

export const DATE_REGEXP = new RegExp(/^(\d{1,2})[\/|\-|\s](\d{1,2})[\/|\-|\s](\d{4})$/);

export default function AgeValidator(years) {

	return new FormValidator((value) => {
		if (!value) {
			return null;
		}
		let date;
		if (value instanceof Date) {
			date = value;
		} else {
			const match = DATE_REGEXP.exec(value);
			if (!match) {
				return null;
			}
			date = new Date(`${match[2]}/${match[1]}/${match[3]}`);
		}
		const now = new Date();
		if (now.getFullYear() - date.getFullYear() >= years &&
			now.getMonth() - date.getMonth() >= 0 &&
			(now.getMonth() - date.getMonth() > 0 || now.getDate() - date.getDate() >= 0)) {
			return null;
		} else {
			return {
				age: years
			}
		};
	});

}
