var Promise = require('bluebird');

module.exports = WebhookInstaller;

function WebhookInstaller(api, shopModel) {
  this.api = api;
  this.shopModel = shopModel;
}

WebhookInstaller.prototype.install = function() {
  return this.installProductWebhook();
}

WebhookInstaller.prototype.installProductWebhook = function() {
  var _this = this;
  var productWebhooks = [
    {
      topic: 'orders/create',
      address: process.env.TUNNEL + '/webhooks/' + _this.shopModel.id + '/orders/create',
      format: 'json'
    }
  ]
  var _this = this;
  var pms = [];
  productWebhooks.forEach(hook => pms.push(_this.installHook(hook)));
  return Promise.all(pms);
}

WebhookInstaller.prototype.installHook = function(hookData) {
  var _this = this;

  return _this.api.post('/admin/webhooks.json', {
    webhook: hookData
  });

}
