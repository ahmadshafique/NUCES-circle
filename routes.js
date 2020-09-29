var loginController = require('./models/login'),
    userdtlsController = require('./models/userdtls'),
    edudtlsController = require('./models/edudtls'),
    expdtlsController = require('./models/expdtls'),
    skillsController = require('./models/skills'),
    organisationController = require('./models/organisation'),
    connectionController = require('./models/connection'),
    jobController = require('./models/jobposts'),
    applicationController = require('./models/applyjob'),
    postController = require('./models/userposts'),
    searchController = require('./models/search');
    

module.exports = function (app) {

    //Auth
    app.post('/register', loginController.register);
    app.post('/login', loginController.checkLogin);
    app.get('/loggedin', loginController.loggedin);
    app.post('/logout', loginController.logout);

    //HomePost Page
    app.get('/userAllPosts/:userid', ensureAuthenticated, postController.userAllPosts);
    app.get('/userPostsCount/:userid', ensureAuthenticated, postController.getPostsCount);
    app.get('/pagePosts/:userid/:pageNo/:pageSize', ensureAuthenticated, postController.pagePosts);
    app.post('/savePost', ensureAuthenticated, postController.savePost);
    app.put('/updatePost', ensureAuthenticated, postController.updatePost);
    app.delete('/deletePost', ensureAuthenticated, postController.deletePost);

    //Search
    app.post('/search', ensureAuthenticated, searchController.advanceSearch);

    // User Profile
    app.put('/userdtls', ensureAuthenticated, userdtlsController.updateUserDtls);
    app.get('/userdtls/:userid', ensureAuthenticated, userdtlsController.getUserDtls);

    //Education Details
    app.post('/edudtls', ensureAuthenticated, edudtlsController.saveEduDtls);
    app.put('/edudtls', ensureAuthenticated, edudtlsController.updateEduDtls);
    app.delete('/edudtls', ensureAuthenticated, edudtlsController.deleteEduDtls);
    app.get('/edudtls/:userid', ensureAuthenticated, edudtlsController.getEduDtls);

    //Experience Details
    app.post('/expdtls', ensureAuthenticated, expdtlsController.saveExpDtls);
    app.put('/expdtls', ensureAuthenticated, expdtlsController.updateExpDtls);
    app.delete('/expdtls', ensureAuthenticated, expdtlsController.deleteExpDtls);
    app.get('/expdtls/:userid', ensureAuthenticated, expdtlsController.getExpDtls);

    //Skills
    app.post('/skills', ensureAuthenticated, skillsController.saveSkills);
    app.get('/skills', ensureAuthenticated, skillsController.getAllSkills);
    app.get('/skills/:userid', ensureAuthenticated, skillsController.getSkills);

    //Organisation
    app.get('/organisations', ensureAuthenticated, organisationController.getAllOrganisations);
    app.get('/institutions', ensureAuthenticated, organisationController.getAllOrganisations);
    app.get('/getOrgDtls/:userid', ensureAuthenticated, organisationController.getOrgDtls);
    app.put('/saveOrgDtls', ensureAuthenticated, organisationController.saveOrgDtls);

    //Connections
    app.get('/connect/requestsReceived/:userid', ensureAuthenticated, connectionController.getAllReqReceived);
    app.get('/connect/requestsSent/:userid', ensureAuthenticated, connectionController.getAllReqSent);
    app.get('/connect/approved/:userid', ensureAuthenticated, connectionController.getAllConn);
    app.post('/connect', ensureAuthenticated, connectionController.addConn);
    app.post('/connect/accept', ensureAuthenticated, connectionController.acceptConn);
    app.delete('/connect', ensureAuthenticated, connectionController.removeConn);
    app.get('/connect/:userid/:secuserid', ensureAuthenticated, connectionController.checkUsersConn);
    app.get('/notconnected/:userid', ensureAuthenticated, connectionController.getRecoConn);

    //Jobs
    app.post('/postjob', ensureAuthenticated, jobController.postJob);
    app.put('/updatejob', ensureAuthenticated, jobController.updateJob);
    app.get('/getjob', ensureAuthenticated, jobController.getAllJobs);
    app.get('/getorgjob/:userid', ensureAuthenticated, jobController.getAllJobsByOrg);
    app.get('/getjob/:jobid', ensureAuthenticated, jobController.getJobById);
    app.delete('/deletejob', ensureAuthenticated, jobController.deleteJob);

    //Job Application
    app.post('/postapp', ensureAuthenticated, applicationController.postApplication);
    app.get('/getuserapp/:userid', ensureAuthenticated, applicationController.getUserApplications);
    app.get('/getorgjobapp/:jobid', ensureAuthenticated, applicationController.getOrgApplications);
    app.get('/getrecojobs/:userid', ensureAuthenticated, applicationController.getRecommendedJobs);

    //app state routing
    app.get('/home', ensureAuthenticated, function (req, res) {
        res.redirect('/login');
    });
    app.get('/organisation', ensureAuthenticated, function (req, res) {
        res.redirect('/login');
    });

    //Auth Middleware
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
            //res.status(401).json({message : "Unauthorized access !!"}); 
        }
    }

    // rest api deleted
    // linked in authentication deleted
    // email smtp deleted
};
