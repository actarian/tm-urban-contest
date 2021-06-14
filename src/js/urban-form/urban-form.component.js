import { Component, getContext } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil } from 'rxjs/operators';
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
		this.onNext = this.onNext.bind(this);
		this.onPrev = this.onPrev.bind(this);
		const nexts = this.nexts = Array.prototype.slice.call(node.querySelectorAll('.btn--next'));
		nexts.forEach(next => {
			next.addEventListener('click', this.onNext);
		});
		const prevs = this.prevs = Array.prototype.slice.call(node.querySelectorAll('.btn--prev'));
		prevs.forEach(prev => {
			prev.addEventListener('click', this.onPrev);
		});

		this.error = null;
		this.success = false;
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
				rulesChecked: new FormControl(null, [Validators.RequiredValidator()]),
				privacyChecked: new FormControl(null, [Validators.RequiredValidator()]),
			}),
			checkRequest: window.antiforgery,
			checkField: '',
		});
		const controls = this.controls = form.controls;
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
			// group.touched = true;
			return;
		}
		console.log('onNext', this.currentStep, this.form);
		if (this.currentStep === 1 && this.isOfAge) {
			this.currentStep = 3;
		} else if (this.currentStep === 1 && !this.isOfAge) {
			this.currentStep = 2;
		} else if (this.currentStep < 3) {
			this.currentStep++;
		}
		group = this.controls[`step${this.currentStep}`];
		group.touched = false;
		this.pushChanges();
	}

	onPrev() {
		if (this.currentStep > 0) {
			this.currentStep--;
		}
		this.pushChanges();
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
		console.log('UrbanFormComponent.onSubmit', form.value);
		if (form.valid) {
			form.submitted = true;
			HttpService.post$('/api/url', form.value).pipe(
				first(),
			).subscribe(_ => {
				this.success = true;
			}, error => {
				console.log('UrbanFormComponent.error', error);
				this.error = error;
				this.pushChanges();
			});
		} else {
			form.touched = true;
		}
	}
}

UrbanFormComponent.meta = {
	selector: '[urban-form]',
};
