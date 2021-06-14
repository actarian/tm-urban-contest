import { Pipe } from 'rxcomp';
import { environment } from '../../environment';

export class FlagPipe extends Pipe {

	static transform(key) {
		const flags = environment.flags;
		return flags[key] || false;
	}

}

FlagPipe.meta = {
	name: 'flag',
};
