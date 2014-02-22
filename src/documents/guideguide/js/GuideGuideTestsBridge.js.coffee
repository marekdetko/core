class window.GuideGuideTestsBridge

  # This is the bridge between GuideGuide logic and an HTML API for GuideGuide.
  # This does not contain GuideGuide or UI logic.
  #
  #   @app - instance of the application api to be used by the bridge
  #
  # Returns itself
  constructor: ->

  # Get saved panel data
  #
  #  callback - code to execute once data has been retrieved
  #
  # Returns nothing
  getData: (callback) =>
    data =
      application:
        id: 'web'
        name: 'GuideGuide web'
        version: '0.0.0'
        os: "TestOs"
        localization: 'en_us'
        env: 'dev'
        guideguideVersion: '0.0.0'
        submitAnonymousData: false
        checkForUpdates: false
    callback null, data

  # Save panel data
  #
  #  data - data to be saved
  #
  # Returns nothing
  setData: (data) =>

  # Add guides to the document
  #
  #  guides - array of guides to add
  #
  # Returns nothing
  addGuides: (guides) =>

  # Turn guide visibility on and off
  #
  # Returns nothing
  toggleGuides: =>

  # Clear guides
  #
  # Returns nothing
  resetGuides: =>

  # Get the guides that exist in the document currently
  #
  #  callback - code to execute once we have the current guides
  #
  # Returns nothing
  getExistingGuides: =>

  # Get info about the current state of the active document
  #
  #  callback - code to execute once we have detirmined the document info
  #
  # Returns nothing
  getDocumentInfo: (callback) =>

  # Update all of the ui with local messages.
  #
  # Returns nothing.
  localizeUI: (messages) =>

  # Do this after GuideGuide updates set data
  #
  # Returns nothing
  onSetsUpdate: () =>

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

  # Log an error
  #
  #  args - an array of errors to print
  #
  # Returns nothing
  error: (args...) =>

  # Open a url in the browser
  #
  #  url - url to load
  #
  # Returns nothing
  openURL: (url) =>

  # Convert a string to a hash.
  #
  #  string - string to be converted to a hash
  #
  # Returns a String
  toHash: (string) =>

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
    console.log args

  # Hide a GuideGuide alert
  #
  # Returns nothing.
  dismissAlert: () =>

  # Determine the operating system in which GuideGuide is running
  #
  # Returns a String
  getOS: =>
