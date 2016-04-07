var express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    jwt = require('jwt-simple'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    BearerStrategy = require('passport-http-bearer').Strategy;

var mongoOptions;

if (typeof process.env.MONGO_USERNAME !== 'undefined') {
    mongoOptions = {
        user: process.env.MONGO_USERNAME
    };

    if (process.env.MONGO_PASSWORD) {
        mongoOptions.pass = process.env.MONGO_PASSWORD;
    }
}

var db = mongoose.connect(process.env.MONGO_SERVER, mongoOptions);

var User = require('./models/userModel');
var Outcome = require('./models/outcomeModel');
var Reflection = require('./models/reflectionModel');
var HotSpotBucket = require('./models/hotSpotBucketModel');

var tempSecret = 'to-be-changed'; // TODO: Make secret not hardcoded into the program

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({'local.username': username}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

passport.use(new BearerStrategy(
    function(token, done) {
        var decoded = jwt.decode(token, tempSecret);
        User.findOne({'local.username': decoded.username}, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user, { scope: 'all' });
        });
    }
));

var app = express();
var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());

var registerRouter = require('./routes/registerRoutes')(User, tempSecret);
var loginRouter = require('./routes/loginRoutes')(User, passport, tempSecret);
var outcomeRouter = require('./routes/outcomeRoutes')(Outcome, passport);
var reflectionRouter = require('./routes/reflectionRoutes')(Reflection, passport);
var hotSpotBucketRouter = require('./routes/hotSpotBucketRoutes')(HotSpotBucket, passport);
var relatedRouter = require('./routes/relatedRoutes')(Outcome, Reflection, passport);
var activeEntriesRouter = require('./routes/activeEntriesRoutes')(Outcome, passport);
var forTestRouter = require('./routes/forTestRoutes')(Outcome, Reflection, HotSpotBucket, User);

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/outcomes', outcomeRouter);
app.use('/api/reflections', reflectionRouter);
app.use('/api/hotSpotBuckets', hotSpotBucketRouter);
app.use('/api/related', relatedRouter);
app.use('/api/activeEntries', activeEntriesRouter);
app.use('/api/forTest', forTestRouter);


var server = app.listen(port);

server.on('close', function () {
    mongoose.connection.close();
});

module.exports = server;