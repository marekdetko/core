class window.GuideGuideUnit

  # measurement units (pixels or points) per inch
  resolution: 72

  constructor: (args = {}) ->
    @resolution = args.resolution if args.resolution

  from: (string = "") =>
    string = string.replace /\s/g, ''
    bits = string.match(/([-0-9\.]+)([a-z%]+)?/i)

    unit =
      string: string
      value: null
      type: null

    return unit if !bits? or bits.length <= 1

    unit.value = parseFloat bits[1]
    unit.type  = @parseUnit(bits[2] || '')
    unit

  toString: (unit) =>

  # Parse a string and change it to a friendly unit
  #
  #   string - string to be parsed
  #
  # Returns a string or null, if invalid
  parseUnit: (string) ->
    switch string
      when 'centimeter', 'centimeters', 'centimetre', 'centimetres', 'cm'
        'cm'
      when 'inch', 'inches', 'in'
        'in'
      when 'millimeter', 'millimeters', 'millimetre', 'millimetres', 'mm'
        'mm'
      when 'pixel', 'pixels', 'px'
        'px'
      when 'point', 'points', 'pts', 'pt'
        'points'
      when 'pica', 'picas'
        'picas'
      when 'percent', 'pct', '%'
        '%'
      else
        null

  # Convert the given value of type to the base unit of the application.
  # This accounts for reslution, but the resolution must be set if it changes.
  # The result is either pixels or points.
  #
  #   value - value to be converted
  #   type  - units of the value
  #
  # Returns a number
  baseValueOf: (unit = "") =>
    unit = @from unit if typeof unit == "string"
    return 0 unless unit.value and unit.type
    type  = unit.type
    value = unit.value

    # convert to inches
    switch type
      when 'cm'     then value = value / 2.54
      when 'in'     then value = value / 1
      when 'mm'     then value = value / 25.4
      when 'px'     then value = value / @resolution
      when 'points' then value = value / @resolution
      when 'picas'  then value = value / 6
      when '%'      then value = 0 # currently not implimented or used in GuideGuide
      else
        return 0

    # convert to base units
    value * @resolution
