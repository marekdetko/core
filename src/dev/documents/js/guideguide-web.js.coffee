# Web module for GuideGuide. Used for development and the website demo.

class GuideGuide extends window.GuideGuideCore
  constructor: (@panel) ->
    console.log 'Running GuideGuide in Web mode'
    @i18n = 'en-us'
    super @panel

  # Get information about the current active document.
  #
  #   info - object of info about the active document
  #
  # Returns an Object or null if no object exists.
  getDocumentInfo: =>
    activeDocument = $('.js-document').find('.js-artboard')
    artboardPosition = activeDocument.position()
    info =
      width: activeDocument.width()
      height: activeDocument.height()
      ruler: 'pixels'
      offsetX: artboardPosition.left
      offsetY: artboardPosition.top
    super info

  # Removes all guides from the document
  #
  # Returns nothing.
  clearGuides: =>
    super
    @document.find('.js-guide').remove()

  # Get GuideGuide's data, including usage data, user preferences, and sets
  #
  # Returns an Object or null if no data exists.
  getGuideGuideData: =>
    data = JSON.parse localStorage.getItem 'guideguide'
    super data

  # Save GuideGuide's data, including usage data, user preferences, and sets
  #
  # Returns nothing.
  saveGuideGuideData: (data) =>
    localStorage.setItem 'guideguide', JSON.stringify data if localStorage
    super data

  # Add a collection of guides to the document.
  #
  #   guides - Collection of guides to be added.
  #
  # Returns nothing
  addGuides: =>
    $.each guides, (index,guide) =>
      @addGuide guide.location, guide.orientation

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

    $('.js-document').find('.js-artboard').append guide

$ ->
  window.guideguide = new GuideGuide $('#guideguide')
