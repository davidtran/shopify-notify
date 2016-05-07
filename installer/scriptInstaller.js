var Promise = require('bluebird');

module.exports = ScriptInstaller;

function ScriptInstaller(api, shop) {
  this.api = api;
  this.shop = shop;
}

ScriptInstaller.prototype.install = function() {
  var _this = this;
  var scripts = [
    process.env.HOST_NAME + ':' + process.env.PORT + '/js/shopify_viewer_notify.js'
  ];
  var pms = [];
  scripts.forEach(script => pms.push(_this.installScript(script)));
  return Promise.all(pms);
}

ScriptInstaller.prototype.installScript = function(script) {
  _this = this;
  return new Promise((resolve, reject) => {
    return _this.api.post('/admin/script_tags.json', {
      script_tag: {
        event: 'onload',
        src: script
      }
    }, (err,data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  })

}