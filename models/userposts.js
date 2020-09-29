var dateutil = require('../util/dateutil'),
	mysql = require('../models/mysql');

exports.savePost = function (req, res) {
	if (!req.body.userid || !req.body.postbody) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var created = dateutil.now();
		var data = {
			postbody: req.body.postbody,
			userid: req.body.userid,
			creationdate: created,
			modifydate: created
		};

		if (data.postbody == null || data.postbody == "") {
			console.log(err);
			res.status(400).json({ status: 400, message: "postbody is emtpy" });
		} else {
			mysql.queryDb('insert into posts set ?', data, function (err, result) {
				if (err) {
					console.log(err);
					res.status(500).json({ status: 500, message: "Error while saving post !!!" });
				}
				else {
					//console.log(JSON.stringify(result));
					res.status(200).json({ status: 200, message: "Successfully saved user post" });
				}
			});
		}
	}
};

exports.updatePost = function (req, res) {
	if (!req.body.postid || !req.body.postbody) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var postid = req.body.postid;
		var modified = dateutil.now();

		var queryParams = {
			postbody: req.body.postbody,
			modifydate: modified
		};

		mysql.queryDb("UPDATE ?? SET ? WHERE ?? = ?", ['posts', queryParams, 'postid', postid], function (err, response) {
			if (err) {
				console.log("Error while update user post");
				res.status(500).json({ status: 500, message: "Error while updating post !!!" });
			}
			else {
				res.status(200).json({ status: 200, message: "Successfully updated user post" });
			}
		});
	}
};

exports.deletePost = function (req, res) {
	if (!req.body.postid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var postid = req.body.postid;

		mysql.queryDb('DELETE FROM ?? WHERE ?? = ?', ['posts', 'postid', postid], function (err, response) {
			if (err) {
				console.log("Error while deleting post !!!" + err);
				res.status(500).json({ status: 500, message: "Error while deleting post !!!" });
			} else {
				res.status(200).json({ status: 200, message: "Post deleted Succesfully" });
			}
		});
	}
};

exports.getPostsCount = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var profile_id = req.params.userid;
		var sql = "select count(postid) as postsCount from posts as p where p.userid=? or p.userid=(select user2id from connections where user1id=?)";
		mysql.queryDb(sql, [profile_id, profile_id], function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ status: 500, message: "Error while getting user posts count !!!" });
			} else {
				//console.log(JSON.stringify(rows));
				res.status(200).json({ status: 200, message: "Successfully got user posts count", count: rows[0].postsCount });
			}
		});
	}
};

exports.pagePosts = function (req, res) {
	//console.log(req.params);
	if (!req.params.userid || !req.params.pageNo || !req.params.pageSize) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var profile_id = req.params.userid;
		var pageNo = req.params.pageNo;
		var pageSize = req.params.pageSize;
		var sql = "select ud.firstname, ud.lastname, p.postbody, p.postid from userdetails as ud inner join posts as p on ud.userid=p.userid where p.userid=? or p.userid=(select user2id from connections where user1id=?) order by p.modifydate desc limit " + pageNo + ", " + pageSize;
		mysql.queryDb(sql, [profile_id, profile_id], function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ status: 500, message: "Error while showing next page post !!!" });
			} else {
				//console.log(JSON.stringify(rows));
				res.status(200).json({ status: 200, message: "Successfully showed next page user posts", data: rows });
			}
		});
	}
};

exports.userAllPosts = function (req, res) {
	if (!req.params.userid) {
		res.status(400).json({
			status: 400,
			message: "Bad Request"
		});
	} else {
		var profile_id = req.params.userid;
		var sql = "select ud.firstname, ud.lastname, p.postbody, p.postid from userdetails as ud inner join posts as p on ud.userid=p.userid where p.userid=? or p.userid=(select user2id from connections where user1id=?) order by p.modifydate desc";
		mysql.queryDb(sql, [profile_id, profile_id], function (err, rows) {
			if (err) {
				console.log(err);
				res.status(500).json({ status: 500, message: "Error while showing all posts !!!" });
			} else {
				//console.log(JSON.stringify(rows));
				res.status(200).json({ status: 200, message: "Successfully showed user all posts", data: rows });
			}
		});
	}
};
