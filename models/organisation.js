var mysql = require('../models/mysql');

exports.getAllOrganisations = function (req, res) {
	mysql.queryDb("SELECT * FROM organisation", [], function (err, response) {
		if (err) {
			res.status(500).json({ status: 500, message: "Error while retrieving data" });
		} else {
			res.status(200).json({ status: 200, data: response });
		}
	});
};

exports.getOrgDtls = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		console.log("getOrgDtls " + req.params.userid);
		mysql.queryDb("select * from organisation where userid = ?", [req.params.userid], function (err, response) {
			if (err) {
				console.log(err);
				res.status(500).json({ status: 500, message: "Error while retrieving data" });
			} else {
				console.log(JSON.stringify(response));
				res.status(200).json({ status: 200, message: "Successful", data: response[0] });
			}
		});
	}
};

exports.saveOrgDtls = function (req, res) {

	if (!req.body.userid || !req.body.motto || !req.body.url || !req.body.overview) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = "" + req.body.userid;
		var queryParams = {
			motto: req.body.motto,
			url: req.body.url,
			overview: req.body.overview,
		};

		mysql.queryDb("UPDATE ?? SET ? WHERE ?? = ?", ['organisation', queryParams, 'userid', userid], function (err, response) {
			if (err) {
				console.log(err);
				res.status(500).json({ status: 500, message: "Error while saving org details data" });
			}
			else {
				res.status(200).json({ status: 200, message: "Successfully updated org profile info" });
			}
		});
	}
}
