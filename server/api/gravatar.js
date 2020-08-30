let request = require("request")
var fs = require("fs");
var chalk = require('chalk');
var validator = require('validator');

module.exports = function (req, res, next) {
	let md5 = req.query.md5;
	// 如果不是md5直接抛出默认头像
	const md5_ = md5 || "";
	if (!validator.isMD5(md5_ + "")) {
		const defaultPath = "./data/userTxDefault/default.png";
		const defaultData = fs.readFileSync(defaultPath);
		res.type('png');
		res.status(200).send(defaultData);
		return false;
	}

	var url = 'https://gravatar.loli.net/avatar/' + md5 + '?s=100&d=mm&r=g&d=404&days=' + new Date().getDate();
	var options = {
		url: url,
		encoding: null,
		timeout: 15000
	};

	let gravatarTxStat = null;
	let getFlag = true;
	let haveUserTx = false;
	const userTxPath = "./public/userTx/" + md5 + ".jpg";
	// 校验用户是否有上传头像
	try {
		fs.statSync(userTxPath);
		haveUserTx = true;
	} catch (err) {
		if (err.code !== "ENOENT") {
			throw err;
		}
		haveUserTx = false;
	}
	if (haveUserTx) {
		// 如果有用户头像则发送用户头像
		const data = fs.readFileSync(userTxPath);
		res.type('jpg');
		res.status(200).send(data);
	} else {
		// 如果没有用户头像则调用gravatar
		// 判断有没有缓存的gravatar头像
		const gravatarPath = "./data/cache/gravatar/" + md5;
		try {
			gravatarTxStat = fs.statSync(gravatarPath);
		} catch (err) {
			if (err.code !== "ENOENT") {
				throw err;
			}
			getFlag = true;
			gravatarTxStat = null;
		}
		if (gravatarTxStat) {
			// 如果有文件信息，获取文件修改日期
			const editDate = gravatarTxStat["mtime"] || "0";
			const editDateFormat = new Date(editDate).toISOString().split('T')[0];
			const nowTimeFormat = new Date().toISOString().split('T')[0];
			if (editDateFormat === nowTimeFormat) {
				// 修改日期和今天一样则线上获取flag为false
				getFlag = false;
			}
		}
		if (getFlag) {
			// console.log(md5 + "读取线上头像");
			request.get(options, (error, response, body) => {
				if (!error && response.statusCode === 200) {
					let ctype = response.headers['content-type'] || 'jpeg';
					res.type(ctype);
					res.status(200).send(body);
					fs.writeFileSync(gravatarPath, body);
				} else {
					// 计算头像ID
					const md5Str = md5 || "";
					const userMD5Last6 = md5Str.substring(md5Str.length - 10, md5Str.length);
					const userMD5Fix = Number("0x" + userMD5Last6);
					// console.log(userMD5Fix);
					let txName = userMD5Fix % 102;
					const txUrl = "./data/userTxDefault/" + txName + ".png";
					const data = fs.readFileSync(txUrl);
					res.type('png');
					res.status(200).send(data);
					fs.writeFileSync(gravatarPath, data);
				}
			});
		} else {
			const data = fs.readFileSync(gravatarPath);
			// console.log(md5 + "读取缓存头像");
			res.status(200).send(data);
		}
	}
}