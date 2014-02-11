gg = {}

asyncTest "Init GuideGuide", ->
  expect 1
  gg = new GuideGuideLib {bridge: new Bridge()}, (err) ->
    ok !err, err
    start()

module "Messages work"
test "Default locale succeeds", ->
  expect 2
  ok messages = new GuideGuideMessages("en_us")
  equal messages.uiGrid(), "Grid"

test "Non-english locales succeed", ->
  expect 2
  ok messages = new GuideGuideMessages("es_es")
  equal messages.uiGrid(), "Retícula"

test "Bad locales fail gracefully", ->
  expect 2
  ok messages = new GuideGuideMessages("foo")
  equal messages.uiGrid(), "Grid"
