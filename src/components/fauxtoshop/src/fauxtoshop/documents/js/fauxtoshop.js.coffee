#
# GuideGuide Web Adapter
#

# Determine the operating system in which GuideGuide is running
#
# Returns a String.
getOS = ->
  os = 'Unknown'
  os = 'MacOS' if navigator.appVersion.indexOf("Mac") >= 0
  os = 'Win' if navigator.appVersion.indexOf("Windows") >= 0
  os = 'UNIX' if navigator.appVersion.indexOf("X11") >= 0
  os = 'Linux' if navigator.appVersion.indexOf("Linux") >= 0
  os

# Add a guide to the document
#
#   location    - coordinate position for the guide to be added
#   orientation - determines horizontal or vertical orientation of the guide
#
# Returns false
addGuide = (location, orientation) ->
  artboardPosition = $('.js-document').find('.js-artboard').position()
  guide = $('.js-templates').find('.js-guide')
  .clone().attr('class','')
  .addClass 'guide js-guide ' + orientation

  if orientation == 'horizontal'
    guide.css 'top', ( location + artboardPosition.top ) + 'px'
  else
    guide.css 'left', ( location + artboardPosition.left ) + 'px'

  $('.js-document').append guide

devData = JSON.parse(localStorage.getItem('guideguidedev')) or new Object()

window.Application =
  id: 'web'
  name: 'GuideGuide web'
  version: '0.0.0'
  os: getOS()
  localization: 'en-us'
  env: 'development'
  guideguideVersion: '0.0.0'
  submitAnonymousData: devData.submitData or false
  checkForUpdates: devData.checkForUpdates or false

# Listen for requests for data from GuideGuide and send the data back.
$(document).on 'guideguide:getExistingGuides', (event, callback) ->
  guides    = []
  docGuides = $('.js-document').find('.js-guide')
  $artboard = $('.js-document').find('.js-artboard')

  docGuides.each (index, el) =>
    $el = $(el)
    guide = {}

    if $el.hasClass 'horizontal'
      guide.orientation = 'horizontal'
      guide.location = $el.position().top - $artboard.position().top
    if $el.hasClass 'vertical'
      guide.orientation = 'vertical'
      guide.location = $el.position().left - $artboard.position().left

    guides.push guide

  callback(guides)

# Listen for requests for data from GuideGuide and send the data back.
$(document).on 'guideguide:getData', (event, callback) ->

  data = JSON.parse(localStorage.getItem('guideguide')) or new Object()
  data.application = Application
  console.log 'GuideGuide web returned', data
  callback(data)

# Save data sent from GuideGuide
$(document).on 'guideguide:setData', (event, data) ->
  localStorage.setItem 'guideguide', JSON.stringify data
  console.log 'GuideGuide web saved:', data

# Toggle guides
$(document).on 'guideguide:toggleGuides', (event) ->
  $(".js-document").toggleClass 'is-showing-guides'

# Clear guides
$(document).on 'guideguide:resetGuides', (event) ->
  $('.js-document').find('.js-guide').remove()

$(document).on 'guideguide:getDocumentInfo', (event, callback) ->
  activeDocument = $('.js-document').find('.js-artboard')
  artboardPosition = activeDocument.position()
  $selection = $('.js-document').find('.js-selection')
  info =
    isSelection: if $selection.length then true else false
    width: if $selection.length then $selection.width()+1 else activeDocument.width()
    height: if $selection.length then $selection.height()+1 else activeDocument.height()
    ruler: 'pixels'
    offsetX: if $selection.length then $selection.position().left - artboardPosition.left else 0
    offsetY: if $selection.length then $selection.position().top - artboardPosition.top else 0
  callback(info)

$(document).on 'guideguide:addGuides', (event, guides) ->
  $.each guides, (index,guide) =>
    addGuide guide.location, guide.orientation

#
# Fauxtoshop UI scripts
#

# Lazy load mouse move listeners. Add a selection object to the stage.
$(document).on 'mousedown', '.js-document', (event) ->
  event.originalEvent.preventDefault()
  return unless $(event.target).hasClass 'js-artboard'

  $('.js-document').find('.js-selection').remove()

  doc =
    top:    $('.js-document').offset().top
    left:   $('.js-document').offset().left

  artboard = 
    top:    $('.js-artboard').offset().top
    left:   $('.js-artboard').offset().left
    width:  $('.js-artboard').width()
    height: $('.js-artboard').height()

  selection =
    anchorTop:    event.pageY
    anchorLeft:   event.pageX

  css =
    top:  selection.top - doc.top
    left: selection.left - doc.top

  $selection = $('.js-templates').find('.js-selection').clone().css(css)
  $('.js-document').append($selection)

  # When the mouse is moved, resize the selection.
  $(document).on 'mousemove', '.js-document', (event) ->
    selection.left   = if event.pageX >= selection.anchorLeft then selection.anchorLeft else event.pageX
    selection.left   = artboard.left - 1 if selection.left < artboard.left
    selection.left   = selection.left if selection.left > selection.left
    selection.top    = if event.pageY >= selection.anchorTop then selection.anchorTop else event.pageY
    selection.top    = artboard.top - 1 if selection.top < artboard.top
    selection.top    = selection.anchorTop if selection.top > selection.anchorTop

    selection.width  = event.pageX - selection.anchorLeft
    selection.width  = artboard.left - selection.anchorLeft if event.pageX < artboard.left
    selection.width  = artboard.width - Math.abs (selection.left-artboard.left) + 1 if event.pageX > (artboard.left + artboard.width)

    selection.height = event.pageY - selection.anchorTop
    selection.height = artboard.top - selection.anchorTop if event.pageY < artboard.top
    selection.height = artboard.height - Math.abs (selection.top-artboard.top) + 1 if event.pageY > (artboard.top + artboard.height)

    css = 
      left:   selection.left - doc.left
      width:  Math.abs selection.width
      top:    selection.top - doc.top
      height: Math.abs selection.height

    $selection.css(css)

  # When the mouse is released, clean up events. If the selection wasn't
  # dragged, remove it.
  $(document).on 'mouseup', (event) ->
    $('.js-document').find('.js-selection').remove() if $('.js-selection').width() <= 1 and $('.js-selection').height() <= 1
    $(document).off 'mousemove'
    $(document).off 'mouseup'

$ ->

  addGuide 10, 'horizontal'

  $(".js-panel").draggable({ handle: ".js-panel-handle" }).resizable({ handles: "n, e, s, w, ne, se, sw, nw" })
  $(".js-document").draggable({ handle: ".js-document-handle" }).resizable({ handles: "n, e, s, w, ne, se, sw, nw" })

  $(document).delegate '.js-guide.horizontal', 'mousedown', (event) ->
    $(this).draggable({ axis: "y", stop: => $(this).draggable("destroy") })

  $(document).delegate '.js-guide.vertical', 'mousedown', (event) ->
    $(this).draggable({ axis: "x", stop: => $(this).draggable("destroy") })
