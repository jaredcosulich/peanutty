$('document').ready () ->
  # Stop uncaptured drops
  $('body')[0].addEventListener('drop', ((event) -> event.preventDefault()), false)

  window.Peanutty = Peanutty
  window.b2d = Peanutty.b2d
