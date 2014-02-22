$ ->
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

  console.log 'hello world'
  ui = new GuideGuideHTMLUI { theme: theme } $("#guideguide")
