(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Gap = (function() {
    Gap.prototype.variableRegexp = /^\$([^\*]+)?(\*(\d+)?)?$/i;

    Gap.prototype.arbitraryRegexp = /^(([-0-9\.]+)?[a-z%]+)(\*(\d+)?)?$/i;

    Gap.prototype.wildcardRegexp = /^~(\*(\d*))?$/i;

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

    function Gap(string, messages) {
      this.toString = __bind(this.toString, this);
      this.invalidBecause = __bind(this.invalidBecause, this);
      this.convertPercent = __bind(this.convertPercent, this);
      this.parseArbitrary = __bind(this.parseArbitrary, this);
      this.parseWildcard = __bind(this.parseWildcard, this);
      this.errors = {};
      this.original = string = string.replace(/\s/g, '');
      this.messages = messages;
      if (this.variableRegexp.test(string)) {
        this.parseVariable(string);
      } else if (this.arbitraryRegexp.test(string)) {
        this.parseArbitrary(string);
      } else if (this.wildcardRegexp.test(string)) {
        this.parseWildcard(string);
      } else {
        this.multiplier = 1;
        this.invalidBecause(this.messages.gapUnrecognized());
      }
    }

    Gap.prototype.parseWildcard = function(string) {
      var gapBits;
      this.isWildcard = true;
      gapBits = this.wildcardRegexp.exec(string);
      this.isFill = gapBits[1] && !gapBits[2] || false;
      this.multiplier = parseInt(gapBits[2]) || 1;
      if (this.isFill) {
        return this.invalidBecause(this.messages.gapNoFillWildcards());
      }
    };

    Gap.prototype.parseVariable = function(string) {
      var gapBits;
      this.isVariable = true;
      gapBits = this.variableRegexp.exec(string);
      this.id = gapBits[1] ? gapBits[1] : "_";
      this.multiplier = parseInt(gapBits[3]) || 1;
      return this.isFill = gapBits[2] && !gapBits[3] || false;
    };

    Gap.prototype.parseArbitrary = function(string) {
      var gapBits;
      this.isArbitrary = true;
      gapBits = this.arbitraryRegexp.exec(string);
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
        return this.invalidBecause(this.messages.gapUnrecognized());
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
      gap = new Gap(this.original, this.messages);
      gap.multiplier = 1;
      gap = new Gap(gap.toString(false), this.messages);
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
        $.each(variables[this.id].all, function(index, gap) {
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

}).call(this);
