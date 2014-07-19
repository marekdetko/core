window.initGuideGuide = (bridge) ->
  window.GuideGuide = new GuideGuideCore { bridge: bridge }, (gg) ->
    gg.log "GuideGuide Ready"

$ ->
  $('.tooltipped').tipsy
    gravity: -> $(this).attr('data-tip-dir') || 'n'
    delayIn: 1000
