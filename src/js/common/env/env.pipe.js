import { Pipe } from 'rxcomp';
import { environment } from '../../environment';

export class EnvPipe extends Pipe {

	static transform(keypath) {
		let env = environment;
		const keys = keypath.split('.');
		let k = keys.shift();
		while (keys.length > 0 && env[k]) {
			env = env[k];
			k = keys.shift();
		}
		const value = env[k] || null;
		return value;
	}

}

EnvPipe.meta = {
	name: 'env',
};
