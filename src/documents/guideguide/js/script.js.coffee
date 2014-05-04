window.initGuideGuide = (bridge) ->
  window.GuideGuide = new GuideGuideCore { bridge: bridge }, (gg) ->
    gg.log "GuideGuide Ready"
