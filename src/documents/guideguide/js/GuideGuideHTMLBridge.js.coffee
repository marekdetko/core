class window.GuideGuideHTMLBridge
  testMode: false

  # This is the bridge between GuideGuide logic and an HTML API for GuideGuide.
  # This does not contain GuideGuide or UI logic.
  #
  # Returns itself
  constructor: (args) ->
    args ||= {}
    @testMode = args.testMode if args.testMode
    @ui = args.ui if args.ui

  # Get saved panel data
  #
  # Returns an Object
  getData: =>
    Fauxtoshop.getData()

  # Save panel data
  #
  #  data - data to be saved
  #
  # Returns nothing
  setData: (data) =>
    Fauxtoshop.setData data

  # Add a guide to the document
  #
  #  guide - guide to be added
  #
  # Returns false
  addGuide: (guide) =>
    Fauxtoshop.addGuide guide

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
    return true if @testMode
    Fauxtoshop.toggleGuides()


  # Clear guides
  #
  # Returns nothing
  resetGuides: =>
    $('.js-document').find('.js-guide').remove()

  # Get info about the current state of the active document
  #
  #  callback - code to execute once we have detirmined the document info
  #
  # Returns nothing
  getDocumentInfo: =>
    Fauxtoshop.getDocumentInfo()

  # Update all of the ui with local messages.
  #
  # Returns nothing.
  localizeUI: (messages) =>
    $elements = $('[data-localize]')
    $elements.each (index, el) =>
      $(el).text Messages[$(el).attr('data-localize')]()


  # Do this after GuideGuide updates set data
  #
  # Returns nothing
  refreshSets: (sets) =>
    return sets if @testMode
    @ui.refreshSets sets

  # Do this after GuideGuide updates settings data
  #
  # Returns nothing
  onSettingsUpdate: () =>

  # Log a message
  #
  #  args - an array of messages to print
  #
  # Returns nothing
  log: (args...) =>
    return args.toString() if @testMode
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
    return url if @testMode
    window.open(url, '_blank')
    url

  # When this install of GuideGuide is out of date, alert the user.
  #
  # Returns nothing.
  showUpdateIndicator: (data) =>
    return data if @testMode
    @ui.showUpdateIndicator data

  # Convert a string to a hash.
  #
  #  string - string to be converted to a hash
  #
  # Returns a String
  toHash: (string) =>
    return CryptoJS.SHA1(string).toString()

  # Show the loader status animation
  #
  # Returns nothing.
  showLoader: =>

  # Hide the loader status animation
  #
  # Returns nothing.
  hideLoader: =>

  # Show a message and buttons to take action
  #
  # Returns nothing.
  alert: (args) =>
    return args if @testMode
    @ui.alert(args)

  # Hide a GuideGuide alert
  #
  # Returns nothing.
  dismissAlert: () =>
