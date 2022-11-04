const fs = require('fs');

function build(pre_path, pre_uri, name, depth) {
	const path = pre_path + '/' + name;
	const stat = fs.statSync(path);
	let node = {};
	if (stat.isDirectory()) {
		node.name = name;
		node.type = 'dir';
		node.path = path;
		if (depth == 0) {
			node.uri = '/';
		}
		else if (depth == 1) {
			node.uri = pre_uri + name;
		}
		else {
			node.uri = pre_uri + '/' + name;
		}
		node.content = [];
		const dir_node = fs.readdirSync(path);
		dir_node.forEach(element => {
			node.content.push(build(path, node.uri, element, depth + 1));
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

module.exports.build = build;