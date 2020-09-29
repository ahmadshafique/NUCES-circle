/*
 * Database Configurations
 */
exports.db = {

	// Local
	"host": "localhost",
	"port": 3306,
	"user": "root",
	"password": "",
	"database": "NU_circle",

};

/*
 * Database Pooling Configurations
*/
exports.dbPool = {
	"maxSize": 50
};

/*
 * App config secrets
 */
exports.appSecrets = {
	"stateMngmt": {
	"cookieSecret": "ZPLlUxBbHBqUME0H9YO92zKjZBndTB",
	"sessionSecret": "ZPLlUxBbHBqUME0H9YO92zKjZBndTB"
	},
	"JWT": {
		"jwt_secret": "ZPLlUxBbHBqUME0H9YO92zKjZBndTB"
	}
}

