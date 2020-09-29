var	moment = require('moment'),
	mysql = require('../models/mysql');

saveExpDtls = function (req, res) {

	var created = new Date();

	if (!req.body.userid || !req.body.startdate || !req.body.enddate || !req.body.companyname || !req.body.title) {

		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var stdate = moment(req.body.startdate, 'DD-MMM-YYYY').toDate();
		var eddate = moment(req.body.enddate, 'DD-MMM-YYYY').toDate();

		if (eddate >= stdate) {
			var queryParam = {
				userid: req.body.userid,
				startdate: stdate,
				enddate: eddate,
				companyname: req.body.companyname,
				title: req.body.title,
				creationdate: created,
				modifydate: created
			}

			mysql.queryDb("INSERT INTO experience SET ?", queryParam, function (err, response) {
				if (err) {
					console.log("Error while perfoming query !!!");
					res.status(500).json({
						status: 500,
						message: "Please try again later"
					});
				} else {
					res.status(200).json({
						status: 200,
						message: "Experience added Succesfully"
					});
				}
			});
		} else {
			res.status(400).json({
				status: 400,
				message: "Bad Request"
			});
		}
	}
};

updateExpDtls = function (req, res) {
	
	var modified = new Date();

	if (!req.body.userid || !req.body.experienceid || !req.body.startdate || !req.body.enddate || !req.body.companyname || !req.body.title) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = req.body.userid, experienceid = req.body.experienceid;

		var stdate = moment(req.body.startdate, 'DD-MMM-YYYY').toDate();
		var eddate = moment(req.body.enddate, 'DD-MMM-YYYY').toDate();

		if (eddate >= stdate) {

			var newParam = {
				startdate: stdate,
				enddate: eddate,
				companyname: req.body.companyname,
				title: req.body.title,
				modifydate: modified
			};
			
			mysql.queryDb("UPDATE experience SET ? WHERE ?? = ? and ?? = ?",
				[newParam, 'userid', userid, 'experienceid', experienceid],
				function (err, response) {
					if (err) {
						console.log("Error while perfoming query !!!");
						console.log(err);
						res.status(500).json({
							status: 500,
							message: "Please try again later"
						});
					} else {
						res.status(200).json({
							status: 200,
							message: "Experience updated Succesfully"
						});
					}
				});
		} else {
			res.status(400).json({
				status: 400,
				message: "Bad Request"
			});
		}
	}
};

getExpDtls = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		mysql.queryDb('SELECT * FROM experience WHERE ?', [{ userid: req.params.userid }], function (err, rows) {

			if (err) {
				res.status(500).json({
					status: 500,
					message: "Error while retrieving data"
				});
			} else {
				//console.log(rows);
				res.status(200).json({
					status: 200,
					data: rows
				});
			}
		});
	}
};

deleteExpDtls = function (req, res) {
	console.log(JSON.stringify(req.body));
	if (!req.body.userid || !req.body.experienceid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = req.body.userid, experienceid = req.body.experienceid;

		mysql.queryDb('DELETE FROM ?? WHERE ?? = ? AND ??=?',
			['experience', 'userid', userid, 'experienceid', experienceid], function (err, response) {
				if (err) {
					console.log("Error while deleting experience !!!");
					console.log(err);
					res.status(500).json({
						status: 500,
						message: "Error while deleting experience !!!"
					});
				} else {
					res.status(200).json({
						status: 200,
						message: "Experience deleted Succesfully"
					});
				}
			});
	}
};

exports.getExpDtls = getExpDtls;
exports.saveExpDtls = saveExpDtls;
exports.updateExpDtls = updateExpDtls;
exports.deleteExpDtls = deleteExpDtls;