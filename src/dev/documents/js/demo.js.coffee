# Emulate Photoshop's native color schemes

$(document).on 'click', '.js-color-switcher-color', (event) ->
  event.preventDefault()
  $(this).closest('.js-color-switcher').find('.js-color-switcher-color').removeClass 'is-selected'
  $(this).addClass 'is-selected'

  $('#guideguide').trigger 'guideguide:updateTheme', $(this).attr 'data-theme-name'

  $('body').attr 'class', $(this).attr 'data-theme-name'

$(document).on 'mousedown', '.js-artboard', (event) ->
  return if $(event.target).hasClass 'js-selection'

  $('.js-artboard').find('.js-selection').remove()

  anchorX = event.pageX
  anchorY = event.pageY
  css =
    top:  anchorY - $('.js-artboard').offset().top
    left: anchorX - $('.js-artboard').offset().left

  $selection = $('.js-document').find('.js-selection').clone().css(css)
  $('.js-artboard').append($selection)


  $(document).on 'mousemove', '.js-artboard', (event) ->
    offset = $selection.offset()
    css = {}

    css.width  = Math.abs event.pageX - anchorX
    css.left   = anchorX - $('.js-artboard').offset().left - css.width if event.pageX < anchorX
    css.height = Math.abs event.pageY - anchorY
    css.top    = anchorY - $('.js-artboard').offset().top - css.height if event.pageY < anchorY

    $selection.css(css)

  $(document).on 'mouseup', (event) ->
    $('.js-artboard').find('.js-selection').remove() if $('.js-selection').width() <= 1 and $('.js-selection').height() <= 1
    $(document).off 'mousemove'
    $(document).off 'mouseup'
