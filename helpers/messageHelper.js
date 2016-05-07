var Promise = require('bluebird');
var moment = require('moment')
var models = require('../models');

module.exports = {
  validateRequest: validateRequest,
  getMessageData: getMessageData,
  saveVisit: saveVisit
}

function saveVisit(ip, url) {
  return models
    .Visit
    .build({
      ip: Math.floor(Math.random() * 99999),
      url: removeQueryStringFromUrl(url)
    })
    .save();
}
function getMessageData(url) {
  return new Promise((resolve, reject) => {
    var messageData = null;
    var domain = extractDomain(url);
    return models
      .Shop
      .findOne({
        where: {
          domain: domain
        }
      })
      .then(shop => {
        if (!shop) return reject('Invalid domain');
        return models
          .Message
          .findOne({
            where: {
              ShopId: shop.id
            }
          })
      })
      .then(message => {
        messageData = message.toJSON();
        return deleteOldVisit();
      })
      .then(() => {
        return countUrlVisit(url);
      })
      .then(count => {
        if (count >= messageData.minViewCount) {
          var content = template(messageData.content, {
            count: count
          });
          messageData['content'] = content
          messageData['showable'] = true;
        } else {
          messageData['showable'] = false;
        }
        delete messageData['id'];
        delete messageData['ShopId'];
        delete messageData['createdAt'];
        delete messageData['updatedAt'];
        delete messageData['minViewCount'];
        return resolve(messageData);
      })
      .catch(err => reject(err));
  })

}

function validateRequest(req, res, next) {
  var url = req.headers.referer;
  var domain = extractDomain(url);
  return isAllowDomain(domain)
    .then(isAllow => {
      if (!isAllow) return res.status(400).send('Domain ' + domain + ' is not allowed');
      return next();
    })
    .catch(err => res.status(500).send(err.message))
}

function template(tpl, data) {
  var re = /\{\{([^\}\}]+)?\}\}/g, match;
  while(match = re.exec(tpl)) {
    tpl = tpl.replace(match[0], data[match[1]])
  }
  return tpl;
}

function countUrlVisit(url) {
  return new Promise((resolve, reject) => {
    url = removeQueryStringFromUrl(url);
    var sql = 'select count(distinct ip) totalVisit FROM Visits WHERE url = :url AND createdAt > date_sub(now() , INTERVAL 30 minute)';
    return models.sequelize.query(sql, {
      type: models.sequelize.QueryTypes.SELECT,
      replacements: {
        url: url
      }
    }).then(data => {
      console.log(data);
      if (data && data[0].totalVisit >= 0) return resolve(data[0].totalVisit)
      return reject(new Error('Can not read data'));
    }, err => reject(err))
  });
}

function deleteOldVisit() {
  var deleteQuery = 'DELETE FROM Visits WHERE createdAt < date_sub(now() , INTERVAL 90 minute)';
  return models.sequelize.query(deleteQuery);
}

function removeQueryStringFromUrl(url) {
  return url.split('?')[0];
}



function isAllowDomain(domain) {
  var whiteLists = ['localhost' ,'stackoverflow.com'];
  return new Promise((resolve, reject) => {
    if (whiteLists.indexOf(domain) > -1) return resolve(true);

    var query = 'SELECT count(domain) countDomain FROM Shops WHERE domain LIKE :domain OR domain LIKE :wwwDomain';
    models.sequelize.query(query, {
      type: models.sequelize.QueryTypes.SELECT,
      replacements: {
        domain: domain,
        wwwDomain: 'www.' + domain
      }
    })
    .then(data => {
      if (data && data[0].countDomain > 0) return resolve(true);
      return resolve(false)
    })
    .catch(err => reject(err))
  })
}

function extractDomain(url) {
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }
  //find & remove port number
  domain = domain.split(':')[0];

  return domain;
}