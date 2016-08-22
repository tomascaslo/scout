/*
 * Expect: A Promise implementation based on https://www.promisejs.org/implementing/
 */

const PENDING = 0
const FULFILLED = 1
const REJECTED = 2

export default (fn) => {
	let state = PENDING
	let value = null
	let handlers = [];

	class Expect {
		constructor(fn) {
			doResolve(fn, resolve, reject)
		}
		done(onFulfilled, onRejected) {
			setTimeout(() => {
				handle({
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

	function fulfill(result) {
		state = FULFILLED
		value = result
		handlers.forEach(handle)
		handlers = null
	}

	function reject(error) {
		state = REJECTED
		value = error
		handlers.forEach(handle)
		handlers = null
	}

	function resolve(result) {
		try {
			let then = getThen(result)
			if(then) {
				doResolve(then.bind(result), resolve, reject)	
				return
			}
			fulfill(result)
		} catch(e) {
			reject(e)
		}
	}

	function handle(handler) {
		if(state === PENDING) {
			handlers.push(handler)
		} else {
			if(state === FULFILLED && typeof handler.onFulfilled === 'function') {
				handler.onFulfilled(value)
			}
			if(state === REJECTED && typeof handler.onRejected === 'function') {
				handler.onRejected(value)
			}
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

	return new Expect(fn)
}

