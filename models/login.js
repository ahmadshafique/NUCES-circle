var crypto = require('crypto'),
    passport = require('passport'),
    mysql = require('../models/mysql'),
    jwt = require('jsonwebtoken'),
    config = require('../conf/config');

exports.register = function (req, res) {

    var pwd = req.body.password;
    var pwdconfirm = req.body.passwordconfirm;
    var un = req.body.email;
    var fn = req.body.firstName;
    var ln = req.body.lastName;
    var orgname = req.body.orgname;
    var usertype = req.body.usertype;

    req.checkBody('email', 'Please enter a valid email.').notEmpty().isEmail();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        var msg = errors[0].msg;
        res.status(400).json({ status: 400, message: msg });
        return;
    }

    mysql.queryDb('select username from userauthenticate where username=?', [un], function (err, result) {
        if (err) {
            console.log("userauthenticate user already present check failed");
            console.log(err);
            res.status(500).json({ status: 500, message: "Please try again later" });
        } else if (result[0] != null) {

            res.status(400).json({ status: 400, message: "This email is already in use !!" });
        }
        else if (pwd.length < 6) {
            res.status(400).json({ status: 400, message: "Password length is less than 6" });
        }
        else if (pwd != pwdconfirm) {
            res.status(400).json({ status: 400, message: "Passwords do not match!" });
        }
        else {
            var new_salt = Math.round((new Date().valueOf() * Math.random())) + '';
            var pw = crypto.createHmac('sha512', new_salt).update(pwd).digest('hex');
            var created = new Date();

            var data = {
                username: un,
                password: pw,
                approved: 1,
                usertype: usertype,
                creationdate: created,
                modifydate: created,
                salt: new_salt
            };

            mysql.queryDb('insert into userauthenticate set ?', data, function (err, result) {

                if (err) {
                    console.log("userauthenticate register problem");
                    console.log(err);
                    res.status(500).json({
                        status: 500,
                        message: "Please try again later"
                    });
                } else {
                    var usrid = "" + result.insertId;
                    if (usertype == 'usr') {
                        var item = {
                            userid: usrid,
                            firstname: fn,
                            lastname: ln,
                            email: un
                        };
                        mysql.queryDb('insert into userdetails set ?', item, function (err, result) {
                            if (err) {
                                console.log("userdetails register problem");
                                console.log(err);
                                res.status(500).json({
                                    status: 500,
                                    message: "Please try again later"
                                });
                            } else {
                                req.session.userid = usrid;
                                req.session.email = un;

                                passport.authenticate('local')(req, res, function () {

                                    res.status(200).json({
                                        status: 200,
                                        userid: usrid,
                                        email: un,
                                        name: req.body.firstName + " " + req.body.lastName,
                                        usertype: usertype,
                                    });

                                });
                            }
                        });

                    } else {

                        var item = {
                            userid: usrid,
                            organisationname: orgname,
                            creationdate: created,
                            modifydate: created,
                            email: un
                        };
                        mysql.queryDb('insert into organisation set ?', item, function (err, result) {
                            if (err) {
                                console.log(err);
                                res.status(500).json({
                                    status: 500,
                                    message: "Please try again later"
                                });
                            } else {
                                req.session.userid = usrid;
                                req.session.email = un;

                                passport.authenticate('local')(req, res, function () {

                                    res.status(200).json({
                                        status: 200,
                                        userid: usrid,
                                        email: un,
                                        name: req.body.orgname,
                                        usertype: usertype,
                                    });

                                });
                            }//inner else
                        });
                    }//outer else
                }
            });
        }
    });
};

exports.checkLogin = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            //console.log(err);
            res.status(500).json({ status: 500, message: info.message + "Please try again later" });
        }
        else if (!user) {
            //console.log(err);
            res.status(401).json({ status: 401, message: info.message });
        }
        else {
            req.logIn(user, function (err) {
                if (err) {
                    //console.log(err);
                    res.status(500).json({ status: 500, message: err + "Please try again later" });
                }
                else {
                    req.session.userid = user.userid;
                    req.session.email = user.username;

                    if (user.usertype == 'usr') {

                        mysql.queryDb('select firstname, lastname from userdetails where userid=?', [user.userid], function (err, result) {
                            if (err) {
                                //console.log(err);
                                res.status(500).json({ status: 500, message: "Please try again later" });
                            } else {
                                //console.log(JSON.stringify(result));
                                res.status(200).json({ status: 200, userid: user.userid, email: user.username, name: result[0].firstname + ' ' + result[0].lastname, usertype: user.usertype });
                            }
                        });
                    } else {

                        mysql.queryDb('select organisationname from organisation where userid=?', [user.userid], function (err, result) {
                            if (err) {
                                //console.log(err);
                                res.status(500).json({ status: 500, message: "Please try again later" });
                            } else {
                                //console.log(JSON.stringify(result));
                                res.status(200).json({ status: 200, userid: user.userid, email: user.username, name: result[0].organisationname, usertype: user.usertype });
                            }
                        });
                    }
                }
            });
        }
    })(req, res, next);
};

exports.logout = function (req, res) {
    req.logout();
    res.sendStatus(200);
};

// route to test if the user is logged in or not 
exports.loggedin = function (req, res) {
    if (req.isAuthenticated())
        res.status(200).json({ status: 200, user: req.user, message: "Authorized" });
    else
        res.status(401).json({ status: 401, message: "Unauthorized" });
};

exports.apiAccessToken = function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            status: 400,
            message: "Bad Request"
        });
    } else {
        mysql.queryDb('select * from userauthenticate where username = ?', [req.body.email], function (err, rows) {
            if (err) {
                console.log('Error while fetching userauthenticate:' + err);
                res.status(500).json({ message: err.message + "Please try again later" });
            } else {
                if (rows == null || rows == '') {
                    res.status(401).json({ message: 'No user with this username and password exists.' });
                } else {
                    var sa = rows[0].salt;
                    var pw = rows[0].password;
                    var upw = crypto.createHmac('sha512', sa).update(req.body.password).digest('hex');
                    if (upw == pw) {
                        //jwt
                        const jwtSecret = config.appSecrets.JWT.jwt_secret;
                        try {
                            let accessTokenBody = {
                                'userid': rows[0].userid,
                                'usertype': rows[0].usertype
                            }
                            let token = jwt.sign(accessTokenBody, jwtSecret);
                            res.status(201).send({ accessToken: token, userid: rows[0].userid });
                        } catch (err) {
                            res.status(500).send({ message: "Failed to generate json token" });
                        }
                    } else {
                        return res.status(403).send({ message: 'Invalid password' });
                    }
                }
            }
        });
    }
};
