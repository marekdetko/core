# Web module for GuideGuide. Used for development and the website demo.

class GuideGuide
  i18n: ''

  constructor: (@$guideguide) ->
    console.log 'Running GuideGuide in Web mode'
    @document = $('.js-document')

    @i18n = @getLanguage()

    @data = JSON.parse localStorage.getItem 'guideguide'

  # Get the localization string of the application.
  #
  # Returns a localization string
  getLanguage: => 'en-us'

  # Get information about the active document
  #
  # Returns an object
  getInfo: =>
    $artboardPosition = @document.find('.js-artboard').position()
    obj =
      width: @document.width()
      height: @document.height()
      ruler: 'pixels'
      offsetX: $artboardPosition.left
      offsetY: $artboardPosition.top

  # Removes all guides from the document
  #
  # Returns nothing
  clearGuides: =>
    @document.find('.js-guide').remove()

  # Add a guide to the document
  #
  #   location    - coordinate position for the guide to be added
  #   orientation - determines horizontal or vertical orientation of the guide
  #
  # Returns false
  addGuide: (location,orientation) =>
    guide = $('<span></span>').addClass 'guide js-guide ' + orientation

    if orientation == 'horizontal'
      guide.css 'top', location + 'px'
    else
      guide.css 'left', location + 'px'

    @document.append guide

  # Add a collection of guides to the document.
  #
  #   guides - Collection of guides to be added.
  #
  # Returns nothing
  addGuides: (guides) =>
    $.each guides, (index,guide) =>
      @addGuide guide.location, guide.orientation

  hasData: =>
    return if localStorage.getItem 'guideguide' then true else false

  saveData: =>
    localStorage.setItem 'guideguide', JSON.stringify @data if localStorage


$ ->
  window.appAdapter = new GuideGuide $('#guideguide')
  $('#guideguide').trigger('guideguide:ready')
