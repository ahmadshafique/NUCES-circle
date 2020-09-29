var moment = require('moment'),
	mysql = require('../models/mysql');

saveEduDtls = function (req, res) {
	var created = new Date();
	console.log(JSON.stringify(req.body));
	if (!req.body.userid || !req.body.startdate || !req.body.enddate || !req.body.school || !req.body.degree) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var fromDate = moment(req.body.startdate, 'DD-MMM-YYYY').toDate();
		var toDate = moment(req.body.enddate, 'DD-MMM-YYYY').toDate();

		if (toDate >= fromDate) {
			var queryParam = {
				userid: req.body.userid,
				startdate: fromDate,
				enddate: toDate,
				school: req.body.school,
				degree: req.body.degree,
				creationdate: created,
				modifydate: created
			}

			mysql.queryDb("INSERT INTO education SET ?", queryParam, function (err,
				response) {
				if (err) {
					console.log("Error while perfoming query !!!");
					res.status(500).json({
						status: 500,
						message: "Please try again later"
					});
				} else {
					res.status(200).json({
						status: 200,
						message: "Education added Succesfully"
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

updateEduDtls = function (req, res) {

	var modified = new Date();

	if (!req.body.userid || !req.body.educationid || !req.body.startdate || !req.body.enddate
		|| !req.body.school || !req.body.degree) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = req.body.userid, educationid = req.body.educationid;

		var stdate = moment(req.body.startdate, 'DD-MMM-YYYY').toDate();
		var eddate = moment(req.body.enddate, 'DD-MMM-YYYY').toDate();

		if (eddate >= stdate) {

			var newParam = {
				startdate: stdate,
				enddate: eddate,
				school: req.body.school,
				degree: req.body.degree,
				modifydate: modified
			};

			mysql.queryDb("UPDATE education SET ? WHERE ?? = ? and ?? = ?",
				[newParam, 'userid', userid, 'educationid', educationid],
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
							message: "Education updated Succesfully"
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

getEduDtls = function (req, res) {

	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		mysql.queryDb('SELECT * FROM education WHERE ?', [{ userid: req.params.userid }], function (err, rows) {

			if (err) {
				res.status(500).json({
					status: 500,
					message: "Error while retrieving data"
				});
			} else {
				res.status(200).json({
					status: 200,
					data: rows
				});
			}
		});
	}

};

deleteEduDtls = function (req, res) {
	console.log(JSON.stringify(req.body));
	console.log(JSON.stringify(req.params));
	if (!req.body.userid || !req.body.educationid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = req.body.userid, educationid = req.body.educationid;

		mysql.queryDb('DELETE FROM ?? WHERE ?? = ? AND ??=?', 
		['education', 'userid', userid, 'educationid', educationid], function (err, response) {
			if (err) {
				console.log("Error while deleting education details !!!");
				console.log(err);
				res.status(500).json({
					status: 500,
					message: "Error while deleting experience !!!"
				});
			} else {
				res.status(200).json({
					status: 200,
					message: "Education details deleted Succesfully"
				});
			}
		});
	}
};

exports.getEduDtls = getEduDtls;
exports.saveEduDtls = saveEduDtls;
exports.updateEduDtls = updateEduDtls;
exports.deleteEduDtls = deleteEduDtls;