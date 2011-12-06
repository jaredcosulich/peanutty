!(function(upload) {
  var lastId, reqwest, timeout;
  reqwest = require('reqwest');
  timeout = require('timeout');
  lastId = 0;
  upload.isubmit = function(o) {
    var form, id, iframe, loaded;
    id = '__upload_iframe_' + lastId++;
    iframe = $('<iframe src="javascript:false" />');
    iframe.attr('id', id);
    iframe.attr('name', id);
    iframe.css('display', 'none');
    form = $('<form method="post" enctype="multipart/form-data" />');
    form.attr('action', o.url);
    form.attr('target', id);
    $('body').append(iframe);
    $('body').append(form);
    loaded = false;
    iframe.bind('load', function() {
      var data, doc;
      data = null;
      doc = $(iframe[0].contentDocument);
      if (!iframe.parent().length || (doc.length && doc.text() === 'false')) {
        if (o.error) {
          o.error(iframe);
        }
        return;
      }
      try {
        data = JSON.parse(doc.text());
      } catch (e) {
        if (o.error) {
          o.error(iframe, e);
        }
      }
      if (o.success) {
        o.success(data, iframe);
      }
      $.timeout(1, function() {
        return iframe.remove();
      });
      return loaded = true;
    });
    if (o.timeout) {
      timeout.timeout(o.timeout, function() {
        if (!loaded) {
          iframe.attr('src', 'javascript:false').remove();
          if (o.error) {
            return o.error(iframe, 'Timeout');
          }
        }
      });
    }
    form.append(o.inputs);
    form.submit();
    return form.remove();
  };
  return upload.upload = function(o) {
    var _ref;
    o.method = 'POST';
    o.type = 'json';
    o.processData = false;
    if ((_ref = o.headers) == null) {
      o.headers = {};
    }
    o.headers['X-File-Name'] = encodeURIComponent(o.data.name);
    o.headers['Content-Type'] = 'application/octet-stream';
    return $.ajax(o);
  };
})(typeof exports !== "undefined" && exports !== null ? exports : (this['upload'] = {}));