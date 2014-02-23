window.initGuideGuide = ->
  theme =
    prefix: 'dark'
    background: '#535353'
    button: '#464646'
    buttonHover: '#393939'
    buttonSelect: '#202020'
    text: '#eee'
    highlight: '#789ff7'
    highlightHover: '#608ef6'
    danger: '#c74040'

  window.UI = new GuideGuideHTMLUI { theme: theme }, $("#guideguide")
  window.Messages = new GuideGuideMessages Fauxtoshop.data.localization

  args =
    bridge: new GuideGuideHTMLBridge({ui: UI})
    messages: Messages
    ui: UI

  window.GuideGuide = new GuideGuideCore args, ->
    console.log "GuideGuide Ready"
