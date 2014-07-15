class window.GuideGuideHTMLBridge
  testMode: false
  locale: "en_us"

  # This is the bridge between GuideGuide logic and an HTML API for GuideGuide.
  # This does not contain GuideGuide or UI logic.
  #
  # Returns itself
  constructor: (args) ->
    args ||= {}
    @testMode = args.testMode if args.testMode
    @ui = args.ui if args.ui

  # Init the UI
  #
  # Returns nothing
  init: (core) =>
    @ui.init core

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
  #  guides - array of guide objects
  #
  # Returns false
  addGuides: (guides, callback) =>
    Fauxtoshop.addGuides guides, callback

  # Fade the action bar since it can't be used.
  #
  # Returns nothing.
  toggleGuideActions: =>
    @ui.toggleGuideActions()

  # Turn guide visibility on and off
  #
  # Returns nothing
  toggleGuides: =>
    Fauxtoshop.toggleGuides()

  # Clear guides
  #
  # Returns nothing
  resetGuides: (guides) =>
    Fauxtoshop.resetGuides()
    @addGuides(guides) if guides.length > 0

  # Get info about the current state of the active document.
  #
  # Returns an Object.
  getDocumentInfo: (callback) =>
    Fauxtoshop.getDocumentInfo (info) ->
      callback info

  # Get the contents of the grid form
  #
  # Returns an Object.
  getFormData: =>
    return Fauxtoshop.testForm if @testMode
    @ui.getFormData()

  # Update all of the ui with local messages.
  #
  # Returns nothing.
  localizeUI: () =>
    return if @testMode
    @ui.localizeUI()

  # Do this after GuideGuide updates set data
  #
  # Returns nothing
  refreshSets: (sets) =>
    return sets if @testMode
    @ui.refreshSets sets

  # Do this after GuideGuide updates settings data
  #
  # Returns nothing
  refreshSettings: (data) =>
    return data if @testMode
    @ui.refreshSettings data

  # Hide the set importer
  #
  # Returns nothing.
  hideImporter: =>
    return true if @testMode
    @ui.hideImporter()

  # Select a specific tab.
  #
  # name - String: data-page string of the tab to be selected
  #
  # Returns nothing.
  selectTab: (tab) =>
    return tab if @testMode
    @ui.selectTab tab

  # Update the contents of the custom field.
  #
  #  string - String: text to add to the custom field.
  #
  # Returns nothing
  updateCustomField: (string) =>
    return string if @testMode
    @ui.updateCustomField string

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
  # Returns an Object.
  showUpdateIndicator: (data) =>
    return data if @testMode
    @ui.showUpdateIndicator data

  # Show update details.
  #
  # Returns Boolean
  showUpdateInfo: =>
    return true if @testMode
    @ui.showUpdateInfo()

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
    return true if @testMode
    @ui.showLoader()

  # Hide the loader status animation
  #
  # Returns nothing.
  hideLoader: =>
    return true if @testMode
    @ui.hideLoader()

  # Show a message and buttons to take action
  #
  # Returns nothing.
  alert: (args) =>
    return args if @testMode
    @ui.alert(args)

  # Switch themes and add the theme to a list for later use
  #
  #   colors - an object of colors
  #
  # Returns nothing
  updateTheme: (colors) =>
    @ui.updateTheme colors

  # Hide a GuideGuide alert
  #
  # Returns nothing.
  dismissAlert: () =>
