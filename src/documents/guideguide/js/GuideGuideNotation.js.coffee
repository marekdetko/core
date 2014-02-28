class window.GGN

  # Original ggn string
  ggn: ''

  # Collection of variables to be used when calculating the grid
  variables: {}

  # Array of errors and error codes present in this ggn object
  errors: {}

  # Used to label new errors
  newErrorId: 0

  # Array of grid objects found in this string
  grids: []

  # Truthy if everything in the string matches the spec
  isValid: true

  # Total number of wildcards in this grid
  wildcards: 0

  constructor: (string) ->
    @errors    = {}
    @variables = {}
    @grids     = []
    @ggn       = string.replace /\s*$|^\s*/gm, ''
    @messages  = Messages
    @parse @ggn

  # Turn a ggn string into a collection of grids
  #
  #   string - gssn string to be parsed
  #
  # Returns an array of grid Objects
  parse: (string) =>
    string = $.trim(string)
      .replace(/[^\S\n]*\|[^\S\n]*/g, '|') # Remove any pipe spaces
      .replace(/\|+/g, ' | ')              # Reduce duped pipes to singles

    lines = string.split /\n/g
    $.each lines, (index,line) =>
      if /^\$.*?\s?=.*$/i.test line
        @parseVariable line
      else if /^\s*#/i.test line
        # ignored line
      else
        @parseGrid line

    # validate everything
    @validate()

  # Generate a spec formatted version of the string
  #
  # Returns a string
  toString: () =>
    string = ""

    # Variables
    $.each @variables, (key,variable) =>
      string += "$#{if key != '_' then key else ''} = "
      gaps = $.map variable.forString, (gap) -> return gap.toString()
      string += gaps.join ' '
      string += '\n'

    string += '\n' if !$.isEmptyObject @variables

    # Grids
    $.each @grids, (key,grid) =>
      gaps = $.map grid.gaps.forString, (gap) -> return gap.toString()
      string += gaps.join ' '
      string += ' ( '

      $.each grid.options, (key,option) =>
        string += option.id if key != 'width' and key != 'offset'

      string += ', ' + grid.options.width.toString() if grid.options.width
      string += ', ' + grid.options.offset.toString() if grid.options.offset
      string += ' )\n'
    string += '\n' if !$.isEmptyObject @grids

    # Errors
    $.each @errors, (key,error) =>
      string += "# #{error.id}: #{error.message}\n"
    string

  # Check the data for invalid gaps and validate according to the spec
  #
  # Returns nothing
  validate: () =>
    wildcards = 0
    fills = 0
    percent = 0
    variablesWithWildcards = {}
    @error @messages.ggnNoGrids() if !@grids.length

    # Check variables
    $.each @variables, (key,variable) =>
      $.each variable.all, (index, gap) =>
        @error @messages.ggnFillInVariable() if gap.isFill
        @defineGapErrors gap if !gap.isValid and gap != '|'
        variablesWithWildcards[key] = true if gap.isWildcard
        percent += gap.value if gap.isPercent
        wildcards++ if gap.isWildcard
        fills++ if gap.isFill

    # Check grids
    $.each @grids, (key,grid) =>
      $.each grid.gaps.all, (index, gap) =>
        @error @messages.ggnNoWildcardsInVariableFills() if gap.isVariable and variablesWithWildcards[gap.id]
        @error @messages.ggnUndefinedVariable() if gap.isVariable and !@variables[gap.id]
        @error @messages.ggnOneFillPerGrid() if gap.isFill and fills
        @defineGapErrors gap if !gap.isValid && gap != '|'
        percent += gap.value if gap.isPercent
        wildcards++ if gap.isWildcard
        fills++ if gap.isFill

      if grid.options.width
        width = new Gap grid.options.width.toString()
        @defineGapErrors width if !width.isValid
    @error @messages.ggnMoreThanOneHundredPercent() if percent > 100
    @wildcards = wildcards

  # Deterime a grid's gaps and options
  #
  #   string - grid string to be parsed
  #
  # Return a grid Object
  parseGrid: (string) =>
    obj =
      options:
        orientation:
          id: "v"
          value: 'vertical'
        remainder:
          id: 'l'
          value: 'last'
      gaps: []

    optionRegexp = /\((.*?)\)/i
    optionBits = optionRegexp.exec(string)
    optionStrings = optionRegexp.exec(string)[1] if optionBits

    string = string.replace optionRegexp, ''

    options = @parseOptions optionStrings if optionStrings

    if options
      $.each options, (key, value) ->
        obj.options[key] = value
    obj.gaps = @parseGridGaps string
    @grids.push obj

  # Deterimine a grid's options
  #
  #   string - string to be parsed
  #
  # Returns an object
  parseOptions: (string) =>
    optionArray = string.toLowerCase().replace(/\s/,'').split ','
    obj = {}

    options = optionArray[0].split ''
    $.each options, (index,option) ->
      switch option
        when "h"
          obj.orientation =
            id: "h"
            value: "horizontal"
        when "v"
          obj.orientation =
            id: "v"
            value: "vertical"
        when "f"
          obj.remainder =
            id: "f"
            value: "first"
        when "c"
          obj.remainder =
            id: "c"
            value: "center"
        when "l"
          obj.remainder =
            id: "l"
            value: "last"
        when "p"
          obj.calculation =
            id: "p"
            value: "pixel"

    if optionArray[1]
      obj.width = new Unit optionArray[1]

    if optionArray[2]
      obj.offset = new Unit optionArray[2]
    obj

  # Determine a variable's id, and gaps
  #
  #   string - variable string to be parsed
  #
  # Return an object
  parseVariable: (string) =>
    id = '_'
    varRegexp = /^\$([^=\s]+)?\s?=\s?(.*)$/i
    varBits = varRegexp.exec(string)
    id = varBits[1] if varBits[1]
    @variables[id] = @parseGridGaps(varBits[2])

  # Turn a grid string into a collection of gaps and objects
  #
  #   string - grid string to be parsed
  #
  # Returns an object
  parseGridGaps: (string) =>
    string = string.replace(/^\s+|\s+$/g, '').replace(/\s\s+/g, ' ')
    gaps =
      forString: []
      all: []

    gapStrings = string.split /\s/

    $.each gapStrings, (index,value) =>
      gap = new Gap value

      if value == '|'
        gaps.forString.push '|'
        gaps = @allocate value, gaps
      else
        gaps.forString.push gap
        for i in [1..gap.multiplier]
          gaps = @allocate gap, gaps

    gaps

  allocate: (gap,gaps) =>
    gap = gap.clone() if gap != '|'

    if gap.isVariable and !gap.isFill
      $.each @variables[gap.id].all, (index, varGap) =>
          gaps = @allocate varGap, gaps
        gaps
    else
      gaps.all = [] if !gaps.all
      gaps.all.push gap

      # These are used for calculation later
      if gap.isPercent
        gaps.percents = [] if !gaps.percents
        gaps.percents.push gap
      if gap.isArbitrary and !gap.isFill
        gaps.arbitrary = [] if !gaps.arbitrary
        gaps.arbitrary.push gap
      if gap.isWildcard
        gaps.wildcards = [] if !gaps.wildcards
        gaps.wildcards.push gap

    gaps.fill = gap if gap.isFill

    gaps

  # Add a message to a collection of errors
  #
  #   collection - list of errors to add message too
  #   message    - message to add
  #
  # Returns nothing
  error: (message) =>
    @isValid = false
    id = message.replace(/\s/g,'').toLowerCase()

    if !@errors[id]
      @errors[id] =
        id: @newErrorId
        message: message
      @newErrorId++
    else
      @errors[id].id

  # Pass error codes to invalid gaps, now that we have them
  #
  #   gap - invalid gap that needs error codes
  #
  # Returns nothing
  defineGapErrors: (gap) =>
    $.each gap.errors, (key,error) =>
      error.id = @error error.message


class window.GuideGuideNotationRefactor

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
