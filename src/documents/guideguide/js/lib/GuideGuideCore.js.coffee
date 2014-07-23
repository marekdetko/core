class window.GuideGuideCore
  siteUrl: 'http://guideguide.me/update/'
  env:     'production'
  allowGuideActions: true
  bridge: {}
  data: {}
  session: {}

  # Create a new GuideGuide instance
  #
  #  args        - Object: Specify options for GuideGuide.
  #    .bridge   - Object: Contains all the necessary methods for GuideGuide to function in the host application.
  #    .siteUrl  - String: Url for guideguide.me. Specify this to switch to a dev url.
  #
  constructor: (args, callback) ->
    @bridge   = args.bridge
    @messages = new Messages @bridge.locale

    @bridge.init @

    @data = @bridge.getData()

    @data.panel    or= @panelBootstrap()
    @data.sets     or= @setsBootstrap()
    @data.settings or= @settingsBootstrap()
    @data.panel.launchCount++
    @saveData()

    @siteUrl = args.siteUrl if args.siteUrl?

    @bridge.localizeUI()
    @refreshSets()
    @refreshSettings()

    unless @isDemo()
      if @data.application.checkForUpdates
        @checkForUpdates (data) =>
          @bridge.hideLoader()
          if data? and data.hasUpdate
            @bridge.showUpdateIndicator(data)
    callback(@) if callback

  # Update the dropdowns in the settings ui.
  #
  # Returns an Object.
  refreshSettings: () =>
    @bridge.refreshSettings @data.settings

  # Update the sets list in the ui.
  #
  # Returns an Array.
  refreshSets: =>
    @bridge.refreshSets @getSets()

  # Check for updates when specifically requested
  manualCheckForUpdates: =>
    @hideLoader()
    @checkForUpdates (data) =>
      @log data
      if data?
        if data.hasUpdate
          @bridge.showUpdateIndicator(data)
          @bridge.showUpdateInfo()
        else
          @alert
            title: @messages.alertTitleUpToDate()
            message: @messages.alertMessageUpToDate()
      else
        @alert
          title: @messages.alertTitleUpdateError()
          message: @messages.alertMessageUpdateError()

  # Check the GuideGuide server to see if there are updates available.
  #
  # Returns nothing.
  checkForUpdates: (callback) =>
    try
      @log 'Checking for updates'

      result =
        hasUpdate: false

      $.ajax
        url: "#{ @siteUrl }#{ @data.application.id }.json"
        crossDomain: true
        dataType: 'jsonp'
        jsonp: "callback"
        jsonpCallback: "callback"
        timeout: 5000
        success: (data) =>
          hasUpdate = false

          ours = @data.application.guideguideVersion.replace(/-/g,'.').split('.')
          theirs = data.version.replace(/-/g,'.').split('.')

          theirs.push(0) while theirs.length < ours.length
          ours.push(0) while theirs.length > ours.length

          for num, i in theirs
            return callback(result) if parseInt(num) < parseInt(ours[i])
            if parseInt(num) > parseInt(ours[i])
              result.hasUpdate = true
              result.url = data.url
              result.title = @messages.alertTitleUpdate()
              result.message = @messages.alertMessageUpdate()
              return callback(result)

          callback(result)
        error: (error) =>
          @log "Update error", error
          callback(null)
    catch e
      alert e

  # Save GuideGuide's data, including usage data, user preferences, and sets
  #
  #  data - optional data to add specifically. used to update settings externally.
  #
  # Returns nothing.
  saveData: (data) =>
    @data = $.extend true, @data, data if data
    try
      @bridge.setData @data
    catch e
      alert e

  # Disable the action buttons while guides are being added.
  #
  # Returns nothing.
  toggleAllowingGuideActions: (callback) =>
    @allowGuideActions = !@allowGuideActions
    callback() if callback

  # Increment a usage counter of a given property.
  #
  #   property - usage property to increment
  #   count    - number of guides being added
  #
  # Returns nothing.
  recordUsage: (property, count = 1) =>
    @data.panel.usage.lifetime += count
    if @data.panel.usage[property]?
      @data.panel.usage[property]++
      @data.panel.usage.guideActions++ if property isnt 'clear'
      @saveData()

    if @data.panel.usage.guideActions == 30 and @data.application.env != 'demo'
      button1 = @button(@messages.uiDonate(), 'donate', true)
      button2 = @button(@messages.uiNiceNo())

      @alert
        title: @messages.alertTitleDonate()
        message: @messages.alertMessageDonate()
        buttons: [button1, button2]

    @data.panel.usage

  # Get a set or group of sets. If a group is specified without a set, a group
  # will be returned.
  #
  #   args.group - String: group id
  #   args.set   - String: set id
  #
  # Returns an Object if a set or an Array of objects if a group
  getSets: (args) =>
    group = @data.sets[ args?.group || "Default" ]
    return group.sets if !args?.set
    return group.sets[args.set]

  # Delete a set and update the set list.
  #
  #  group - String: Group in which the to-delete set exits
  #  set   - String: Set to delete
  #
  # Returns nothing.
  deleteSet: (group, set) =>
    delete @data.sets[group].sets[set]
    @saveData()
    @refreshSets()

  # Create a new set object, add it to the list, and save.
  # If the data includes an id, delete the set with that id (update).
  #
  # Returns
  saveSet: (data) =>
    delete @data.sets["Default"].sets[data.id] if data.id? and data.id.length > 0
    data.contents = @stringifyFormData(data.contents) if typeof data.contents == "object"
    set =
      name: data.name
      string: data.contents
    set.id = @generateSetID set

    @data.sets["Default"].sets[set.id] = set
    @saveData()
    @refreshSets()
    @bridge.selectTab('sets')
    set

  # Export GuideGuide's sets to an external source.
  #
  # Returns nothing.
  exportSets: =>
    return if @isDemo()

    data =
      description: @messages.helpGistExport()
      public: false
      files:
        "sets.json":
          content: JSON.stringify @data.sets
    @showLoader()
    $.ajax
      url: 'https://api.github.com/gists'
      type: 'POST'
      data: JSON.stringify data
      complete: (data) =>
        @hideLoader()
      success: (data) =>
        @alert
          title: @messages.alertTitleExportSuccess()
          message: @messages.alertMessageExportSuccess(data.html_url)
      error: (data) =>
        @alert
          title: @messages.alertTitleExportError()
          message: @messages.alertMessageExportError()

  importSets: (id) =>
    return @alert({ title: @messages.alertTitleImportNotGist(), message: @messages.alertMessageImportNotGist() }) if !id?
    @showLoader()
    $.ajax
      url: "https://api.github.com/gists/#{ id }"
      type: 'GET'
      complete: (data) =>
        @hideLoader()
      success: (data) =>
        if data.files["sets.json"] and sets = JSON.parse data.files["sets.json"].content
          @bridge.hideImporter()
          # TODO: Make this an extend
          for key, group of sets
            @data.sets[key] ||=
              name: group.name
              sets: []

            g = @data.sets[key]

            for key, set of group.sets
              g.sets[set.id] = set if !g.sets[set.id]?

          @saveData()
          @refreshSets()
          @bridge.selectTab 'sets'
          @alert
            title: @messages.alertTitleImportSuccess()
            message: @messages.alertMessageImportSuccess()
        else
          @alert
            title: @messages.alertTitleImportGistNoSets()
            message: @messages.alertMessageImportGistNoSets()
      error: (data) =>
        @alert
          title: @messages.alertTitleImportGistError()
          message: @messages.alertMessageImportGistError()

  # Show the indeterminate loader.
  #
  # Returns nothing
  showLoader: => @bridge.showLoader()

  # Hide the indeterminate loader.
  #
  # Returns nothing
  hideLoader: => @bridge.hideLoader()

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

  # Open the donate url in a browser.
  #
  # Returns the donate url
  donate: =>
    @bridge.openURL "http://guideguide.me/donate"

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

  # Generate a set ID based on a hash of the grid notation. This will allow us to detect
  # duplicates easier. Since this is a dependency situation, leave it up to
  # the bridge to provide the utility.
  #
  #   set - Object: Set object used as a seed for the ID hash
  #
  # returns a String
  generateSetID: (set) =>
    @bridge.toHash("#{ set.name }#{ set.string }")

  # Save the data for the active document whenever it changes so that we can
  # access it for precalculation without slowing down the UI.
  #
  # Returns nothing.
  storeDocumentState: =>
    @bridge.getDocumentInfo (info) => @session.document = info

  # Clear the stored active document data.
  #
  # Returns nothing.
  clearDocumentState: =>
    @session.document = null

  # Get info about the current state of the active document.
  #
  # Returns an Object.
  getDocumentInfo: (callback) =>
    @bridge.getDocumentInfo (info) =>
      callback info

  # Default info about GuideGuide.
  #
  # Returns an Object
  panelBootstrap: =>
    id: null
    launchCount: 0
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
  setsBootstrap: =>
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

    setsBootstrap

  # Default settings for GuideGuide
  #
  # Returns an Object.
  settingsBootstrap: =>
    horizontalRemainder: 'last'
    verticalRemainder:   'last'
    horizontalPosition:  'first'
    verticalPosition:    'first'
    calculation:         'pixel'

  # Create a collection of unique unique guides that do not already exist.
  #
  #   existing  - (Array) First array
  #   added     - (Array) Second array
  #   args      - (Object) Options
  #
  # Returns an array of guides
  consolidate: (existing, added, args = {}) =>
    list   = {}
    result = []
    for i, e of existing
      list["#{ e.location }.#{ e.orientation }"] = true

    for i, e of added
      include = !list["#{ e.location }.#{ e.orientation }"]?
      list["#{ e.location }.#{ e.orientation }"] = true
      if args.bounds and include
        inBounds = false
        inBounds = true  if e.orientation == "h" and args.bounds.bottom >= e.location >= args.bounds.top
        inBounds = true  if e.orientation == "v" and args.bounds.right >= e.location >= args.bounds.left
        include  = false if (inBounds and args.invert) or (!inBounds and !args.invert)

      result.push e if include

    result

  # When the form changes, update the contents of the Custom form to reflect it.
  #
  #  data - Object: Form data.
  #
  # Returns a String.
  formChanged: (data) =>
    @bridge.updateCustomField @stringifyFormData data.contents
    return

  # Determine whether the value in the form is valid
  #
  #   value       - String: string to be validated
  #   integerOnly - Boolean: if true, only integers are valid
  #
  # Returns a Boolean
  validateInput: (value, integerOnly = false) =>
    return true if value == ""
    valid = true
    units = value.split ','
    (valid = false if !Unit.parse(unit)) for unit in units
    valid

  # Clean up an input string and fill in any missing units
  getInputFormat: (string, callback) =>
    string = string.replace(/\s/g,'')
    @bridge.getDocumentInfo (info) =>
      bits = string.split ','
      for bit, i in bits
        unit = Unit.preferredName(info.ruler)
        bits[i] = "#{ bit }#{ unit }" if bit == parseFloat(bit).toString()
      callback bits.join(', ')

  # Create a GuideGuide Notation string from the contents for the grid form
  #
  #  data - Object: Form data
  #
  # Returns a GuideGuide Notation string
  stringifyFormData: (data) =>
    string1 = GridNotation.stringify
      count:          data.countColumn
      width:          data.widthColumn
      gutter:         data.gutterColumn
      firstMargin:    data.marginLeft
      lastMargin:     data.marginRight
      columnMidpoint: data.midpointColumn || false
      gutterMidpoint: data.midpointColumnGutter || false
      orientation:    'v'
      position:       @data.settings.horizontalPosition.charAt(0)
      remainder:      @data.settings.verticalRemainder.charAt(0)
      calculation:    @data.settings.calculation.charAt(0)
    string2 = GridNotation.stringify
      count:          data.countRow
      width:          data.widthRow
      gutter:         data.gutterRow
      firstMargin:    data.marginTop
      lastMargin:     data.marginBottom
      columnMidpoint: data.midpointRow || false
      gutterMidpoint: data.midpointRowGutter || false
      orientation:    'h'
      position:       @data.settings.verticalPosition.charAt(0)
      remainder:      @data.settings.horizontalRemainder.charAt(0)
      calculation:    @data.settings.calculation.charAt(0)

    "#{ string1 }#{ if string1 and string2 then '\n' else '' }#{ string2 }"

  # Add guides to the stage from GuideGuide Notation.
  #
  #   notation    - String: GuideGuide Notation
  #   source - String: Action executed to add guides, used for recording usage.
  #
  # Returns the array of guides generated from the GuideGuide Notation.
  addGuidesFromNotation: (notation, source, callback) =>
    @bridge.getDocumentInfo (info) =>

      return unless info and info.hasOpenDocuments
      guides = []

      guides = GridNotation.parse notation, info
      guides = @consolidate(info.existingGuides, guides)

      @recordUsage source, guides.length
      @addGuides guides, callback

  getGGNFromExistingGuides: (callback) =>
    @bridge.getDocumentInfo (info) =>
      xString = ''
      yString = ''
      string  = ''

      prevHorizontal = if info.isSelection then info.offsetY else 0
      prevVertical = if info.isSelection then info.offsetX else 0
      guides = info.existingGuides

      if info.isSelection
        bounds =
          top:    info.offsetY
          left:   info.offsetX
          bottom: info.offsetY + info.height
          right:  info.offsetX + info.width
        guides = @consolidate([], info.existingGuides, { bounds: bounds })

      if guides
        guides.sort (a,b) =>
          a.location - b.location

        $.each guides, (index, guide) =>
          if guide.orientation == 'v'
            xString = "#{ xString }#{ guide.location - prevVertical }px | "
            prevVertical = guide.location
          if guide.orientation == 'h'
            yString = "#{ yString }#{ guide.location - prevHorizontal }px | "
            prevHorizontal = guide.location

        xString = "#{ xString }(v#{ 'p' if @data.settings.calculation == 'pixel' })" if xString != ''
        yString = "#{ yString }(h#{ 'p' if @data.settings.calculation == 'pixel' })" if yString != ''

        string += xString
        string += '\n' if xString
        string += yString
        string += '\n' if yString
        string += '\n# ' + @messages.gnStringFromExistingGuides() if xString or yString

      callback string

  # Add an array of guides to the document.
  #
  #  guides - Array: Guides to add.
  #
  # Returns the original guide array.
  addGuides: (guides, callback) =>
    @bridge.addGuides guides, callback

  # Create a single guide in the location specified
  #
  # Returns the resulting GuideGuide Notation string
  quickGuide: (type) =>
    return unless type in ["top", "bottom", "horizontalMidpoint", "left", "right", "verticalMidpoint"]

    orientation = before = after = notation = ""

    switch type
      when "top", "bottom", "horizontalMidpoint"
        orientation = "h"
      when "left", "right", "verticalMidpoint"
        orientation = "v"

    switch type
      when "right", "bottom", "horizontalMidpoint", "verticalMidpoint"
        before = "~"

    switch type
      when "top", "left", "horizontalMidpoint", "verticalMidpoint"
        after = "~"

    notation = "#{ before }|#{ after }(#{ orientation }#{ @calculationType() })"

    @addGuidesFromNotation notation
    return notation

  # Test a string to see if it is valid.
  #
  # Returns a Boolean
  formIsValid: (data) =>
    string = @stringifyFormData(data.contents)
    GridNotation.test(string).length is 0

  # Add guides to the document based on the form
  #
  # Returns an Array of guides
  makeGridFromForm: (data, callback) =>
    string = @stringifyFormData(data.contents)
    @addGuidesFromNotation string, 'grid', callback

  # Add guides to the document from a set
  #
  # Returns an Array of guides
  makeGridFromSet: (sets, callback) =>
    tasks = sets.length
    for s in sets
      set = @getSets { set: s.id, group: s.group }
      @addGuidesFromNotation set.string, 'set', =>
        tasks--
        callback() if tasks is 0 and callback

  # Create a grid from the Custom form
  #
  # Returns an Array of guides
  makeGridFromCustom: (string, callback) =>
    @addGuidesFromNotation string, 'custom', callback

  # Remove all or a portion of the guides.
  #
  # Returns an Array of remaining guides
  clearGuides: =>
    guides = []
    @bridge.getDocumentInfo (info) =>
      if info.isSelection
        bounds =
          top:    info.offsetY
          left:   info.offsetX
          bottom: info.offsetY + info.height
          right:  info.offsetX + info.width
        guides = @consolidate([], info.existingGuides, { bounds: bounds, invert: true })
        @log guides

      @bridge.resetGuides(guides)

      @recordUsage "clear"

  # Take the current grid form data and calculate the results.
  #
  # Returns an Object.
  preCalculateGrid: (notation, callback) =>
    data = { guides: [] }
    guides = []
    return callback(data) unless @session.document
    guides = GridNotation.parse notation, @session.document
    data.guides = @consolidate(@session.document.existingGuides, guides)
    callback(data)

  # Get the option value that corresponds to the calculation type of the app
  #
  # Returns a String
  calculationType: =>
    if @data.settings.calculation == 'pixel' then 'p' else ''

  # Truthy if the environment is set to "demo"
  #
  # Returns a Boolean
  isDemo: =>
    @data.application.env == 'demo'

  # Open a url in the default browser
  #
  #  url - String: URL to open
  #
  # Returns nothing
  openURL: (url) =>
    @bridge.openURL url

  # Toggle guide visibility.
  #
  # Returns nothing.
  toggleGuides: =>
    @bridge.toggleGuides()

  # Log a message
  #
  #  args - an array of messages to print
  #
  # Returns nothing
  log: (args...) =>
    @bridge.log args

  # Switch themes and add the theme to a list for later use
  #
  #   colors           - an object of colors
  #     background     - background color
  #     button         - buttons and inputs
  #     buttonHover    - button and input hover
  #     buttonSelect   - button and input selected
  #     text           - text
  #     highlight      - primary button and links
  #     highlightHover - primary button and links hover
  #     danger         - highlight for negative/warning actions
  #
  # Returns nothing
  updateTheme: (colors) =>
    @bridge.updateTheme colors
