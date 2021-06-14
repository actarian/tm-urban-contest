import { FormValidator } from 'rxcomp-form';

export default function RequiredIfValidator(fieldName, formGroup) {

	return new FormValidator((value) => {
		const field = formGroup ? formGroup.get(fieldName) : null;
		return field && field.value && !value ? { required: { value: value, requiredIf: fieldName } } : null;
	});

}
