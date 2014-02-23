class window.GuideGuideHTMLUI

  # The GuideGuide HTML user interface. This should only contain UI concerns and
  # not anything related to GuideGuide's logic.
  constructor: (args, @panel) ->
    return if !@panel
    @panel.on 'guideguide:exitform', @onExitGridForm
    @panel.on 'guideguide:exitcustom', @onExitCustomForm
    @panel.on 'click', '.js-tabbed-page-tab', @onTabClick
    @panel.on 'click', '.js-toggle-guide-visibility', @onToggleGuides

    @panel.removeClass 'hideUI'
    @updateTheme args.theme
    @panel.find('textarea').autosize();
    console.log "HTML UI Loaded"

  # Update all of the ui with local messages.
  #
  # Returns nothing.
  localizeUI: =>
    $elements = $('[data-localize]')
    $elements.each (index, el) =>
      $(el).text @messages[$(el).attr('data-localize')]()

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
      @selectTab @panel, filter

    $('#guideguide').trigger "guideguide:enter#{ enterPage }"

  # Select the tab that has the given tab-filter. If there is none, select the first tab.
  #
  # $container - (jQuery object) .js-tabbed-pages element
  # name       - (String) content of the data-page attribute. this item will be selected
  #
  # Returns nothing.
  selectTab: ($container, name) =>
    $container.find("[data-page]").removeClass 'is-selected'

    if name
      filter = -> $(this).attr('data-page') is name
      tab = $container.find('.js-tabbed-page-tab').filter filter
      tabBucket = $container.find('.js-tabbed-page').filter filter
    else
      tab = $container.find '.js-tabbed-page-tab:first'
      tabBucket = $container.find '.js-tabbed-page:first'

    # Select tab and bucket
    tab.addClass 'is-selected'
    tabBucket.addClass 'is-selected'

  # Toggle guide visibility.
  #
  # Returns nothing.
  onToggleGuides: (event) =>
    event.preventDefault()
    GuideGuide.log "Toggle guides"
    GuideGuide.toggleGuides()

  # When this install of GuideGuide is out of date, alert the user.
  #
  # Returns nothing.
  showUpdateIndicator: (data) =>
    @panel.addClass 'has-update'
    button = @panel.find '.js-has-update-button'
    button.attr 'data-title', data.title
    button.attr 'data-message', data.message

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
