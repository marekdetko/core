class window.GuideGuideLib
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
      'log',
      'error',
      'openURL',
      'toHash',
      'alert'
    ]
    missing = []

    for index, method of expected
      missing.push(method) if !@bridge[method]?

    if missing.length > 0
      callback("The bridge is missing the following methods: #{ missing.join(', ') }")
      return

    @data = @bridge.getData (err, data) =>
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
    @completeInit(callback)

  # Finish the GuideGuide startup process.
  #
  # Returns nothing.
  completeInit: (callback) =>

    @alert
      title: "Hello World"
      message: "Hello Again"
      buttons: [ @button(@messages.uiOk(), 'dismissAlert', true) ]
    # @bridge.log "Running #{ @data.application.name } in #{ @data.application.env } mode"
    #
    # @refreshSets()
    #
    # if !@guideguideData.panel.askedAboutAnonymousData and !isDemo()
    #   title   = @messages.alertTitleWelcome()
    #   message = @messages.alertMessageWelcome()
    #   @alert [title, message], ['primary js-confirm-submit-data', 'js-deny-submit-data'], [@messages.uiYes(), @messages.uiNo()]

    # @refreshSettings()
    # @localizeUI()

    # if !isDemo()
    #   @submitData()
    #   @checkForUpdates (data) =>
    #     if data? and data.hasUpdate
    #       @panel.trigger 'guideguide:hasUpdate', data


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
