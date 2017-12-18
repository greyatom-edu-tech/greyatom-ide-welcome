/** @babel */

export default {
	getApiEndpoint: () => {
		var config = atom.config.get('greyatom-ide')
		if (config) {
			return config.apiEndpoint
		}
		config = atom.config.get('dev-greyatom-ide')
		if (config) {
			return config.apiEndpoint
		}
	}
}