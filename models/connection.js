var dateutil = require('../util/dateutil'),
	mysql = require('../models/mysql');

checkUsersConn = function (req, res) {
	if (!req.params.userid || !req.params.secuserid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var user1id = req.params.userid
		var user2id = req.params.secuserid
		mysql.queryDb('select * from connections where user1id=? and user2id=?', [user1id, user2id], function (err, result) {
			if (err) {
				console.log("error while fetching connection data" + err);
				res.status(500).json({ status: 500, message: "Please try again later" });
			} else {
				if (result == null || result == '') {
					mysql.queryDb('select * from connections where user1id=? and user2id=?', [user2id, user1id], function (err, result) {
						if (err) {
							console.log("error while fetching connection data" + err);
							res.status(500).json({ status: 500, message: "Please try again later" });
						} else {
							if (result == null || result == '')
								res.status(200).json({ status: 200, message: "Not Connected", con: 0 });
							else if (result[0].approved = "0")
								res.status(200).json({ status: 200, message: "Request Pending", con: 1 });
							else
								res.status(200).json({ status: 200, message: "Connected", con: 2 });
						}
					});
				}
				else if (result[0].approved = "0")
					res.status(200).json({ status: 200, message: "Request Pending", con: 1 });
				else
					res.status(200).json({ status: 200, message: "Connected", con: 2 });
			}
		});
	}

};

addConn = function (req, res) {
	if (!req.body.userid || !req.body.secuserid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var user1id = req.body.userid;
		var user2id = req.body.secuserid;
		var creationdate = dateutil.now();
		var data = {
			user1id: user1id,
			user2id: user2id,
			creationdate: creationdate
		};

		mysql.queryDb('insert into connections set ?', [data], function (err, result) {
			if (err) {
				console.log("Error while adding connection " + err);
				res.status(500).json({ status: 500, message: "Please try again later" });
			} else {
				res.status(200).json({ status: 200, message: "Connection Added" });
			}
		});
	}
};

acceptConn = function (req, res) {
	if (!req.body.userid || !req.body.secuserid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var user1id = req.body.userid;
		var user2id = req.body.secuserid;

		mysql.queryDb("Update connections set approved='1' where user1id = ? and user2id = ?", [user1id, user2id], function (err, result) {
			if (err) {
				console.log("Error while accepting connection " + err);
				res.status(500).json({ status: 500, message: "Please try again later" });
			} else {
				mysql.queryDb("Update connections set approved='1' where user1id=? and user2id = ?", [user2id, user1id], function (err, result) {
					if (err) {
						console.log("Error while accepting connection " + err);
						res.status(500).json({ status: 500, message: "Please try again later" });
					} else {
					}
				})
				res.status(200).json({ status: 200, message: "Connection Accepted" });
			}
		})
	}
}

removeConn = function (req, res) {
	if (!req.body.userid || !req.body.secuserid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var user1id = req.body.userid;
		var user2id = req.body.secuserid;

		mysql.queryDb('delete from connections where user1id = ? and user2id = ?', [user1id, user2id], function (err, result) {
			if (err) {
				console.log("error while removing connection " + err);
				//res.status(500).json({ status: 500, message: "Please try again later" });
			}
		});
		mysql.queryDb('delete from connections where user1id = ? and user2id = ?', [user2id, user1id], function (err, result) {
			if (err) {
				console.log("error while removing connection " + err);
				//res.status(500).json({ status: 500, message: "Please try again later" });
			}
		});
		res.status(200).json({ status: 200, message: "Connection Removed" });
	}
};

//fetch approved=0 user2id Received
getAllReqReceived = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = req.params.userid;
		if (!userid) {
			res.status(400).json({ status: 400, message: "Bad Request" });
		} else {
			mysql.queryDb("select * from connections where user2id=? and approved='0'", [userid], function (err, result) {
				if (err) {
					console.log("Error while retrieving user connections requests !!! " + err);
					res.status(500).json({ status: 500, message: "Error while retrieving user connections requests !!" });
				} else {
					var array = [];
					result.forEach(function (connection) {
						array.push(connection.user1id);
					});
					if (array.length > 0) {
						var sql = "select userid, concat(firstname, ' ', lastname) as fullname, email from userdetails usr where usr.userid in (?)";
						mysql.queryDb(sql, [array], function (err, rows) {
							if (err) {
								console.log("Error while retrieving user connections !!!" + err);
								res.status(500).json({ status: 500, message: "Error while retrieving user connections requests" });
							} else {
								console.log(JSON.stringify(rows));
								res.status(200).json({ status: 200, message: "Successful", data: rows });
							}
						});
					}
					else {
						res.status(200).json({ status: 200, message: "No Connection Requests Pending" });
					}
				}
			});
		}
	}
}

