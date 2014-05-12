(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.GGN = (function() {
    GGN.prototype.ggn = '';

    GGN.prototype.variables = {};

    GGN.prototype.errors = {};

    GGN.prototype.newErrorId = 0;

    GGN.prototype.grids = [];

    GGN.prototype.isValid = true;

    GGN.prototype.wildcards = 0;

    function GGN(string, messages) {
      this.defineGapErrors = __bind(this.defineGapErrors, this);
      this.error = __bind(this.error, this);
      this.allocate = __bind(this.allocate, this);
      this.parseGridGaps = __bind(this.parseGridGaps, this);
      this.parseVariable = __bind(this.parseVariable, this);
      this.parseOptions = __bind(this.parseOptions, this);
      this.parseGrid = __bind(this.parseGrid, this);
      this.validate = __bind(this.validate, this);
      this.toString = __bind(this.toString, this);
      this.parse = __bind(this.parse, this);
      this.errors = {};
      this.variables = {};
      this.grids = [];
      this.ggn = string.replace(/\s*$|^\s*/gm, '');
      this.messages = messages;
      this.parse(this.ggn);
    }

    GGN.prototype.parse = function(string) {
      var lines;
      string = $.trim(string).replace(/[^\S\n]*\|[^\S\n]*/g, '|').replace(/\|+/g, ' | ');
      lines = string.split(/\n/g);
      $.each(lines, (function(_this) {
        return function(index, line) {
          if (/^\$.*?\s?=.*$/i.test(line)) {
            return _this.parseVariable(line);
          } else if (/^\s*#/i.test(line)) {

          } else {
            return _this.parseGrid(line);
          }
        };
      })(this));
      return this.validate();
    };

    GGN.prototype.toString = function() {
      var string;
      string = "";
      $.each(this.variables, (function(_this) {
        return function(key, variable) {
          var gaps;
          string += "$" + (key !== '_' ? key : '') + " = ";
          gaps = $.map(variable.forString, function(gap) {
            return gap.toString();
          });
          string += gaps.join(' ');
          return string += '\n';
        };
      })(this));
      if (!$.isEmptyObject(this.variables)) {
        string += '\n';
      }
      $.each(this.grids, (function(_this) {
        return function(key, grid) {
          var gaps;
          gaps = $.map(grid.gaps.forString, function(gap) {
            return gap.toString();
          });
          string += gaps.join(' ');
          string += ' ( ';
          $.each(grid.options, function(key, option) {
            if (key !== 'width' && key !== 'offset') {
              return string += option.id;
            }
          });
          if (grid.options.width) {
            string += ', ' + grid.options.width.toString();
          }
          if (grid.options.offset) {
            string += ', ' + grid.options.offset.toString();
          }
          return string += ' )\n';
        };
      })(this));
      if (!$.isEmptyObject(this.grids)) {
        string += '\n';
      }
      $.each(this.errors, (function(_this) {
        return function(key, error) {
          return string += "# " + error.id + ": " + error.message + "\n";
        };
      })(this));
      return string;
    };

    GGN.prototype.validate = function() {
      var fills, percent, variablesWithWildcards, wildcards;
      wildcards = 0;
      fills = 0;
      percent = 0;
      variablesWithWildcards = {};
      if (!this.grids.length) {
        this.error(this.messages.ggnNoGrids());
      }
      $.each(this.variables, (function(_this) {
        return function(key, variable) {
          return $.each(variable.all, function(index, gap) {
            if (gap.isFill) {
              _this.error(_this.messages.ggnFillInVariable());
            }
            if (!gap.isValid && gap !== '|') {
              _this.defineGapErrors(gap);
            }
            if (gap.isWildcard) {
              variablesWithWildcards[key] = true;
            }
            if (gap.isPercent) {
              percent += gap.value;
            }
            if (gap.isWildcard) {
              wildcards++;
            }
            if (gap.isFill) {
              return fills++;
            }
          });
        };
      })(this));
      $.each(this.grids, (function(_this) {
        return function(key, grid) {
          var width;
          $.each(grid.gaps.all, function(index, gap) {
            if (gap.isVariable && variablesWithWildcards[gap.id]) {
              _this.error(_this.messages.ggnNoWildcardsInVariableFills());
            }
            if (gap.isVariable && !_this.variables[gap.id]) {
              _this.error(_this.messages.ggnUndefinedVariable());
            }
            if (gap.isFill && fills) {
              _this.error(_this.messages.ggnOneFillPerGrid());
            }
            if (!gap.isValid && gap !== '|') {
              _this.defineGapErrors(gap);
            }
            if (gap.isPercent) {
              percent += gap.value;
            }
            if (gap.isWildcard) {
              wildcards++;
            }
            if (gap.isFill) {
              return fills++;
            }
          });
          if (grid.options.width) {
            width = new Gap(grid.options.width.toString(), _this.messages);
            if (!width.isValid) {
              return _this.defineGapErrors(width);
            }
          }
        };
      })(this));
      if (percent > 100) {
        this.error(this.messages.ggnMoreThanOneHundredPercent());
      }
      return this.wildcards = wildcards;
    };

    GGN.prototype.parseGrid = function(string) {
      var obj, optionBits, optionRegexp, optionStrings, options;
      obj = {
        options: {
          orientation: {
            id: "v",
            value: 'vertical'
          },
          remainder: {
            id: 'l',
            value: 'last'
          }
        },
        gaps: []
      };
      optionRegexp = /\((.*?)\)/i;
      optionBits = optionRegexp.exec(string);
      if (optionBits) {
        optionStrings = optionRegexp.exec(string)[1];
      }
      string = string.replace(optionRegexp, '');
      if (optionStrings) {
        options = this.parseOptions(optionStrings);
      }
      if (options) {
        $.each(options, function(key, value) {
          return obj.options[key] = value;
        });
      }
      obj.gaps = this.parseGridGaps(string);
      return this.grids.push(obj);
    };

    GGN.prototype.parseOptions = function(string) {
      var obj, optionArray, options;
      optionArray = string.toLowerCase().replace(/\s/, '').split(',');
      obj = {};
      options = optionArray[0].split('');
      $.each(options, function(index, option) {
        switch (option) {
          case "h":
            return obj.orientation = {
              id: "h",
              value: "horizontal"
            };
          case "v":
            return obj.orientation = {
              id: "v",
              value: "vertical"
            };
          case "f":
            return obj.remainder = {
              id: "f",
              value: "first"
            };
          case "c":
            return obj.remainder = {
              id: "c",
              value: "center"
            };
          case "l":
            return obj.remainder = {
              id: "l",
              value: "last"
            };
          case "p":
            return obj.calculation = {
              id: "p",
              value: "pixel"
            };
        }
      });
      if (optionArray[1]) {
        obj.width = new Unit(optionArray[1]);
      }
      if (optionArray[2]) {
        obj.offset = new Unit(optionArray[2]);
      }
      return obj;
    };

    GGN.prototype.parseVariable = function(string) {
      var id, varBits, varRegexp;
      id = '_';
      varRegexp = /^\$([^=\s]+)?\s?=\s?(.*)$/i;
      varBits = varRegexp.exec(string);
      if (varBits[1]) {
        id = varBits[1];
      }
      return this.variables[id] = this.parseGridGaps(varBits[2]);
    };

    GGN.prototype.parseGridGaps = function(string) {
      var gapStrings, gaps;
      string = string.replace(/^\s+|\s+$/g, '').replace(/\s\s+/g, ' ');
      gaps = {
        forString: [],
        all: []
      };
      gapStrings = string.split(/\s/);
      $.each(gapStrings, (function(_this) {
        return function(index, value) {
          var gap, i, _i, _ref, _results;
          gap = new Gap(value, _this.messages);
          if (value === '|') {
            gaps.forString.push('|');
            return gaps = _this.allocate(value, gaps);
          } else {
            gaps.forString.push(gap);
            _results = [];
            for (i = _i = 1, _ref = gap.multiplier; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
              _results.push(gaps = _this.allocate(gap, gaps));
            }
            return _results;
          }
        };
      })(this));
      return gaps;
    };

    GGN.prototype.allocate = function(gap, gaps) {
      if (gap !== '|') {
        gap = gap.clone();
      }
      if (gap.isVariable && !gap.isFill) {
        $.each(this.variables[gap.id].all, (function(_this) {
          return function(index, varGap) {
            return gaps = _this.allocate(varGap, gaps);
          };
        })(this));
        gaps;
      } else {
        if (!gaps.all) {
          gaps.all = [];
        }
        gaps.all.push(gap);
        if (gap.isPercent) {
          if (!gaps.percents) {
            gaps.percents = [];
          }
          gaps.percents.push(gap);
        }
        if (gap.isArbitrary && !gap.isFill) {
          if (!gaps.arbitrary) {
            gaps.arbitrary = [];
          }
          gaps.arbitrary.push(gap);
        }
        if (gap.isWildcard) {
          if (!gaps.wildcards) {
            gaps.wildcards = [];
          }
          gaps.wildcards.push(gap);
        }
      }
      if (gap.isFill) {
        gaps.fill = gap;
      }
      return gaps;
    };

    GGN.prototype.error = function(message) {
      var id;
      this.isValid = false;
      id = message.replace(/\s/g, '').toLowerCase();
      if (!this.errors[id]) {
        this.errors[id] = {
          id: this.newErrorId,
          message: message
        };
        return this.newErrorId++;
      } else {
        return this.errors[id].id;
      }
    };

    GGN.prototype.defineGapErrors = function(gap) {
      return $.each(gap.errors, (function(_this) {
        return function(key, error) {
          return error.id = _this.error(error.message);
        };
      })(this));
    };

    return GGN;

  })();

  window.GuideGuideNotationRefactor = (function() {
    function GuideGuideNotationRefactor(args) {
      if (args == null) {
        args = {};
      }
      this.clean = __bind(this.clean, this);
      this.validate = __bind(this.validate, this);
      this.stringify = __bind(this.stringify, this);
      this.parse = __bind(this.parse, this);
    }

    GuideGuideNotationRefactor.prototype.parse = function(string) {
      if (string == null) {
        string = "";
      }
      return [];
    };

    GuideGuideNotationRefactor.prototype.stringify = function(obj) {
      if (obj == null) {
        obj = {};
      }
      return "";
    };

    GuideGuideNotationRefactor.prototype.validate = function(ggn) {
      if (ggn == null) {
        ggn = "";
      }
      return ggn;
    };

    GuideGuideNotationRefactor.prototype.clean = function(string) {
      if (string == null) {
        string = "";
      }
      return "";
    };

    return GuideGuideNotationRefactor;

  })();

}).call(this);
