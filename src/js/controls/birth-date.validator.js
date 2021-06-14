import { FormValidator } from 'rxcomp-form';

export const DATE_REGEXP = new RegExp(/^(\d{1,2})[\/|\-|\s](\d{1,2})[\/|\-|\s](\d{4})$/);

function isValidDate(value, match) {
	try {
		return Date.parse(value) !== NaN;
	} catch (_) {
		try {
			return Date.parse(`${match[2]}/${match[1]}/${match[3]}`) !== NaN;
		} catch (_) {
			return false;
		}
	}
}

export default function BirthDateValidator() {

	return new FormValidator((value) => {
		if (!value) {
			return null;
		}
		if (value instanceof Date) {
			return null;
		}
		const match = DATE_REGEXP.exec(value);
		return match && isValidDate(value, match) ? null : {
			birthDate: {
				valid: false
			}
		};
	});

}
