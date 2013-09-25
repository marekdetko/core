# Web module for GuideGuide. Used for development and the website demo.

class GuideGuide extends window.GuideGuideCore
  constructor: (@panel) ->
    console.log 'Running GuideGuide in Web mode'
    super @panel

  # Determine the language for the app in which GuideGuide is running.
  #
  # Returns nothing.
  getLocalization: =>
    'en-us'

  # Set default data the first time GuideGuide run.
  #
  # Returns nothing.
  bootstrap: =>
    data =
      appID: 'web'
    super data

  # Get the version of this install of GuideGuide.
  #
  # Returns a semantic version string http://semver.org/
  getVersion: =>
    '0.0.0'

  # Determine the version of the app in which GuideGuide is running.
  #
  # Returns a semantic version string http://semver.org/
  getAppVersion: =>
    '0.0.0'

  # Determine the operating system in which GuideGuide is running
  #
  # Returns a String.
  getOS: =>
    os = 'Unknown'
    os = 'MacOS' if navigator.appVersion.indexOf("Mac") >= 0
    os = 'Win' if navigator.appVersion.indexOf("Windows") >= 0
    os = 'UNIX' if navigator.appVersion.indexOf("X11") >= 0
    os = 'Linux' if navigator.appVersion.indexOf("Linux") >= 0
    os

  # Submit anonymous usage data to the GuideGuide servers. In GuideGuide Web,
  # this is only a debug feature and must enabled intentionally.
  #
  # Returns nothing.
  submitData: =>
    devData = JSON.parse localStorage.getItem 'guideguidedev'
    if devData? and devData.submitData
      super true

  checkForUpdates: =>
    devData = JSON.parse localStorage.getItem 'guideguidedev'
    if devData? and devData.checkForUpdates
      super true

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
  saveGuideGuideData: =>
    localStorage.setItem 'guideguide', JSON.stringify @guideguideData if localStorage
    super

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

  # Get the guides that already exist on the stage
  #
  # Returns an Array of guides
  getExistingGuides: =>
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
      
    super guides

  onToggleGuides: =>
    $(".js-document").toggleClass 'is-showing-guides'
    super

$ ->
  window.guideguide = new GuideGuide $('#guideguide')
