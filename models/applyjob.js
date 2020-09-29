var mysql = require('../models/mysql');

postApplication = function (req, res) {
	if (!req.body.userid || !req.body.jobid) {
		res.status(400).json({status: 400, message: "Bad Request"});
	} else {
		console.log("postApplication " + JSON.stringify(req.body));
		var data = {
			userid: req.body.userid,
			jobid: req.body.jobid
		};
		mysql.queryDb("insert into jobapplications set ? ", [data], function (err, result) {
			if (err) {
				console.log("Error while inserting jobApply data " + err);
				res.status(500).json({ status: 500, message: "Error while inserting jobApply data" });
			} else {
				res.status(200).json({ status: 200, message: "Successful" });
			}
		});
	}
};

//Called in user profile jobs applied
getUserApplications = function (req, res) {
	console.log("applicationsByUserId " + JSON.stringify(req.params));
	var userid = req.params.userid;
	if (!userid) {
		res.status(400).json({ status: 400, message: "Bad Request" });
	} else {
		mysql.queryDb("select jobid from jobapplications where userid = ? ", [userid], function (err, rows) {
			if (err) {
				console.log("Error while getting jobApplyUser data " + err);
				res.status(500).json({ status: 500, message: "Error while getting jobApplyUser data" });
			} else {
				var array = [];
				rows.forEach(function (job) {
					array.push(job.jobid);
				});
				if (array.length > 0) {
					var sql = "select title, organisationname as company, location,	detailslink, fromdate, todate from job j inner join organisation o on j.userid=o.userid where j.jobid in (?)";
					mysql.queryDb(sql, [array], function (err, rows) {
						if (err) {
							console.log("Error while retrieving user job applications !!!" + err);
							res.status(500).json({ status: 500, message: "Error while retrieving user job applications" });
						} else {
							console.log(JSON.stringify(rows));
							res.status(200).json({ status: 200, message: "Successful", data: rows });
						}
					});
				} else {
					res.status(200).json({ status: 200, message: "No Jobs Applied" });
				}
			}
		});
	}
};

//Called by jobid for each job posted by org to get list of applicants
getOrgApplications = function (req, res) {
	console.log("applicationsByJobId " + JSON.stringify(req.params));
	var jobid = req.params.jobid;
	if (!jobid) {
		res.status(400).json({ status: 400, message: "Bad Request" });
	} else {
		mysql.queryDb("select userid from jobapplications where jobid = ? ", [jobid], function (err, rows) {
			if (err) {
				console.log("Error while getting jobAppliedUser data " + err);
				res.status(500).json({ status: 500, message: "Error while getting jobAppliedUser data" });
			} else {
				var array = [];
				rows.forEach(function (user) {
					array.push(user.userid);
				});
				if (array.length > 0) {
					var sql = "select concat(firstname, ' ', lastname) as fullname, headline from userdetails where userid in (?)";
					mysql.queryDb(sql, [array], function (err, rows) {
						if (err) {
							console.log("Error while retrieving job applicants !!!" + err);
							res.status(500).json({ status: 500, message: "Error while retrieving job applicants" });
						} else {
							console.log(JSON.stringify(rows));
							res.status(200).json({ status: 200, message: "Successful", data: rows });
						}
					});
				} else {
					res.status(200).json({ status: 200, message: "No User Applied" });
				}
			}
		});
	}
}

//Called in user profile jobs recommendation
getRecommendedJobs = function (req, res) {
	console.log("recommendedUserJobs " + JSON.stringify(req.params));
	var userid = req.params.userid;
	if (!userid) {
		res.status(400).json({ status: 400, message: "Bad Request" });
	} else {
		mysql.queryDb("select jobid from job", [], function (err, resultjobs) {
			if (err) {
				console.log("Error while retrieving recommended all jobs !!! " + err);
				res.status(500).json({ status: 500, message: "Error while retrieving recommended all jobs !!" });
			} else {
				mysql.queryDb("select jobid from jobapplications where userid = ?", [userid], function (err, resultapplications) {
					if (err) {
						console.log("Error while retrieving recommended job !!! " + err);
						res.status(500).json({ status: 500, message: "Error while retrieving recommended jobs !!" });
					} else {
						var array = [];
						if (resultapplications.length < 1) {
							resultjobs.forEach(function (job) {
								array.push(job.jobid);
							});
							if (array.length > 0) {
								var sql = "select jobid, title, organisationname as company, location,	detailslink, fromdate, todate from job j inner join organisation o on j.userid=o.userid where j.jobid in (?)";
								mysql.queryDb(sql, [array], function (err, rows) {
									if (err) {
										console.log("Error while retrieving recommended jobs !!!" + err);
										res.status(500).json({ status: 500, message: "Error while retrieving recommended jobs" });
									} else {
										//console.log(JSON.stringify(rows));
										res.status(200).json({ status: 200, message: "Successful", data: rows });
									}
								});
							}
							else {
								res.status(200).json({ status: 200, message: "No Jobs Recommended" });
							}
						}
						else {
							resultapplications.forEach(function (jobApplied) {
								array.push(jobApplied.jobid);
							});
							mysql.queryDb("select count(*) as total_count from job", function (err, count) {
								if (err) {
									console.log("Error while retrieving total jobs count !!! " + err);
									res.status(500).json({ status: 500, message: "Error while retrieving total jobs count !!" });
								} else {
									if (array.length > 0 && array.length < count[0].total_count) {
										var sql = "select jobid, title, organisationname as company, location,	detailslink, fromdate, todate from job j inner join organisation o on j.userid=o.userid where j.jobid not in (?)";
										mysql.queryDb(sql, [array], function (err, rows) {
											if (err) {
												console.log("Error while retrieving recommended user connections !!!" + err);
												res.status(500).json({ status: 500, message: "Error while recommended retrieving user connections" });
											} else {
												//console.log(JSON.stringify(rows));
												res.status(200).json({ status: 200, message: "Successful", data: rows });
											}
										});
									} else {
										res.status(200).json({ status: 200, message: "No Jobs Recommended" });
									}
								}
							})
						}
					}
				})
			}
		});
	}
};


exports.postApplication = postApplication;
exports.getUserApplications = getUserApplications;
exports.getOrgApplications = getOrgApplications;
exports.getRecommendedJobs = getRecommendedJobs;
