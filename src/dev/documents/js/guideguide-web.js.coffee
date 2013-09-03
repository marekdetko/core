# Web module for GuideGuide. Used for development and the website demo.

class GuideGuide extends window.GuideGuideCore
  constructor: (@panel) ->
    console.log 'Running GuideGuide in Web mode'
    super @panel

  getLocalization: =>
    'en-us'

  # Get information about the current active document.
  #
  #   info - object of info about the active document
  #
  # Returns an Object or null if no object exists.
  getDocumentInfo: =>
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
    super info

  # Removes all guides from the document
  #
  # Returns nothing.
  resetGuides: =>
    $('.js-document').find('.js-guide').remove()
    super

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
  addGuides: (guides) =>
    super guides
    $.each guides, (index,guide) =>
      @addGuide guide.location, guide.orientation
    
  # Add a guide to the document
  #
  #   location    - coordinate position for the guide to be added
  #   orientation - determines horizontal or vertical orientation of the guide
  #
  # Returns false
  addGuide: (location,orientation) =>
    artboardPosition = $('.js-document').find('.js-artboard').position()
    guide = $('.js-templates').find('.js-guide')
    .clone().attr('class','')
    .addClass 'guide js-guide ' + orientation

    if orientation == 'horizontal'
      guide.css 'top', ( location + artboardPosition.top ) + 'px'
    else
      guide.css 'left', ( location + artboardPosition.left ) + 'px'

    $('.js-document').append guide

  getExistingGuides: =>
    guides = []

    docGuides = $('.js-document').find('.js-guide')

    $selection = $('.js-document').find('.js-selection')
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
      
    super guides

$ ->
  window.guideguide = new GuideGuide $('#guideguide')
