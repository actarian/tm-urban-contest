import { Pipe } from 'rxcomp';
import { environment } from '../../environment';
import { Utils } from '../utils/utils';

export class LabelPipe extends Pipe {

	static transform(key) {
		const labels = LabelPipe.labels_;
		return labels[key] || key; // `#${key}#`;
	}

	static getKeys(...keys) {
		return LabelPipe.transform(keys.map(x => x.replace('-', '_')).join('_'));
	}

	static setLabels() {
		const LABELS = Utils.merge({
			select: 'Seleziona',
			browse: 'Sfoglia',
			cancel: 'Annulla',
			error_email: 'Email non valida',
			error_match: 'I campi non corrispondono',
			error_required: 'Campo obbligatorio',
			loading: 'caricamento',
			remove: 'Rimuovi',
			required: 'Richiesto',
			select_file: 'Seleziona il file',
			update: 'Aggiorna',
			upload: 'Carica',
			drag_and_drop_images: 'Drag And Drop your images here',
		}, environment.labels);
		this.labels_ = LABELS;
	}
}

LabelPipe.setLabels();

LabelPipe.meta = {
	name: 'label',
};
