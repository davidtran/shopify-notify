var Promise = require('bluebird');
var models = require('../models');
var WebhookInstaller = require('./webhookInstaller.js');
var queueHelper = require('../helpers/queueHelper.js');
var ScriptInstaller = require('./scriptInstaller');
module.exports = Installer;

function Installer(api, query) {
  this.api = api;
  this.query = query;
}

Installer.prototype.install = function() {
  var _this = this;
  return new Promise((resolve, reject) => {
    return _this.shouldInstall()
      .then(() => {
        return _this.getToken();
      })
      .then(token => {
        _this.shopModel.token = token;
        return _this.shopModel.save();
      })
      .then(() => {
        return _this.installScripts();
      })
      .then(() => {
        return _this.finish();
      })
      .then(() => {
        return resolve();
      })
      .catch(err => {
        console.log(err);
        if (err.message == 'already.install') {
          return resolve();
        }
        return reject(err);
      })
  })

}

Installer.prototype.finish = function() {
  var _this = this;
  _this.shopModel.isInstalled = true;
  return _this.shopModel.save();
}

Installer.prototype.shouldInstall = function() {
  var _this = this;
  return new Promise((resolve, reject) => {
    return models
      .Shop
      .find({
        where: {
          shop: _this.api.config.shop
        }
      })
      .then((shopData) => {
        _this.shopModel = shopData;
        if (null == shopData) return reject(new Error('Shop data not found'));
        if (shopData.isInstalled) {
          return reject(new Error('already.install'));
        } else {
          return resolve();
        }
      })
  })

}

Installer.prototype.getToken = function() {
  var _this = this;
  return new Promise((resolve, reject) => {
    _this.api.config.access_token = null;
    return _this.api.exchange_temporary_token(_this.query, (err, authData) => {
      console.log(authData);
      if (err) return reject(err);
      console.log(authData);
      _this.api.config.access_token = authData.access_token;
      return resolve(authData.access_token);
    });
  });
}

Installer.prototype.installWebhook = function() {
  var _this = this;
  var webhookInstaller = new WebhookInstaller(_this.api, _this.shopModel);
  return webhookInstaller.install();
}

Installer.prototype.installScripts = function() {
  var _this = this;
  var scriptInstaller = new ScriptInstaller(_this.api, _this.shopModel);
  return scriptInstaller.install();
}

Installer.prototype.getShopInfo = function() {
  var _this = this;
  return new Promise((resolve, reject) => {
    return _this.api.get('/admin/shop.json', (err, data) => {
      if (err) return reject(err);
      _this.shopModel.domain = data.shop.domain
      return _this.shopModel.save()
        .then(() => resolve)
        .catch(err => reject(err))
    })
  })

}
