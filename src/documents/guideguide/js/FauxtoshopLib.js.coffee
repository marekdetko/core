class window.FauxtoshopLib

  data: {}

  # Fauxtoshop is an simulated Photoshop environmennt. It is used for
  # development and demonstration on guideguide.me
  #
  # Returns itself.
  constructor: (args, callback) ->
    args ||= {}
    args.submitData ||= false
    args.checkForUpdates ||= false
    args.testMode ||= false

    @data =
      id: 'web'
      name: 'GuideGuide web'
      version: '0.0.0'
      os: @getOS()
      localization: 'en_us'
      env: 'dev'
      guideguideVersion: '0.0.0'
      submitAnonymousData: args.submitData
      checkForUpdates: args.checkForUpdates
      testMode: args.testMode

    callback @ if callback

  # Get saved panel data
  #
  #  callback - code to execute once data has been retrieved
  #
  # Returns nothing
  getData: =>
    data =
      application: @data

  # Add a guide to the document
  #
  #   location    - coordinate position for the guide to be added
  #   orientation - determines horizontal or vertical orientation of the guide
  #
  # Returns false
  addGuide: (location, orientation) =>
    artboardPosition = $('.js-document').find('.js-artboard').position()
    guide = $('.js-templates').find('.js-guide')
    .clone().attr('class','')
    .addClass 'guide js-guide ' + orientation

    if orientation == 'horizontal'
      guide.css 'top', ( location + artboardPosition.top ) + 'px'
    else
      guide.css 'left', ( location + artboardPosition.left ) + 'px'

    $('.js-document').append guide

  # Determine the operating system in which GuideGuide is running
  #
  # Returns a String
  getOS: =>
    os = 'Unknown'
    os = 'MacOS' if navigator.appVersion.indexOf("Mac") >= 0
    os = 'Win' if navigator.appVersion.indexOf("Windows") >= 0
    os = 'UNIX' if navigator.appVersion.indexOf("X11") >= 0
    os = 'Linux' if navigator.appVersion.indexOf("Linux") >= 0
    os

  # Get the guides that exist in the document currently
  #
  #  callback - code to execute once we have the current guides
  #
  # Returns nothing
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
    guides

  # Get info about the current state of the active document
  #
  #  callback - code to execute once we have detirmined the document info
  #
  # Returns nothing
  getDocumentInfo: =>
    activeDocument = $('.js-document').find('.js-artboard')
    artboardPosition = activeDocument.position()
    $selection = $('.js-document').find('.js-selection')
    info =
      hasOpenDocuments: true
      isSelection: if $selection.length then true else false
      width: if $selection.length then $selection.width()+1 else activeDocument.width()
      height: if $selection.length then $selection.height()+1 else activeDocument.height()
      offsetX: if $selection.length then $selection.position().left - artboardPosition.left else 0
      offsetY: if $selection.length then $selection.position().top - artboardPosition.top else 0
      ruler: 'pixels'
      existingGuides: @getExistingGuides()

  # Show a message and buttons to take action
  #
  # Returns nothing.
  alert: (args) =>
    return if @data.testMode
    console.log args
