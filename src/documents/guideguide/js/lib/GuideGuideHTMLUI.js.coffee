class window.GuideGuideHTMLUI
  core: {}

  # The GuideGuide HTML user interface. This should only contain UI concerns and
  # not anything related to GuideGuide's logic.
  constructor: ->
    @panel = $('#guideguide')
    @panel.on 'guideguide:exitform', @onExitGridForm
    @panel.on 'guideguide:exitcustom', @onExitCustomForm
    @panel.on 'click', '.js-tabbed-page-tab', @onTabClick
    @panel.on 'click', '.js-alert-body .js-button', @onAlertButtonClick
    @panel.on 'click', '.js-link', @onClickLink
    @panel.on 'click', '.js-toggle-guide-visibility', @onToggleGuides
    @panel.on 'click', '.js-action-bar .js-top', @onClickTopGuide
    @panel.on 'click', '.js-action-bar .js-bottom', @onClickBottomGuide
    @panel.on 'click', '.js-action-bar .js-left', @onClickLeftGuide
    @panel.on 'click', '.js-action-bar .js-right', @onClickRightGuide
    @panel.on 'click', '.js-action-bar .js-horizontal-midpoint', @onClickHorizontalMidpoint
    @panel.on 'click', '.js-action-bar .js-vertical-midpoint', @onClickVerticalMidpoint
    @panel.on 'click', '.js-action-bar .js-clear', @onClickClearGuides
    @panel.on 'focus', '.js-input input, .js-input textarea', @onInputFocus
    @panel.on 'blur', '.js-input input, .js-input textarea', @onInputBlur
    @panel.on 'click', '.js-grid-form .js-clear-form', @onClickClearForm
    @panel.on 'mouseover', '.js-grid-form [data-distribute] .js-iconned-input-button', @onMouseOverDistributeIcon
    @panel.on 'mouseout', '.js-grid-form [data-distribute] .js-iconned-input-button', @onMouseOutDistributeIcon
    @panel.on 'click', '.js-dropdown', @onToggleDropdown
    @panel.on 'click', '.js-dropdown .js-dropdown-item', @onClickDropdownItem
    @panel.on 'click', '.js-import-sets', @onShowImporter
    @panel.on 'click', '.js-cancel-import', @onClickCancelImport
    @panel.on 'click', '.js-export-sets', @onClickExportSets
    @panel.on 'click', '.js-import', @onClickImportSets
    @panel.on 'click', '.js-input-shell', @onClickInputBackground
    @panel.on 'click', '.js-help-target', @onClickHelpTarget
    @panel.on 'click', '.js-has-update-button', @onClickHasUpdateButton
    @panel.on 'click', '.js-check-for-updates', @onClickCheckForUpdates
    @panel.on 'click', '.js-sets-form .js-delete-set', @onClickDeleteSet
    @panel.on 'click', '.js-grid-form .js-new-set', @onClickShowGridNewSetForm
    @panel.on 'click', '.js-cancel-set', @onClickHideNewSetForm
    @panel.on 'click', '.js-checkbox', @onClickCheckbox
    @panel.on 'blur', '.js-grid-form .js-grid-form-input', @onBlurFormInput
    @panel.on 'click', '.js-grid-form [data-distribute] .js-iconned-input-button', @onClickDistributeIcon
    @panel.on 'click', '.js-sets-form .js-set-select', @onSelectSet
    @panel.on 'focus', '.js-custom-form .js-custom-input', @onFocusCustomForm
    @panel.on 'blur', '.js-custom-form .js-custom-input', @onBlurCustomForm
    @panel.on 'click', '.js-grid-form .js-save-set', @onClickSaveSetFromGrid
    @panel.on 'click', '.js-grid-form .js-make-grid', @onClickMakeGridFromForm
    @panel.on 'click', '.js-custom-form .js-new-set', @onClickShowCustomNewSetForm
    @panel.on 'click', '.js-sets-form .js-new-set', @onClickShowSetsNewSetForm
    @panel.on 'click', '.js-custom-form .js-save-set', @onClickSaveSetFromCustom
    @panel.on 'click', '.js-sets-form .js-make-grid', @onClickMakeGridFromSet
    @panel.on 'click', '.js-custom-form .js-make-grid', @onClickMakeGridFromCusom
    @panel.on 'click', '.js-sets-form .js-edit-set', @onClickEditSet
    @panel.on 'precalculate:form', @precalculateForm

  init: (core) =>
    @core = core
    @messages = @core.messages

    @panel.removeClass('hideUI')
    @panel.find('textarea').autosize()

  # Update all of the ui with local messages.
  #
  # Returns nothing.
  localizeUI: =>
    $elements = $('[data-localize]')
    $elements.each (index, el) =>
      $(el).text @messages[$(el).attr('data-localize')]()

  # When an input gains focus, outline it's parent and get the most up to date
  # document info.
  #
  # Returns nothing.
  onInputFocus: (event) =>
    $(event.currentTarget).closest('.js-input').addClass 'is-focused'
    $(event.currentTarget).closest('.js-input').removeClass 'is-invalid'
    $(event.currentTarget).closest('.js-grid-form').find('.js-make-grid').addClass 'js-enter-click'
    @panel.on 'keypress.enter', @onInputKeypress

  # When an input blurs remove its outline.
  #
  # Returns nothing.
  onInputBlur: (event) =>
    $(event.currentTarget).closest('.js-input').removeClass 'is-focused'
    $('.js-enter-click').removeClass 'js-enter-click'
    $('.js-grid-form').toggleClass 'is-showing-clear-button', @formIsFilledOut()
    @panel.off '.enter'

  # Count the guides that will be added as a result of the current form inputs.
  #
  # Returns nothing.
  precalculateForm: (event) =>
    @updateGuideCounter('.js-count-form', @core.stringifyFormData(@getFormData().contents))

  # Update the Make grid button with the number of guides that will be added
  # when creating the grid.
  #
  # Returns nothing.
  updateGuideCounter: (button, notation) =>
    @core.preCalculateGrid notation, (data) ->
      str = ""
      str = " (+#{ data.guides.length })" if data and data.guides.length > 0
      $(button).text str
      str

  # Determine if the form has been has been filled out in any way.
  #
  # Returns a boolean.
  formIsFilledOut: ->
    modified = false
    (modified = true if $.trim($(field).val()).length > 0) for field in $('.js-grid-form .js-grid-form-input')
    (modified = true if $(box).hasClass('checked')) for box in $('.js-grid-form .js-checkbox')
    modified

  # Clear all values of the grid form.
  #
  # Returns nothing.
  onClickClearForm: (event) =>
    event.preventDefault()
    $('.is-showing-clear-button').removeClass 'is-showing-clear-button'
    $('.js-grid-form .js-grid-form-input').val ''
    $('.js-grid-form .js-checkbox').removeClass 'checked'
    setTimeout @updateGuideCounter('.js-count-form', @core.stringifyFormData(@getFormData().contents)), 100

  # When enter is pressed, render the grid.
  #
  # Returns nothing.
  onInputKeypress: (event) => $('.js-enter-click').click() if event.which is 13

  # Outline an invalid input with red.
  #
  # Returns nothing.
  markInvalid: ($input) => $input.closest('.js-input').addClass 'is-invalid'

  # Clear any error reporting text and reset the Custom forms's validation
  #
  # Returns nothing.
  onFocusCustomForm: (event) =>
    $input = $(event.currentTarget)
    $input.val $input.val().replace(/[\{\}]|\[.*?\]|^#.*?$/gm, '').replace(/\s+$/g,'')

  # Validate the contents of the Custom form
  #
  # Returns nothing.
  onBlurCustomForm: (event) =>
    keys = [
      'gnUnrecognized'
      'gnNoGrids'
      'gnNoFillWildcards'
      'gnOneFillPerGrid'
      'gnFillInVariable'
      'gnUndefinedVariable'
    ]
    $input = $(event.currentTarget)
    if string = $input.val().replace /^\s+|\s+$/g, ''
      string = GridNotation.clean $input.val()
      errors = GridNotation.test($input.val())
      if errors.length > 0
        @markInvalid $input.closest('.js-input')
        string += "\n\n"
        (string += "# #{ code }. #{ @messages[keys[code-1]]() }\n") for code in errors
      else
        @updateGuideCounter('.js-count-custom', string)
      $input.val string
      $input.trigger('autosize.resize')

  # Highlight all field icons of similar type
  #
  # Returns nothing.
  onMouseOverDistributeIcon: (event) =>
    $form   = $(event.currentTarget).closest '.js-grid-form'
    type    = $(event.currentTarget).closest('[data-distribute]').attr 'data-distribute'
    $fields = @filteredList $form.find('.js-grid-form-iconned-input'), type
    $fields.addClass 'distribute-highlight'

  # Remove highlight from field icons
  #
  # Returns nothing.
  onMouseOutDistributeIcon: (event) =>
    @panel.find('.distribute-highlight').removeClass('distribute-highlight')

  # When exiting the Custom form, clear the new set form.
  #
  # Returns nothing
  onExitGridForm: =>
    @hideNewSetForm()

  # When exiting the Custom form, clear it.
  #
  # Returns nothing
  onExitCustomForm: =>
    @hideNewSetForm()

  # Hide the new set form and clear any data if it exists.
  #
  # Returns nothing.
  hideNewSetForm: =>
    @panel.find('.js-grid-form').find('.js-set-name').val('')
    @panel.find('.js-grid-form').find('.js-set-id').val('')
    @panel.removeClass('is-showing-new-set-form')

  # Behavior for navigating a collection of "pages" via a set of tabs
  #
  # Returns nothing.
  onTabClick: (event) =>
    event.preventDefault()

    exitPage   = @panel.find('.js-tabbed-page-tab.is-selected').attr 'data-page'
    enterPage  = $(event.currentTarget).attr 'data-page'

    return if enterPage == exitPage

    $('#guideguide').trigger "guideguide:exit#{ exitPage }"

    if filter = enterPage
      @selectTab filter

    $('#guideguide').trigger "guideguide:enter#{ enterPage }"

  # Select the tab that has the given tab-filter. If there is none, select the first tab.
  #
  # name - (String) content of the data-page attribute. this item will be selected
  #
  # Returns nothing.
  selectTab: (name) =>
    @panel.find("[data-page]").removeClass 'is-selected'

    if name
      filter = -> $(this).attr('data-page') is name
      tab = @panel.find('.js-tabbed-page-tab').filter filter
      tabBucket = @panel.find('.js-tabbed-page').filter filter
    else
      tab = $container.find '.js-tabbed-page-tab:first'
      tabBucket = @panel.find '.js-tabbed-page:first'

    # Select tab and bucket
    tab.addClass 'is-selected'
    tabBucket.addClass 'is-selected'

  # Toggle checkboxes
  #
  # Returns nothing
  onClickCheckbox: (event) =>
    event.preventDefault()
    $checkbox = $(event.currentTarget)
    $checkbox.toggleClass 'checked'
    $form  = $checkbox.closest '.js-grid-form'
    @core.formChanged @getFormData()
    $('.js-grid-form').toggleClass 'is-showing-clear-button', @formIsFilledOut()
    setTimeout @updateGuideCounter('.js-count-form', @core.stringifyFormData(@getFormData().contents)), 100

  # Updates the text in the custom field and resizes it
  #
  # Returns nothing
  updateCustomField: (text) =>
    @panel.find('.js-custom-input').val(text).trigger('autosize.resize')

  # When a field is unfocused, validate its contents
  #
  # Returns noting.
  onBlurFormInput: (event) =>
    @validateInput $(event.currentTarget), => @panel.trigger 'precalculate:form'

  validateInput: ($input, callback) =>
    return (callback() if callback) if $.trim($input.val()) is ""
    int = false

    if $input.attr 'data-integer'
      val = Math.round parseFloat $input.val()
      $input.val val if val
      int = true
    else
      @core.getInputFormat $input.val(), (val) -> $input.val(val)

    if !@core.validateInput $input.val(), int
      @markInvalid $input
    else
      setTimeout @core.formChanged(@getFormData()), 100

    callback() if callback

  # When one of the input icons is clicked, change all fields of the same type
  # to that value
  #
  # Returns nothing.
  onClickDistributeIcon: (event) =>
    event.preventDefault()
    $form  = $(event.currentTarget).closest '.js-grid-form'
    $input = $(event.currentTarget).closest '.js-grid-form-iconned-input'
    $field = $input.find('.js-grid-form-input')
    @validateInput $field, =>
      return if $input.hasClass 'is-invalid'
      value   = $field.val()
      type    = $input.attr 'data-distribute'
      $fields = @filteredList $form.find('.js-grid-form-iconned-input'), type
      $fields.find('.js-grid-form-input').val value
      @core.formChanged @getFormData()
      @panel.trigger 'precalculate:form'

  # Toggle dropdown visibilty
  #
  # Returns nothing.
  onToggleDropdown: (event) =>
    event.preventDefault()

    $dropdown = $(event.currentTarget)
    if $dropdown.hasClass 'is-active'
      $dropdown.removeClass 'is-active'
    else
      $('.js-dropdown').removeClass 'is-active'
      $dropdown.addClass 'is-active'
      $list = $dropdown.find('.js-dropdown-list')
      visibleBottom = $('.js-settings-list').scrollTop() + $('.js-settings-list').outerHeight()
      listBottom = $dropdown.position().top + $list.position().top + $list.outerHeight() + 3

      if listBottom > visibleBottom
        offset = listBottom - visibleBottom
        $('.js-settings-list').scrollTop $('.js-settings-list').scrollTop() + offset

  # Update settings and dropdown button when a dropdown item is clicked.
  #
  # Returns nothing.
  onClickDropdownItem: (event) =>
    event.preventDefault()
    $item     = $ event.currentTarget
    $dropdown = $item.closest '.js-dropdown'
    setting   = $dropdown.attr 'data-setting'
    value     = $item.attr 'data-value'
    value     = true if value is "true"
    value     = false if value is "false"

    $dropdown.find('.js-dropdown-button .js-value').text $item.text()
    data =
      settings: {}
    data.settings[setting] = value
    @core.saveData data

  # Display the correct settings in the Settings tab.
  #
  # Returns nothing.
  refreshSettings: (settings) =>
    $dropdowns = $('.js-dropdown')

    $dropdowns.each (index, el) =>
      $dropdown = $ el
      setting   = $dropdown.attr 'data-setting'
      value     = settings[setting]
      $selected = $dropdown.find("[data-value='#{ value }']")
      $dropdown.find('.js-dropdown-button .js-value').text @messages[$selected.attr('data-localize')]()

  # Show the set importer
  #
  # Returns nothing.
  onShowImporter: (event) =>
    event.preventDefault()
    return if @core.isDemo()
    @panel.addClass 'is-showing-importer'
    @panel.find('.js-import-input').val ''

  # Hide the set importer
  #
  # Returns nothing.
  hideImporter: =>
    @panel.removeClass 'is-showing-importer'

  # Dismiss the importer
  #
  # Returns nothing
  onClickCancelImport: (event) =>
    event.preventDefault()
    @panel.removeClass 'is-showing-importer'

  onClickExportSets: (event) =>
    event.preventDefault()
    @core.exportSets()

  onClickImportSets: (event) =>
    event.preventDefault()
    return if @core.isDemo()

    data = $(".js-import-input").val()

    # Is it a gist?
    if data.indexOf("gist.github.com") > 0
      id = data.substring data.lastIndexOf('/') + 1
      @core.importSets id
    else
      @core.importSets null

  # Show the indeterminate loader.
  #
  # Returns nothing
  showLoader: =>
    @panel.addClass 'is-loading'

  # Hide the indeterminate loader.
  #
  # Returns nothing
  hideLoader: =>
    @panel.removeClass 'is-loading'

  # Toggle guide visibility.
  #
  # Returns nothing.
  onToggleGuides: (event) =>
    event.preventDefault()
    @core.log "Toggle guides"
    @core.toggleGuides()

  # When an alert button is clicked, dismiss the alert and execute the callback
  #
  # Returns nothing.
  onAlertButtonClick: (event) =>
    event.preventDefault()
    @panel.find('.js-alert-title').text ''
    @panel.find('.js-alert-message').text ''
    @panel.removeClass 'has-alert'
    callback = $(event.currentTarget).attr('data-callback')
    GuideGuide[callback]()

  # When this install of GuideGuide is out of date, alert the user.
  #
  # Returns nothing.
  showUpdateIndicator: (data) =>
    @panel.addClass 'has-update'
    button = @panel.find '.js-has-update-button'
    button.attr 'data-title', data.title
    button.attr 'data-message', data.message

  # Handle clicks on the check for updates button
  #
  # Returns nothing.
  onClickCheckForUpdates: (event) =>
    event.preventDefault()
    @core.manualCheckForUpdates()

  # Show update details. Triggered from Core.
  #
  # Returns nothing.
  showUpdateInfo: =>
    $('.js-has-update-button').click()

  # Show update details. Triggerd from the UI.
  #
  # Returns nothing.
  onClickHasUpdateButton: (event) =>
    event.preventDefault()
    @core.alert
      title: $(event.currentTarget).attr 'data-title'
      message: $(event.currentTarget).attr 'data-message'

  # Delete a set and update the set list.
  #
  # Returns nothing.
  onClickDeleteSet: (event) =>
    event.preventDefault()
    $set = $(event.currentTarget).closest '.js-set'
    id = $set.attr 'data-id'
    group = $set.attr 'data-group'
    @core.deleteSet(group, id)

  # Fire save set event and pass it the contents of the grid form
  #
  # Returns nothing.
  onClickSaveSetFromGrid: (event) =>
    event.preventDefault()
    data = @getFormData()
    @markInvalid @panel.find('.js-grid-form .js-set-name').closest('.js-input') if data.name.length == 0
    return if @panel.find('.js-grid-form .js-input').filter('.is-invalid').length > 0
    @core.saveSet @getFormData()
    @hideNewSetForm()

  onClickSaveSetFromCustom: (event) =>
    event.preventDefault()
    $form = $('.js-custom-form')
    name = $form.find('.js-set-name').val()
    string = $('.js-custom-input').val().replace /^\s+|\s+$/g, ''
    @markInvalid $form.find('.js-set-name').closest('.js-input') if name.length == 0
    return if @panel.find('.js-custom-form .js-input').filter('.is-invalid').length > 0
    return if string.length == 0
    set =
      id: $('#guideguide').find('.js-set-id').val()
      name: name
      contents: string
    @core.saveSet set
    @hideNewSetForm()

  # Open Custom form with data from the set to be edited
  #
  # Returns nothing.
  onClickEditSet: (event) =>
    event.preventDefault()
    $set  = $(event.currentTarget).closest('.js-set')
    id    = $set.attr('data-id')
    group = $set.attr('data-group')
    set   = @core.getSets { set: id, group: group }
    $form = @panel.find('.js-custom-form')
    $form.find('.js-set-name').val(set.name)
    $form.find('.js-set-id').val(set.id)
    @showCustomSetForm(set.string)

  # Select a set in the sets list when it is clicked
  #
  # Returns nothing.
  onSelectSet: (event) =>
    event.preventDefault()
    $(event.currentTarget).closest('.js-set').toggleClass('is-selected')
    $selected = $('.js-set-list').find('.is-selected')
    notation = ""
    for set in $selected
      data =
        set: $(set).attr('data-id')
        group: $(set).attr('data-group')
      notation += "#{ @core.getSets(data).string }\n"
    @updateGuideCounter('.js-count-sets', notation)


  # Remove any sets in the markup and update the list with a new set items for
  # each set in the list.
  #
  # Returns nothing.
  refreshSets: (sets) =>
    $list = @panel.find('.js-set-list')
    $list.find('.js-set').remove()
    $.each sets, (index,set) =>
      item = $('.js-set-item-template').clone(true).removeClass('js-set-item-template')
      item.find('.js-set-item-name').html set.name
      item.attr 'data-group', "Default"
      item.attr 'data-id', set.id
      $list.append item

  # On the Custom page, display and focus new set name field, swap in save set
  # and cancel set buttons, hide make grid and new set buttons.
  #
  # Returns nothing.
  onClickShowGridNewSetForm: (event) =>
    event.preventDefault()
    @panel.addClass('is-showing-new-set-form')
    @panel.find('.js-grid-form').find('.js-set-name').focus()

  # Handle clicks on the new set button
  #
  # Returns nothing
  onClickShowCustomNewSetForm: (event) =>
    event.preventDefault()
    @showCustomSetForm()

  onClickShowSetsNewSetForm: (event) =>
    event.preventDefault()
    @core.getGGNFromExistingGuides (string) =>
      @core.log string
      @showCustomSetForm string

  # On the Grid page, display and focus new set name field, swap in save set
  # and cancel set buttons, hide make grid and new set buttons.
  #
  # Returns nothing.
  showCustomSetForm: (prefill = '') =>
    @panel.find('.js-custom-tab').click() if @panel.find('.js-sets-tab.is-selected').length
    @panel.addClass('is-showing-new-set-form')
    @updateCustomField prefill if prefill
    @panel.find('.js-custom-form').find('.js-set-name').focus()

  # On both forms, Hide new set name, swap out save set and cancel set buttons, show make
  # grid and new set buttons
  #
  # Returns nothing.
  onClickHideNewSetForm: (event) =>
    event.preventDefault()
    @hideNewSetForm()

  # Show the alert and fill its fields
  #
  #   title    - Array. The first value is the title to be used, and the second is the message.
  #   message  - Array of class strings for buttons. A button will be created for each
  #   buttons  - Array of IDs of button messages
  #
  # Returns nothing.
  alert: (args) =>
    @panel.find('.js-alert-title').text args.title
    @panel.find('.js-alert-message').html args.message
    @panel.find('.js-alert-actions').html ''

    $.each args.buttons, (i, value) =>
      data = args.buttons[i]
      button = $('.js-button-template').clone().removeClass('js-button-template')
      button.find('a')
        .text(if data.label then data.label else '')
        .addClass(if data.primary then 'primary' else '')
        .attr('data-callback', if data.callback then data.callback else '')
      @panel.find('.js-alert-actions').append button

    @panel.addClass 'has-alert'

  # Collect data from the grid form.
  #
  #   $form - jQuery object of the form to be used
  #
  # Returns an Object
  getFormData: =>
    $form = $('.js-grid-form')
    obj =
      name: $('.js-grid-form .js-set-name').val()
      contents: {}

    $fields = $form.find '.js-grid-form-input'
    $fields.each (index, element) ->
      key = $(element).attr 'data-type'
      obj.contents[key] = $(element).val()

    $checkboxes = $form.find '.js-checkbox'
    $checkboxes.each (index, element) ->
      key = $(element).attr 'data-type'
      obj.contents[key] = true if $(element).hasClass 'checked'
    obj

  # Open a exported sets url
  #
  # Returns nothing
  onClickLink: (event) =>
    event.preventDefault()
    url = $(event.currentTarget).attr 'href'
    @core.openURL url

  # Draw a guide at the top of the document/selection
  #
  # Return nothing.
  onClickTopGuide: (event) =>
    event.preventDefault()
    @core.quickGuide "top" if @core.allowGuideActions

  # Draw a guide at the bottom of the document/selection
  #
  # Return nothing.
  onClickBottomGuide: (event) =>
    event.preventDefault()
    @core.quickGuide "bottom" if @core.allowGuideActions

  # Draw a guide to the left of the document/selection
  #
  # Return nothing.
  onClickLeftGuide: (event) =>
    event.preventDefault()
    @core.quickGuide "left" if @core.allowGuideActions

  # Draw a guide to the right of the document/selection
  #
  # Return nothing.
  onClickRightGuide: (event) =>
    event.preventDefault()
    @core.quickGuide "right" if @core.allowGuideActions

  # Draw a guide at the horizontal midpoint of the document/selection
  #
  # Return nothing.
  onClickHorizontalMidpoint: (event) =>
    event.preventDefault()
    @core.quickGuide "horizontalMidpoint" if @core.allowGuideActions

  # Draw a guide at the vertical midpoint of the document/selection
  #
  # Return nothing.
  onClickVerticalMidpoint: (event) =>
    event.preventDefault()
    @core.quickGuide "verticalMidpoint" if @core.allowGuideActions

  # Handle clicks on the clear guides button.
  #
  # Returns nothing.
  onClickClearGuides: (event) =>
    event.preventDefault()
    @core.clearGuides() if @core.allowGuideActions

  # Create a grid from the Grid form
  #
  # Returns Nothing.
  onClickMakeGridFromForm: (event) =>
    event.preventDefault()
    data = @getFormData()
    return if @panel.find('.js-grid-form .js-input').filter('is-invalid') > 0
    return if !@core.formIsValid(data)
    @core.toggleAllowingGuideActions =>
      @core.makeGridFromForm data, =>
        @core.toggleAllowingGuideActions()

  # Create a grid from the Custom form
  #
  # Returns nothing.
  onClickMakeGridFromCusom: (event) =>
    event.preventDefault()
    $form  = @panel.find('.js-custom-form')
    string = @panel.find('.js-custom-input').val().replace(/^\s+|\s+$/g, '')
    return unless $form.find('.js-input.is-invalid').length == 0 and string
    @core.toggleAllowingGuideActions =>
      @core.makeGridFromCustom string, =>
        @core.toggleAllowingGuideActions()

  # Create a grid from a set
  #
  # Returns nothing.
  onClickMakeGridFromSet: (event) =>
    event.preventDefault()
    $selected = $('.js-set-list').find('.is-selected')
    return unless $selected.length
    sets = []
    for set in $selected
      sets.push
        id: $(set).attr 'data-id'
        group: $(set).attr 'data-group'
    @core.toggleAllowingGuideActions =>
      @core.makeGridFromSet sets, =>
        @core.toggleAllowingGuideActions()

  # When the input shell is clicked rather than the input inside, focus the
  # input.
  #
  # Returns nothing.
  onClickInputBackground: (event) =>
    return unless $(event.target).hasClass "js-input-shell"
    $inputs = $(event.currentTarget).find('input')
    $textAreas = $(event.currentTarget).find('textarea')

    $inputs.focus() if $inputs.length
    $textAreas.focus() if $textAreas.length

  # Hide and reveal help text.
  #
  # Returns nothing
  onClickHelpTarget: (event) =>
    event.preventDefault()
    $(event.currentTarget).closest('.js-help').toggleClass "is-helping"

  # Sort a list of form fields and return ones that match a filter
  #
  #    $list - list of objects to be filtered
  #    type  - type of form field to return
  #
  # Returns an Array of jquery objects
  filteredList: ($list,type) ->
    filter  = -> $(this).attr('data-distribute') is type
    $fields = $list.filter filter

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
    @panel
      .removeClass('dark-theme light-theme')
      .addClass("#{ colors.prefix || 'dark' }-theme")
    $("head").append('<style id="theme">') if !$("#theme").length
    $("#theme").text """
      #guideguide {
        color: #{ colors.text };
        background-color: #{ colors.background };
      }
      #guideguide a {
        color: #{ colors.text };
      }
      #guideguide a:hover {
        color: #{ colors.highlight };
      }
      #guideguide .nav a.is-selected {
        color: #{ colors.buttonSelect };
      }
      #guideguide .input {
        background-color: #{ colors.button };
      }
      #guideguide .input input, #guideguide .input textarea {
        color: #{ colors.text };
      }
      #guideguide .input.is-focused .input-shell {
        border-color: #{ colors.highlight };
      }
      #guideguide .input.is-invalid .input-shell {
        border-color: #{ colors.danger };
      }
      #guideguide .distribute-highlight .icon {
        color: #{ colors.highlight };
      }
      #guideguide .button {
        background-color: #{ colors.button };
      }
      #guideguide .button:hover {
        background-color: #{ colors.buttonHover };
        color: #{ colors.text };
      }
      #guideguide .button.primary {
        background-color: #{ colors.highlight };
        color: #eee;
      }
      #guideguide .button.primary:hover {
        background-color: #{ colors.highlightHover };
        color: #eee;
      }
      #guideguide .button-clear-guides:hover {
        background-color: #{ colors.danger };
      }
      #guideguide .set-list-set {
        background-color: #{ colors.button };
      }
      #guideguide .set-list-set:hover {
        background-color: #{ colors.buttonHover };
      }
      #guideguide .set-list-set:hover a {
        color: #{ colors.text };
      }
      #guideguide .set-list-set.is-selected {
        background-color: #{ colors.highlight };
        color: #eee;
      }
      #guideguide .set-list-set.is-selected a {
        color: #eee;
      }
      #guideguide .set-list-set.is-selected:hover {
        background-color: #{ colors.highlightHover };
      }
      #guideguide .dropdown.is-active .dropdown-button {
        background-color: #{ colors.highlight };
      }
      #guideguide .dropdown.is-active .dropdown-button:after {
        background-color: #{ colors.highlight };
      }
      #guideguide .dropdown.is-active .dropdown-button:hover, #guideguide .dropdown.is-active .dropdown-button:hover:after {
        background-color: #{ colors.highlightHover };
      }
      #guideguide .dropdown-button {
        background-color: #{ colors.button };
      }
      #guideguide .dropdown-button:before {
        border-color: #{ colors.text } transparent transparent;
      }
      #guideguide .dropdown-button:hover, #guideguide .dropdown-button:hover:after {
        background-color: #{ colors.buttonHover };
      }
      #guideguide .dropdown-button:hover {
        color: #{ colors.text };
      }
      #guideguide .dropdown-button:after {
        background-color: #{ colors.button };
        border-left: 2px solid #{ colors.background };
      }
      #guideguide .dropdown-item {
        background-color: #{ colors.button };
        border-top: 2px solid #{ colors.background };
      }
      #guideguide .dropdown-item:hover {
        color: #{ colors.text };
        background-color: #{ colors.buttonHover };
      }
      #guideguide .alert-body {
        background-color: #{ colors.background };
      }
      #guideguide .scrollbar .handle {
        background-color: #{ colors.buttonSelect };
      }
      #guideguide .importer {
        background-color: #{ colors.background };
      }
      #guideguide .loader-background {
        background-color: #{ colors.background };
      }
      """
