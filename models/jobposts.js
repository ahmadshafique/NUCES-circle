var moment = require('moment'),
  mysql = require('../models/mysql');

postJob = function (req, res) {
  if (!req.body.userid || !req.body.title || !req.body.location || !req.body.details || !req.body.fromdate || !req.body.todate) {
    res.status(400).json({
      status: 400,
      message: "Bad Request"
    });
  } else {
    console.log("postJob " + JSON.stringify(req.body));

    var fromDate = moment(req.body.fromdate, 'DD-MMM-YYYY').toDate();
    var toDate = moment(req.body.todate, 'DD-MMM-YYYY').toDate();

    if (toDate >= fromDate) {
      var data = {
        userid: req.body.userid,
        title: req.body.title,
        location: req.body.location,
        detailslink: req.body.details,
        fromdate: fromDate,
        todate: toDate,
      };
      mysql.queryDb('insert into job set ?', [data], function (err, result) {
        if (err) {
          console.log("Error while inserting job data. " + err);
          res.status(500).json({ status: 500, message: "Error while adding job details" });
        } else {
          res.status(200).json({ status: 200, message: "Successful" });
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

updateJob = function (req, res) {
  if (!req.body.userid || !req.body.jobid || !req.body.title || !req.body.location || !req.body.details || !req.body.fromdate || !req.body.todate) {
    res.status(400).json({
      status: 400,
      message: "Bad Request"
    });
  } else {
    console.log("updateJob " + JSON.stringify(req.body));

    var fromDate = moment(req.body.fromdate, 'DD-MMM-YYYY').toDate();
    var toDate = moment(req.body.todate, 'DD-MMM-YYYY').toDate();

    if (toDate >= fromDate) {
      var newParam = {
        'title': req.body.title,
        'location': req.body.location,
        'detailslink': req.body.details,
        'fromdate': fromDate,
        'todate': toDate,
      };

      var userid = req.body.userid, jobid = req.body.jobid;

      mysql.queryDb("UPDATE job SET ? WHERE ?? = ? and ?? = ?",
        [newParam, 'userid', userid, 'jobid', jobid],
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
              message: "Job details updated Succesfully"
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
}

deleteJob = function (req, res) {
  if (!req.body.userid || !req.body.jobid) {
    res.status(400).json({
      status: 400,
      message: "Bad Request"
    });
  } else {
    console.log("deleteJob " + JSON.stringify(req.body));
    var userid = req.body.userid, jobid = req.body.jobid;
    mysql.queryDb('delete from job where ?? = ? and ?? = ?', ['jobid', jobid, 'userid', userid], function (err, result) {
      if (err) {
        console.log("Error while deleting job data. " + err);
        res.status(500).json({ status: 500, message: "Error while deleting job" });
      } else {
        res.status(200).json({ status: 200, message: "Successful" });
      }
    });
  }
};

getJobById = function (req, res) {
  if (!req.params.jobid) {
    res.status(400).json({
      status: 400,
      message: "Bad Request"
    });
  } else {
    console.log("jobById " + JSON.stringify(req.params));
    var jobid = req.params.jobid;
    mysql.queryDb('select * from job where ?? = ?', ['jobid', jobid], function (err, result) {
      if (err) {
        console.log("Error while getting jobs data by id. " + err);
        res.status(500).json({ status: 500, message: "Error while getting job by jobid" });
      } else {
        console.log(JSON.stringify(result));
        res.status(200).json({ status: 200, message: "Successful", data: result[0] });
      }
    });
  }
};

getAllJobs = function (req, res) {
  mysql.queryDb('select * from job', [], function (err, result) {
    if (err) {
      console.log("Error while getting all jobs data. " + err);
      res.status(500).json({ status: 500, message: "Error while getting all job details" });
    } else {
      console.log(JSON.stringify(result));
      res.status(200).json({ status: 200, message: "Successful", result: result });
    }
  });
};

getAllJobsByOrg = function (req, res) {
  if (!req.params.userid) {
    res.status(400).json({
      status: 400,
      message: "Bad Request"
    });
  } else {
    console.log("jobByUserId " + JSON.stringify(req.params));
    var userid = req.params.userid;
    mysql.queryDb('select * from job where ?? = ?', ['userid', userid], function (err, result) {
      if (err) {
        console.log("Error while getting all jobs data for given organization" + err);
        res.status(500).json({ status: 500, message: "Error while getting all job details" });
      } else {
        if (result != null || result != "") {
          res.status(200).json({ status: 200, message: "Jobs Posted By this Organisation", result: result });
        }
        else {
          res.status(200).json({ status: 200, message: "No Jobs Posted By this Organisation" });
        }
      }
    });
  }
};

exports.postJob = postJob;
exports.updateJob = updateJob;
exports.getJobById = getJobById;
exports.getAllJobs = getAllJobs;
exports.getAllJobsByOrg = getAllJobsByOrg;
exports.deleteJob = deleteJob;
