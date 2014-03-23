class window.GuideGuideCore
  siteUrl: 'http://guideguide.me'
  env:     'production'
  bridge: {}
  data: {}

  # Create a new GuideGuide instance
  #
  #  args        - Object: Specify options for GuideGuide.
  #    .bridge   - Object: Contains all the necessary methods for GuideGuide to function in the host application.
  #    .messages - Object: Contains all the necessary messages for GuideGuide.
  #    .locale   - String: Locale string that GuideGuide will use to pick its language.
  #    .siteUrl  - String: Url for guideguide.me. Specify this to switch to a dev url.
  #
  constructor: (args, callback) ->
    return if !args.bridge?
    args.locale ||= "en_us"

    @bridge   = args.bridge
    @messages = args.messages

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
      @bridge.log data
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
    @bridge.log 'Checking for updates'
    $.ajax
      type: 'GET'
      url: "#{ @siteUrl }/panel/#{ @data.application.id }"
      data:
        version: @data.application.guideguideVersion || '0.0.0'
        i18n: @data.application.localization
      success: (data) =>
        callback(data)
      error: (error) =>
        @bridge.log error
        callback({ hasUpdate: false })

  # Save GuideGuide's data, including usage data, user preferences, and sets
  #
  #  data - optional data to add specifically. used to update settings externally.
  #
  # Returns nothing.
  saveData: (data) =>
    @data = $.extend true, @data, data if data
    @bridge.setData @data

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

  # Generate a set ID based on a hash of the GGN. This will allow us to detect
  # duplicates easier. Since this is a dependency situation, leave it up to
  # the bridge to provide the utility.
  #
  #   set - Object: Set object used as a seed for the ID hash
  #
  # returns a String
  generateSetID: (set) =>
    @bridge.toHash("#{ set.name }#{ set.string }")

  # Get info about the current state of the active document.
  #
  # Returns an Object.
  getDocumentInfo: =>
    @bridge.getDocumentInfo()

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
        inBounds = true  if e.orientation == "horizontal" and args.bounds.bottom >= e.location >= args.bounds.top
        inBounds = true  if e.orientation == "vertical" and args.bounds.right >= e.location >= args.bounds.left
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

  # Determine whether the value in the form is valid
  #
  #   value       - String: string to be validated
  #   integerOnly - Boolean: if true, only integers are valid
  #
  # Returns a Boolean
  validateInput: (value, integerOnly = false) =>
    return true if value == ""
    units = value.split ','
    units = units.filter (unit) =>
      u = new Unit(unit,integerOnly)
      !u.isValid

    units.length == 0

  # Create a GuideGuide Notation string from the contents for the grid form
  #
  #  data - Object: Form data
  #
  # Returns a GuideGuide Notation string
  stringifyFormData: (data) =>
    string1 = @stringifyGridPlane
      count:          data.countColumn
      width:          data.widthColumn
      gutter:         data.gutterColumn
      firstMargin:    data.marginLeft
      lastMargin:     data.marginRight
      columnMidpoint: data.midpointColumn || false
      gutterMidpoint: data.midpointColumnGutter || false
      orientation:    'v'
      position:       @data.settings.verticalPosition
      remainder:      @data.settings.verticalRemainder
    string2 = @stringifyGridPlane
      count:          data.countRow
      width:          data.widthRow
      gutter:         data.gutterRow
      firstMargin:    data.marginTop
      lastMargin:     data.marginBottom
      columnMidpoint: data.midpointRow || false
      gutterMidpoint: data.midpointRowGutter || false
      orientation:    'h'
      position:       @data.settings.horizontalPosition
      remainder:      @data.settings.horizontalRemainder

    "#{ string1 }#{ if string1 and string2 then '\n' else '' }#{ string2 }"

  # TODO: Move this to GuideGuideNotation.coffee
  # TODO: Remove redundant pipes
  # TODO: Send back an empty string if empty data is provided
  # Convert grid data to a GuideGuide Notation string.
  # This is a simple grid, with margins, equal columns and gutters.
  #
  #  data   - data from the form
  #
  # Returns a string
  stringifyGridPlane: (data) =>
    data ||= {}
    data.count            = parseInt data.count
    data.width          ||= ''
    data.gutter         ||= ''
    data.firstMargin    ||= ''
    data.lastMargin     ||= ''
    data.columnMidpoint ||= false
    data.gutterMidpoint ||= false
    data.orientation    ||= 'v'
    data.position       ||= 'first'
    data.remainder      ||= 'last'
    firstMargString       = ''
    varString             = ''
    gridString            = ''
    lastMargString        = ''
    optionsString         = ''

    # Set up the margins, if they exist
    firstMargString = '|' + data.firstMargin.replace(/\s/g,'').split(',').join('|') + '|' if data.firstMargin
    lastMargString  = '|' + data.lastMargin.replace(/\s/g,'').split(',').join('|') + '|' if data.lastMargin

    # Set up the columns and gutters variables, if they exist
    if data.count or data.width
      column = if data.width then data.width else '~'
      if data.columnMidpoint
        unit   = new Unit data.width if data.width
        column = if data.width then "#{ unit.value/2 }#{ unit.type }|#{ unit.value/2 }#{ unit.type }" else "~|~"

      varString += "$#{ data.orientation }=|#{ column }|\n"

      if data.gutter and data.count != 1
        gutter = if data.gutter then data.gutter else '~'
        if data.gutterMidpoint
          unit   = new Unit data.gutter if data.gutter
          gutter = if data.gutter then "#{ unit.value/2 }#{ unit.type }|#{ unit.value/2 }#{ unit.type }" else "~|~"

        varString  = "$#{ data.orientation }=|#{ column }|#{ gutter }|\n"
        varString += "$#{ data.orientation }C=|#{ column }|\n" if data.count

    # Set up the grid string
    if data.count or data.width
      gridString += "|$#{ data.orientation }"
      gridString += "*" if data.count != 1
      gridString += data.count - 1 if data.count > 1 and data.gutter
      gridString += data.count if data.count > 1 and !data.gutter
      gridString += "|"
      gridString += "|$#{ data.orientation }#{ if data.gutter then 'C' else '' }|" if data.count > 1 and data.gutter

    if (!data.count and !data.width) and data.firstMargin
      gridString += "|"

    if (!data.count and !data.width) and (data.firstMargin or data.lastMargin)
      gridString += "~"

    if (!data.count and !data.width) and data.lastMargin
      gridString += "|"

    if data.firstMargin or data.lastMargin or data.count or data.width
      # Set up the options
      optionsString += "("
      optionsString += data.orientation.charAt(0).toLowerCase()
      optionsString += data.remainder.charAt(0).toLowerCase()
      optionsString += "p" if @data.settings.calculation == "pixel"
      optionsString += ")"

    leftBuffer = rightBuffer = ""
    if data.width
      leftBuffer = "~" if data.position == "last" or data.position == "center"
      rightBuffer = "~" if data.position == "first" or data.position == "center"

    # Bring it all together
    "#{ varString }#{ firstMargString }#{ leftBuffer }#{ gridString }#{ rightBuffer }#{ lastMargString }#{ optionsString }".replace(/\|+/g, "|")

  # TODO: Move this to GuideGuideNotation.coffee
  # Turn a GuideGuide object into a collection of guides.
  #
  #   ggn  - GuideGuide Object to pull guides from
  #   info - Document info
  #
  # Returns a collection of guides
  getGuidesFromGGN: (ggn, info) =>
    guides = []

    $.each ggn.grids, (index,grid) =>
      guideOrientation = grid.options.orientation.value
      wholePixels      = grid.options.calculation? == 'pixel'
      fill             = grid.gaps.fill if grid.gaps.fill
      measuredWidth    = if guideOrientation == 'horizontal' then info.height else info.width
      measuredWidth    = grid.options.width.value if grid.options.width
      offset           = if guideOrientation == 'horizontal' then info.offsetY else info.offsetX

      # Calculate and set the value percent gaps. This calculation is based on
      # the document or selection width, less the margin area if it is greater
      # zero.
      if grid.gaps.percents
        $.each grid.gaps.percents, (index,gap) =>
          percentValue = measuredWidth*(gap.value/100)
          Math.floor percentValue if wholePixels
          gap.convertPercent percentValue

      # Subtract arbitrary gap value from non-margin area to get wildcard area,
      # which is used to calculate the size of the wildcards
      arbitrarySum = if grid.gaps.arbitrary then @sum grid.gaps.arbitrary, 'value' else 0
      wildcardArea = measuredWidth - arbitrarySum

      if wildcardArea and fill
        # The grid contains a fill, figure out how many times it will fit and generate
        # new gaps for it.
        fillIterations = Math.floor wildcardArea/fill.sum(ggn.variables)
        fillCollection = []
        fillWidth = 0

        for i in [1..fillIterations]
          if fill.isVariable
            fillCollection = fillCollection.concat ggn.variables[fill.id].all
            fillWidth += @sum ggn.variables[fill.id].all, 'value'
          else
            newGap = fill.clone()
            newGap.isFill = false
            fillCollection.push newGap
            fillWidth += newGap.value

        wildcardArea -= fillWidth

      if wildcardArea and grid.gaps.wildcards
        # If the grid contains wildcards, figure out and set how wide they are
        wildcardWidth = wildcardArea/grid.gaps.wildcards.length

        if wholePixels
          wildcardWidth = Math.floor wildcardWidth
          remainderPixels = wildcardArea % grid.gaps.wildcards.length

        $.each grid.gaps.wildcards, (index,gap) =>
          gap.value = wildcardWidth

      if remainderPixels
        # If this is a pixel specific grid, whole pixel math usually results in remainder pixels.
        # This decides where amongst the wildcards the remainders should be distributed.
        remainderOffset = 0

        remainderOffset = Math.floor (grid.gaps.wildcards.length - remainderPixels)/2 if grid.options.remainder.value == 'center'
        remainderOffset = grid.gaps.wildcards.length - remainderPixels if grid.options.remainder.value == 'last'

        $.each grid.gaps.wildcards, (index, gap) =>
          gap.value++ if index >= remainderOffset && index < remainderOffset + remainderPixels

      # Figure out where the grid starts
      insertMarker = if grid.options.offset then grid.options.offset.value else offset

      # Expand any fills
      $.each grid.gaps.all, (index,item) =>
        grid.gaps.all = grid.gaps.all.slice(0, index).concat fillCollection, grid.gaps.all.slice(index + 1) if item.isFill

      # Add all the guides
      $.each grid.gaps.all, (index,item) =>
        if item == '|'
          guides.push obj =
            location: insertMarker
            orientation: guideOrientation
        else
          insertMarker += item.value

    guides

  # Add guides to the stage from GuideGuide Notation.
  #
  #   ggn    - String: GuideGuide Notation
  #   source - String: Action executed to add guides, used for recording usage.
  #
  # Returns the array of guides generated from the GuideGuide Notation.
  addGuidesfromGGN: (ggn, source) =>
    info = @bridge.getDocumentInfo()

    return unless info and info.hasOpenDocuments
    guides = []

    guides = @getGuidesFromGGN new GGN(ggn), info
    guides = @consolidate(info.existingGuides, guides)

    @recordUsage source, guides.length
    # TODO: @bridge.resetGuides()
    @addGuides guides
    guides

  getGGNFromExistingGuides: (callback) =>
    info    = @bridge.getDocumentInfo()
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
        if guide.orientation == 'vertical'
          xString = "#{ xString }#{ guide.location - prevVertical }px | "
          prevVertical = guide.location
        if guide.orientation == 'horizontal'
          yString = "#{ yString }#{ guide.location - prevHorizontal }px | "
          prevHorizontal = guide.location

      xString = "#{ xString }(v#{ 'p' if @data.settings.calculation == 'pixel' })" if xString != ''
      yString = "#{ yString }(h#{ 'p' if @data.settings.calculation == 'pixel' })" if yString != ''

      string += xString
      string += '\n' if xString
      string += yString
      string += '\n' if yString
      string += '\n# ' + @messages.ggnStringFromExistingGuides() if xString or yString

    callback string

  # Add an array of guides to the document.
  #
  #  guides - Array: Guides to add.
  #
  # Returns the original guide array.
  addGuides: (guides) =>
    @bridge.addGuides(guides)
    guides

  # Create a single guide in the location specified
  #
  # Returns the resulting GuideGuide Notation string
  quickGuide: (type) =>
    return unless type in ["top", "bottom", "horizontalMidpoint", "left", "right", "verticalMidpoint"]

    orientation = before = after = ggn = ""

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

    ggn = "#{ before }|#{ after }(#{ orientation }#{ @calculationType() })"
    @addGuidesfromGGN ggn
    return ggn

  # TODO: confirm this is valid via a GuideGuide Notation validate method
  # Add guides to the document based on the form
  #
  # Returns an Array of guides
  makeGridFromForm: (data) =>
    @addGuidesfromGGN @stringifyFormData(data.contents), 'grid'

  # Add guides to the document from a set
  #
  # Returns an Array of guides
  makeGridFromSet: (set, group) =>
    set = @getSets { set: set, group: group }
    @addGuidesfromGGN set.string, 'set'

  # Create a grid from the Custom form
  #
  # Returns an Array of guides
  makeGridFromCustom: (string) =>
    @addGuidesfromGGN string, 'custom'

  # Remove all or a portion of the guides.
  #
  # Returns an Array of remaining guides
  clearGuides: =>
    guides = []
    info = @bridge.getDocumentInfo()
    return guides unless info.hasOpenDocuments

    @bridge.resetGuides()

    if info.isSelection
      bounds =
        top:    info.offsetY
        left:   info.offsetX
        bottom: info.offsetY + info.height
        right:  info.offsetX + info.width
      guides = @consolidate([], info.existingGuides, { bounds: bounds, invert: true })
      @addGuides guides

    @recordUsage "clear"
    guides


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

  # Calculate the sum of an array of values
  #
  #   array - array to be added together
  #   key   - optional key value to be used if array contains objects
  #
  # Returns a Number
  sum: (array, key = null) ->
    total = 0
    $.each array, (index,value) =>
      if key
        total += array[index][key] if array[index][key]
      else
        total += array[index]
    total

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
