(function($) {
  var renderTemplate;
  renderTemplate = require('wings').renderTemplate;
  $.ender({
    renderTemplate: renderTemplate
  });
  return $.ender({
    render: function(data, links) {
      return renderTemplate(this[0].innerHTML, data, links);
    }
  }, true);
})(ender);