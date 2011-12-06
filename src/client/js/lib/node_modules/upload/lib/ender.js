!(function($) {
  var upload;
  upload = require('upload');
  return $.ender({
    isubmit: upload.isubmit,
    upload: upload.upload
  });
})(ender);