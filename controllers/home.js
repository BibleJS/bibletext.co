/**
 * GET /
 * Home page.
 */

var secrets = require('../config/secrets');
var twilio = require('twilio')(secrets.twilio.sid, secrets.twilio.token);
var bible = require('bible-english');
var User = require('../models/User');

var _ = require('lodash');

var fm = require('util').format;

exports.votdMiddleware = function(req, res, next) {

  bible.getVerse('votd', function (err, data) {
    if(err) {
      var error = new Error(err);
      return next(error);
    }

    var votd = _.first(data);

    // the verse of the day in JSON
    res.votd = votd;

    // Builds a plain verse of the day, used for text messages
    res.votdPlain = fm("%s - %s %s:%s",
        votd.text,
        votd.bookname,
        votd.chapter,
        votd.verse
      );

    next();
  });

};

exports.votd = function(req, res) {

  bible.getVerse('votd', function (err, data) {
    return res.send(err || data[0]);
  });

};

exports.index = function(req, res) {

  bible.getVerse('votd', function (err, data) {

    res.render('home', {
      title: 'Home',
      votd : _.first(data)
    });

  });

};

exports.send = function(req, res, next) {

  var message = {
    to: '+64211677263',
    from: '+12678002909',
    body: res.votdPlain
  };

  twilio.sendMessage(message, function(err, responseData) {
    if (err) return next(err.message);
    req.flash('success', { msg: 'Text sent to ' + responseData.to + '.'});
    res.redirect('/');
  });

};
