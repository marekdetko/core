class window.GuideGuideLib
  bridge: {}
  data: {}

  constructor: (bridge, callback) ->
    @bridge = bridge

    expected = [
      'getData',
      'setData',
      'addGuides',
      'toggleGuides',
      'resetGuides',
      'getExistingGuides',
      'getDocumentInfo',
      'log',
      'error',
      'openURL'
    ]
    missing = []

    for index, method of expected
      missing.push(method) if !bridge[method]?

    if missing.length > 0
      callback("The bridge is missing the following methods: #{ missing.join(', ') }")
      return

    callback(null)