//fetch approved=0 user1id Sent
getAllReqSent = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = req.params.userid;
		if (!userid) {
			res.status(400).json({ status: 400, message: "Bad Request" });
		} else {
			mysql.queryDb("select * from connections where user1id=? and approved='0'", [userid], function (err, result) {
				if (err) {
					console.log("Error while retrieving user connections requests !!! " + err);
					res.status(500).json({ status: 500, message: "Error while retrieving user connections requests !!" });
				} else {
					var array = [];
					result.forEach(function (connection) {
						array.push(connection.user2id);
					});
					if (array.length > 0) {
						var sql = "select userid, concat(firstname, ' ', lastname) as fullname, email from userdetails usr where usr.userid in (?)";
						mysql.queryDb(sql, [array], function (err, rows) {
							if (err) {
								console.log("Error while retrieving user connections !!!" + err);
								res.status(500).json({ status: 500, message: "Error while retrieving user connections requests" });
							} else {
								console.log(JSON.stringify(rows));
								res.status(200).json({ status: 200, message: "Successful", data: rows });
							}
						});
					}
					else {
						res.status(200).json({ status: 200, message: "No Connection Requests Sent" });
					}
				}
			});
		}
	}
}

//fetch approved=1
getAllConn = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var userid = req.params.userid;
		if (!userid) {
			res.status(400).json({ status: 400, message: "Bad Request" });
		} else {
			mysql.queryDb("select * from connections where user1id=? and approved='1' UNION select * from connections where user2id=? and approved='1'", [userid, userid], function (err, result) {
				if (err) {
					console.log("Error while retrieving user connections !!! " + err);
					res.status(500).json({ status: 500, message: "Error while retrieving user connections !!" });
				} else {
					var array = [];
					result.forEach(function (connection) {
						array.push(connection.user2id);
					});
					if (array.length > 0) {
						var sql = "select userid, concat(firstname, ' ', lastname) as fullname, email from userdetails usr where usr.userid in (?)";
						mysql.queryDb(sql, [array], function (err, rows) {
							if (err) {
								console.log("Error while retrieving user connections !!!" + err);
								res.status(500).json({ status: 500, message: "Error while retrieving user connections" });
							} else {
								console.log(JSON.stringify(rows));
								res.status(200).json({ status: 200, message: "Successful", data: rows });
							}
						});
					} else {
						res.status(200).json({ status: 200, message: "No Connections" });
					}
				}
			});
		}
	}
};

getRecoConn = function (req, res) {
	var userid = req.params.userid;
	if (!userid) {
		res.status(400).json({ status: 400, message: "Bad Request" });
	} else {
		mysql.queryDb("select * from userdetails", [], function (err, resultdetails) {
			if (err) {
				console.log("Error while retrieving recommended connection userdetails !!! " + err);
				res.status(500).json({ status: 500, message: "Error while retrieving recommended connection userdetails !!" });
			} else {
				mysql.queryDb("select * from connections where user1id=? UNION select * from connections where user2id=?", [userid, userid], function (err, resultconnections) {
					if (err) {
						console.log("Error while retrieving recommended user connections !!! " + err);
						res.status(500).json({ status: 500, message: "Error while retrieving recommended user connections !!" });
					} else {
						var array = [];
						if (resultconnections.length < 1) {
							resultdetails.forEach(function (user) {
								if (userid != user.userid)
									array.push(user.userid);
							});
							if (array.length > 0) {
								var sql = "select userid, concat(firstname, ' ', lastname) as fullname, email from userdetails usr where usr.userid in (?)";
								mysql.queryDb(sql, [array], function (err, rows) {
									if (err) {
										console.log("Error while retrieving recommended user connections !!!" + err);
										res.status(500).json({ status: 500, message: "Error while retrieving recommended user connections" });
									} else {
										console.log(JSON.stringify(rows));
										res.status(200).json({ status: 200, message: "Successful", data: rows });
									}
								});
							}
							else {
								res.status(200).json({ status: 200, message: "No Recommended Connections" });
							}
						}
						else {
							resultconnections.forEach(function (connuser) {
								array.push(connuser.userid);
							});
							array.push(userid);
							mysql.queryDb("select count(*) as total_count from userdetails", function (err, count) {
								if (err) {
									console.log("Error while retrieving total user count !!! " + err);
									res.status(500).json({ status: 500, message: "Error while retrieving total user count !!" });
								} else {
									if (array.length > 1 && array.length < count.total_count) {
										var sql = "select userid, concat(firstname, ' ', lastname) as fullname, email from userdetails usr where usr.userid not in (?)";
										mysql.queryDb(sql, [array], function (err, rows) {
											if (err) {
												console.log("Error while retrieving recommended user connections !!!" + err);
												res.status(500).json({ status: 500, message: "Error while retrieving recommended user connections" });
											} else {
												console.log(JSON.stringify(rows));
												res.status(200).json({ status: 200, message: "Successful", data: rows });
											}
										});
									} else {
										res.status(200).json({ status: 200, message: "No Recommended Connections" });
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

exports.checkUsersConn = checkUsersConn;
exports.getRecoConn = getRecoConn;
exports.addConn = addConn;
exports.acceptConn = acceptConn;
exports.removeConn = removeConn;
exports.getAllReqReceived = getAllReqReceived;
exports.getAllReqSent = getAllReqSent;
exports.getAllConn = getAllConn;