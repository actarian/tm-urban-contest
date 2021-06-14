
export const environmentServed = {
	flags: {
		production: true,
	},
	markets: ['IT', 'EU', 'AM', 'AS', 'IN'],
	defaultMarket: 'IT',
	currentMarket: 'IT',
	languages: ['it', 'en', 'de', 'ch'],
	defaultLanguage: 'it',
	currentLanguage: 'it',
	api: '/Client/docs/api',
	assets: '/Client/docs/',
	workers: {
		image: '/Client/docs/js/workers/image.service.worker.js',
		prefetch: '/Client/docs/js/workers/prefetch.service.worker.js',
	},
	githubDocs: 'https://raw.githubusercontent.com/actarian/giorgetti/main/docs/',
	slug: {
		configureProduct: `/Client/docs/products-configure.html`,
		reservedArea: `/Client/docs/reserved-area.html`,
	},
	template: {
		modal: {
			userModal: '/template/modals/user-modal.cshtml',
			projectsRegistrationModal: '/template/modals/projects-registration-modal.cshtml',
			materialsModal: '/template/modals/materials-modal.cshtml',
			marketsAndLanguagesModal: '/template/modals/markets-and-languages-modal.html',
		}
	},
	googleMaps: {
		apiKey: 'AIzaSyDvGw6iAoKdRv8mmaC9GeT-LWLPQtA8p60',
	},
	thron: {
		clientId: '',
	}
};
