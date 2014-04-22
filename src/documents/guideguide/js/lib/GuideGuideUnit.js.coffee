# A unit of measurement formed of a number/type pair

class window.Unit

  # number - entered value
  value: null

  # string - entered unit type, reformatted
  type: null

  # number - value in base units, usually pixels
  baseValue: null

  # boolean - truthy if this is valid and can be parsed
  isValid: true

  # string - original string
  original: null

  resolution: 72

  # string - the current ruler unit of the application
  rulerUnit: "px"

  # Create a unit object
  #
  #   string - string to be parsed into a Unit
  #
  # Returns an object
  constructor: (string, integerOnly = false) ->
    @original = string = string.replace /\s/g, ''
    unitGaps = string.match(/([-0-9\.]+)([a-z%]+)?/i) || ''
    @value    = parseFloat unitGaps[1]

    if !integerOnly
      unitString = unitGaps[2] || ''
      @type      = @parseUnit unitString if @value
      @baseValue = @getBaseValue(@value,@type)
      @isValid   = @type != null
    else
      if unitGaps[1]
        @type = 'integer'
        @isValid = true

    if !@value?
      @isValid = false
    if !@type
      @isValid = false
      @type = unitString

  # Return the string form of the object, properly formatted,
  # based on the original string value
  toString: =>
    if @isValid
      "#{ @value }#{if @type and @type != 'integer' then @type else ''}"
    else
      @original

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
      when ''
        @parseUnit @rulerUnit
      else
        null

  # Get the value of the gap in base units
  #
  #   value - value to be converted
  #   type  - units of the value
  #
  # Returns a number
  getBaseValue: (value,type) ->
    tmpValue  = 0
    unitCanon =
      cm:    2.54,
      inch:  1,
      mm:    25.4,
      px:    @resolution,
      point: 72,
      pica:  6

    # convert to inch
    switch type
      when 'cm' then tmpValue = value / unitCanon.cm
      when 'in' then tmpValue = value / unitCanon.inch
      when 'mm' then tmpValue = value / unitCanon.mm
      when 'px' then tmpValue = value / unitCanon.px
      when 'points' then tmpValue = value / unitCanon.point
      when 'picas' then tmpValue = value / unitCanon.pica
      when '%'
        # tmpValue = (pctRef / unitCanon.px)*(value/100)
      else
        return 0

    tmpValue * unitCanon.px


# This will be the new class once I have time to refactor everything
# currently unused
class window.GuideGuideUnitRefactor

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
