import libs from './libs'

//console.log(libs); // eslint-disable-line no-console
const { request, DOM: $ } = libs

//console.log($.get('body')); // eslint-disable-line no-console

//$.setClasses(body, 'lol')
//$.setClasses(body, 'blah')
//$.setClasses(body, 'lol')
//$.setClasses(body, ['x','lol'])
//$.removeClasses(body, ['x', 'lol'])
//$.removeClasses(body, 'blah')

function success(res) {
	//console.log(res) // eslint-disable-line no-console
	const data = res.data.children

	let body = $.get('body')

	let ps = $.createElements('p', data.length)

	let a = $.createElement('a')
	//console.log(a) // eslint-disable-line no-console

	$.appendChild(ps, a)

	data.forEach((n, i) => {
		let asinps = $.get('a', ps[i]) 
		asinps.href = n.data.url
		asinps.innerHTML = n.data.url
	})

	$.appendChildren(body, ps)
}

request()
	.get('https://www.reddit.com/r/drugscirclejerk.json')
	.end()
	.then(success)

request()
	.get('https://www.reddit.com/r/gaming.json')
	.end()
	.then(success)

