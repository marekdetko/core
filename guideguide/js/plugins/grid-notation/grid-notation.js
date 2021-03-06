// Generated by CoffeeScript 1.7.1
(function() {
  var Command, GridNotation, Unit, error, find, lengthOf, trim,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GridNotation = (function() {
    function GridNotation(args) {
      if (args == null) {
        args = {};
      }
      this.stringifyParams = __bind(this.stringifyParams, this);
      this.stringifyCommands = __bind(this.stringifyCommands, this);
      this.parseVariable = __bind(this.parseVariable, this);
      this.parseParams = __bind(this.parseParams, this);
      this.parseGrid = __bind(this.parseGrid, this);
      this.isCommands = __bind(this.isCommands, this);
      this.validate = __bind(this.validate, this);
      this.objectify = __bind(this.objectify, this);
      this.test = __bind(this.test, this);
      this.stringify = __bind(this.stringify, this);
      this.clean = __bind(this.clean, this);
      this.unit = new Unit();
      this.cmd = new Command();
    }

    GridNotation.prototype.parse = function(string, info) {
      var adjust, adjustRemainder, command, explicit, explicitSum, fill, fillCollection, fillIterations, fillWidth, gn, grid, guideOrientation, guides, i, insertMarker, key, measuredWidth, newCommand, newCommands, offset, originalWidth, percentValue, percents, remainderOffset, remainderPixels, stretchDivisions, tested, variable, wholePixels, wildcardArea, wildcardWidth, wildcards, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _o, _p, _q, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (string == null) {
        string = "";
      }
      if (info == null) {
        info = {};
      }
      if (info.resolution) {
        this.unit.resolution = info.resolution;
      }
      this.cmd.unit = this.unit;
      guides = [];
      tested = this.validate(this.objectify(string));
      if (tested.errors.length > 0) {
        return null;
      }
      gn = tested.obj;
      _ref = gn.variables;
      for (key in _ref) {
        variable = _ref[key];
        gn.variables[key] = this.expandCommands(variable, {
          variables: gn.variables
        });
      }
      _ref1 = gn.grids;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        grid = _ref1[_i];
        guideOrientation = grid.params.orientation;
        wholePixels = grid.params.calculation === 'p';
        fill = find(grid.commands, function(el) {
          return el.isFill;
        })[0] || null;
        originalWidth = guideOrientation === 'h' ? info.height : info.width;
        measuredWidth = guideOrientation === 'h' ? info.height : info.width;
        if ((_ref2 = grid.params.width) != null ? (_ref3 = _ref2.unit) != null ? _ref3.base : void 0 : void 0) {
          measuredWidth = grid.params.width.unit.base;
        }
        offset = guideOrientation === 'h' ? info.offsetY : info.offsetX;
        stretchDivisions = 0;
        adjustRemainder = 0;
        grid.commands = this.expandCommands(grid.commands, gn.variables);
        wildcards = find(grid.commands, function(el) {
          return el.isWildcard;
        });
        if ((_ref4 = grid.params.width) != null ? (_ref5 = _ref4.unit) != null ? _ref5.base : void 0 : void 0) {
          adjustRemainder = originalWidth - ((_ref6 = grid.params.width) != null ? _ref6.unit.base : void 0);
        }
        percents = find(grid.commands, function(el) {
          return el.isPercent;
        });
        for (_j = 0, _len1 = percents.length; _j < _len1; _j++) {
          command = percents[_j];
          percentValue = measuredWidth * (command.unit.value / 100);
          if (wholePixels) {
            percentValue = Math.floor(percentValue);
          }
          command.unit = this.unit.parse("" + percentValue + "px");
        }
        explicit = find(grid.commands, function(el) {
          return el.isExplicit && !el.isFill;
        });
        explicitSum = 0;
        for (_k = 0, _len2 = explicit.length; _k < _len2; _k++) {
          command = explicit[_k];
          explicitSum += command.unit.base;
        }
        if (((_ref7 = grid.params.width) != null ? (_ref8 = _ref7.unit) != null ? _ref8.base : void 0 : void 0) == null) {
          if (wildcards.length === 0) {
            adjustRemainder = originalWidth - explicitSum;
          }
          measuredWidth -= ((_ref9 = grid.params.firstOffset) != null ? (_ref10 = _ref9.unit) != null ? _ref10.base : void 0 : void 0) || 0;
          measuredWidth -= ((_ref11 = grid.params.lastOffset) != null ? (_ref12 = _ref11.unit) != null ? _ref12.base : void 0 : void 0) || 0;
        }
        if (adjustRemainder > 0) {
          adjustRemainder -= ((_ref13 = grid.params.firstOffset) != null ? (_ref14 = _ref13.unit) != null ? _ref14.base : void 0 : void 0) || 0;
          adjustRemainder -= ((_ref15 = grid.params.lastOffset) != null ? (_ref16 = _ref15.unit) != null ? _ref16.base : void 0 : void 0) || 0;
        }
        if ((_ref17 = grid.params.firstOffset) != null ? _ref17.isWildcard : void 0) {
          stretchDivisions++;
        }
        if ((_ref18 = grid.params.lastOffset) != null ? _ref18.isWildcard : void 0) {
          stretchDivisions++;
        }
        adjust = adjustRemainder / stretchDivisions;
        if ((_ref19 = grid.params.firstOffset) != null ? _ref19.isWildcard : void 0) {
          if (wholePixels) {
            adjust = Math.ceil(adjust);
          }
          grid.params.firstOffset = this.cmd.parse("" + adjust + "px");
        }
        if ((_ref20 = grid.params.lastOffset) != null ? _ref20.isWildcard : void 0) {
          if (wholePixels) {
            adjust = Math.floor(adjust);
          }
          grid.params.lastOffset = this.cmd.parse("" + adjust + "px");
        }
        offset += ((_ref21 = grid.params.firstOffset) != null ? _ref21.unit.base : void 0) || 0;
        wildcardArea = measuredWidth - explicitSum;
        if (wildcardArea && fill) {
          fillIterations = Math.floor(wildcardArea / lengthOf(fill, gn.variables));
          fillCollection = [];
          fillWidth = 0;
          for (i = _l = 1; 1 <= fillIterations ? _l <= fillIterations : _l >= fillIterations; i = 1 <= fillIterations ? ++_l : --_l) {
            if (fill.isVariable) {
              fillCollection = fillCollection.concat(gn.variables[fill.id]);
              fillWidth += lengthOf(fill, gn.variables);
            } else {
              newCommand = this.cmd.parse(this.cmd.toSimpleString(fill));
              fillCollection.push(newCommand);
              fillWidth += newCommand.unit.base;
            }
          }
          wildcardArea -= fillWidth;
          newCommands = [];
          _ref22 = grid.commands;
          for (i = _m = 0, _len3 = _ref22.length; _m < _len3; i = ++_m) {
            command = _ref22[i];
            if (command.isFill) {
              newCommands = newCommands.concat(fillCollection);
            } else {
              newCommands.push(command);
            }
          }
          grid.commands = [].concat(newCommands);
        }
        if (wildcardArea && wildcards) {
          wildcardWidth = wildcardArea / wildcards.length;
          if (wholePixels) {
            wildcardWidth = Math.floor(wildcardWidth);
            remainderPixels = wildcardArea % wildcards.length;
          }
          for (_n = 0, _len4 = wildcards.length; _n < _len4; _n++) {
            command = wildcards[_n];
            command.isWildcard = false;
            command.isExplicit = true;
            command.isFill = true;
            command.multiplier = 1;
            command.isPercent = false;
            command.unit = this.unit.parse("" + wildcardWidth + "px");
          }
        }
        if (remainderPixels) {
          remainderOffset = 0;
          if (grid.params.remainder === 'c') {
            remainderOffset = Math.floor((wildcards.length - remainderPixels) / 2);
          }
          if (grid.params.remainder === 'l') {
            remainderOffset = wildcards.length - remainderPixels;
          }
          for (i = _o = 0, _len5 = wildcards.length; _o < _len5; i = ++_o) {
            command = wildcards[i];
            if (i >= remainderOffset && i < remainderOffset + remainderPixels) {
              command.unit = this.unit.parse("" + (wildcardWidth + 1) + "px");
            }
          }
        }
        insertMarker = (_ref23 = grid.params.firstOffset) != null ? _ref23.unit.base : void 0;
        insertMarker || (insertMarker = offset);
        newCommands = [];
        _ref24 = grid.commands;
        for (i = _p = 0, _len6 = _ref24.length; _p < _len6; i = ++_p) {
          command = _ref24[i];
          if (!command.isGuide || (command.isGuide && !((_ref25 = grid.commands[i - 1]) != null ? _ref25.isGuide : void 0))) {
            newCommands.push(command);
          }
        }
        grid.commands = [].concat(newCommands);
        _ref26 = grid.commands;
        for (_q = 0, _len7 = _ref26.length; _q < _len7; _q++) {
          command = _ref26[_q];
          if (command.isGuide) {
            guides.push({
              location: insertMarker,
              orientation: guideOrientation
            });
          } else {
            insertMarker += command.unit.base;
          }
        }
      }
      return guides;
    };

    GridNotation.prototype.clean = function(string) {
      var gn, grid, key, line, variable, _i, _len, _ref, _ref1;
      if (string == null) {
        string = "";
      }
      gn = this.validate(this.objectify(string)).obj;
      string = "";
      _ref = gn.variables;
      for (key in _ref) {
        variable = _ref[key];
        string += "" + key + " = " + (this.stringifyCommands(variable)) + "\n";
      }
      if (gn.variables.length > 0) {
        string += "\n";
      }
      _ref1 = gn.grids;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        grid = _ref1[_i];
        line = "";
        line += this.stringifyCommands(grid.commands);
        line += " " + (this.stringifyParams(grid.params));
        string += "" + (trim(line)) + "\n";
      }
      return trim(string.replace(/\n\n\n+/g, "\n"));
    };

    GridNotation.prototype.stringify = function(data) {
      var column, firstMargString, gridString, gutter, lastMargString, optionsString, unit, varString;
      data || (data = {});
      data.count = parseInt(data.count);
      data.width || (data.width = '');
      data.gutter || (data.gutter = '');
      data.firstMargin || (data.firstMargin = '');
      data.lastMargin || (data.lastMargin = '');
      data.columnMidpoint || (data.columnMidpoint = false);
      data.gutterMidpoint || (data.gutterMidpoint = false);
      data.orientation || (data.orientation = 'v');
      data.position || (data.position = 'f');
      data.remainder || (data.remainder = 'l');
      data.calculation || (data.calculation = '');
      firstMargString = '';
      varString = '';
      gridString = '';
      lastMargString = '';
      optionsString = '';
      if (data.firstMargin) {
        firstMargString = '|' + data.firstMargin.replace(/,|\s+/g, ' ').split(' ').join('|') + '|';
      }
      if (data.lastMargin) {
        lastMargString = '|' + data.lastMargin.replace(/,|\s+/g, ' ').split(' ').reverse().join('|') + '|';
      }
      if (data.count || data.width) {
        column = data.width ? data.width : '~';
        if (data.columnMidpoint) {
          if (data.width) {
            unit = this.unit.parse(data.width);
          }
          column = data.width ? "" + (unit.value / 2) + unit.type + "|" + (unit.value / 2) + unit.type : "~|~";
        }
        varString += "$" + data.orientation + " = |" + column + "|\n";
        if (data.gutter && data.count !== 1) {
          gutter = data.gutter ? data.gutter : '~';
          if (data.gutterMidpoint) {
            if (data.gutter) {
              unit = this.unit.parse(data.gutter);
            }
            gutter = data.gutter ? "" + (unit.value / 2) + unit.type + "|" + (unit.value / 2) + unit.type : "~|~";
          }
          varString = "$" + data.orientation + " = |" + column + "|" + gutter + "|\n";
          varString += "$" + data.orientation + "C = |" + column + "|\n";
        }
      }
      if (data.count || data.width) {
        gridString += "|$" + data.orientation;
        if (data.count !== 1) {
          gridString += "*";
        }
        if (data.count > 1 && data.gutter) {
          gridString += data.count - 1;
        }
        if (data.count > 1 && !data.gutter) {
          gridString += data.count;
        }
        gridString += "|";
        if (data.gutter) {
          gridString += "|$" + data.orientation + (data.gutter ? 'C' : '') + "|";
        }
      }
      if ((!data.count && !data.width) && data.firstMargin) {
        gridString += "|";
      }
      if ((!data.count && !data.width) && (data.firstMargin || data.lastMargin)) {
        gridString += "~";
      }
      if ((!data.count && !data.width) && data.lastMargin) {
        gridString += "|";
      }
      if (data.firstMargin || data.lastMargin || data.count || data.width) {
        optionsString += " ( ";
        optionsString += data.orientation;
        optionsString += data.remainder;
        if (data.calculation === "p") {
          optionsString += "p";
        }
        optionsString += ", ";
        if (data.position === "l" || data.position === "c") {
          optionsString += "~";
        }
        optionsString += "|";
        if (data.position === "f" || data.position === "c") {
          optionsString += "~";
        }
        optionsString += " )";
      }
      return this.pipeCleaner(("" + varString + firstMargString + gridString + lastMargString + optionsString).replace(/\|+/g, "|"));
    };

    GridNotation.prototype.test = function(string) {
      return this.validate(this.objectify(string)).errors;
    };

    GridNotation.prototype.objectify = function(string) {
      var grid, grids, line, lines, variable, variables, _i, _len;
      if (string == null) {
        string = "";
      }
      lines = string.split(/\n/g);
      string = "";
      variables = {};
      grids = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (/^\$.*?\s?=.*$/i.test(line)) {
          variable = this.parseVariable(line);
          variables[variable.id] = variable.commands;
        } else if (/^\s*#/i.test(line)) {

        } else {
          grid = this.parseGrid(line);
          if (grid.commands.length > 0) {
            grids.push(grid);
          }
        }
      }
      return {
        variables: variables,
        grids: grids
      };
    };

    GridNotation.prototype.validate = function(obj) {
      var command, commands, errors, fills, first, grid, id, key, last, varHasFill, varHasWildcard, variable, variablesWithWildcards, width, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      variablesWithWildcards = {};
      errors = [];
      if (obj.grids.length <= 0) {
        error(2, errors);
      }
      _ref = obj.variables;
      for (key in _ref) {
        commands = _ref[key];
        for (_i = 0, _len = commands.length; _i < _len; _i++) {
          command = commands[_i];
          if (command.errors.length > 0) {
            error(command.errors, errors);
          }
          id = command.id;
          if (id) {
            variable = obj.variables[id];
          }
          if (id && !variable) {
            error(6, errors, command);
          }
          if (command.isFill) {
            error(5, errors, command);
          }
          if (command.isWildcard) {
            variablesWithWildcards[key] = true;
          }
        }
      }
      _ref1 = obj.grids;
      for (key in _ref1) {
        grid = _ref1[key];
        fills = 0;
        first = grid.params.firstOffset;
        width = grid.params.width;
        last = grid.params.lastOffset;
        if (first && first.errors.length > 0) {
          error(1, errors);
        }
        if (width && width.errors.length > 0) {
          error(1, errors);
        }
        if (last && last.errors.length > 0) {
          error(1, errors);
        }
        _ref2 = grid.commands;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          command = _ref2[_j];
          if (command.errors.length > 0) {
            error(command.errors, errors);
          }
          id = command.id;
          if (id) {
            variable = obj.variables[id];
          }
          if (id && !variable) {
            error(6, errors, command);
          }
          varHasWildcard = find(variable, function(el) {
            return el.isWildcard;
          }).length > 0;
          if (command.isFill && varHasWildcard) {
            error(3, errors, command);
          }
          if (command.isFill) {
            fills++;
          }
          varHasFill = find(variable, function(el) {
            return el.isFill;
          }).length > 0;
          if (id && variable && varHasFill) {
            fills++;
          }
          if (fills > 1) {
            error(4, errors, command);
          }
          if (id && variable && varHasFill) {
            error(5, errors, command);
          }
        }
      }
      return {
        errors: errors.sort(),
        obj: obj
      };
    };

    GridNotation.prototype.parseCommands = function(string) {
      var commands, token, tokens, _i, _len;
      if (string == null) {
        string = "";
      }
      string = this.pipeCleaner(string);
      commands = [];
      if (string === "") {
        return commands;
      }
      tokens = string.replace(/^\s+|\s+$/g, '').replace(/\s\s+/g, ' ').split(/\s/);
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        commands.push(this.cmd.parse(token));
      }
      return commands;
    };

    GridNotation.prototype.expandCommands = function(commands, variables) {
      var command, i, loops, newCommands, reparse, varWidths, _i, _j, _k, _len, _len1;
      if (commands == null) {
        commands = [];
      }
      if (variables == null) {
        variables = {};
      }
      if (typeof commands === "string") {
        commands = this.parseCommands(commands);
      }
      reparse = true;
      varWidths = {};
      while (reparse === true) {
        reparse = false;
        newCommands = [];
        for (_i = 0, _len = commands.length; _i < _len; _i++) {
          command = commands[_i];
          if (command.isFill) {
            newCommands.push(command);
          } else {
            loops = command.multiplier || 1;
            for (i = _j = 0; _j < loops; i = _j += 1) {
              newCommands.push(this.cmd.parse(this.cmd.toSimpleString(command)));
            }
          }
        }
        commands = [].concat(newCommands);
        newCommands = [];
        for (i = _k = 0, _len1 = commands.length; _k < _len1; i = ++_k) {
          command = commands[i];
          if (command.isVariable && variables && variables[command.id] && !command.isFill) {
            reparse = true;
            newCommands = newCommands.concat(variables[command.id]);
          } else {
            newCommands.push(command);
          }
        }
        commands = [].concat(newCommands);
      }
      return commands;
    };

    GridNotation.prototype.isCommands = function(string) {
      var commands;
      if (string == null) {
        string = "";
      }
      if (string === "") {
        return false;
      }
      if (string.indexOf("|") >= 0) {
        return true;
      }
      commands = this.parseCommands(string);
      if (commands.length > 1) {
        return true;
      }
      if (commands[0].errors.length === 0) {
        return true;
      }
      return false;
    };

    GridNotation.prototype.parseGrid = function(string) {
      var commands, params, regex;
      if (string == null) {
        string = "";
      }
      regex = /\((.*?)\)/i;
      params = regex.exec(string) || [];
      string = trim(string.replace(regex, ''));
      commands = this.parseCommands(string);
      return {
        commands: commands,
        wildcards: find(commands, function(el) {
          return el.isWildcard;
        }),
        params: this.parseParams(params[1] || '')
      };
    };

    GridNotation.prototype.parseParams = function(string) {
      var bits, k, obj, v, _ref, _ref1, _ref2, _ref3;
      if (string == null) {
        string = "";
      }
      bits = string.replace(/[\s\(\)]/g, '').split(',');
      obj = {
        orientation: "h",
        remainder: "l",
        calculation: ""
      };
      if (bits.length > 1) {
        _ref = this.parseOptions(bits[0]);
        for (k in _ref) {
          v = _ref[k];
          obj[k] = v;
        }
        _ref1 = this.parseAdjustments(bits[1] || "");
        for (k in _ref1) {
          v = _ref1[k];
          obj[k] = v;
        }
        return obj;
      } else if (bits.length === 1) {
        if (this.isCommands(bits[0])) {
          _ref2 = this.parseAdjustments(bits[0] || "");
          for (k in _ref2) {
            v = _ref2[k];
            obj[k] = v;
          }
        } else {
          _ref3 = this.parseOptions(bits[0]);
          for (k in _ref3) {
            v = _ref3[k];
            obj[k] = v;
          }
        }
      }
      return obj;
    };

    GridNotation.prototype.parseOptions = function(string) {
      var obj, option, options, _i, _len;
      if (string == null) {
        string = "";
      }
      options = string.split('');
      obj = {};
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        switch (option.toLowerCase()) {
          case "h":
          case "v":
            obj.orientation = option;
            break;
          case "f":
          case "c":
          case "l":
            obj.remainder = option;
            break;
          case "p":
            obj.calculation = option;
        }
      }
      return obj;
    };

    GridNotation.prototype.parseAdjustments = function(string) {
      var adj, bits, el, end, i, _i, _len, _ref, _ref1;
      if (string == null) {
        string = "";
      }
      adj = {
        firstOffset: null,
        width: null,
        lastOffset: null
      };
      if (string === "") {
        return adj;
      }
      bits = this.expandCommands(string.replace(/\s/, '')).splice(0, 5);
      end = bits.length - 1;
      if (bits.length > 1 && !bits[end].isGuide) {
        adj.lastOffset = bits[end];
      }
      if (!bits[0].isGuide) {
        adj.firstOffset = bits[0];
      }
      for (i = _i = 0, _len = bits.length; _i < _len; i = ++_i) {
        el = bits[i];
        if (((_ref = bits[i - 1]) != null ? _ref.isGuide : void 0) && ((_ref1 = bits[i + 1]) != null ? _ref1.isGuide : void 0)) {
          if (!el.isGuide) {
            adj.width = el;
          }
        }
      }
      return adj;
    };

    GridNotation.prototype.parseVariable = function(string) {
      var bits;
      bits = /^\$([^=\s]+)?\s?=\s?(.*)$/i.exec(string);
      if (bits[2] == null) {
        return null;
      }
      return {
        id: bits[1] ? "$" + bits[1] : "$",
        commands: this.parseCommands(bits[2])
      };
    };

    GridNotation.prototype.pipeCleaner = function(string) {
      if (string == null) {
        string = "";
      }
      return string.replace(/[^\S\n]*\|[^\S\n]*/g, '|').replace(/\|+/g, ' | ').replace(/^\s+|\s+$/gm, '');
    };

    GridNotation.prototype.stringifyCommands = function(commands) {
      var command, string, _i, _len;
      string = "";
      for (_i = 0, _len = commands.length; _i < _len; _i++) {
        command = commands[_i];
        string += this.cmd.stringify(command);
      }
      return this.pipeCleaner(string);
    };

    GridNotation.prototype.stringifyParams = function(params) {
      var string;
      string = "";
      string += "" + (params.orientation || '');
      string += "" + (params.remainder || '');
      string += "" + (params.calculation || '');
      if (params.firstOffset || params.width || params.lastOffset) {
        if (string.length > 0) {
          string += ", ";
        }
      }
      if (params.firstOffset) {
        string += this.cmd.stringify(params.firstOffset);
      }
      if (params.firstOffset || params.width) {
        string += "|";
      }
      if (params.width) {
        string += "" + (this.cmd.stringify(params.width));
      }
      if (params.lastOffset || params.width) {
        string += "|";
      }
      if (params.lastOffset) {
        string += this.cmd.stringify(params.lastOffset);
      }
      if (string) {
        return "( " + (this.pipeCleaner(string)) + " )";
      } else {
        return '';
      }
    };

    return GridNotation;

  })();

  Command = (function() {
    Command.prototype.variableRegexp = /^\$([^\*]+)?(\*(\d+)?)?$/i;

    Command.prototype.explicitRegexp = /^(([-0-9\.]+)?[a-z%]+)(\*(\d+)?)?$/i;

    Command.prototype.wildcardRegexp = /^~(\*(\d*))?$/i;

    function Command(args) {
      if (args == null) {
        args = {};
      }
      this.isWildcard = __bind(this.isWildcard, this);
      this.isExplicit = __bind(this.isExplicit, this);
      this.isVariable = __bind(this.isVariable, this);
      this.unit = new Unit();
    }

    Command.prototype.isGuide = function(command) {
      if (command == null) {
        command = "";
      }
      if (typeof command === "string") {
        return command.replace(/\s/g, '') === "|";
      } else {
        return command.isGuide || false;
      }
    };

    Command.prototype.isVariable = function(command) {
      if (command == null) {
        command = "";
      }
      if (typeof command === "string") {
        return this.variableRegexp.test(command.replace(/\s/g, ''));
      } else {
        return command.isVariable || false;
      }
    };

    Command.prototype.isExplicit = function(command) {
      if (command == null) {
        command = "";
      }
      if (typeof command === "string") {
        if (!this.explicitRegexp.test(command.replace(/\s/g, ''))) {
          return false;
        }
        if (this.unit.parse(command) === null) {
          return false;
        }
        return true;
      } else {
        return command.isExplicit || false;
      }
    };

    Command.prototype.isWildcard = function(command) {
      if (command == null) {
        command = "";
      }
      if (typeof command === "string") {
        return this.wildcardRegexp.test(command.replace(/\s/g, ''));
      } else {
        return command.isWildcard || false;
      }
    };

    Command.prototype.isPercent = function(command) {
      var unit;
      if (command == null) {
        command = "";
      }
      if (typeof command === "string") {
        unit = this.unit.parse(command.replace(/\s/g, ''));
        return (unit != null) && unit.type === '%';
      } else {
        return command.isPercent || false;
      }
    };

    Command.prototype.isFill = function(string) {
      var bits;
      if (string == null) {
        string = "";
      }
      if (this.isVariable(string)) {
        bits = this.variableRegexp.exec(string);
        return bits[2] && !bits[3] || false;
      } else if (this.isExplicit(string)) {
        bits = this.explicitRegexp.exec(string);
        return bits[3] && !bits[4] || false;
      } else if (this.isWildcard(string)) {
        bits = this.wildcardRegexp.exec(string);
        return bits[1] && !bits[2] || false;
      } else {
        return false;
      }
    };

    Command.prototype.count = function(string) {
      if (string == null) {
        string = "";
      }
      string = string.replace(/\s/g, '');
      if (this.isVariable(string)) {
        return parseInt(this.variableRegexp.exec(string)[3]) || 1;
      } else if (this.isExplicit(string)) {
        return parseInt(this.explicitRegexp.exec(string)[4]) || 1;
      } else if (this.isWildcard(string)) {
        return parseInt(this.wildcardRegexp.exec(string)[2]) || 1;
      } else {
        return null;
      }
    };

    Command.prototype.parse = function(string) {
      var bits;
      if (string == null) {
        string = "";
      }
      string = string.replace(/\s/g, '');
      if (this.isGuide(string)) {
        return {
          errors: [],
          isGuide: true
        };
      } else if (this.isVariable(string)) {
        bits = this.variableRegexp.exec(string);
        return {
          errors: [],
          isVariable: true,
          isFill: this.isFill(string),
          id: bits[1] ? "$" + bits[1] : "$",
          multiplier: this.count(string)
        };
      } else if (this.isExplicit(string)) {
        return {
          errors: [],
          isExplicit: true,
          isPercent: this.isPercent(string),
          isFill: this.isFill(string),
          unit: this.unit.parse(string),
          multiplier: this.count(string)
        };
      } else if (this.isWildcard(string)) {
        return {
          errors: this.isFill(string) ? [3] : [],
          isWildcard: true,
          isFill: this.isFill(string),
          multiplier: this.count(string)
        };
      } else {
        return {
          errors: [1],
          string: string
        };
      }
    };

    Command.prototype.stringify = function(command) {
      var string;
      if (command == null) {
        command = "";
      }
      if (typeof command === "string") {
        return command;
      }
      string = "";
      if (command.isGuide) {
        string += "|";
      } else if (command.isVariable) {
        string += command.id;
      } else if (command.isExplicit) {
        string += this.unit.stringify(command.unit);
      } else if (command.isWildcard) {
        string += "~";
      } else {
        if (command.string === "") {
          return "";
        }
        string += command.string;
      }
      if (command.isVariable || command.isExplicit || command.isWildcard) {
        if (command.isFill || command.multiplier > 1) {
          string += '*';
        }
        if (command.multiplier > 1) {
          string += command.multiplier;
        }
      }
      if (command.errors.length === 0) {
        return string;
      } else {
        return "{" + string + " [" + (command.errors.join(',')) + "]}";
      }
    };

    Command.prototype.toSimpleString = function(command) {
      if (command == null) {
        command = "";
      }
      if (typeof command === "string") {
        return command.replace(/\*.*/gi, "");
      }
      return this.stringify(command).replace(/[\{\}]|\*.*|\[\d*\]/gi, "");
    };

    return Command;

  })();

  Unit = (function() {
    Unit.prototype.resolution = 72;

    function Unit(args) {
      if (args == null) {
        args = {};
      }
      this.stringify = __bind(this.stringify, this);
      this.parse = __bind(this.parse, this);
    }

    Unit.prototype.parse = function(string) {
      var bits, value;
      if (string == null) {
        string = "";
      }
      string = string.replace(/\s/g, '');
      bits = string.match(/([-0-9\.]+)([a-z%]+)?/i);
      if (!string || string === "" || (bits == null)) {
        return null;
      }
      if (bits[2] && !this.preferredName(bits[2])) {
        return null;
      }
      if (bits[1] && !bits[2]) {
        value = parseFloat(bits[1]);
        if (value.toString() === bits[1]) {
          return value;
        } else {
          return null;
        }
      }
      return {
        string: string,
        value: parseFloat(bits[1]),
        type: this.preferredName(bits[2]),
        base: this.asBaseUnit({
          value: parseFloat(bits[1]),
          type: this.preferredName(bits[2])
        })
      };
    };

    Unit.prototype.preferredName = function(string) {
      switch (string) {
        case 'centimeter':
        case 'centimeters':
        case 'centimetre':
        case 'centimetres':
        case 'cm':
          return 'cm';
        case 'inch':
        case 'inches':
        case 'in':
          return 'in';
        case 'millimeter':
        case 'millimeters':
        case 'millimetre':
        case 'millimetres':
        case 'mm':
          return 'mm';
        case 'pixel':
        case 'pixels':
        case 'px':
          return 'px';
        case 'point':
        case 'points':
        case 'pts':
        case 'pt':
          return 'points';
        case 'pica':
        case 'picas':
          return 'picas';
        case 'percent':
        case 'pct':
        case '%':
          return '%';
        default:
          return null;
      }
    };

    Unit.prototype.asBaseUnit = function(unit) {
      if (!((unit != null) && (unit.value != null) && (unit.type != null))) {
        return null;
      }
      switch (unit.type) {
        case 'cm':
          unit.value = unit.value / 2.54;
          break;
        case 'in':
          unit.value = unit.value / 1;
          break;
        case 'mm':
          unit.value = unit.value / 25.4;
          break;
        case 'px':
          unit.value = unit.value / this.resolution;
          break;
        case 'points':
          unit.value = unit.value / this.resolution;
          break;
        case 'picas':
          unit.value = unit.value / 6;
          break;
        default:
          return null;
      }
      return unit.value * this.resolution;
    };

    Unit.prototype.stringify = function(unit) {
      if (unit == null) {
        unit = "";
      }
      if (unit === "") {
        return null;
      }
      if (typeof unit === "string") {
        return this.stringify(this.parse(unit));
      }
      return "" + unit.value + unit.type;
    };

    return Unit;

  })();

  trim = function(string) {
    return string.replace(/^\s+|\s+$/g, '');
  };

  find = function(arr, iterator) {
    var el, i, matches, _i, _len;
    if (!(arr && iterator)) {
      return [];
    }
    matches = [];
    for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
      el = arr[i];
      if (iterator(el) === true) {
        matches.push(el);
      }
    }
    return matches;
  };

  lengthOf = function(command, variables) {
    var sum, _i, _len, _ref, _ref1;
    if (!command.isVariable) {
      return command.unit.value * command.multiplier;
    }
    if (!variables[command.id]) {
      return 0;
    }
    sum = 0;
    _ref = variables[command.id];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      command = _ref[_i];
      sum += ((_ref1 = command.unit) != null ? _ref1.base : void 0) || 0;
    }
    return sum;
  };

  error = function(codes, master, command) {
    var code, exists, _i, _len;
    if (typeof codes === "number") {
      codes = [codes];
    }
    for (_i = 0, _len = codes.length; _i < _len; _i++) {
      code = codes[_i];
      exists = find(master, (function(e, i) {
        if (e === code) {
          return true;
        }
      })).length > 0;
      if (!exists) {
        master.push(code);
      }
      if (!command) {
        return;
      }
      command.errors || (command.errors = []);
      command.isValid = false;
      exists = find(command.errors, (function(e, i) {
        if (e === code) {
          return true;
        }
      })).length > 0;
      if (!exists) {
        command.errors.push(code);
      }
    }
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      notation: new GridNotation(),
      unit: new Unit(),
      command: new Command()
    };
  } else {
    window.GridNotation = new GridNotation();
    window.Unit = new Unit();
    window.Command = new Command();
  }

}).call(this);
