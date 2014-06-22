class window.FauxtoshopLib
  testMode: false
  data:
    application:
      id: 'web'
      name: 'GuideGuide web'
      localization: 'en_us'
      env: 'dev'
      guideguideVersion: '0.0.0.0'
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
  testForm:
    name: ""
    marginLeft: ""
    marginTop: ""
    marginRight: ""
    marginBottom: ""
    countColumn: ""
    countRow: ""
    widthColumn: ""
    widthRow: ""
    gutterColumn: ""
    gutterRow: ""

  # Fauxtoshop is an simulated Photoshop environmennt. It is used for
  # development and demonstration on guideguide.me
  #
  # Returns itself.
  constructor: (args, callback) ->
    args ||= {}
    @testMode = args.testMode if args.testMode
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
  addGuides: (guides) =>
    return guides if @testMode
    artboardPosition = $('.js-document').find('.js-artboard').position()
    for i, g of guides
      guide = $('.js-templates').find('.js-guide')
      .clone().attr('class','')
      .addClass 'guide js-guide ' + g.orientation

      if g.orientation == 'h'
        guide.css 'top', ( g.location + artboardPosition.top ) + 'px'
      else
        guide.css 'left', ( g.location + artboardPosition.left ) + 'px'

      $('.js-document').append guide

  resetGuides: =>
    return [] if @testMode
    $('.js-document').find('.js-guide').remove()

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

      if $el.hasClass 'h'
        guide.orientation = 'h'
        guide.location = $el.position().top - $artboard.position().top
      if $el.hasClass 'v'
        guide.orientation = 'v'
        guide.location = $el.position().left - $artboard.position().left

      guides.push guide
    guides

  # Get info about the current state of the active document
  #
  #  callback - code to execute once we have detirmined the document info
  #
  # Returns nothing
  getDocumentInfo: (callback) =>
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
    callback info

  # Turn guide visibility on and off
  #
  # Returns nothing
  toggleGuides: =>
    return true if @testMode
    $(".js-document").toggleClass 'is-showing-guides'
