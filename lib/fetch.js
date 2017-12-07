/** @babel */

export default fetchWrapper = function(url, init) {
	return fetch(url, init)
		.then((response) => {
		  if(response.ok) {
		    return response.text();
		  }
		  throw new Error('Commit Live API Failed');
		})
		.then(body => JSON.parse(body))
}