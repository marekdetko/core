class window.GuideGuideCore
  siteUrl: 'http://guideguide.me'
  env:     'production'
  bridge: {}
  data: {}

  # Create a new GuideGuide instance
  #
  #  args       - Object: Specify options for GuideGuide.
  #    .bridge  - Object: Contains all the necessary methods for GuideGuide to function in the host application.
  #    .locale  - String: Locale string that GuideGuide will use to pick its language.
  #    .siteUrl - String: Url for guideguide.me. Specify this to switch to a dev url.
  #
  constructor: (args, callback) ->
    if !args.bridge?
      callback("Please specify a panel bridge")
      return

    args.locale ||= "en_us"

    @bridge = args.bridge
    @messages = new GuideGuideMessages(args.locale)
    @siteUrl = args.siteUrl if args.siteUrl?

    expected = [
      'getData',
      'setData',
      'addGuides',
      'toggleGuides',
      'resetGuides',
      'getExistingGuides',
      'getDocumentInfo',
      'localizeUI',
      'log',
      'error',
      'openURL',
      'toHash',
      'alert',
      'dismissAlert',
      'showLoader',
      'hideLoader',
      'onSetsUpdate',
      'onSettingsUpdate'
    ]
    missing = []

    for index, method of expected
      missing.push(method) if !@bridge[method]?

    if missing.length > 0
      callback("The bridge is missing the following methods: #{ missing.join(', ') }")
      return

    @bridge.getData (err, data) =>
      if err
        callback(err)
      else
        @initData data, callback

  # When data is received from the application, fill out any missing data, then
  # procede with the callback.
  #
  #  data     - Object: Data from the application provided by the bridge
  #  callback - Function: Method to execute once the data is ready.
  #
  # Returns nothing.
  initData: (data, callback) =>
    data.panel    or= @panelBootstrap
    data.sets     or= @setsBootstrap
    data.settings or= @settingsBootstrap
    data.panel.launchCount++
    @data = data
    @saveGuideGuideData()

    if !@data.panel.askedAboutAnonymousData and !@isDemo()
      title   = @messages.alertTitleWelcome()
      message = @messages.alertMessageWelcome()
      button1 = @button(@messages.uiYes(), 'submitDataConfirmed', true)
      button2 = @button(@messages.uiNo(), 'dismissAlert')

      @alert
        title: title
        message: message
        buttons: [button1, button2]

    @bridge.localizeUI()
    @bridge.onSetsUpdate()
    @bridge.onSettingsUpdate()

    unless @isDemo()
      @submitData()
      @checkForUpdates (data) =>
        if data? and data.hasUpdate
          @panel.trigger 'guideguide:hasUpdate', data

    callback(null)

  # When the user grants data collection permission, update the settings and
  # dismiss the alert.
  #
  # Returns nothing.
  submitDataConfirmed: () =>
    @data.settings.reportAnonymousData = true
    @data.panel.askedAboutAnonymousData = true
    @saveGuideGuideData()
    @bridge.onSettingsUpdate()
    @dismissAlert()

  # Submit anonymous usage data to the GuideGuide servers.
  #
  # Returns nothing.
  submitData: () =>
    return unless @data.settings.reportAnonymousData and @data.application.submitAnonymousData
    @bridge.log 'Submitting anonymous data'

    data =
      usage: @data.panel.usage

    if @data.panel.id?
      data._id          = @data.panel.id
    else
      data.version      = @data.application.guideguideVersion
      data.appID        = @data.application.id
      data.appName      = @data.application.name
      data.AppVersion   = @data.application.version
      data.os           = @data.application.os
      data.localization = @data.application.localization

    $.ajax
      type: 'POST'
      url: "#{ @siteUrl }/install"
      data: data
      success: (data) =>
        @bridge.log 'Anonymous data submitted successfully'
        if typeof data is 'object' and data._id
          @data.panel.id = data._id
          @saveGuideGuideData()

  # Check the GuideGuide server to see if there are updates available.
  #
  # Returns nothing.
  checkForUpdates: (callback) =>
    return unless @data.application.checkForUpdates
    @bridge.log 'Checking for updates'

    $.ajax
      type: 'GET'
      url: "#{ @siteUrl }/panel/#{ @data.application.id }"
      data:
        version: @data.application.guideguideVersion || '0.0.0'
        i18n: @data.application.localization
      complete: (data) =>
        @bridge.hideLoader()
      success: (data) =>
        callback(data)
      error: (error) =>
        @bridge.log error
        callback(null)

  # Save GuideGuide's data, including usage data, user preferences, and sets
  #
  # Returns nothing.
  saveGuideGuideData: =>
    @bridge.setData @data

  # Alert a message to the user
  #
  # Reterns nothing.
  alert: (args) =>
    return unless args?
    args.title   ||= "Title"
    args.message ||= "Message"
    args.buttons ||= [ @button(@messages.uiOk(), 'dismissAlert', true) ]
    @bridge.alert(args)

  # Dismiss a GuideGuide alert without taking action
  #
  # Returns nothing.
  dismissAlert: =>
    @bridge.dismissAlert()

  # Form a button data object.
  #
  #  label        - String: Text to be used for the button label.
  #  callbackName - String: Callback to be executed when the button is clicked.
  #  primary      - Boolean: If true, the button will be highlighted.
  #
  #
  # Returns an Object.
  button: (label, callbackName, primary) =>
    label: label
    callback: callbackName
    primary: primary || false

  # Generate a set ID based on a hash of the GGN. This will allow us to detect
  # duplicates easier. Since this is a dependency situation, leave it up to
  # the bridge to provide the utility.
  #
  #   set - Object: Set object used as a seed for the ID hash
  #
  # returns a String
  generateSetID: (set) =>
    @bridge.toHash("#{ set.name }#{ set.string }")

  # Default info about GuideGuide.
  #
  # Returns an Object
  panelBootstrap: =>
    id: null
    launchCount: 0
    askedAboutAnonymousData: false
    usage:
      lifetime: 0
      guideActions: 0
      grid: 0
      custom: 0
      set: 0
      top: 0
      bottom: 0
      left: 0
      right: 0
      verticalMidpoint: 0
      horizontalMidpoint: 0
      clear: 0

  # Default sets for GuideGuide.
  #
  # Returns an Object.
  setBootstrap: =>
    bootstrap =
      Default:
        name: "Default"
        sets: {}

    set1 =
      name:'Outline'
      string: """
      | ~ | (vFl)
      | ~ | (hFl)
      """
    set2 =
      name:'Two column grid'
      string: """
      | ~ | ~ | (vFl)
      """
    set3 =
      name:'Three column grid'
      string: """
      | ~ | ~ | ~ | (vFl)
      """
    setsBootstrap =
      Default:
        name: "Default"
        sets: {}

    set1.id = @generateSetID set1
    set2.id = @generateSetID set2
    set3.id = @generateSetID set3

    setsBootstrap.Default.sets[set1.id] = set1
    setsBootstrap.Default.sets[set2.id] = set2
    setsBootstrap.Default.sets[set3.id] = set3

    bootstrap

  # Default settings for GuideGuide
  #
  # Returns an Object.
  settingsBootstrap: =>
    horizontalRemainder: 'last'
    verticalRemainder:   'last'
    horizontalPosition:  'first'
    verticalPosition:    'first'
    calculation:         'pixel'
    reportAnonymousData: false

  # Truthy if the environment is set to "demo"
  #
  # Returns a Boolean
  isDemo: =>
    @data.application.env == 'demo'
