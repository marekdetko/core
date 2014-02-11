gg = {}

asyncTest "Init GuideGuide", ->
  expect(1)
  gg = new GuideGuideLib new Bridge(), (err) ->
    ok !err, err
    start()
