(function() {
  var GGN, Gap, GuideGuide, Messages, Unit, arbitraryRegexp, getBaseValue, parseUnit, resolution, variableRegexp, wildcardRegexp,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  resolution = 72;

  Unit = (function() {
    Unit.prototype.value = null;

    Unit.prototype.type = null;

    Unit.prototype.baseValue = null;

    Unit.prototype.isValid = true;

    Unit.prototype.original = null;

    function Unit(string, integerOnly) {
      var unitGaps, unitString;
      if (integerOnly == null) {
        integerOnly = false;
      }
      this.toString = __bind(this.toString, this);
      this.original = string = string.replace(/\s/g, '');
      unitGaps = string.match(/([-0-9\.]+)([a-z%]+)?/i) || '';
      this.value = parseFloat(unitGaps[1]);
      if (!integerOnly) {
        unitString = unitGaps[2] || '';
        if (this.value) {
          this.type = parseUnit(unitString);
        }
        this.baseValue = getBaseValue(this.value, this.type);
        this.isValid = this.type !== null;
      } else {
        if (unitGaps[1]) {
          this.type = 'integer';
          this.isValid = true;
        }
      }
      if (this.value == null) {
        this.isValid = false;
      }
      if (!this.type) {
        this.isValid = false;
        this.type = unitString;
      }
    }

    Unit.prototype.toString = function() {
      if (this.isValid) {
        return "" + this.value + (this.type && this.type !== 'integer' ? this.type : '');
      } else {
        return this.original;
      }
    };

    return Unit;

  })();

  parseUnit = function(string) {
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
      case '':
        return parseUnit(parent.window.GuideGuide.activeDocumentInfo.ruler);
      default:
        return null;
    }
  };

  getBaseValue = function(value, type) {
    var tmpValue, unitCanon;
    tmpValue = 0;
    unitCanon = {
      cm: 2.54,
      inch: 1,
      mm: 25.4,
      px: resolution,
      point: 72,
      pica: 6
    };
    switch (type) {
      case 'cm':
        tmpValue = value / unitCanon.cm;
        break;
      case 'in':
        tmpValue = value / unitCanon.inch;
        break;
      case 'mm':
        tmpValue = value / unitCanon.mm;
        break;
      case 'px':
        tmpValue = value / unitCanon.px;
        break;
      case 'points':
        tmpValue = value / unitCanon.point;
        break;
      case 'picas':
        tmpValue = value / unitCanon.pica;
        break;
      case '%':
        break;
      default:
        return 0;
    }
    return tmpValue * unitCanon.px;
  };

  Messages = (function() {
    Messages.prototype.messages = {
      'en_us': {
        'ui.grid': "Grid",
        'ui.custom': "Custom",
        'ui.sets': "Sets",
        'ui.updates': "Updates",
        'ui.btnMakeGrid': "Make grid",
        'ui.btnSaveSettings': "Save settings",
        'ui.btnImport': "Import",
        'ui.btnExport': "Export",
        'ui.btnOk': "Ok",
        'ui.btnCheckForUpdates': "Check for updates",
        'ui.titleHorizontalPosition': "Horizontal position",
        'ui.titleVerticalPosition': "Vertical position",
        'ui.titleHorizontalRemainder': "Horizontal remainder",
        'ui.titleVerticalPosition': "Vertical position",
        'ui.titleReportAnonymousData': "Report anonymous data",
        'ui.settingHorizontalFirst': 'Left',
        'ui.settingHorizontalCenter': 'Center',
        'ui.settingHorizontalLast': 'Right',
        'ui.settingVerticalFirst': 'Top',
        'ui.settingVerticalCenter': 'Center',
        'ui.settingVerticalLast': 'Bottom',
        'ui.yes': 'Yes',
        'ui.no': 'No',
        'gap.unrecognized': "Unrecognized gap",
        'gap.noFillWildcards': "Wildcards cannot be fills",
        'ggn.noGrids': "This string does not contain any grids",
        'ggn.fillInVariable': "Variables cannot contain a fill",
        'ggn.noWildcardsInVariableFills': "A variable used as a fill can not contain a wildcard",
        'ggn.undefinedVariable': "Undefined variable",
        'ggn.oneFillPerGrid': "A grid can only contain one fill",
        'ggn.moreThanOneHundredPercent': "A grid cannot contain more than 100%",
        'ggn.stringFromExistingGuides': "String generated from existing guides",
        'alertTitle.welcome': "Welcome to GuideGuide",
        'alertMessage.welcome': "This is the beginning of something special. To help GuideGuide get more and more awesome, would you allow GuideGuide to submit anonymous usage data?",
        'alertTitle.upToDate': "Up to date",
        'alertMessage.upToDate': "GuideGuide is currently up to date.",
        'alertTitle.updateError': "Error Checking for updates",
        'alertMessage.updateError': "Unfortunately, GuideGuide is unable to check for updates at this time. Please try again later.",
        'help.position': "This determines where GuideGuide puts a grid when it is smaller than the available area.",
        'help.remainder': "In pixel mode, GuideGuide rounds down decimal pixel widths and uses this setting to determine which columns or rows receive the remainder pixels."
      }
    };

    function Messages(i18n) {
      var _this = this;
      if (this.messages[i18n]) {
        $.each(this.messages['en_us'], function(key, value) {
          return _this[key] = _this.messages[i18n][key] ? _this.messages[i18n][key] : value;
        });
      } else {
        parent.window.PanelBridge.log("GuideGuide doesn't recognize the \"" + i18n + "\" localization.");
      }
    }

    return Messages;

  })();

  GGN = (function() {
    GGN.prototype.ggn = '';

    GGN.prototype.variables = {};

    GGN.prototype.errors = {};

    GGN.prototype.newErrorId = 0;

    GGN.prototype.grids = [];

    GGN.prototype.isValid = true;

    GGN.prototype.wildcards = 0;

    function GGN(string) {
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
      this.messages = parent.window.GuideGuide.messages;
      this.parse(this.ggn);
    }

    GGN.prototype.parse = function(string) {
      var lines,
        _this = this;
      string = string.replace(/^[\s]+|[\s]+$/mg, '').replace(/[^\S\n]+\|[^\S\n]+/g, '|').replace(/\|+/g, ' | ');
      lines = string.split(/\n/g);
      $.each(lines, function(index, line) {
        if (/^\$.*?\s?=.*$/i.test(line)) {
          return _this.parseVariable(line);
        } else if (/^\s*#/i.test(line)) {

        } else {
          return _this.parseGrid(line);
        }
      });
      return this.validate();
    };

    GGN.prototype.toString = function() {
      var string,
        _this = this;
      string = "";
      $.each(this.variables, function(key, variable) {
        var gaps;
        string += "$" + (key !== '_' ? key : '') + " = ";
        gaps = $.map(variable.forString, function(gap) {
          return gap.toString();
        });
        string += gaps.join(' ');
        return string += '\n';
      });
      if (!$.isEmptyObject(this.variables)) {
        string += '\n';
      }
      $.each(this.grids, function(key, grid) {
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
      });
      if (!$.isEmptyObject(this.grids)) {
        string += '\n';
      }
      $.each(this.errors, function(key, error) {
        return string += "# " + error.id + ": " + error.message + "\n";
      });
      return string;
    };

    GGN.prototype.validate = function() {
      var fills, percent, variablesWithWildcards, wildcards,
        _this = this;
      wildcards = 0;
      fills = 0;
      percent = 0;
      variablesWithWildcards = {};
      if (!this.grids.length) {
        this.error(this.messages['ggn.noGrids']);
      }
      $.each(this.variables, function(key, variable) {
        return $.each(variable.all, function(index, gap) {
          if (gap.isFill) {
            _this.error(_this.messages['ggn.fillInVariable']);
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
      });
      $.each(this.grids, function(key, grid) {
        var width;
        $.each(grid.gaps.all, function(index, gap) {
          if (gap.isVariable && variablesWithWildcards[gap.id]) {
            _this.error(_this.messages['ggn.noWildcardsInVariableFills']);
          }
          if (gap.isVariable && !_this.variables[gap.id]) {
            _this.error(_this.messages['ggn.undefinedVariable']);
          }
          if (gap.isFill && fills) {
            _this.error(_this.messages['ggn.oneFillPerGrid']);
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
          width = new Gap(grid.options.width.toString());
          if (!width.isValid) {
            return _this.defineGapErrors(width);
          }
        }
      });
      if (percent > 100) {
        this.error(this.messages['ggn.moreThanOneHundredPercent']);
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
          position: {
            id: "F",
            value: 'first'
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
      optionArray = string.replace(/\s/, '').split(',');
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
          case "F":
            return obj.position = {
              id: "F",
              value: "first"
            };
          case "C":
            return obj.position = {
              id: "C",
              value: "center"
            };
          case "L":
            return obj.position = {
              id: "L",
              value: "last"
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
      var gapStrings, gaps,
        _this = this;
      string = string.replace(/^\s+|\s+$/g, '').replace(/\s\s+/g, ' ');
      gaps = {
        forString: [],
        all: []
      };
      gapStrings = string.split(/\s/);
      $.each(gapStrings, function(index, value) {
        var gap, i, _i, _ref, _results;
        gap = new Gap(value);
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
      });
      return gaps;
    };

    GGN.prototype.allocate = function(gap, gaps) {
      var _this = this;
      if (gap !== '|') {
        gap = gap.clone();
      }
      if (gap.isVariable && !gap.isFill) {
        $.each(this.variables[gap.id].all, function(index, varGap) {
          return gaps = _this.allocate(varGap, gaps);
        });
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
      var _this = this;
      return $.each(gap.errors, function(key, error) {
        return error.id = _this.error(error.message);
      });
    };

    return GGN;

  })();

  variableRegexp = /^\$([^\*]+)?(\*(\d+)?)?$/i;

  arbitraryRegexp = /^(([-0-9\.]+)?[a-z%]+)(\*(\d+)?)?$/i;

  wildcardRegexp = /^~(\*(\d*))?$/i;

  Gap = (function() {
    Gap.prototype.isValid = true;

    Gap.prototype.original = null;

    Gap.prototype.errors = {};

    Gap.prototype.unit = {};

    Gap.prototype.value = null;

    Gap.prototype.isFill = null;

    Gap.prototype.isVariable = null;

    Gap.prototype.isArbitrary = null;

    Gap.prototype.isWildcard = null;

    Gap.prototype.isUnrecognized = null;

    Gap.prototype.isPercent = null;

    Gap.prototype.typePrefix = '';

    function Gap(string) {
      this.toString = __bind(this.toString, this);
      this.invalidBecause = __bind(this.invalidBecause, this);
      this.convertPercent = __bind(this.convertPercent, this);
      this.parseArbitrary = __bind(this.parseArbitrary, this);
      this.errors = {};
      this.original = string = string.replace(/\s/g, '');
      this.messages = parent.window.GuideGuide.messages;
      if (variableRegexp.test(string)) {
        this.parseVariable(string);
      } else if (arbitraryRegexp.test(string)) {
        this.parseArbitrary(string);
      } else if (wildcardRegexp.test(string)) {
        this.parseWildcard(string);
      } else {
        this.multiplier = 1;
        this.invalidBecause(this.messages['gap.unrecognized']);
      }
    }

    Gap.prototype.parseWildcard = function(string) {
      var gapBits;
      this.isWildcard = true;
      gapBits = wildcardRegexp.exec(string);
      this.isFill = gapBits[1] && !gapBits[2] || false;
      this.multiplier = parseInt(gapBits[2]) || 1;
      if (this.isFill) {
        return this.invalidBecause(this.messages['gap.noFillWildcards']);
      }
    };

    Gap.prototype.parseVariable = function(string) {
      var gapBits;
      this.isVariable = true;
      gapBits = variableRegexp.exec(string);
      this.id = gapBits[1] ? gapBits[1] : "_";
      this.multiplier = parseInt(gapBits[3]) || 1;
      return this.isFill = gapBits[2] && !gapBits[3] || false;
    };

    Gap.prototype.parseArbitrary = function(string) {
      var gapBits;
      this.isArbitrary = true;
      gapBits = arbitraryRegexp.exec(string);
      this.unit = new Unit(gapBits[1]);
      this.multiplier = parseInt(gapBits[4]) || 1;
      this.isFill = gapBits[3] && !gapBits[4] || false;
      if (this.unit.type === '%') {
        this.isPercent = true;
      }
      if (this.unit.isValid) {
        this.value = this.unit.baseValue;
        if (this.isPercent) {
          return this.value = this.unit.value;
        }
      } else {
        return this.invalidBecause(this.messages['gap.unrecognized']);
      }
    };

    Gap.prototype.convertPercent = function(value) {
      this.isPercent = false;
      this.unit = new Unit("" + value + "px");
      return this.value = this.unit.value;
    };

    Gap.prototype.invalidBecause = function(reason) {
      this.isValid = false;
      return this.errors[reason.replace(/\s/g, '').toLowerCase()] = {
        id: '',
        message: reason
      };
    };

    Gap.prototype.toString = function(validate) {
      var string;
      if (validate == null) {
        validate = true;
      }
      string = "";
      if (this.isVariable) {
        string += '$';
        if (this.id !== '_') {
          string += this.id;
        }
        if (this.isFill || this.multiplier > 1) {
          string += '*';
        }
        if (this.multiplier > 1) {
          string += this.multiplier;
        }
      } else if (this.isArbitrary) {
        string += this.typePrefix + this.unit.toString();
        if (this.isFill || this.multiplier > 1) {
          string += '*';
        }
        if (this.multiplier > 1) {
          string += this.multiplier;
        }
      } else if (this.isWildcard) {
        string += "~";
        if (this.isFill || this.multiplier > 1) {
          string += '*';
        }
        if (this.multiplier > 1) {
          string += this.multiplier;
        }
      } else {
        string = this.original;
      }
      if (validate && !$.isEmptyObject(this.errors)) {
        string = "{" + string + " [" + ($.map(this.errors, function(error) {
          return error.id;
        }).join(',')) + "]}";
      }
      return string;
    };

    Gap.prototype.clone = function() {
      var gap;
      gap = new Gap(this.original);
      gap.multiplier = 1;
      gap = new Gap(gap.toString(false));
      gap.errors = this.errors;
      return gap;
    };

    Gap.prototype.sum = function(variables) {
      var sum;
      if (variables == null) {
        variables = {};
      }
      if (this.isVariable) {
        sum = 0;
        $.each(variables[this.id], function(index, gap) {
          if (gap.value) {
            return sum += gap.value;
          }
        });
        return sum;
      } else {
        return this.value * this.multiplier;
      }
    };

    return Gap;

  })();

  GuideGuide = (function() {
    GuideGuide.prototype.siteUrl = 'http://guideguide.me';

    GuideGuide.prototype.env = 'production';

    GuideGuide.prototype.activeDocumentInfo = {
      ruler: 'px'
    };

    function GuideGuide(panel) {
      this.panel = panel;
      this.updateTheme = __bind(this.updateTheme, this);
      this.consolidateGuides = __bind(this.consolidateGuides, this);
      this.getGuidesFromGGN = __bind(this.getGuidesFromGGN, this);
      this.hideNewSetForm = __bind(this.hideNewSetForm, this);
      this.onHideNewSetForm = __bind(this.onHideNewSetForm, this);
      this.onShowGridNewSetForm = __bind(this.onShowGridNewSetForm, this);
      this.showCustomSetForm = __bind(this.showCustomSetForm, this);
      this.onShowSetsNewSetForm = __bind(this.onShowSetsNewSetForm, this);
      this.onShowCustomNewSetForm = __bind(this.onShowCustomNewSetForm, this);
      this.refreshSets = __bind(this.refreshSets, this);
      this.updateSet = __bind(this.updateSet, this);
      this.createNewSet = __bind(this.createNewSet, this);
      this.onMakeGridFromSet = __bind(this.onMakeGridFromSet, this);
      this.onMakeGridFromCusom = __bind(this.onMakeGridFromCusom, this);
      this.onMakeGridFromForm = __bind(this.onMakeGridFromForm, this);
      this.onSaveSetFromGrid = __bind(this.onSaveSetFromGrid, this);
      this.onSaveSetFromCustom = __bind(this.onSaveSetFromCustom, this);
      this.onEditSet = __bind(this.onEditSet, this);
      this.onExitCustomForm = __bind(this.onExitCustomForm, this);
      this.onExitGridForm = __bind(this.onExitGridForm, this);
      this.onClickExportSets = __bind(this.onClickExportSets, this);
      this.onClickImportSets = __bind(this.onClickImportSets, this);
      this.getOS = __bind(this.getOS, this);
      this.getAppVersion = __bind(this.getAppVersion, this);
      this.getVersion = __bind(this.getVersion, this);
      this.submitData = __bind(this.submitData, this);
      this.onHasUpdate = __bind(this.onHasUpdate, this);
      this.onClickHasUpdateButton = __bind(this.onClickHasUpdateButton, this);
      this.checkForUpdates = __bind(this.checkForUpdates, this);
      this.onClickCheckForUpdates = __bind(this.onClickCheckForUpdates, this);
      this.onDeleteSet = __bind(this.onDeleteSet, this);
      this.onSelectSet = __bind(this.onSelectSet, this);
      this.onBlurCustomForm = __bind(this.onBlurCustomForm, this);
      this.onFocusCustomForm = __bind(this.onFocusCustomForm, this);
      this.onBlurFormInput = __bind(this.onBlurFormInput, this);
      this.onClickDistributeIcon = __bind(this.onClickDistributeIcon, this);
      this.onMouseOutDistributeIcon = __bind(this.onMouseOutDistributeIcon, this);
      this.onMouseOverDistributeIcon = __bind(this.onMouseOverDistributeIcon, this);
      this.updateCustomField = __bind(this.updateCustomField, this);
      this.addGuidesfromGGN = __bind(this.addGuidesfromGGN, this);
      this.resetGuides = __bind(this.resetGuides, this);
      this.clearGuides = __bind(this.clearGuides, this);
      this.onClickClearGuides = __bind(this.onClickClearGuides, this);
      this.onClickVerticalMidpoint = __bind(this.onClickVerticalMidpoint, this);
      this.onClickHorizontalMidpoint = __bind(this.onClickHorizontalMidpoint, this);
      this.onClickRightGuide = __bind(this.onClickRightGuide, this);
      this.onClickLeftGuide = __bind(this.onClickLeftGuide, this);
      this.onClickBottomGuide = __bind(this.onClickBottomGuide, this);
      this.onClickTopGuide = __bind(this.onClickTopGuide, this);
      this.onDenySubmitData = __bind(this.onDenySubmitData, this);
      this.onConfirmSubmitData = __bind(this.onConfirmSubmitData, this);
      this.recordUsage = __bind(this.recordUsage, this);
      this.saveGuideGuideData = __bind(this.saveGuideGuideData, this);
      this.onToggleGuides = __bind(this.onToggleGuides, this);
      this.onClickDropdownItem = __bind(this.onClickDropdownItem, this);
      this.onToggleDropdown = __bind(this.onToggleDropdown, this);
      this.selectTab = __bind(this.selectTab, this);
      this.onTabClick = __bind(this.onTabClick, this);
      this.updateTheme = __bind(this.updateTheme, this);
      this.refreshSettings = __bind(this.refreshSettings, this);
      this.dismissAlert = __bind(this.dismissAlert, this);
      this.onClickDismissAlert = __bind(this.onClickDismissAlert, this);
      this.alert = __bind(this.alert, this);
      this.onClickCheckbox = __bind(this.onClickCheckbox, this);
      this.onClickHelpTarget = __bind(this.onClickHelpTarget, this);
      this.onClickInputBackground = __bind(this.onClickInputBackground, this);
      this.onInputInvalidate = __bind(this.onInputInvalidate, this);
      this.onInputBlur = __bind(this.onInputBlur, this);
      this.onInputFocus = __bind(this.onInputFocus, this);
      this.localizeUI = __bind(this.localizeUI, this);
      this.completeSetup = __bind(this.completeSetup, this);
      this.initData = __bind(this.initData, this);
      this.init = __bind(this.init, this);
      this.application = parent.$(window.parent.document) || $(document);
      this.bridge = parent.window.PanelBridge;
      this.panel.on('click', '.js-tabbed-page-tab', this.onTabClick);
      this.panel.on('click', '.js-custom-form .js-make-grid', this.onMakeGridFromCusom);
      this.panel.on('click', '.js-sets-form .js-make-grid', this.onMakeGridFromSet);
      this.panel.on('click', '.js-sets-form .js-set-select', this.onSelectSet);
      this.panel.on('click', '.js-sets-form .js-delete-set', this.onDeleteSet);
      this.panel.on('click', '.js-grid-form .js-new-set', this.onShowGridNewSetForm);
      this.panel.on('click', '.js-custom-form .js-new-set', this.onShowCustomNewSetForm);
      this.panel.on('click', '.js-sets-form .js-new-set', this.onShowSetsNewSetForm);
      this.panel.on('click', '.js-cancel-set', this.onHideNewSetForm);
      this.panel.on('click', '.js-grid-form .js-save-set', this.onSaveSetFromGrid);
      this.panel.on('click', '.js-custom-form .js-save-set', this.onSaveSetFromCustom);
      this.panel.on('click', '.js-sets-form .js-edit-set', this.onEditSet);
      this.panel.on('guideguide:exitform', this.onExitGridForm);
      this.panel.on('guideguide:exitcustom', this.onExitCustomForm);
      this.panel.on('guideguide:hasUpdate', this.onHasUpdate);
      this.panel.on('focus', '.js-custom-form .js-custom-input', this.onFocusCustomForm);
      this.panel.on('blur', '.js-custom-form .js-custom-input', this.onBlurCustomForm);
      this.panel.on('click', '.js-action-bar .js-clear', this.onClickClearGuides);
      this.panel.on('click', '.js-action-bar .js-top', this.onClickTopGuide);
      this.panel.on('click', '.js-action-bar .js-bottom', this.onClickBottomGuide);
      this.panel.on('click', '.js-action-bar .js-left', this.onClickLeftGuide);
      this.panel.on('click', '.js-action-bar .js-right', this.onClickRightGuide);
      this.panel.on('click', '.js-action-bar .js-horizontal-midpoint', this.onClickHorizontalMidpoint);
      this.panel.on('click', '.js-action-bar .js-vertical-midpoint', this.onClickVerticalMidpoint);
      this.panel.on('mouseover', '.js-grid-form [data-distribute] .js-iconned-input-button', this.onMouseOverDistributeIcon);
      this.panel.on('mouseout', '.js-grid-form [data-distribute] .js-iconned-input-button', this.onMouseOutDistributeIcon);
      this.panel.on('click', '.js-grid-form [data-distribute] .js-iconned-input-button', this.onClickDistributeIcon);
      this.panel.on('focus', '.js-grid-form .js-grid-form-input', this.onFocusFormInput);
      this.panel.on('blur', '.js-grid-form .js-grid-form-input', this.onBlurFormInput);
      this.panel.on('click', '.js-grid-form .js-make-grid', this.onMakeGridFromForm);
      this.panel.on('focus', '.js-set-name', this.onFocusSetName);
      this.panel.on('click', '.js-toggle-guide-visibility', this.onToggleGuides);
      this.panel.on('click', '.js-dropdown', this.onToggleDropdown);
      this.panel.on('click', '.js-dropdown .js-dropdown-item', this.onClickDropdownItem);
      this.panel.on('click', '.js-help-target', this.onClickHelpTarget);
      this.panel.on('click', '.js-checkbox', this.onClickCheckbox);
      this.panel.on('click', '.js-import-sets', this.onClickImportSets);
      this.panel.on('click', '.js-export-sets', this.onClickExportSets);
      this.panel.on('click', '.js-confirm-submit-data', this.onConfirmSubmitData);
      this.panel.on('click', '.js-deny-submit-data', this.onDenySubmitData);
      this.panel.on('click', '.js-check-for-updates', this.onClickCheckForUpdates);
      this.panel.on('click', '.js-dismiss-alert', this.onClickDismissAlert);
      this.panel.on('click', '.js-has-update-button', this.onClickHasUpdateButton);
      this.panel.on('focus', '.js-input input, .js-input textarea', this.onInputFocus);
      this.panel.on('blur', '.js-input input, .js-input textarea', this.onInputBlur);
      this.panel.on('input:invalidate', '.js-input', this.onInputInvalidate);
      this.panel.on('click', '.js-input-shell', this.onClickInputBackground);
      this.panel.find('textarea').autosize();
    }

    GuideGuide.prototype.init = function() {
      this.bridge.getData(this.initData);
      return this.panel.removeClass('hideUI');
    };

    GuideGuide.prototype.initData = function(data) {
      var panelBootstrap, setsBootstrap, settingsBootstrap, _base, _base1, _base2;
      this.bridge.log('Setting up data from application');
      this.guideguideData = data;
      panelBootstrap = {
        id: null,
        newSetId: 3,
        launchCount: 0,
        askedAboutAnonymousData: false,
        usage: {
          lifetime: 0,
          guideActions: 0,
          grid: 0,
          custom: 0,
          set: 0,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          verticalMidpoint: 0,
          horizontalMidpoint: 0,
          clear: 0
        }
      };
      setsBootstrap = [
        {
          id: 0,
          name: 'Outline',
          string: "| ~ | (vFl)\n| ~ | (hFl)"
        }, {
          id: 1,
          name: 'Two column grid',
          string: "| ~ | ~ | (vFl)"
        }, {
          id: 2,
          name: 'Three column grid',
          string: "| ~ | ~ | ~ | (vFl)"
        }
      ];
      settingsBootstrap = {
        horizontalRemainder: 'last',
        verticalRemainder: 'last',
        horizontalPosition: 'first',
        verticalPosition: 'first',
        calculation: 'pixel',
        reportAnonymousData: false
      };
      (_base = this.guideguideData).panel || (_base.panel = panelBootstrap);
      (_base1 = this.guideguideData).sets || (_base1.sets = setsBootstrap);
      (_base2 = this.guideguideData).settings || (_base2.settings = settingsBootstrap);
      this.guideguideData.panel.launchCount++;
      this.saveGuideGuideData();
      return this.completeSetup();
    };

    GuideGuide.prototype.completeSetup = function() {
      var _this = this;
      this.refreshSets();
      this.bridge.log("Running " + this.guideguideData.application.name + " in " + this.guideguideData.application.env + " mode");
      if (this.guideguideData.application.env === 'development') {
        this.siteUrl = 'http://localhost:5000';
      }
      this.messages = new Messages(this.guideguideData.application.localization);
      if (!this.guideguideData.panel.askedAboutAnonymousData && this.guideguideData.application.env !== 'demo') {
        this.alert('welcome', ['primary js-confirm-submit-data', 'js-deny-submit-data'], ['ui.yes', 'ui.no']);
      }
      this.refreshSettings();
      this.localizeUI();
      if (this.guideguideData.application.env !== 'demo') {
        this.submitData();
        return this.checkForUpdates(function(data) {
          if ((data != null) && data.hasUpdate) {
            return _this.panel.trigger('guideguide:hasUpdate', data);
          }
        });
      }
    };

    GuideGuide.prototype.localizeUI = function() {
      var $elements,
        _this = this;
      $elements = $('[data-localize]');
      return $elements.each(function(index, el) {
        return $(el).text(_this.messages[$(el).attr('data-localize')]);
      });
    };

    GuideGuide.prototype.onInputFocus = function(event) {
      var _this = this;
      $(event.currentTarget).closest('.js-input').addClass('is-focused');
      $(event.currentTarget).closest('.js-input').removeClass('is-invalid');
      return this.bridge.getDocumentInfo(function(info) {
        return _this.activeDocumentInfo = info;
      });
    };

    GuideGuide.prototype.onInputBlur = function(event) {
      return $(event.currentTarget).closest('.js-input').removeClass('is-focused');
    };

    GuideGuide.prototype.onInputInvalidate = function(event) {
      return $(event.currentTarget).addClass('is-invalid');
    };

    GuideGuide.prototype.onClickInputBackground = function(event) {
      var $inputs, $textAreas;
      if (!$(event.target).hasClass("js-input-shell")) {
        return;
      }
      $inputs = $(event.currentTarget).find('input');
      $textAreas = $(event.currentTarget).find('textarea');
      if ($inputs.length) {
        $inputs.focus();
      }
      if ($textAreas.length) {
        return $textAreas.focus();
      }
    };

    GuideGuide.prototype.onClickHelpTarget = function(event) {
      event.preventDefault();
      return $(event.currentTarget).closest('.js-help').toggleClass("is-helping");
    };

    GuideGuide.prototype.onClickCheckbox = function(event) {
      var $checkbox, $form, val,
        _this = this;
      event.preventDefault();
      $checkbox = $(event.currentTarget);
      val = $checkbox.attr('data-checked') === 'true';
      $checkbox.attr('data-checked', !val);
      $form = $checkbox.closest('.js-grid-form');
      return this.stringifyFormData(this.getFormData($form), function(string) {
        return _this.updateCustomField(string);
      });
    };

    GuideGuide.prototype.alert = function(data, buttonClasses, buttonNames) {
      var message, title,
        _this = this;
      buttonClasses || (buttonClasses = ['primary js-dismiss-alert']);
      buttonNames || (buttonNames = ['ui.btnOk']);
      title = typeof data === 'string' ? this.messages["alertTitle." + data] : data[0];
      message = typeof data === 'string' ? this.messages["alertMessage." + data] : data[1];
      this.panel.find('.js-alert-title').text(title);
      this.panel.find('.js-alert-message').text(message);
      this.panel.find('.js-alert-actions').html('');
      $.each(buttonClasses, function(i, value) {
        var button;
        button = $('.js-button-template').clone().removeClass('js-button-template');
        button.find('a').addClass(buttonClasses[i]).text((buttonNames[i] ? _this.messages[buttonNames[i]] : _this.messages['ui.btnOk']));
        return _this.panel.find('.js-alert-actions').append(button);
      });
      return this.panel.addClass('has-alert');
    };

    GuideGuide.prototype.onClickDismissAlert = function(event) {
      event.preventDefault();
      return this.dismissAlert();
    };

    GuideGuide.prototype.dismissAlert = function() {
      this.panel.find('.js-alert-title').text('');
      this.panel.find('.js-alert-message').text('');
      return this.panel.removeClass('has-alert');
    };

    GuideGuide.prototype.refreshSettings = function() {
      var $dropdowns,
        _this = this;
      $dropdowns = $('.js-dropdown');
      return $dropdowns.each(function(index, el) {
        var $dropdown, $selected, setting, value;
        $dropdown = $(el);
        setting = $dropdown.attr('data-setting');
        value = _this.guideguideData.settings[setting];
        $selected = $dropdown.find("[data-value='" + value + "']");
        return $dropdown.find('.js-dropdown-button').text(_this.messages[$selected.attr('data-localize')]);
      });
    };

    GuideGuide.prototype.updateTheme = function(theme) {
      return this.panel.attr('data-theme', theme);
    };

    GuideGuide.prototype.onTabClick = function(event) {
      var enterPage, exitPage, filter;
      event.preventDefault();
      exitPage = this.panel.find('.js-tabbed-page-tab.is-selected').attr('data-page');
      enterPage = $(event.currentTarget).attr('data-page');
      if (enterPage === exitPage) {
        return;
      }
      $('#guideguide').trigger("guideguide:exit" + exitPage);
      if (filter = enterPage) {
        this.selectTab(this.panel, filter);
      }
      return $('#guideguide').trigger("guideguide:enter" + enterPage);
    };

    GuideGuide.prototype.selectTab = function($container, name) {
      var filter, tab, tabBucket;
      $container.find("[data-page]").removeClass('is-selected');
      if (name) {
        filter = function() {
          return $(this).attr('data-page') === name;
        };
        tab = $container.find('.js-tabbed-page-tab').filter(filter);
        tabBucket = $container.find('.js-tabbed-page').filter(filter);
      } else {
        tab = $container.find('.js-tabbed-page-tab:first');
        tabBucket = $container.find('.js-tabbed-page:first');
      }
      tab.addClass('is-selected');
      return tabBucket.addClass('is-selected');
    };

    GuideGuide.prototype.onToggleDropdown = function(event) {
      var $dropdown, $list, listBottom, offset, visibleBottom;
      event.preventDefault();
      if ($(event.target).hasClass('js-dropdown-backdrop')) {
        $('.js-dropdown').removeClass('is-active');
      } else {
        $dropdown = $(event.currentTarget);
        $dropdown.toggleClass('is-active');
        $list = $dropdown.find('.js-dropdown-list');
        visibleBottom = $('.js-settings-list').scrollTop() + $('.js-settings-list').outerHeight();
        listBottom = $dropdown.position().top + $list.position().top + $list.outerHeight() + 3;
        if (listBottom > visibleBottom) {
          offset = listBottom - visibleBottom;
          $('.js-settings-list').scrollTop($('.js-settings-list').scrollTop() + offset);
        }
      }
      return this.panel.toggleClass('has-dropdown');
    };

    GuideGuide.prototype.onClickDropdownItem = function(event) {
      var $dropdown, $item, setting, value;
      event.preventDefault();
      $item = $(event.currentTarget);
      $dropdown = $item.closest('.js-dropdown');
      setting = $dropdown.attr('data-setting');
      value = $item.attr('data-value');
      if (value === "true") {
        value = true;
      }
      if (value === "false") {
        value = false;
      }
      $dropdown.find('.js-dropdown-button').text(this.messages[$item.attr('data-localize')]);
      this.guideguideData.settings[setting] = value;
      return this.saveGuideGuideData();
    };

    GuideGuide.prototype.onToggleGuides = function(event) {
      event.preventDefault();
      this.bridge.log("Toggle guides");
      return this.bridge.toggleGuides();
    };

    GuideGuide.prototype.saveGuideGuideData = function() {
      return this.bridge.setData(this.guideguideData);
    };

    GuideGuide.prototype.recordUsage = function(property, count) {
      this.guideguideData.panel.usage.lifetime += count;
      if (this.guideguideData.panel.usage[property] != null) {
        this.guideguideData.panel.usage[property]++;
        if (property !== 'clear') {
          this.guideguideData.panel.usage.guideActions++;
        }
        return this.saveGuideGuideData();
      }
    };

    GuideGuide.prototype.onConfirmSubmitData = function(event) {
      event.preventDefault();
      this.guideguideData.settings.reportAnonymousData = true;
      this.guideguideData.panel.askedAboutAnonymousData = true;
      this.saveGuideGuideData();
      this.refreshSettings();
      return this.dismissAlert();
    };

    GuideGuide.prototype.onDenySubmitData = function(event) {
      event.preventDefault();
      this.guideguideData.panel.askedAboutAnonymousData = true;
      this.saveGuideGuideData();
      return this.dismissAlert();
    };

    GuideGuide.prototype.onClickTopGuide = function(event) {
      event.preventDefault();
      return this.addGuidesfromGGN("| ~ (h" + (this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")", 'top');
    };

    GuideGuide.prototype.onClickBottomGuide = function(event) {
      event.preventDefault();
      return this.addGuidesfromGGN("~ | (h" + (this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")", 'bottom');
    };

    GuideGuide.prototype.onClickLeftGuide = function(event) {
      event.preventDefault();
      return this.addGuidesfromGGN("| ~ (v" + (this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")", 'left');
    };

    GuideGuide.prototype.onClickRightGuide = function(event) {
      event.preventDefault();
      return this.addGuidesfromGGN("~ | (v" + (this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")", 'right');
    };

    GuideGuide.prototype.onClickHorizontalMidpoint = function(event) {
      event.preventDefault();
      return this.addGuidesfromGGN("~ | ~ (h" + (this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")", 'horizontalMidpoint');
    };

    GuideGuide.prototype.onClickVerticalMidpoint = function(event) {
      event.preventDefault();
      return this.addGuidesfromGGN("~ | ~ (v" + (this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")", 'verticalMidpoint');
    };

    GuideGuide.prototype.onClickClearGuides = function(event) {
      var _this = this;
      event.preventDefault();
      return this.bridge.getDocumentInfo(function(info) {
        if (!info.hasOpenDocuments) {
          return;
        }
        _this.clearGuides();
        return _this.recordUsage('clear');
      });
    };

    GuideGuide.prototype.clearGuides = function() {
      var _this = this;
      this.bridge.log("Clear guides");
      return this.bridge.getDocumentInfo(function(info) {
        var bounds;
        if (info.isSelection) {
          bounds = {
            top: info.offsetY,
            left: info.offsetX,
            bottom: info.offsetY + info.height,
            right: info.offsetX + info.width
          };
          _this.resetGuides();
          return _this.bridge.addGuides(_this.consolidateGuides([info.existingGuides], bounds, true));
        } else {
          return _this.resetGuides();
        }
      });
    };

    GuideGuide.prototype.resetGuides = function() {
      this.bridge.log('Resetting guides');
      return this.bridge.resetGuides();
    };

    GuideGuide.prototype.addGuidesfromGGN = function(ggn, source) {
      var _this = this;
      return this.bridge.getDocumentInfo(function(info) {
        var guides;
        if (!(info && info.hasOpenDocuments)) {
          return;
        }
        guides = [];
        return _this.getGuidesFromGGN(new GGN(ggn), info, function(g) {
          guides = _this.consolidateGuides([g, info.existingGuides]);
          _this.bridge.log("Add guides from " + source);
          _this.recordUsage(source, guides.length);
          return _this.bridge.addGuides(guides);
        });
      });
    };

    GuideGuide.prototype.updateCustomField = function(text) {
      return this.panel.find('.js-custom-input').val(text).trigger('autosize.resize');
    };

    GuideGuide.prototype.onMouseOverDistributeIcon = function(event) {
      var $fields, $form, type;
      $form = $(event.currentTarget).closest('.js-grid-form');
      type = $(event.currentTarget).closest('[data-distribute]').attr('data-distribute');
      $fields = this.filteredList($form.find('.js-grid-form-iconned-input'), type);
      return $fields.addClass('distribute-highlight');
    };

    GuideGuide.prototype.onMouseOutDistributeIcon = function(event) {
      return this.panel.find('.distribute-highlight').removeClass('distribute-highlight');
    };

    GuideGuide.prototype.onClickDistributeIcon = function(event) {
      var $field, $fields, $form, $input, type, value;
      event.preventDefault();
      $form = $(event.currentTarget).closest('.js-grid-form');
      $input = $(event.currentTarget).closest('.js-grid-form-iconned-input');
      $field = $input.find('.js-grid-form-input');
      this.formatField($field);
      value = $field.val();
      type = $input.attr('data-distribute');
      $fields = this.filteredList($form.find('.js-grid-form-iconned-input'), type);
      return $fields.find('.js-grid-form-input').val(value);
    };

    GuideGuide.prototype.onBlurFormInput = function(event) {
      var $form, $input, int, val,
        _this = this;
      $input = $(event.currentTarget);
      if ($input.val()) {
        int = false;
        if ($input.attr('data-integer')) {
          val = Math.round(parseFloat($input.val()));
          if (val) {
            $input.val(val);
          }
          int = true;
        }
        if (!this.isValid($input.val(), int)) {
          return $input.trigger('input:invalidate');
        } else {
          this.formatField($input);
          $form = $input.closest('.js-grid-form');
          return this.stringifyFormData(this.getFormData($form), function(string) {
            return _this.updateCustomField(string);
          });
        }
      }
    };

    GuideGuide.prototype.onFocusCustomForm = function(event) {
      var $input;
      $input = $(event.currentTarget);
      return $input.val($input.val().replace(/[\{\}]|\[.*?\]|^#.*?$/gm, '').replace(/\s+$/g, ''));
    };

    GuideGuide.prototype.onBlurCustomForm = function(event) {
      var $input, ggn, string;
      $input = $(event.currentTarget);
      if (string = $input.val().replace(/^\s+|\s+$/g, '')) {
        ggn = new GGN($input.val());
        if (!ggn.isValid) {
          $input.trigger('input:invalidate');
        }
        $input.val(ggn.toString());
        return $input.trigger('autosize.resize');
      }
    };

    GuideGuide.prototype.onSelectSet = function(event) {
      var $set;
      event.preventDefault();
      $set = $(event.currentTarget);
      $set.closest('.js-sets-form').find('.is-selected').removeClass('is-selected');
      return $set.closest('.js-set').addClass('is-selected');
    };

    GuideGuide.prototype.onDeleteSet = function(event) {
      var $set, id;
      event.preventDefault();
      $set = $(event.currentTarget).closest('.js-set');
      id = $set.attr('data-id');
      this.guideguideData.sets = $.grep(this.guideguideData.sets, function(set) {
        return parseInt(set.id) !== parseInt(id);
      });
      this.saveGuideGuideData();
      return this.refreshSets();
    };

    GuideGuide.prototype.onClickCheckForUpdates = function(event) {
      var _this = this;
      event.preventDefault();
      return this.checkForUpdates(function(data) {
        _this.bridge.log(data);
        if (data != null) {
          if (data.hasUpdate) {
            _this.panel.trigger('guideguide:hasUpdate', data);
            return $('.js-has-update-button').click();
          } else {
            return _this.alert('upToDate', ['primary js-dismiss-alert'], ['ui.btnOk']);
          }
        } else {
          return _this.alert('updateError', ['primary js-dismiss-alert'], ['ui.btnOk']);
        }
      });
    };

    GuideGuide.prototype.checkForUpdates = function(callback) {
      var _this = this;
      if (!this.guideguideData.application.checkForUpdates) {
        return;
      }
      this.bridge.log('Checking for updates');
      return $.ajax({
        type: 'GET',
        url: "" + this.siteUrl + "/panel/" + this.guideguideData.application.id,
        data: {
          version: this.guideguideData.application.guideguideVersion || '0.0.0',
          i18n: this.guideguideData.application.localization
        },
        success: function(data) {
          return callback(data);
        },
        error: function(error) {
          _this.bridge.log(error);
          return callback(null);
        }
      });
    };

    GuideGuide.prototype.onClickHasUpdateButton = function(event) {
      var message, title;
      event.preventDefault();
      title = $(event.currentTarget).attr('data-title');
      message = $(event.currentTarget).attr('data-message');
      return this.alert([title, message], ['primary js-dismiss-alert'], ['ui.btnOk']);
    };

    GuideGuide.prototype.onHasUpdate = function(event, data) {
      var button;
      this.panel.addClass('has-update');
      button = this.panel.find('.js-has-update-button');
      button.attr('data-title', data.title);
      return button.attr('data-message', data.message);
    };

    GuideGuide.prototype.submitData = function() {
      var data,
        _this = this;
      if (!(this.guideguideData.settings.reportAnonymousData && this.guideguideData.application.submitAnonymousData)) {
        return;
      }
      this.bridge.log('Submitting anonymous data');
      data = {
        usage: this.guideguideData.panel.usage
      };
      if (this.guideguideData.panel.id != null) {
        data._id = this.guideguideData.panel.id;
      } else {
        data.version = this.guideguideData.application.guideguideVersion;
        data.appID = this.guideguideData.application.id;
        data.appName = this.guideguideData.application.name;
        data.AppVersion = this.guideguideData.application.version;
        data.os = this.guideguideData.application.os;
        data.localization = this.guideguideData.application.localization;
      }
      return $.ajax({
        type: 'POST',
        url: "" + this.siteUrl + "/install",
        data: data,
        success: function(data) {
          _this.bridge.log('Anonymous data submitted successfully');
          if (typeof data === 'object' && data._id) {
            _this.guideguideData.panel.id = data._id;
            return _this.saveGuideGuideData();
          }
        }
      });
    };

    GuideGuide.prototype.getVersion = function() {
      return '0.0.0';
    };

    GuideGuide.prototype.getAppVersion = function() {
      return '0.0.0';
    };

    GuideGuide.prototype.getOS = function() {
      return 'Unknown OS';
    };

    GuideGuide.prototype.onClickImportSets = function(event) {
      event.preventDefault();
      return this.bridge.log('Import sets');
    };

    GuideGuide.prototype.onClickExportSets = function(event) {
      event.preventDefault();
      return this.bridge.log('Export sets');
    };

    GuideGuide.prototype.onExitGridForm = function() {
      return this.hideNewSetForm();
    };

    GuideGuide.prototype.onExitCustomForm = function() {
      return this.hideNewSetForm();
    };

    GuideGuide.prototype.onEditSet = function(event) {
      var $form, $set, id, set;
      event.preventDefault();
      $('#guideguide').find('.js-custom-tab').click();
      $set = $(event.currentTarget).closest('.js-set');
      id = $set.attr('data-id');
      set = $.grep(this.guideguideData.sets, function(set) {
        return parseInt(set.id) === parseInt(id);
      });
      $form = this.panel.find('.js-custom-form');
      $form.find('.js-set-name').val(set[0].name);
      $form.find('.js-set-id').val(set[0].id);
      return this.showCustomSetForm(set[0].string);
    };

    GuideGuide.prototype.onSaveSetFromCustom = function(event) {
      var $form, executable, name, obj, string;
      event.preventDefault();
      $form = this.panel.find('.js-custom-form');
      string = $('.js-custom-input').val().replace(/^\s+|\s+$/g, '');
      name = $form.find('.js-set-name').val();
      executable = $form.find('.js-input.is-invalid').length === 0 && string.length > 0 && name.length > 0;
      this.bridge.log('foo: ', $form);
      if (executable) {
        obj = {
          id: $form.find('.js-set-id').val(),
          name: name,
          ggn: string
        };
        if (!$('#guideguide').find('.js-set-id').val()) {
          this.createNewSet(obj);
        } else {
          this.updateSet(obj);
        }
        return this.panel.find('.js-sets-tab').click();
      } else {
        if (name.length === 0) {
          $('.js-set-name').trigger('input:invalidate');
        }
        if (string.length === 0) {
          return $('.js-custom-input').trigger('input:invalidate');
        }
      }
    };

    GuideGuide.prototype.onSaveSetFromGrid = function(event) {
      var $form, data,
        _this = this;
      event.preventDefault();
      $form = this.panel.find('.js-grid-form');
      data = this.getFormData($form);
      return this.stringifyFormData(data, function(string) {
        var executable, obj;
        executable = $form.find('.js-input.is-invalid').length === 0 && string;
        if (executable) {
          _this.bridge.log('New set from form');
          _this.bridge.log(string);
          obj = {
            name: data.name,
            ggn: string
          };
          _this.createNewSet(obj);
          return _this.panel.find('.js-sets-tab').click();
        }
      });
    };

    GuideGuide.prototype.onMakeGridFromForm = function(event) {
      var $form,
        _this = this;
      event.preventDefault();
      $form = $(event.currentTarget).closest('.js-grid-form');
      return this.stringifyFormData(this.getFormData($form), function(string) {
        if (!($form.find('.js-input.is-invalid').length === 0 && string)) {
          return;
        }
        return _this.addGuidesfromGGN(string, 'grid');
      });
    };

    GuideGuide.prototype.onMakeGridFromCusom = function(event) {
      var $form, string;
      event.preventDefault();
      $form = this.panel.find('.js-custom-form');
      string = this.panel.find('.js-custom-input').val().replace(/^\s+|\s+$/g, '');
      if (!($form.find('.js-input.is-invalid').length === 0 && string)) {
        return;
      }
      return this.addGuidesfromGGN(string, 'custom');
    };

    GuideGuide.prototype.onMakeGridFromSet = function(event) {
      var $set, data;
      event.preventDefault();
      $set = $('.js-set-list').find('.is-selected').first();
      if (!$set.length) {
        return;
      }
      data = $.grep(this.guideguideData.sets, function(set) {
        return parseInt(set.id) === parseInt($set.attr('data-id'));
      });
      return this.addGuidesfromGGN(data[0].string, 'set');
    };

    GuideGuide.prototype.createNewSet = function(data) {
      var newSet;
      newSet = {
        id: this.guideguideData.panel.newSetId,
        name: data.name,
        string: data.ggn
      };
      this.guideguideData.panel.newSetId++;
      this.guideguideData.sets.push(newSet);
      this.saveGuideGuideData();
      return this.refreshSets();
    };

    GuideGuide.prototype.updateSet = function(data) {
      var set;
      set = $.grep(this.guideguideData.sets, function(set) {
        return parseInt(set.id) === parseInt(data.id);
      });
      set[0].name = data.name;
      set[0].string = data.ggn;
      this.saveGuideGuideData();
      return this.refreshSets();
    };

    GuideGuide.prototype.refreshSets = function() {
      var $list,
        _this = this;
      this.bridge.log('Refreshing sets');
      $list = this.panel.find('.js-set-list');
      $list.find('.js-set').remove();
      return $.each(this.guideguideData.sets, function(index, set) {
        var item;
        item = $('.js-set-item-template').clone(true).removeClass('js-set-item-template');
        item.find('.js-set-item-name').html(set.name);
        item.attr('data-id', set.id);
        return $list.append(item);
      });
    };

    GuideGuide.prototype.onShowCustomNewSetForm = function(event) {
      event.preventDefault();
      return this.showCustomSetForm();
    };

    GuideGuide.prototype.onShowSetsNewSetForm = function(event) {
      var _this = this;
      event.preventDefault();
      return this.bridge.getDocumentInfo(function(info) {
        var bounds, guides, prevHorizontal, prevVertical, string, xString, yString;
        xString = '';
        yString = '';
        prevHorizontal = info.isSelection ? info.offsetY : 0;
        prevVertical = info.isSelection ? info.offsetX : 0;
        guides = info.existingGuides;
        if (info.isSelection) {
          bounds = {
            top: info.offsetY,
            left: info.offsetX,
            bottom: info.offsetY + info.height,
            right: info.offsetX + info.width
          };
          guides = _this.consolidateGuides([guides, info.existingGuides], bounds);
        }
        guides.sort(function(a, b) {
          return a.location - b.location;
        });
        $.each(guides, function(index, guide) {
          if (guide.orientation === 'vertical') {
            xString = "" + xString + (guide.location - prevVertical) + "px | ";
            prevVertical = guide.location;
          }
          if (guide.orientation === 'horizontal') {
            yString = "" + yString + (guide.location - prevHorizontal) + "px | ";
            return prevHorizontal = guide.location;
          }
        });
        if (xString !== '') {
          xString = "" + xString + "(v" + (_this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")";
        }
        if (yString !== '') {
          yString = "" + yString + "(h" + (_this.guideguideData.settings.calculation === 'pixel' ? 'p' : void 0) + ")";
        }
        string = '';
        string += xString;
        if (xString) {
          string += '\n';
        }
        string += yString;
        if (yString) {
          string += '\n';
        }
        if (xString || yString) {
          string += '\n# ' + _this.messages['ggn.stringFromExistingGuides'];
        }
        return _this.showCustomSetForm(string);
      });
    };

    GuideGuide.prototype.showCustomSetForm = function(prefill) {
      if (prefill == null) {
        prefill = '';
      }
      if (this.panel.find('.js-sets-tab.is-selected').length) {
        this.panel.find('.js-custom-tab').click();
      }
      this.panel.addClass('is-showing-new-set-form');
      if (prefill) {
        this.updateCustomField(prefill);
      }
      return this.panel.find('.js-custom-form').find('.js-set-name').focus();
    };

    GuideGuide.prototype.onShowGridNewSetForm = function(event) {
      event.preventDefault();
      this.panel.addClass('is-showing-new-set-form');
      return this.panel.find('.js-grid-form').find('.js-set-name').focus();
    };

    GuideGuide.prototype.onHideNewSetForm = function(event) {
      event.preventDefault();
      return this.hideNewSetForm();
    };

    GuideGuide.prototype.hideNewSetForm = function() {
      this.panel.find('.js-grid-form').find('.js-set-name').val('');
      this.panel.find('.js-grid-form').find('.js-set-id').val('');
      return this.panel.removeClass('is-showing-new-set-form');
    };

    GuideGuide.prototype.getGuidesFromGGN = function(ggn, info, callback) {
      var guides,
        _this = this;
      guides = [];
      $.each(ggn.grids, function(index, grid) {
        var arbitrarySum, areaWidth, fill, fillCollection, fillIterations, fillWidth, guideOrientation, i, insertMarker, measuredWidth, newGap, offset, positionOffset, remainderOffset, remainderPixels, wholePixels, wildcardArea, wildcardWidth, _i;
        positionOffset = 0;
        guideOrientation = grid.options.orientation.value;
        wholePixels = grid.options.calculation && grid.options.calculation.value === 'pixel';
        if (grid.gaps.fill) {
          fill = grid.gaps.fill;
        }
        measuredWidth = guideOrientation === 'horizontal' ? info.height : info.width;
        if (grid.options.width) {
          measuredWidth = grid.options.width.value;
        }
        offset = guideOrientation === 'horizontal' ? info.offsetY : info.offsetX;
        if (grid.gaps.percents) {
          $.each(grid.gaps.percents, function(index, gap) {
            var percentValue;
            percentValue = measuredWidth * (gap.value / 100);
            if (wholePixels) {
              Math.floor(percentValue);
            }
            return gap.convertPercent(percentValue);
          });
        }
        arbitrarySum = grid.gaps.arbitrary ? _this.sum(grid.gaps.arbitrary, 'value') : 0;
        wildcardArea = measuredWidth - arbitrarySum;
        if (wildcardArea && fill) {
          fillIterations = Math.floor(wildcardArea / fill.sum(ggn.variables));
          fillCollection = [];
          fillWidth = 0;
          for (i = _i = 1; 1 <= fillIterations ? _i <= fillIterations : _i >= fillIterations; i = 1 <= fillIterations ? ++_i : --_i) {
            if (fill.isVariable) {
              fillCollection = fillCollection.concat(ggn.variables[fill.id]);
              fillWidth += _this.sum(ggn.variables[fill.id], 'value');
            } else {
              newGap = fill.clone();
              newGap.isFill = false;
              fillCollection.push(newGap);
              fillWidth += newGap.value;
            }
          }
          wildcardArea -= fillWidth;
        }
        if (wildcardArea && grid.gaps.wildcards) {
          wildcardWidth = wildcardArea / grid.gaps.wildcards.length;
          if (wholePixels) {
            wildcardWidth = Math.floor(wildcardWidth);
            remainderPixels = wildcardArea % grid.gaps.wildcards.length;
          }
          $.each(grid.gaps.wildcards, function(index, gap) {
            return gap.value = wildcardWidth;
          });
        }
        if (remainderPixels) {
          remainderOffset = 0;
          if (grid.options.remainder.value === 'center') {
            remainderOffset = Math.floor((grid.gaps.wildcards.length - remainderPixels) / 2);
          }
          if (grid.options.remainder.value === 'last') {
            remainderOffset = grid.gaps.wildcards.length - remainderPixels;
          }
          $.each(grid.gaps.wildcards, function(index, gap) {
            if (index >= remainderOffset && index < remainderOffset + remainderPixels) {
              return gap.value++;
            }
          });
        }
        insertMarker = offset;
        if (grid.options.width && grid.options.position.value === 'last') {
          areaWidth = guideOrientation === 'horizontal' ? info.height : info.width;
          insertMarker += areaWidth - grid.options.width.value;
        }
        if (grid.options.offset) {
          if (grid.options.position.value === 'first') {
            insertMarker += grid.options.offset.value;
          } else if (grid.options.position.value === 'last') {
            insertMarker -= grid.options.offset.value;
          }
        }
        $.each(grid.gaps.all, function(index, item) {
          if (item.isFill) {
            return grid.gaps.all = grid.gaps.all.slice(0, index).concat(fillCollection, grid.gaps.all.slice(index + 1));
          }
        });
        return $.each(grid.gaps.all, function(index, item) {
          var obj;
          if (item === '|') {
            return guides.push(obj = {
              location: insertMarker,
              orientation: guideOrientation
            });
          } else {
            return insertMarker += item.value;
          }
        });
      });
      return callback(guides);
    };

    GuideGuide.prototype.consolidateGuides = function(guideArrays, bounds, invert) {
      var array, guides, uniqueGuides, _i, _len,
        _this = this;
      if (bounds == null) {
        bounds = null;
      }
      if (invert == null) {
        invert = false;
      }
      uniqueGuides = {
        horizontal: {},
        vertical: {}
      };
      guides = [];
      for (_i = 0, _len = guideArrays.length; _i < _len; _i++) {
        array = guideArrays[_i];
        guides = guides.concat(array);
      }
      if (bounds) {
        guides = $.grep(guides, function(el) {
          var unique;
          unique = !uniqueGuides[el.orientation][el.location];
          if (unique) {
            uniqueGuides[el.orientation][el.location] = true;
            if (el.orientation === 'vertical') {
              if (invert) {
                return el.location < bounds.left || el.location > bounds.right;
              } else {
                return el.location >= bounds.left && el.location <= bounds.right;
              }
            }
            if (el.orientation === 'horizontal') {
              if (invert) {
                return el.location < bounds.top || el.location > bounds.bottom;
              } else {
                return el.location >= bounds.top && el.location <= bounds.bottom;
              }
            }
          } else {
            return false;
          }
        });
      } else {
        guides = $.grep(guides, function(el) {
          var unique;
          unique = !uniqueGuides[el.orientation][el.location];
          uniqueGuides[el.orientation][el.location] = true;
          return unique;
        });
      }
      return guides;
    };

    GuideGuide.prototype.stringifyFormGrid = function(data) {
      var column, firstMargString, gridString, gutter, lastMargString, optionsString, unit, varString;
      data.count = parseInt(data.count);
      firstMargString = '';
      varString = '';
      gridString = '';
      lastMargString = '';
      optionsString = '';
      if (data.firstMargin) {
        firstMargString = '|' + data.firstMargin.replace(/\s/g, '').split(',').join('|') + '|';
      }
      if (data.lastMargin) {
        lastMargString = '|' + data.lastMargin.replace(/\s/g, '').split(',').join('|') + '|';
      }
      if (data.count || data.width) {
        column = data.width ? data.width : '~';
        if (data.columnMidpoint) {
          if (data.width) {
            unit = new Unit(data.width);
          }
          column = data.width ? "" + (unit.value / 2) + unit.type + "|" + (unit.value / 2) + unit.type : "~|~";
        }
        varString += "$" + data.orientation + "=|" + column + "|";
        if (data.gutter && data.count !== 1) {
          gutter = data.gutter ? data.gutter : '~';
          if (data.gutterMidpoint) {
            if (data.gutter) {
              unit = new Unit(data.gutter);
            }
            gutter = data.gutter ? "" + (unit.value / 2) + unit.type + "|" + (unit.value / 2) + unit.type : "~|~";
          }
          varString = "$" + data.orientation + "=|" + column + "|" + gutter + "|";
          if (data.count) {
            varString += "\n$" + data.orientation + "C=|" + column + "|";
          }
        }
      }
      if (data.count || data.width) {
        gridString += "$" + data.orientation;
        if (data.count !== 1) {
          gridString += "*";
        }
        if (data.count > 1 && data.gutter) {
          gridString += data.count - 1;
        }
        if (data.count > 1 && !data.gutter) {
          gridString += data.count;
        }
        if (data.count > 1 && data.gutter) {
          gridString += "|$" + data.orientation + (data.gutter ? 'C' : '') + "|";
        }
      }
      if (data.firstMargin || data.lastMargin || data.count || data.width) {
        optionsString += "(";
        optionsString += data.orientation.charAt(0).toLowerCase();
        optionsString += data.position.charAt(0).toUpperCase();
        optionsString += data.remainder.charAt(0).toLowerCase();
        optionsString += ")";
      }
      return "" + varString + "\n" + firstMargString + gridString + lastMargString + optionsString + "\n";
    };

    GuideGuide.prototype.stringifyFormData = function(data, callback) {
      var _this = this;
      return this.bridge.getDocumentInfo(function(info) {
        var string;
        string = '';
        string += _this.stringifyFormGrid({
          count: data.countColumn,
          width: data.widthColumn,
          gutter: data.gutterColumn,
          firstMargin: data.marginLeft,
          lastMargin: data.marginRight,
          columnMidpoint: data.midpointColumn || false,
          gutterMidpoint: data.midpointColumnGutter || false,
          orientation: 'v',
          position: _this.guideguideData.settings.verticalPosition,
          remainder: _this.guideguideData.settings.verticalRemainder
        });
        string += _this.stringifyFormGrid({
          count: data.countRow,
          width: data.widthRow,
          gutter: data.gutterRow,
          firstMargin: data.marginTop,
          lastMargin: data.marginBottom,
          columnMidpoint: data.midpointRow || false,
          gutterMidpoint: data.midpointRowGutter || false,
          orientation: 'h',
          position: _this.guideguideData.settings.horizontalPosition,
          remainder: _this.guideguideData.settings.horizontalRemainder
        });
        return callback(new GGN(string).toString());
      });
    };

    GuideGuide.prototype.sum = function(array, key) {
      var total,
        _this = this;
      if (key == null) {
        key = null;
      }
      total = 0;
      $.each(array, function(index, value) {
        if (key) {
          if (array[index][key]) {
            return total += array[index][key];
          }
        } else {
          return total += array[index];
        }
      });
      return total;
    };

    GuideGuide.prototype.formatField = function($field) {
      var int;
      int = $field.attr('data-integer') ? true : false;
      return $field.val($.map($field.val().split(','), function(unit) {
        return new Unit(unit, int).toString();
      }).join(', '));
    };

    GuideGuide.prototype.filteredList = function($list, type) {
      var $fields, filter;
      filter = function() {
        return $(this).attr('data-distribute') === type;
      };
      return $fields = $list.filter(filter);
    };

    GuideGuide.prototype.getFormData = function($form) {
      var $checkboxes, $fields, obj;
      obj = {
        name: $('.js-grid-form .js-set-name').val()
      };
      $fields = $form.find('.js-grid-form-input');
      $fields.each(function(index, element) {
        var key;
        key = $(element).attr('data-type');
        return obj[key] = $(element).val();
      });
      $checkboxes = $form.find('.js-checkbox');
      $checkboxes.each(function(index, element) {
        var key;
        key = $(element).attr('data-type');
        if ($(element).attr('data-checked') === 'true') {
          return obj[key] = true;
        }
      });
      return obj;
    };

    GuideGuide.prototype.isValid = function(string, integerOnly) {
      var units,
        _this = this;
      if (integerOnly == null) {
        integerOnly = false;
      }
      units = string.split(',');
      units = units.filter(function(unit) {
        var u;
        u = new Unit(unit, integerOnly);
        return !u.isValid;
      });
      return units.length === 0;
    };

    GuideGuide.prototype.updateTheme = function(colors) {
      if (!$("#theme").length) {
        $("head").append('<style id="theme">');
      }
      return $("#theme").text("#guideguide {\n  color: " + colors.text + ";\n  background-color: " + colors.background + ";\n}\n#guideguide a {\n  color: " + colors.text + ";\n}\n#guideguide a:hover {\n  color: " + colors.highlight + ";\n}\n#guideguide .nav a.is-selected {\n  color: " + colors.buttonSelect + ";\n}\n#guideguide .input {\n  background-color: " + colors.button + ";\n}\n#guideguide .input input, #guideguide .input textarea {\n  color: " + colors.text + ";\n}\n#guideguide .input.is-focused .input-shell {\n  border-color: " + colors.highlight + ";\n}\n#guideguide .input.is-invalid .input-shell {\n  border-color: " + colors.danger + ";\n}\n#guideguide .distribute-highlight .icon {\n  color: " + colors.highlight + ";\n}\n#guideguide .button {\n  background-color: " + colors.button + ";\n}\n#guideguide .button:hover {\n  background-color: " + colors.buttonHover + ";\n  color: " + colors.text + ";\n}\n#guideguide .button.primary {\n  background-color: " + colors.highlight + ";\n  color: #fff;\n}\n#guideguide .button.primary:hover {\n  background-color: " + colors.highlightHover + ";\n  color: #fff;\n}\n#guideguide .button-clear-guides:hover {\n  background-color: " + colors.danger + ";\n  color: #fff;\n}\n#guideguide .set-list-set {\n  background-color: " + colors.button + ";\n}\n#guideguide .set-list-set:hover {\n  background-color: " + colors.buttonHover + ";\n}\n#guideguide .set-list-set:hover a {\n  color: " + colors.text + ";\n}\n#guideguide .set-list-set.is-selected {\n  background-color: " + colors.highlight + ";\n  color: #fff;\n}\n#guideguide .set-list-set.is-selected:hover {\n  background-color: " + colors.highlightHover + ";\n}\n#guideguide .dropdown.is-active .dropdown-button {\n  background-color: " + colors.highlight + ";\n}\n#guideguide .dropdown.is-active .dropdown-button:after {\n  background-color: " + colors.highlight + ";\n}\n#guideguide .dropdown.is-active .dropdown-button:hover, #guideguide .dropdown.is-active .dropdown-button:hover:after {\n  background-color: " + colors.highlightHover + ";\n}\n#guideguide .dropdown-button {\n  background-color: " + colors.button + ";\n}\n#guideguide .dropdown-button:before {\n  border-color: " + colors.text + " transparent transparent;\n}\n#guideguide .dropdown-button:hover, #guideguide .dropdown-button:hover:after {\n  background-color: " + colors.buttonHover + ";\n}\n#guideguide .dropdown-button:hover {\n  color: " + colors.text + ";\n}\n#guideguide .dropdown-button:after {\n  background-color: " + colors.button + ";\n  border-left: 2px solid " + colors.background + ";\n}\n#guideguide .dropdown-item {\n  background-color: " + colors.button + ";\n  border-top: 2px solid " + colors.background + ";\n}\n#guideguide .dropdown-item:hover {\n  color: " + colors.text + ";\n  background-color: " + colors.buttonHover + ";\n}\n#guideguide .alert-body {\n  background-color: " + colors.background + ";\n}\n#guideguide .scrollbar .handle {\n  background-color: " + colors.buttonSelect + ";\n}");
    };

    return GuideGuide;

  })();

  $(function() {
    return parent.window.GuideGuide = new GuideGuide($('#guideguide'));
  });

}).call(this);
