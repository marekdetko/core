class window.GuideGuideHTMLUI

  # The GuideGuide HTML user interface. This should only contain UI concerns and
  # not anything related to GuideGuide's logic.
  constructor: (@UI) ->
    @UI.removeClass 'hideUI'
    console.log "HTML UI Loaded"

  # Update all of the ui with local messages.
  #
  # Returns nothing.
  localizeUI: =>
    $elements = $('[data-localize]')
    $elements.each (index, el) =>
      $(el).text @messages[$(el).attr('data-localize')]()
