class window.GuideGuideHTMLUI

  # The GuideGuide HTML user interface. This should only contain UI concerns and
  # not anything related to GuideGuide's logic.
  constructor: (args, @UI) ->
    @UI.removeClass 'hideUI'
    @updateTheme args.theme
    console.log "HTML UI Loaded"

  # Update all of the ui with local messages.
  #
  # Returns nothing.
  localizeUI: =>
    $elements = $('[data-localize]')
    $elements.each (index, el) =>
      $(el).text @messages[$(el).attr('data-localize')]()

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
    @UI
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
