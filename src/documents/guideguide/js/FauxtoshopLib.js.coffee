class window.FauxtoshopLib
  testMode: false
  data:
    application:
      id: 'web'
      name: 'GuideGuide web'
      version: '0.0.0'
      os: "Unknown"
      localization: 'en_us'
      env: 'dev'
      guideguideVersion: '0.0.0'
      submitAnonymousData: false
      checkForUpdates: false
  testInfo:
    hasOpenDocuments: true
    isSelection: false
    width: 100
    height: 100
    offsetX: 0
    offsetY: 0
    ruler: 'pixels'
    existingGuides: []

  # Fauxtoshop is an simulated Photoshop environmennt. It is used for
  # development and demonstration on guideguide.me
  #
  # Returns itself.
  constructor: (args, callback) ->
    args ||= {}
    @testMode = args.testMode if args.testMode
    @data.application.os = @getOS()
    @data.application.submitAnonymousData = args.submitData || false
    @data.application.checkForUpdates = args.checkForUpdates || false

    callback @ if callback

  # Get saved panel data
  #
  #  callback - code to execute once data has been retrieved
  #
  # Returns nothing
  getData: =>
    return @data if @testMode
    data = JSON.parse localStorage.getItem 'guideguide' || @data
    data ||= @data

  # Save panel data
  #
  #  data - data to be saved
  #
  # Returns nothing
  setData: (data) =>
    return data if @testMode
    localStorage.setItem 'guideguide', JSON.stringify data

  # Add a guide to the document
  #
  #  guide - guide to be added
  #
  # Returns false
  addGuide: (g) =>
    return g if @testMode
    artboardPosition = $('.js-document').find('.js-artboard').position()
    guide = $('.js-templates').find('.js-guide')
    .clone().attr('class','')
    .addClass 'guide js-guide ' + g.orientation

    if g.orientation == 'horizontal'
      guide.css 'top', ( g.location + artboardPosition.top ) + 'px'
    else
      guide.css 'left', ( g.location + artboardPosition.left ) + 'px'

    $('.js-document').append guide
    g

  resetGuides: =>
    return [] if @testMode
    $('.js-document').find('.js-guide').remove()

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
    return @testInfo if @testMode
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

  # Turn guide visibility on and off
  #
  # Returns nothing
  toggleGuides: =>
    return true if @testMode
    $(".js-document").toggleClass 'is-showing-guides'
