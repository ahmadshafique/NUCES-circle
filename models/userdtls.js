var mysql = require('../models/mysql');

updateUserDtls = function (req, res) {

	if (!req.body.userid || !req.body.firstName || !req.body.lastName || !req.body.dob || req.body.dob > new Date()) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = "" + req.body.userid;

		var queryParams = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			headline: req.body.headline,
			dob: req.body.dob,
			summary: req.body.summary
		};

		mysql.queryDb("UPDATE ?? SET ? WHERE ?? = ?", ['userdetails', queryParams, 'userid', userid], function (err, response) {
			if (err) {
				console.log("Error while update userdetails");
				res.status(500).json({ status: 500, message: "Error while updating user profile info !!!" });			}
			else {
				res.status(200).json({ status: 200, message: "Successfully updated user profile info" });
			}

		});
	}
};

getUserDtls = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		console.log("getUserDtls " + req.params.userid);
		mysql.queryDb("select * from userdetails where userid = ?", [req.params.userid], function (err, response) {

			if (err) {
				console.log(err);
				res.status(500).json({ status: 500, message: "Error while retrieving user details data" });
			} else {
				//console.log(response[0]);
				//console.log("Result: " + JSON.stringify(response[0]));
				res.status(200).json({ status: 200, message: "Successful", data: response[0] });
			}
		});
	}
};

exports.getUserDtls = getUserDtls;
exports.updateUserDtls = updateUserDtls;