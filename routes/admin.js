var express = require('express');
var router = express.Router();

var Promise = require('bluebird');
var models = require('../models');

var shopChecker = require('../middlewares/shopChecker.js');
var fs = require('fs');

var multer = require('multer');
var upload = multer({
  dest: 'upload/'
})
module.exports = router;

process.on("unhandledRejection", function(reason, promise) {
    console.log(reason, promise);
});

process.on("rejectionHandled", function(promise) {
    console.log(promise);
});


router.get('/', shopChecker, (req, res) => {
  return getMessage(req)
    .then(message => {
      return res.render('admin/index', {
        form: message.toJSON()
      });
    });
})

function getMessage(req) {
  var defaultData = {
    content: '{{count}} people are considering this item right now!',
    active: true,
    mobile: true,
    displayTime: 3,
    initialDelay: 0,
    minViewCount: 1,
    position: 'bottomRight',
    customCss: [
      '.snmc_container .notify_message {',
      '}',
      '.snmc_container .noty_text {',
      '}'
    ].join('\n'),
    style: 'alert'
  }

  return models
    .Message
    .findOne({
      where: {
        ShopId: req.data.shop.id
      }
    })
    .then(message => {
      if (!message) {
        message = models.Message.build({ShopId: req.data.shop.id});
        message.update(defaultData);
      }
      return message.save();
    });
}

router.post('/', shopChecker, (req, res) => {
  return models
    .Message
    .findOne({
      where: {
        ShopId: req.data.shop.id
      }
    })
    .then(message => {
      if (!message) message = models.Message.build({ShopId: req.data.shop.id});
      message.update(req.body);
      return message.save();
    })
    .then(() => {
      return res.sendStatus(200)
    })
    .catch(err => {
      return res.status(500).send(err.message)
    })
});

router.get('/behavior', shopChecker, (req, res) => {
  return getMessage(req)
    .then(message => {
      return res.render('admin/behavior', {
        form: message.toJSON()
      });
    })
    .catch(err => {
      console.log(err);
      return res.render('500')
    })
})

router.get('/faq', shopChecker, (req, res) => {
  return res.render('admin/faq', {
    title: 'FAQ'
  })
})