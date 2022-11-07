const fs = require('fs');
const p = require('path');
const { promisify } = require('util');
const Stat = promisify(fs.stat);
const Readdir = promisify(fs.readdir);

async function buildRoot(pre_path, pre_uri, name, depth) {
	const path = p.join(pre_path, name);
	const stat = await Stat(path);
	let node = {};
	if (stat.isDirectory()) {
		node.name = name;
		node.type = 'dir';
		node.path = path;
		if (depth == 0) {
			node.uri = '/';
			node.mtime = stat.mtime;
		}
		else if (depth == 1) {
			node.uri = pre_uri + name;
		}
		else {
			node.uri = pre_uri + '/' + name;
		}
		node.content = [];
		const dir_node = await Readdir(path);
		dir_node.forEach(async fileName => {
			node.content.push(await buildRoot(path, node.uri, fileName, depth + 1));
		});
	}
	else if (stat.isFile()) {
		node.name = name;
		node.type = 'file';
		node.path = path;
		node.uri = pre_uri + '/' + name;
	}
	return node;
}

async function checkForUpdate(rootNode, prefix, rootName) {
	if (!rootNode) {
		return newRoot = await buildRoot(prefix, '', rootName, 0);
	}
	else{
		const rootPath = p.join(prefix, rootName);
		let curr_modify = await Stat(rootPath);
		curr_modify = curr_modify.mtime;
		const old_modify = rootNode.mtime;
		if (curr_modify > old_modify) {
			return newRoot = await buildRoot(prefix, '', rootName, 0);
		}
		return rootNode;
	}
}

module.exports.build = buildRoot;
module.exports.checkForUpdate = checkForUpdate;