/*
 * Expect: A Promise implementation based on https://www.promisejs.org/implementing/
 */

const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

export default class Expect {
	constructor(fn) {
		this.state = PENDING
		this.value = null
		this.handlers = []

		doResolve(fn, this.resolve, this.reject)
	}
	fulfill(result) {
		this.state = FULFILLED
		this.value = result
	}
	reject(error) {
		this.state = REJECTED
		this.value = error
	}
	resolve(result) {
		try {
			let then = getThen(result)
			if(then) {
				doResolve(then.bind(result), this.resolve, this.reject)	
				return
			}
			this.fulfill(result)
		} catch(e) {
			this.reject(e)
		}
	}
	handle(handler) {
		if(this.state === PENDING) {
			this.handlers.push(handler)
		} else {
			if(this.state === FULFILLED && typeof handler.onFulfilled === 'function') {
				typeof handler.onFulfilled(this.value)
			}
			if(this.state === REJECTED && typeof handler.onRejected === 'function') {
				typeof handler.onRejected(this.value)
			}
		}
	}
	done(onFulfilled, onRejected) {
		setTimeout(() => {
			this.handle({
				onFulfilled,
				onRejected
			})
		}, 0)
	}
	then(onFulfilled, onRejected) {
		return new Expect((resolve, reject) => {
			return this.done((result) => {
				if(typeof onFulfilled === 'function')	{
					try {
						return resolve(onFulfilled(result))
					} catch (ex) {
						return reject(ex)
					}	
				} else {
					return resolve(result)
				}
			}, (error) => {
				if(typeof onRejected === 'function') {
					try {
						return resolve(onRejected(error))
					} catch (ex) {
						return reject(ex)
					} 
				} else {
					return reject(error)
				}
			})	
		})
	}
}

function getThen(value) {
	let t = typeof value
	if(value && (t === 'object' || t === 'function')) {
		let then = value.then
		if(typeof then === 'function') {
			return then
		}
	}

	return null
}

function doResolve(fn, onFulfilled, onRejected) {
	let done = false
	try {
		fn(function(value) {
			if(done) { return }
			done = true
			onFulfilled(value)
		}, function(reason) {
			if(done) { return }
			done = true
			onRejected(reason)
		})	
	} catch(ex) {
		if(done) { return }
		done = true
		onRejected(ex)
	}
}
