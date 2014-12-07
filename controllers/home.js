/**
 * GET /
 * Home page.
 */

var _ = require('lodash');
var bible = require('bible-english');

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
