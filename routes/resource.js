var express = require('express');
var router = express.Router();
var fs = require('fs');

module.exports = router;

router.get('/shopify_viewer_notify.js', function(req, res) {
  fs.readFile(__dirname + '/../public/js/shopify_viewer_notify.js', 'utf8',function(err, data) {
    if (err) return res.status(404).send(err);

    data = data.replace('ROOT_URL_PLACEHOLDER', process.env.HOST_NAME);
    res.setHeader('Content-Type', 'text/javascript');
    res.writeHead(200);
    res.end(data);
  })
});

