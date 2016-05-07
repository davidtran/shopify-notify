
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var cors = require('cors')
var messageHelper = require('../helpers/messageHelper');

router.options('*', cors());

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Shopify-Watermark'
  });
});

router.get('/message', cors(), messageHelper.validateRequest, (req, res) => {
  var url = req.headers.referer;
  return messageHelper
    .getMessageData(url)
    .then(data => {
      return res.status(200).send(data)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    })

})

router.post('/visit', cors(), messageHelper.validateRequest, (req, res) => {

  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  var url = req.headers.referer;
  if (!ip || !url) return res.status(500).send('Missing params');

  return messageHelper.saveVisit(ip, url)
    .then(visit => {
      return res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      return res.sendStatus(500)
    })

});

module.exports = router;
