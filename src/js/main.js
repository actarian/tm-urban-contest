import { UrbanEnter } from './urban-enter/urban-enter';
import { UrbanForm } from './urban-form/urban-form';
import { UrbanVideo } from './urban-video/urban-video';

document.addEventListener('DOMContentLoaded', () => {
	const enters = UrbanEnter.init();
	const forms = UrbanForm.init();
	const videos = UrbanVideo.init();
});

/*
// FORM WIZARD

const steps = Array.prototype.slice.call(document.querySelectorAll('.steps__item'));

let currentStep = -1;

const onUpdateStep = () => {
	steps.forEach((step, i) => {
		i === currentStep ? step.classList.add('active') : step.classList.remove('active');
	});
}

const onNextStep = () => {
	if (currentStep < 3) {
		currentStep++;
	}
	onUpdateStep();
}

const onPrevStep = () => {
	if (currentStep > 0) {
		currentStep--;
	}
	onUpdateStep();
}

const nexts = Array.prototype.slice.call(document.querySelectorAll('.btn--next'));
nexts.forEach(next => {
	next.addEventListener('click', onNextStep);
});

const prevs = Array.prototype.slice.call(document.querySelectorAll('.btn--prev'));
prevs.forEach(prev => {
	prev.addEventListener('click', onPrevStep);
});

onNextStep();
*/
