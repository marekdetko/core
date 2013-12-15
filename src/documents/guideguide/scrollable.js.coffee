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

    $container.on 'drag.scrollable', '.js-scrollbar-handle', ( $.throttle 100, onDragHandle )

    $container.on 'dragstart.scrollable', '.js-scrollbar-handle', (event, ui) ->
      $container.addClass 'is-dragging'

    $container.on 'dragstop.scrollable', '.js-scrollbar-handle', (event, ui) ->
      $container.removeClass 'is-dragging'

    $contentOuter.on 'scroll.scrollable', ( $.throttle 50, onScroll )

    # When the scroll area is left, wait, then hide the scroll handle.
    $(document).on 'mouseleave.scrollable', '.js-scrollable', onMouseLeave

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

# While scrolling, update the scrollbar handle position
#
# Returns nothing
onScroll = (event) ->
  $container    = $(this).closest '.js-scrollable'
  return if $container.hasClass 'is-dragging'

  $contentOuter = $container.find '.js-scroll-outer'
  $contentInner = $container.find '.js-scroll-inner'
  $scrollHandle = $container.find '.js-scrollbar-handle'
  $scrollTrack  = $container.find '.js-scrollbar-track'

  scrollPercent = $contentOuter.scrollTop() / ( $contentInner.outerHeight() - $contentOuter.outerHeight() )
  scrollPercent = 1 if scrollPercent > 1
  scrollPercent = 0 if scrollPercent < 0

  scrollAmmount = scrollPercent * ( $scrollTrack.outerHeight() - $scrollHandle.outerHeight(true) )
  console.log $scrollHandle
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

  # Scroll events fire when the scrollTop is changed, so there will need to be
  # a distinction made as to whether the scroll is coming from the wheel or
  # dragging. Dragging should be ignored.
  #
  # When scrolling comes from the wheel, the dragger will need to be adjusted to match.
  #
  # This works mostly well. It behaves strangely when clicking a setting
  # dropdown, which jumps the menu up and ruins it.
  #
  # Menu dropdown appears over the scrollbar

$ ->
  $(".js-scrollbar-handle").draggable
    addClasses: false
    axis: "y"
    containment: "parent"
