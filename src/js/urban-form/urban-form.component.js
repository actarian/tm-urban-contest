import { Component, getContext } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { HttpService } from '../common/http/http.service';
import AgeValidator from '../controls/age.validator';
import BirthDateValidator from '../controls/birth-date.validator';
import { FormService } from '../controls/form.service';

export const DATE_REGEXP = new RegExp(/^(\d{1,2})[\/|\-|\s](\d{1,2})[\/|\-|\s](\d{4})$/);

export class UrbanFormComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		this.node = node;
		this.currentStep = 0;
		this.error = null;
		this.success = false;
		this.busy = false;
		const form = this.form = new FormGroup({
			step0: new FormGroup({
				picture: new FormControl(null, [Validators.RequiredValidator()]),
			}),
			step1: new FormGroup({
				firstName: new FormControl(null, [Validators.RequiredValidator()]),
				lastName: new FormControl(null, [Validators.RequiredValidator()]),
				birthDate: new FormControl(null, [Validators.RequiredValidator(), BirthDateValidator(), AgeValidator(14)]),
				telephone: new FormControl(null, [Validators.RequiredValidator()]),
				email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
				address: new FormControl(null, [Validators.RequiredValidator()]),
				city: new FormControl(null, [Validators.RequiredValidator()]),
				province: new FormControl(null, [Validators.RequiredValidator()]),
				userName: new FormControl(null, [Validators.RequiredValidator()]),
				category: new FormControl(null, [Validators.RequiredValidator()]),
			}),
			step2: new FormGroup({
				parentFirstName: new FormControl(null, [Validators.RequiredValidator()]),
				parentLastName: new FormControl(null, [Validators.RequiredValidator()]),
				parentIdCard: new FormControl(null, [Validators.RequiredValidator()]),
				parentTelephone: new FormControl(null, [Validators.RequiredValidator()]),
				parentEmail: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			}),
			step3: new FormGroup({
				rulesChecked: new FormControl(null, [Validators.RequiredTrueValidator()]),
				privacyChecked: new FormControl(null, [Validators.RequiredTrueValidator()]),
			}),
			checkRequest: window.antiforgery,
			checkField: '',
		});
		const controls = this.controls = form.controls;
		const province = controls.step1.controls.province;
		province.options = FormService.toSelectOptions(window.province.options);
		const category = controls.step1.controls.category;
		category.options = FormService.toSelectOptions(window.category.options);
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((_) => {
			this.pushChanges();
		});
	}

	onNext(event) {
		let group = this.controls[`step${this.currentStep}`];
		if (!group.valid) {
			Object.keys(group.controls).forEach(key => {
				group.controls[key].touched = true;
			});
			const { node } = getContext(this);
			const firstInvalidInput = Array.prototype.slice.call(node.querySelectorAll('.invalid')).find((x) => x.hasAttribute('[control]'));
			if (firstInvalidInput) {
				firstInvalidInput.scrollIntoView({ behavior: 'smooth' });
			}
			// group.touched = true;
			return;
		}
		// console.log('onNext', this.currentStep, this.form);
		if (this.currentStep === 1 && this.isOfAge) {
			this.currentStep = 3;
			if (window.dataLayer) {
				window.dataLayer.push({ 'event': 'step accettazione benvenuto' });
			}
		} else if (this.currentStep === 1 && !this.isOfAge) {
			this.currentStep = 2;
			if (window.dataLayer) {
				window.dataLayer.push({ 'event': 'step responsabilita genitoriale' });
			}
		} else if (this.currentStep < 3) {
			if (this.currentStep === 2) {
				if (window.dataLayer) {
					window.dataLayer.push({ 'event': 'step accettazione benvenuto' });
				}
			}
			else {
				if (window.dataLayer) {
					window.dataLayer.push({ 'event': 'step form dati' });
				}
			}
			this.currentStep++;
		}
		group = this.controls[`step${this.currentStep}`];
		group.touched = false;
		this.pushChanges();
		this.scrollToTop();
	}

	onPrev() {
		if (this.currentStep > 0) {
			this.currentStep--;
		}
		this.pushChanges();
		this.scrollToTop();
	}

	scrollToTop() {
		const { node } = getContext(this);
		const stepsNode = node.querySelector('.steps--form');
		stepsNode.scrollIntoView({ behavior: 'smooth' });
	}

	get isOfAge() {
		const birthDateValue = this.form.controls.step1.controls.birthDate.value;
		if (!birthDateValue) {
			return false;
		} else {
			const match = DATE_REGEXP.exec(birthDateValue);
			if (!match) {
				return false;
			} else {
				const date = new Date(`${match[2]}/${match[1]}/${match[3]}`);
				const now = new Date();
				if (now.getFullYear() - date.getFullYear() > 18 ||
					(now.getFullYear() - date.getFullYear() == 18 && now.getMonth() - date.getMonth() > 0) ||
					(now.getFullYear() - date.getFullYear() == 18 && now.getMonth() - date.getMonth() == 0 && now.getDate() - date.getDate() >= 0)) {
					return true;
				} else {
					return false;
				};
			}
		}
	}

	onSubmit(model) {
		const form = this.form;
		// console.log('UrbanFormComponent.onSubmit', form.value, form);
		if (form.controls.step0.valid &&
			form.controls.step1.valid &&
			(this.isOfAge || form.controls.step2.valid) &&
			form.controls.step3.valid) {
			form.submitted = true;
			const payload = Object.assign({
				checkRequest: form.value.checkRequest,
				checkField: form.value.checkField,
			},
				form.value.step0,
				form.value.step1,
				form.value.step2,
				form.value.step3
			);
			this.busy = true;
			this.pushChanges();
			HttpService.post$('https://contest.tau-marin.it/', payload).pipe(
				first(),
				finalize(_ => {
					this.busy = false;
					this.pushChanges();
				}),
			).subscribe(_ => {
				this.success = true;
				window.location.href = window.category.options.find(option => option.value === form.value.step1.category).url;
			}, error => {
				console.log('UrbanFormComponent.error', error);
				this.error = error;
				this.pushChanges();
			});
		} else {
			form.touched = true;
		}
	}

	onTest() {
		const form = this.form;
		const controls = this.controls;
		const province = controls.step1.controls.province.options.length > 1 ? controls.step1.controls.province.options[1].id : null;
		const category = controls.step1.controls.category.options.length > 1 ? controls.step1.controls.category.options[1].id : null;
		form.patch({
			step1: {
				firstName: 'Jhon',
				lastName: 'Appleseed',
				birthDate: '22/04/1976',
				telephone: '0721 411112',
				email: 'jhonappleseed@gmail.com',
				address: 'Strada della Campanara, 15',
				city: 'Pesaro',
				province: province,
				userName: 'jappleseed',
				category: category,
			},
			step3: {
				rulesChecked: true,
				privacyChecked: true,
			},
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}
}

UrbanFormComponent.meta = {
	selector: '[urban-form]',
};
