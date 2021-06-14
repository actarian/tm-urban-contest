import { FormValidator } from 'rxcomp-form';

export default function MatchValidator(fieldName, formGroup) {

	return new FormValidator((value) => {
		const field = formGroup ? formGroup.get(fieldName) : null;
		if (!value || !field) {
			return null;
		}
		return value !== field.value ? { match: { value: value, match: field.value } } : null;
	});

}
