import { ApiService } from '../../common/api/api.service';

export class ContactsService {

	static data$() {
		return ApiService.get$('/contacts/data.json');
	}

	static submit$() {
		return ApiService.post$('/contacts/submit.json');
	}

}
