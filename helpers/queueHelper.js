var kue = require('kue'),
    queue = kue.createQueue(),
    Promise = require('bluebird')

function createImportOrderJob(shopId) {
  return new Promise((resolve, reject) => {
    queue
      .create('importOrder', {
        shopId: shopId
      })
      .attempts(3)
      .priority('high')
      .backoff({
        delay: 60000,
        type: 'fixed'
      })
      .save(err => {
        if (err) return reject(err);
        return resolve();
      });
  });

}

module.exports = {
  createImportOrderJob: createImportOrderJob
}