var user = require("./modules/models/user");
var car = require("./modules/models/car");
var post = require("./modules/models/post");
var socialPosts = require("./modules/models/social_posts");
var mods = require("./modules/models/modifications");
var likes = require("./modules/models/likes");

var restify = require('restify');
var s3 = require('./modules/s3');

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));
server.use(restify.acceptParser(server.acceptable));

// CORS config
server.pre(restify.CORS({
  origins: ['*'],
  credentials: false
}));

server.use(restify.fullResponse());

/*
Gets a user from the database with the given userId.
*/
function getUser(req, res) {
  user.getUser(req.params.email, (error, results, fields) => {
    if (error) {
      res.send(error);
    } else {
      res.send(results[0] || {});
    }
  });
}

/*
Inserts a new user into the database.
*/
function createUser(req, res) {
  user.createUser(req.params, (error, results, fields) => {
    res.send(results[0]);
  });
}

/*
Gets a car from the database with the given carId.
*/
function getCar(req, res) {
  car.getCar(req.params.id, (error, results, fields) => {
    res.send(results[0]);
  });
}

/*
Inserts a new car into the database.
*/
function createCar(req, res) {
  car.createCar(req.params, (error, results, fields) => {
    res.send(results);
  });
}

/*
Get all posts from the database.
*/
function getAllPosts(req, res) {
  post.getAllPosts((error, results, fields) => {
    res.send(results);
  });
}

/*
Inserts a new social post into the database.
*/
function createSocialPost(req, res) {
  socialPosts.createSocialPost(req.params, (error, results, fields) => {
    res.send(results);
  });
}

/*
Gets all social posts for a user from the database with the given userId.
*/
function getSocialPostsByUser(req, res) {
  socialPosts.getSocialPostsByUser(req.params.userId, (error, results, fields) => {
    res.send(results);
  });
}

/*
Gets all social posts from the database.
*/
function getAllSocialPosts(req, res) {
  socialPosts.getAllSocialPosts((error, results, fields) => {
    res.send(results);
  });
}

/*
Gets X social posts from the database after skipping Y rows.
Data should include numberOfRowsToSkip and numberOfRowsToGet.
*/
function getXRowsAfterIndexY(req, res) {
  socialPosts.getXRowsAfterIndexY(req.params, (error, results, fields) => {
    res.send(results);
  });
}

/*
Gets social posts for the given user. Gets X social posts from the database
after skipping Y rows.
Data should include numberOfRowsToSkip and numberOfRowsToGet.
*/
function getXPostsAfterIndexYByUser(req, res) {
  socialPosts.getXPostsAfterIndexYByUser(req.params, (error, results, fields) => {
    res.send(results);
  });
}

/*
Inserts a new modification into the database.
*/
function createModification(req, res) {
  mods.createModification(req.params, (error, results, fields) => {
    res.send(results);
  });
}

/*
Gets all modifications for a user from the database with the given userId.
*/
function getModificationsByUser(req, res) {
  mods.getModificationsByUser(req.params.userId, (error, results, fields) => {
    res.send(results);
  });
}

/*
Gets all modifications from the database.
*/
function getAllModifications(req, res) {
  mods.getAllModifications((error, results, fields) => {
    res.send(results);
  });
}

/*
Toggles the given like by user then post.
*/
function toggleLike(req, res){
  likes.updateLike(req.params.userid, req.params.postid,(error, results, fields) => {
    res.send(results);
  });
}
/*
Get AWS S3 credentials to upload a file with the given filename and content_type.
*/
function getS3Credentials(req, res) {
  res.json(s3.getCredentials(req.params.filename, req.params.content_type));
}

// user
server.get('/user/:email', getUser);
server.post('/user', createUser);

// car
server.get('/car/:id', getCar);
server.post('/car', createCar);

// post
server.get('/posts/all', getAllPosts);

//socialPosts
server.post('/socialpost', createSocialPost);
server.get('/socialpostsbyuser/:userId', getSocialPostsByUser);
server.get('/socialposts/all', getAllSocialPosts);
server.get('/socialposts/:numberOfRowsToGet/:numberOfRowsToSkip', getXRowsAfterIndexY);
server.get('/socialposts/:userId/:numberOfRowsToGet/:numberOfRowsToSkip', getXPostsAfterIndexYByUser);

//modifications
server.post('/mod', createModification);
server.get('/modsbyuser/:userId', getModificationsByUser);
server.get('/mods/all', getAllModifications);

//likes
server.post('/likes', toggleLike);

// s3
server.get('/s3_credentials', getS3Credentials);

server.listen(process.env.PORT || 8080, function () { // bind server to port 5000.
  console.log('%s listening at %s', server.name, server.url);
});
