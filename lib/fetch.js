/** @babel */

export default fetchWrapper = function(url, init) {
	return fetch(url, init)
		.then(response => response.text())
		.then(body => JSON.parse(body))
}