(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Unit = (function() {
    Unit.prototype.value = null;

    Unit.prototype.type = null;

    Unit.prototype.baseValue = null;

    Unit.prototype.isValid = true;

    Unit.prototype.original = null;

    Unit.prototype.resolution = 72;

    Unit.prototype.rulerUnit = "px";

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
          this.type = this.parseUnit(unitString);
        }
        this.baseValue = this.getBaseValue(this.value, this.type);
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

    Unit.prototype.parseUnit = function(string) {
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
          return this.parseUnit(this.rulerUnit);
        default:
          return null;
      }
    };

    Unit.prototype.getBaseValue = function(value, type) {
      var tmpValue, unitCanon;
      tmpValue = 0;
      unitCanon = {
        cm: 2.54,
        inch: 1,
        mm: 25.4,
        px: this.resolution,
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

    return Unit;

  })();

  window.GuideGuideUnitRefactor = (function() {
    GuideGuideUnitRefactor.prototype.resolution = 72;

    function GuideGuideUnitRefactor(args) {
      if (args == null) {
        args = {};
      }
      this.baseValueOf = __bind(this.baseValueOf, this);
      this.toString = __bind(this.toString, this);
      this.from = __bind(this.from, this);
      if (args.resolution) {
        this.resolution = args.resolution;
      }
    }

    GuideGuideUnitRefactor.prototype.from = function(string) {
      var bits, unit;
      if (string == null) {
        string = "";
      }
      string = string.replace(/\s/g, '');
      bits = string.match(/([-0-9\.]+)([a-z%]+)?/i);
      unit = {
        string: string,
        value: null,
        type: null
      };
      if ((bits == null) || bits.length <= 1) {
        return unit;
      }
      unit.value = parseFloat(bits[1]);
      unit.type = this.parseUnit(bits[2] || '');
      return unit;
    };

    GuideGuideUnitRefactor.prototype.toString = function(unit) {};

    GuideGuideUnitRefactor.prototype.parseUnit = function(string) {
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

    GuideGuideUnitRefactor.prototype.baseValueOf = function(unit) {
      var type, value;
      if (unit == null) {
        unit = "";
      }
      if (typeof unit === "string") {
        unit = this.from(unit);
      }
      if (!(unit.value && unit.type)) {
        return 0;
      }
      type = unit.type;
      value = unit.value;
      switch (type) {
        case 'cm':
          value = value / 2.54;
          break;
        case 'in':
          value = value / 1;
          break;
        case 'mm':
          value = value / 25.4;
          break;
        case 'px':
          value = value / this.resolution;
          break;
        case 'points':
          value = value / this.resolution;
          break;
        case 'picas':
          value = value / 6;
          break;
        case '%':
          value = 0;
          break;
        default:
          return 0;
      }
      return value * this.resolution;
    };

    return GuideGuideUnitRefactor;

  })();

}).call(this);
