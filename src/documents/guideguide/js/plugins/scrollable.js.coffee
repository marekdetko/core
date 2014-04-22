scrollTimer = {}

# When the scroll area is entered make any necessary calculations and
# adjustments, then reveal the scroll handle.
$(document).on 'mouseenter', '.js-scrollable', (event) ->
  $container    = $(this).closest '.js-scrollable'
  $contentOuter = $container.find '.js-scroll-outer'
  $contentInner = $container.find '.js-scroll-inner'

  scrollable = $contentInner.outerHeight() > $contentOuter.outerHeight()

  if scrollable
    clearTimeout scrollTimer
    $container.addClass 'scrollbar-is-visible'

    adjustScrollbar $container

    $container.on 'drag.scrollable', '.js-scrollbar-handle', ( $.throttle 100, onDragHandle )

    $container.on 'dragstart.scrollable', '.js-scrollbar-handle', (event, ui) ->
      $container.addClass 'is-dragging'

    $container.on 'dragstop.scrollable', '.js-scrollbar-handle', (event, ui) ->
      $container.removeClass 'is-dragging'

    $contentOuter.on 'scroll.scrollable', ( $.throttle 50, onAdjust )

    # When the scroll area is left, wait, then hide the scroll handle.
    $(document).on 'mouseleave.scrollable', '.js-scrollable', onMouseLeave

    $(document).on 'keyup.scrollable', '.js-scrollable', onAdjust


# While the scrollbar handle is being dragged, scroll the content
#
# Returns nothing
onDragHandle = (event, ui) ->
  $container    = $(this).closest '.js-scrollable'
  $scrollHandle = $container.find '.js-scrollbar-handle'
  $scrollTrack  = $container.find '.js-scrollbar-track'
  $contentOuter = $container.find '.js-scroll-outer'
  $contentInner = $container.find '.js-scroll-inner'

  scrollPercent = ui.position.top / ( $scrollTrack.outerHeight() - $scrollHandle.outerHeight(true) )
  scrollAmmount = ( $contentInner.outerHeight() - $contentOuter.outerHeight() ) * scrollPercent
  $contentOuter.scrollTop(scrollAmmount)

# While scrolling or when the scroll area size changes, update the scrollbar
# handle position
#
# Returns nothing
onAdjust = (event) ->
  adjustScrollbar $(event.currentTarget).closest '.js-scrollable'

# Reposition the scroll handle based on the scroll content's position
#
#   $container - instance of .js-scrollable for this scrollbar
#
# Returns nothing
adjustScrollbar = ($container) ->
  return if $container.hasClass 'is-dragging'

  $contentOuter = $container.find '.js-scroll-outer'
  $contentInner = $container.find '.js-scroll-inner'
  $scrollHandle = $container.find '.js-scrollbar-handle'
  $scrollTrack  = $container.find '.js-scrollbar-track'

  scrollPercent = $contentOuter.scrollTop() / ( $contentInner.outerHeight() - $contentOuter.outerHeight() )
  scrollPercent = 1 if scrollPercent > 1
  scrollPercent = 0 if scrollPercent < 0

  scrollAmmount = scrollPercent * ( $scrollTrack.outerHeight() - $scrollHandle.outerHeight(true) )
  $scrollHandle.css 'top', scrollAmmount

# When the mouse leaves the scroll area, remove events and set a timer to
# dismiss the handle.
#
# Returns nothing
onMouseLeave = (event) ->
  $container    = $(this).closest '.js-scrollable'
  $contentOuter = $container.find '.js-scroll-outer'

  $(document).off '.scrollable'
  $container.off '.scrollable'
  $contentOuter.off '.scrollable'

  $container = $(this).closest('.js-scrollable')

  if $container.hasClass 'scrollbar-is-visible'
    scrollTimer = setTimeout(
      => $container.removeClass 'scrollbar-is-visible'
      1000
    )

$ ->
  $(".js-scrollbar-handle").draggable
    addClasses: false
    axis: "y"
    containment: "parent"
