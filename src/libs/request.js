/*
 * A simple implementation of a client-side HTTP request library, inspired in SuperAgent.
 */

import Expect from './Expect'

const HTTPMethod = {
	GET: 'GET',
	POST: 'POST',
	HEAD: 'HEAD'
}

const defaults = {
	method: HTTPMethod.GET,
	accept: 'application/json',
	isAsync: true
}

export default (url, config) => {
	config = config && typeof config === 'object' ?
		config : {}
	config.method = config.method ?
		validateMethod(config.method) : defaults.method
	config.accept = defaults.accept
	config.isAsync = defaults.isAsync

	class Request {
		constructor() {
			this.xhr = new XMLHttpRequest()
			this.url = url
			this.method = config.method
			this.headers = {
				'Accept': config.accept
			}
			this.isAsync = config.isAsync
		}
		to() {
			return this	
		}
		get(url) {
			isValidUrl(url)
			this.method = HTTPMethod.GET
			this.url = url
			return this	
		}
		post(url) {
			isValidUrl(url)
			this.method = HTTPMethod.POST
			this.url = url

			return this	
		}
		head(url)	{
			this.method = HTTPMethod.HEAD
			this.url = url

			return this
		}
		setHeader(header, value) {
			if(typeof header !== 'string' || typeof value !== 'string') {
				throw new Error('`header` and `value` must be strings')	
			}

			this.headers[header] = value

			return this
		}
		accept(type) {
			this.setHeader('Accept', type)

			return this
		}
		end() {
			isValidUrl(this.url) // We validate that a url was set
			this.xhr.open(this.method, this.url, this.isAsync)	
			this.setHeaders()

			return createRequest(this.xhr)
		}
		setHeaders() {
			for(let header in this.headers) {
				this.xhr.setRequestHeader(header, this.headers[header])
			}
		}
	}	

	return new Request()
}

function createRequest(xhr) {
	return new Expect(function(resolve, reject) {
		xhr.onreadystatechange = () => {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				if(xhr.status >= 200 && xhr.status < 300) {
					resolve(JSON.parse(xhr.responseText))	
				} else {
					reject(xhr.responseText)
				}
			}
		}

		xhr.send()	
	})	
}


function isValidUrl(url) {
	if(typeof url === 'string' &&
		url.search(/(\/?[\w-]+)(\/[\w-]+)*\/?|(((http|ftp|https):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/g) > -1) { // Test this is working correctly
		return true	
	}
	
	throw new Error(`\`url\` must be a string. Getting \`${url}\` instead.`)
}

function validateMethod(method) {
	if(typeof method === 'string') {
		throw new Error(`\`method\` must be a string. Getting \`${method}\` instead.`)
	}

	if(!defaults[method]) {
		throw new Error(`${method} is not a supported http method.`)	
	}

	return true
}
