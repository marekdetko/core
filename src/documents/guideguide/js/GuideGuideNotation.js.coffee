class window.GuideGuideNotation

  constructor: (args = {}) ->

  # Turn a GuideGuide notation string into a GuideGuide notation object.
  #
  #   string - GuideGuide notation string to be parsed.
  #
  # Returns an array of grid Objects.
  parse: (string = "") =>
    []

  # Convert a GuideGuide notation object to a GuideGuide string.
  #
  #   obj - GuideGuide notation object to convert to a string.
  #
  # Returns a string.
  stringify: (obj = {}) =>
    ""

  # Check the data for invalid gaps and validate according to the spec.
  #
  # Returns truthy if the string is valid GuideGuide notation.
  validate: (ggn = "") =>
    ggn

  # Clean up a GuideGuide notation string to be nicely formatted.
  #
  # Returns a String.
  clean: (string = "") =>
    ""
