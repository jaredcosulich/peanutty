(function($) {
  return $('document').ready(function() {
    $('body').view({
      name: 'Main',
      complete: function() {
        return $.route.init(true);
      }
    });
    return $('body')[0].addEventListener('drop', (function(event) {
      return event.preventDefault();
    }), false);
  });
})(ender);