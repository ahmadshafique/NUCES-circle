var mysql = require('../models/mysql');

function basicSearch(req, res) {
	
	var sql = "select ud.userid as userid, concat(ud.firstname, ' ', ud.lastname) as name, 'usr' as type from userdetails as ud union select o.userid as userid, o.organisationname as name, 'org' as type from organisation as o union select j.jobid as userid, j.title as name, 'job' as type from job as j";
	var data = [];
	mysql.queryDb(sql, [], function (err, result) {
		if (err) {
			console.log("Error while fetching search data. " + err);
			res.status(500).json({ status: 500, message: "Please try again later" });
		} else {
			result.forEach(function (item) {
				data.push({
					type: item.type,
					userid: item.userid,
					name: item.name
				});
			});
			//console.log(data);
			res.status(200).json({ status: 200, message: "Successful", data: data });
		};
	});
}

exports.advanceSearch = function (req, res) {
	//console.log(req.body.query);
	var query = '%'+req.body.query+'%';
	var sql = "SELECT distinct ud.userid, concat(ud.firstname, ' ', ud.lastname) as name, 'usr' as type "+
	"FROM userdetails as ud	"+
	"LEFT JOIN experience as exp ON ud.userid = exp.userid "+
	"LEFT JOIN education as edu ON exp.userid = edu.userid "+
	"where ud.firstname like ? or ud.lastname like ? or ud.email like ? "+
	"or exp.companyname like ? or exp.title like ? or exp.location like ? "+
	"or exp.startdate like ? or exp.enddate like ? or edu.school like ? "+
	"or edu.startdate like ? or edu.enddate like ? or edu.degree like ? "+
	"UNION "+
	"select o.userid as userid, o.organisationname as name, 'org' as type from organisation as o "+
	"where o.organisationname like ? or o.email like ? "+
	"UNION "+
	"select j.jobid as userid, j.title as name, 'job' as type from job as j "+
	"where j.title like ? or j.location like ? or fromdate like ? or todate like ? ";
	var params = [query,query,query,query,query,query,query,query,query,
				query,query,query,query,query,query,query,query,query];

	var data = [];
	mysql.queryDb(sql, params, function (err, result) {
		if (err) {
			console.log("Error while fetching search data. " + err);
			res.status(500).json({ status: 500, message: "Please try again later" });
		} else {
			result.forEach(function (item) {
			 	data.push({
					type: item.type,
					userid: item.userid,
					name: item.name
				});
			});
			if (data.length>0){
				console.log(data);
				res.status(200).json({ status: 200, message: "Successful", data: data });
			} else {
				res.status(200).json({ status: 200, message: "Parameters do not match with any existing record", data: [] });

			}
		};
	});
}
