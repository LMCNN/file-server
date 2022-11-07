// enviroment variables
const APP_PATH = process.env.APP_PATH;
const ROOT_PATH = process.env.ROOT_PATH;
const ROOT_NAME = process.env.ROOT_NAME;

const path = require('path');
const url = require('url');
const express = require('express');
const router = express.Router();
const { build, checkForUpdate } = require(path.join(APP_PATH, 'utils', 'utils.js'));

let root;

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

router.get('/', async (req, res) => {
	root = await checkForUpdate(root, ROOT_PATH, ROOT_NAME);
	console.log(root);
	const params = {
		title: root.name,
		uri: root.uri,
		dirs: root.content.filter(elem => elem.type === 'dir'),
		files: root.content.filter(elem => elem.type === 'file')
	};
	res.render('file', params);
});

router.use(async (req, res) => {
	root = await checkForUpdate(root, ROOT_PATH, ROOT_NAME);
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