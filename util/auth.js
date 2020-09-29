var mysql = require('../models/mysql');
	crypto = require('crypto'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
		//console.log('serializeUser' + user.userid + ":" + user.username);
		//try {
			done(null, user);
		//} catch (e) {
			//console.log(e);
			//console.log('serializeUser:: ' + user.userid + ":" + user.username);
		//}
	});

	passport.deserializeUser(function (user, done) {
		//console.log('deserializeUser' + user.userid + ":" + user.username);
		//try {
			done(null, user);
		//} catch (e) {
			//console.log(e);
			//console.log('deserializeUser:: ' + user.userid + ":" + user.username);
		//}
	});

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function (email, password, done) {
		mysql.queryDb('select * from userauthenticate where username = ?', [email], function (err, rows) {
			if (err) {
				console.log('Error while fetching userauthenticate:' + err);
				return done(err);
			} else {
				if (rows == null || rows == '') {
					console.log('No user with this username ' + err);
					return done(null, false, { 'message': 'No user with this username and password exists.' });
				} else {
					var sa = rows[0].salt;
					var pw = rows[0].password;
					var upw = crypto.createHmac('sha512', sa).update(password).digest('hex');
					if (upw == pw) {
						//console.log("done local profile");
						return done(null, rows[0]);
					}
					return done(null, false, { 'message': 'Invalid password' });
				}
			}
		});
	}));
};
