var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require('fs');

var htmlContent;
fs.readFile('index.html', function (err, data) {
  if (err) throw err;
  htmlContent = data;
});
var picPath = "pic/";
http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      var imgData = fields.img.replace(/^data:image\/\w+;base64,/, "");
      imgData = imgData.replace(/ /g,"+");
      // console.log(imgData);
      var imgType = "png";
      var imgSuffiex = "."+imgType;
      var imgBuffter = new Buffer(imgData, 'base64');
      var picRelPath = picPath+fields.filename+imgSuffiex;
      fs.writeFile(picRelPath,imgBuffter,function(err){
        if(err){
            res.end("保存失败");
        }else{
            res.end(picRelPath);
        }
      });
    });

    return;
  }
    if (req.url.match("^/?"+picPath)) {
        res.writeHead(200,{'content-type':"image/png"});
        var imgPath = req.url;
        imgPath = imgPath.replace(/^\//,"");
        fs.readFile(imgPath, function (err, data) {
          if (err) throw err;
          res.end(data);
        });
        return;
    }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  // console.log(req.url);
  // 文件读写，输出index.html
  res.end(htmlContent);
}).listen(8080);