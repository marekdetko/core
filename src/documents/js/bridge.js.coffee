devData = JSON.parse(localStorage.getItem('guideguidedev')) or new Object()

class window.Bridge

  constructor: () ->

  # Get saved panel data
  #
  #  callback - code to execute once data has been retrieved
  #
  # Returns nothing
  getData: (callback) =>
    data = JSON.parse(localStorage.getItem('guideguide')) or new Object()
    data.application = Fauxtoshop.data

    if data
      callback data
    else
      callback null

  # Save panel data
  #
  #  data - data to be saved
  #
  # Returns nothing
  setData: (data, callback) =>
    localStorage.setItem 'guideguide', JSON.stringify data

  # Add guides to the document
  #
  #  guides - array of guides to add
  #
  # Returns nothing
  addGuides: (guides) =>
    $.each guides, (index, guide) =>
      Fauxtoshop.addGuide guide.location, guide.orientation

  # Turn guide visibility on and off
  #
  # Returns nothing
  toggleGuides: =>
    $(".js-document").toggleClass 'is-showing-guides'

  # Clear guides
  #
  # Returns nothing
  resetGuides: =>
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
    callback(info)

  # Log a message
  #
  #  args - an array of messages to print
  #
  # Returns nothing
  log: (args...) =>
    if console.log.apply
      console.log.apply(console, args)
    else
      console.log args.join " "

  # Log an error
  #
  #  args - an array of errors to print
  #
  # Returns nothing
  error: (args...) =>
    if console.error.apply
      console.error.apply(console, args)
    else
      console.error args.join " "

  # Open a url in the browser
  #
  #  url - url to load
  #
  # Returns nothing
  openURL: (url) =>
    window.open(url, '_blank')
