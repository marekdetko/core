# When the scroll area is entered make any necessary calculations and
# adjustments, then reveal the scroll handle.
$(document).on 'mouseenter', '.js-scrollable', (event) ->
  $container    = $(this).closest '.js-scrollable'
  $contentOuter = $container.find '.js-scroll-outer'
  $contentInner = $container.find '.js-scroll-inner'

  scrollable = $contentInner.outerHeight() > $contentOuter.outerHeight()

  if scrollable
    $container.addClass 'scrollbar-is-visible'

# When the scroll area is left, wait, then hide the scroll handle.
$(document).on 'mouseleave', '.js-scrollable', (event) ->
  $container = $(this).closest('.js-scrollable')
  setTimeout(
    => $container.removeClass 'scrollbar-is-visible'
    1000
  )

$ ->
  $(".js-scrollbar-handle").draggable
    addClasses: false
    axis: "y"
    containment: "parent"
