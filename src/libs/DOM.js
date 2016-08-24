export function get(selector, from) {
	from = from || document
	return from.querySelector(selector)
}

export function getAll(selector, from) {
	from = from || document
	return from.querySelectorAll(selector)
}

export function getByID(id, from) {
	from = from || document
	return from.getElementById(id)
}

export function getByClass(classes, from) { // classes can be a string of classes separate by spaces or an Array
	from = from || document

	if(classes instanceof Array) {
		classes = classes.join(' ')
	}

	return from.getElementsByClassName(classes)
}

export function getParent(element) {
	return element.parentNode || null;
}

export function getAttr(element, attr) {
	return element[attr]
}

export function setID(element, id) {
	if(typeof id !== 'string') {
		throw new Error('id must be a string')
	}

	element.id = id
}

export function createElement(elementType) {
	if(typeof elementType !== 'string') {
		throw new Error('elementType must be a string')
	}
	return document.createElement(elementType)
}

export function createElements(elementType, times) {
	let elements = []

	if(typeof times === 'undefined') {
		times = 1
	}
	
	for(;times;times--) {
		elements.push(createElement(elementType))	
	}

	return elements
}

export function appendChild(elements, child) {
	if(elements.length || elements.length === 0) {
		elements.forEach((e) => {
			e.appendChild(child.cloneNode())
		})
	} else {
		elements.appendChild(child)
	}
}

export function appendChildren(element, children) {
	if(children.length || children.length === 0) {
		children.forEach((e) => {
			appendChild(element, e)
		})
	}
}

export function innerHTML(elements, text) {
	if(typeof text !== 'string') {
		throw new Error('text must be a string.');
	}

	if(elements.length || elements.length === 0) {
		elements.forEach((e) => {
			e.innerHTML = text				
		})
	} else {
		elements.innerHTML = text	
	}
}

export function setClasses(element, classes) { // classes can be a string or an Array of classes
	classes = _normalizeClasses(element, classes)	

	element.className = element.className ? 
		(element.className.trim() + ' ' + classes).trim() :
		classes
}

export function removeClasses(element, classes) { // classes can be a string or an Array of classes
	let className = element.className ?
		element.className.trim().split(' ') :
		[]

	if(classes instanceof Array && className.length) {
		let newClassName = className.slice()

		classes.forEach((c) => {
			if(className.indexOf(c) > -1)	{
				newClassName.splice(newClassName.indexOf(c), 1)	
			}
		})	

		element.className = newClassName.join(' ')
	} else {
		if(className.indexOf(classes) > -1)	{
			className.splice(className.indexOf(classes), 1)
			element.className = className.join(' ')
		}
	}
}

/*
 * Some util functions
 */

function _normalizeClasses(element, classes) {
	let className = element.className ?
		element.className.trim().split(' ') :
		[]

	if(classes instanceof Array && className.length) {
		let newClasses = classes.slice()

		classes.forEach((c) => {
			if(className.indexOf(c) > -1)	{
				newClasses.splice(newClasses.indexOf(c), 1)	
			}
		})	

		return newClasses.join(' ')
	} else {
		if(className.indexOf(classes) > -1)	{
			return ''
		}
	}

	return classes
}
