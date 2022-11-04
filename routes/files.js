const { build } = require('../utils/utils');
const url = require('url');
const express = require('express');
const router = express.Router();

let root = build(process.cwd(), '', 'public', 0);

function checkUrl(url) {
	let list = url.split("/");
	list = list.filter(element => {
		return element.length > 0;
	});
	if (list.length == 0) return 'invalid';
	let pointer = root;
	list.forEach(elem => {
		try {
			pointer = pointer.content.find(e => e.name === elem);
		}
		catch (e) {
			return pointer;
		}
	});

	return pointer;
}

router.get('/first_template', (req, res) => {
	res.render('first_view');
});

router.get('/', (req, res) => {
	const params = {
		title: root.name,
		uri: root.uri,
		dirs: root.content.filter(elem => elem.type === 'dir'),
		files: root.content.filter(elem => elem.type === 'file')
	};
	res.render('file', params);
});

router.use((req, res) => {
	const result = checkUrl(req.url);
	if (result && result.type === 'dir') {
		pre_uri = result.uri;
		let n = pre_uri.length - 1;
		while (pre_uri[n] !== '/') n--;
		if (n == 0) pre_uri = '/';
		else pre_uri = pre_uri.slice(0, n);
		const params = {
			title: result.name,
			uri: pre_uri,
			dirs: result.content.filter(elem => elem.type === 'dir'),
			files: result.content.filter(elem => elem.type === 'file')
		};
		res.render('file', params);
	}
	else {
		res.send(result);
	}
	res.end();
});

module.exports = router;