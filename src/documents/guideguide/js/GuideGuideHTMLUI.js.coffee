class window.GuideGuideHTMLUI

  # The GuideGuide HTML user interface. This should only contain UI concerns and
  # not anything related to GuideGuide's logic.
  constructor: (@UI) ->
    @UI.removeClass 'hideUI'
    console.log "Init UI"
