# Emulate Photoshop's native color schemes

$(document).on 'click', '.js-color-switcher-color', (event) ->
  event.preventDefault()
  $(this).closest('.js-color-switcher').find('.js-color-switcher-color').removeClass 'is-selected'
  $(this).addClass 'is-selected'

  $('#guideguide').trigger 'guideguide:updateTheme', $(this).attr 'data-theme-name'

  $('body').attr 'class', $(this).attr 'data-theme-name'
