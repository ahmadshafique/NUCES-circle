var moment = require('moment');

exports.now = function () {
	return new Date();
};

exports.nowFullString = function () {
	return moment().format('DD-MMMM-YYYY');
};

exports.nowString = function () {
	return moment().format('MMMM-YYYY');
};
