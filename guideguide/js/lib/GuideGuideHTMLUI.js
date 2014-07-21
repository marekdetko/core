(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.GuideGuideHTMLUI = (function() {
    GuideGuideHTMLUI.prototype.core = {};

    function GuideGuideHTMLUI() {
      this.updateTheme = __bind(this.updateTheme, this);
      this.onClickHelpTarget = __bind(this.onClickHelpTarget, this);
      this.onClickInputBackground = __bind(this.onClickInputBackground, this);
      this.onClickMakeGridFromSet = __bind(this.onClickMakeGridFromSet, this);
      this.onClickMakeGridFromCusom = __bind(this.onClickMakeGridFromCusom, this);
      this.onClickMakeGridFromForm = __bind(this.onClickMakeGridFromForm, this);
      this.onClickClearGuides = __bind(this.onClickClearGuides, this);
      this.onClickVerticalMidpoint = __bind(this.onClickVerticalMidpoint, this);
      this.onClickHorizontalMidpoint = __bind(this.onClickHorizontalMidpoint, this);
      this.onClickRightGuide = __bind(this.onClickRightGuide, this);
      this.onClickLeftGuide = __bind(this.onClickLeftGuide, this);
      this.onClickBottomGuide = __bind(this.onClickBottomGuide, this);
      this.onClickTopGuide = __bind(this.onClickTopGuide, this);
      this.onClickLink = __bind(this.onClickLink, this);
      this.getFormData = __bind(this.getFormData, this);
      this.alert = __bind(this.alert, this);
      this.onClickHideNewSetForm = __bind(this.onClickHideNewSetForm, this);
      this.showCustomSetForm = __bind(this.showCustomSetForm, this);
      this.onClickShowSetsNewSetForm = __bind(this.onClickShowSetsNewSetForm, this);
      this.onClickShowCustomNewSetForm = __bind(this.onClickShowCustomNewSetForm, this);
      this.onClickShowGridNewSetForm = __bind(this.onClickShowGridNewSetForm, this);
      this.refreshSets = __bind(this.refreshSets, this);
      this.onSelectSet = __bind(this.onSelectSet, this);
      this.onClickEditSet = __bind(this.onClickEditSet, this);
      this.onClickSaveSetFromCustom = __bind(this.onClickSaveSetFromCustom, this);
      this.onClickSaveSetFromGrid = __bind(this.onClickSaveSetFromGrid, this);
      this.onClickDeleteSet = __bind(this.onClickDeleteSet, this);
      this.onClickHasUpdateButton = __bind(this.onClickHasUpdateButton, this);
      this.showUpdateInfo = __bind(this.showUpdateInfo, this);
      this.onClickCheckForUpdates = __bind(this.onClickCheckForUpdates, this);
      this.showUpdateIndicator = __bind(this.showUpdateIndicator, this);
      this.onAlertButtonClick = __bind(this.onAlertButtonClick, this);
      this.onToggleGuides = __bind(this.onToggleGuides, this);
      this.hideLoader = __bind(this.hideLoader, this);
      this.showLoader = __bind(this.showLoader, this);
      this.onClickImportSets = __bind(this.onClickImportSets, this);
      this.onClickExportSets = __bind(this.onClickExportSets, this);
      this.onClickCancelImport = __bind(this.onClickCancelImport, this);
      this.hideImporter = __bind(this.hideImporter, this);
      this.onShowImporter = __bind(this.onShowImporter, this);
      this.refreshSettings = __bind(this.refreshSettings, this);
      this.onClickDropdownItem = __bind(this.onClickDropdownItem, this);
      this.onToggleDropdown = __bind(this.onToggleDropdown, this);
      this.onClickDistributeIcon = __bind(this.onClickDistributeIcon, this);
      this.validateInput = __bind(this.validateInput, this);
      this.onBlurFormInput = __bind(this.onBlurFormInput, this);
      this.updateCustomField = __bind(this.updateCustomField, this);
      this.onClickCheckbox = __bind(this.onClickCheckbox, this);
      this.selectTab = __bind(this.selectTab, this);
      this.onTabClick = __bind(this.onTabClick, this);
      this.hideNewSetForm = __bind(this.hideNewSetForm, this);
      this.onExitCustomForm = __bind(this.onExitCustomForm, this);
      this.onExitGridForm = __bind(this.onExitGridForm, this);
      this.onMouseOutDistributeIcon = __bind(this.onMouseOutDistributeIcon, this);
      this.onMouseOverDistributeIcon = __bind(this.onMouseOverDistributeIcon, this);
      this.onBlurCustomForm = __bind(this.onBlurCustomForm, this);
      this.onFocusCustomForm = __bind(this.onFocusCustomForm, this);
      this.markInvalid = __bind(this.markInvalid, this);
      this.onInputKeypress = __bind(this.onInputKeypress, this);
      this.onClickClearForm = __bind(this.onClickClearForm, this);
      this.updateGuideCounter = __bind(this.updateGuideCounter, this);
      this.precalculateForm = __bind(this.precalculateForm, this);
      this.onInputBlur = __bind(this.onInputBlur, this);
      this.onInputFocus = __bind(this.onInputFocus, this);
      this.localizeUI = __bind(this.localizeUI, this);
      this.init = __bind(this.init, this);
      this.panel = $('#guideguide');
      this.panel.on('guideguide:exitform', this.onExitGridForm);
      this.panel.on('guideguide:exitcustom', this.onExitCustomForm);
      this.panel.on('click', '.js-tabbed-page-tab', this.onTabClick);
      this.panel.on('click', '.js-alert-body .js-button', this.onAlertButtonClick);
      this.panel.on('click', '.js-link', this.onClickLink);
      this.panel.on('click', '.js-toggle-guide-visibility', this.onToggleGuides);
      this.panel.on('click', '.js-action-bar .js-top', this.onClickTopGuide);
      this.panel.on('click', '.js-action-bar .js-bottom', this.onClickBottomGuide);
      this.panel.on('click', '.js-action-bar .js-left', this.onClickLeftGuide);
      this.panel.on('click', '.js-action-bar .js-right', this.onClickRightGuide);
      this.panel.on('click', '.js-action-bar .js-horizontal-midpoint', this.onClickHorizontalMidpoint);
      this.panel.on('click', '.js-action-bar .js-vertical-midpoint', this.onClickVerticalMidpoint);
      this.panel.on('click', '.js-action-bar .js-clear', this.onClickClearGuides);
      this.panel.on('focus', '.js-input input, .js-input textarea', this.onInputFocus);
      this.panel.on('blur', '.js-input input, .js-input textarea', this.onInputBlur);
      this.panel.on('click', '.js-grid-form .js-clear-form', this.onClickClearForm);
      this.panel.on('mouseover', '.js-grid-form [data-distribute] .js-iconned-input-button', this.onMouseOverDistributeIcon);
      this.panel.on('mouseout', '.js-grid-form [data-distribute] .js-iconned-input-button', this.onMouseOutDistributeIcon);
      this.panel.on('click', '.js-dropdown', this.onToggleDropdown);
      this.panel.on('click', '.js-dropdown .js-dropdown-item', this.onClickDropdownItem);
      this.panel.on('click', '.js-import-sets', this.onShowImporter);
      this.panel.on('click', '.js-cancel-import', this.onClickCancelImport);
      this.panel.on('click', '.js-export-sets', this.onClickExportSets);
      this.panel.on('click', '.js-import', this.onClickImportSets);
      this.panel.on('click', '.js-input-shell', this.onClickInputBackground);
      this.panel.on('click', '.js-help-target', this.onClickHelpTarget);
      this.panel.on('click', '.js-has-update-button', this.onClickHasUpdateButton);
      this.panel.on('click', '.js-check-for-updates', this.onClickCheckForUpdates);
      this.panel.on('click', '.js-sets-form .js-delete-set', this.onClickDeleteSet);
      this.panel.on('click', '.js-grid-form .js-new-set', this.onClickShowGridNewSetForm);
      this.panel.on('click', '.js-cancel-set', this.onClickHideNewSetForm);
      this.panel.on('click', '.js-checkbox', this.onClickCheckbox);
      this.panel.on('blur', '.js-grid-form .js-grid-form-input', this.onBlurFormInput);
      this.panel.on('click', '.js-grid-form [data-distribute] .js-iconned-input-button', this.onClickDistributeIcon);
      this.panel.on('click', '.js-sets-form .js-set-select', this.onSelectSet);
      this.panel.on('focus', '.js-custom-form .js-custom-input', this.onFocusCustomForm);
      this.panel.on('blur', '.js-custom-form .js-custom-input', this.onBlurCustomForm);
      this.panel.on('click', '.js-grid-form .js-save-set', this.onClickSaveSetFromGrid);
      this.panel.on('click', '.js-grid-form .js-make-grid', this.onClickMakeGridFromForm);
      this.panel.on('click', '.js-custom-form .js-new-set', this.onClickShowCustomNewSetForm);
      this.panel.on('click', '.js-sets-form .js-new-set', this.onClickShowSetsNewSetForm);
      this.panel.on('click', '.js-custom-form .js-save-set', this.onClickSaveSetFromCustom);
      this.panel.on('click', '.js-sets-form .js-make-grid', this.onClickMakeGridFromSet);
      this.panel.on('click', '.js-custom-form .js-make-grid', this.onClickMakeGridFromCusom);
      this.panel.on('click', '.js-sets-form .js-edit-set', this.onClickEditSet);
      this.panel.on('precalculate:form', this.precalculateForm);
    }

    GuideGuideHTMLUI.prototype.init = function(core) {
      this.core = core;
      this.messages = this.core.messages;
      this.panel.removeClass('hideUI');
      return this.panel.find('textarea').autosize();
    };

    GuideGuideHTMLUI.prototype.localizeUI = function() {
      var $elements;
      $elements = $('[data-localize]');
      return $elements.each((function(_this) {
        return function(index, el) {
          return $(el).text(_this.messages[$(el).attr('data-localize')]());
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.onInputFocus = function(event) {
      $(event.currentTarget).closest('.js-input').addClass('is-focused');
      $(event.currentTarget).closest('.js-input').removeClass('is-invalid');
      $(event.currentTarget).closest('.js-grid-form').find('.js-make-grid').addClass('js-enter-click');
      return this.panel.on('keypress.enter', this.onInputKeypress);
    };

    GuideGuideHTMLUI.prototype.onInputBlur = function(event) {
      $(event.currentTarget).closest('.js-input').removeClass('is-focused');
      $('.js-enter-click').removeClass('js-enter-click');
      $('.js-grid-form').toggleClass('is-showing-clear-button', this.formIsFilledOut());
      return this.panel.off('.enter');
    };

    GuideGuideHTMLUI.prototype.precalculateForm = function(event) {
      return this.updateGuideCounter('.js-count-form', this.core.stringifyFormData(this.getFormData().contents));
    };

    GuideGuideHTMLUI.prototype.updateGuideCounter = function(button, notation) {
      return this.core.preCalculateGrid(notation, function(data) {
        var str;
        str = "";
        if (data && data.guides.length > 0) {
          str = " (+" + data.guides.length + ")";
        }
        $(button).text(str);
        return str;
      });
    };

    GuideGuideHTMLUI.prototype.formIsFilledOut = function() {
      var box, field, modified, _i, _j, _len, _len1, _ref, _ref1;
      modified = false;
      _ref = $('.js-grid-form .js-grid-form-input');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if ($.trim($(field).val()).length > 0) {
          modified = true;
        }
      }
      _ref1 = $('.js-grid-form .js-checkbox');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        box = _ref1[_j];
        if ($(box).hasClass('checked')) {
          modified = true;
        }
      }
      return modified;
    };

    GuideGuideHTMLUI.prototype.onClickClearForm = function(event) {
      event.preventDefault();
      $('.is-showing-clear-button').removeClass('is-showing-clear-button');
      $('.js-grid-form .js-grid-form-input').val('');
      $('.js-grid-form .js-checkbox').removeClass('checked');
      return setTimeout(this.updateGuideCounter('.js-count-form', this.core.stringifyFormData(this.getFormData().contents)), 100);
    };

    GuideGuideHTMLUI.prototype.onInputKeypress = function(event) {
      if (event.which === 13) {
        return $('.js-enter-click').click();
      }
    };

    GuideGuideHTMLUI.prototype.markInvalid = function($input) {
      return $input.closest('.js-input').addClass('is-invalid');
    };

    GuideGuideHTMLUI.prototype.onFocusCustomForm = function(event) {
      var $input;
      $input = $(event.currentTarget);
      return $input.val($input.val().replace(/[\{\}]|\[.*?\]|^#.*?$/gm, '').replace(/\s+$/g, ''));
    };

    GuideGuideHTMLUI.prototype.onBlurCustomForm = function(event) {
      var $input, code, errors, keys, string, _i, _len;
      keys = ['gnUnrecognized', 'gnNoGrids', 'gnNoFillWildcards', 'gnOneFillPerGrid', 'gnFillInVariable', 'gnUndefinedVariable'];
      $input = $(event.currentTarget);
      if (string = $input.val().replace(/^\s+|\s+$/g, '')) {
        string = GridNotation.clean($input.val());
        errors = GridNotation.test($input.val());
        if (errors.length > 0) {
          this.markInvalid($input.closest('.js-input'));
          string += "\n\n";
          for (_i = 0, _len = errors.length; _i < _len; _i++) {
            code = errors[_i];
            string += "# " + code + ". " + (this.messages[keys[code - 1]]()) + "\n";
          }
        } else {
          this.updateGuideCounter('.js-count-custom', string);
        }
        $input.val(string);
        return $input.trigger('autosize.resize');
      }
    };

    GuideGuideHTMLUI.prototype.onMouseOverDistributeIcon = function(event) {
      var $fields, $form, type;
      $form = $(event.currentTarget).closest('.js-grid-form');
      type = $(event.currentTarget).closest('[data-distribute]').attr('data-distribute');
      $fields = this.filteredList($form.find('.js-grid-form-iconned-input'), type);
      return $fields.addClass('distribute-highlight');
    };

    GuideGuideHTMLUI.prototype.onMouseOutDistributeIcon = function(event) {
      return this.panel.find('.distribute-highlight').removeClass('distribute-highlight');
    };

    GuideGuideHTMLUI.prototype.onExitGridForm = function() {
      return this.hideNewSetForm();
    };

    GuideGuideHTMLUI.prototype.onExitCustomForm = function() {
      return this.hideNewSetForm();
    };

    GuideGuideHTMLUI.prototype.hideNewSetForm = function() {
      this.panel.find('.js-grid-form').find('.js-set-name').val('');
      this.panel.find('.js-grid-form').find('.js-set-id').val('');
      return this.panel.removeClass('is-showing-new-set-form');
    };

    GuideGuideHTMLUI.prototype.onTabClick = function(event) {
      var enterPage, exitPage, filter;
      event.preventDefault();
      exitPage = this.panel.find('.js-tabbed-page-tab.is-selected').attr('data-page');
      enterPage = $(event.currentTarget).attr('data-page');
      if (enterPage === exitPage) {
        return;
      }
      $('#guideguide').trigger("guideguide:exit" + exitPage);
      if (filter = enterPage) {
        this.selectTab(filter);
      }
      return $('#guideguide').trigger("guideguide:enter" + enterPage);
    };

    GuideGuideHTMLUI.prototype.selectTab = function(name) {
      var filter, tab, tabBucket;
      this.panel.find("[data-page]").removeClass('is-selected');
      if (name) {
        filter = function() {
          return $(this).attr('data-page') === name;
        };
        tab = this.panel.find('.js-tabbed-page-tab').filter(filter);
        tabBucket = this.panel.find('.js-tabbed-page').filter(filter);
      } else {
        tab = $container.find('.js-tabbed-page-tab:first');
        tabBucket = this.panel.find('.js-tabbed-page:first');
      }
      tab.addClass('is-selected');
      return tabBucket.addClass('is-selected');
    };

    GuideGuideHTMLUI.prototype.onClickCheckbox = function(event) {
      var $checkbox, $form;
      event.preventDefault();
      $checkbox = $(event.currentTarget);
      $checkbox.toggleClass('checked');
      $form = $checkbox.closest('.js-grid-form');
      this.core.formChanged(this.getFormData());
      $('.js-grid-form').toggleClass('is-showing-clear-button', this.formIsFilledOut());
      return setTimeout(this.updateGuideCounter('.js-count-form', this.core.stringifyFormData(this.getFormData().contents)), 100);
    };

    GuideGuideHTMLUI.prototype.updateCustomField = function(text) {
      return this.panel.find('.js-custom-input').val(text).trigger('autosize.resize');
    };

    GuideGuideHTMLUI.prototype.onBlurFormInput = function(event) {
      return this.validateInput($(event.currentTarget), (function(_this) {
        return function() {
          return _this.panel.trigger('precalculate:form');
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.validateInput = function($input, callback) {
      var int, val;
      if ($.trim($input.val()) === "") {
        return (callback ? callback() : void 0);
      }
      int = false;
      if ($input.attr('data-integer')) {
        val = Math.round(parseFloat($input.val()));
        if (val) {
          $input.val(val);
        }
        int = true;
      } else {
        this.core.getInputFormat($input.val(), function(val) {
          return $input.val(val);
        });
      }
      if (!this.core.validateInput($input.val(), int)) {
        this.markInvalid($input);
      } else {
        this.core.formChanged(this.getFormData());
      }
      if (callback) {
        return callback();
      }
    };

    GuideGuideHTMLUI.prototype.onClickDistributeIcon = function(event) {
      var $field, $form, $input;
      event.preventDefault();
      $form = $(event.currentTarget).closest('.js-grid-form');
      $input = $(event.currentTarget).closest('.js-grid-form-iconned-input');
      $field = $input.find('.js-grid-form-input');
      return this.validateInput($field, (function(_this) {
        return function() {
          var $fields, type, value;
          if ($input.hasClass('is-invalid')) {
            return;
          }
          value = $field.val();
          type = $input.attr('data-distribute');
          $fields = _this.filteredList($form.find('.js-grid-form-iconned-input'), type);
          $fields.find('.js-grid-form-input').val(value);
          _this.core.formChanged(_this.getFormData());
          return _this.panel.trigger('precalculate:form');
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.onToggleDropdown = function(event) {
      var $dropdown, $list, listBottom, offset, visibleBottom;
      event.preventDefault();
      $dropdown = $(event.currentTarget);
      if ($dropdown.hasClass('is-active')) {
        return $dropdown.removeClass('is-active');
      } else {
        $('.js-dropdown').removeClass('is-active');
        $dropdown.addClass('is-active');
        $list = $dropdown.find('.js-dropdown-list');
        visibleBottom = $('.js-settings-list').scrollTop() + $('.js-settings-list').outerHeight();
        listBottom = $dropdown.position().top + $list.position().top + $list.outerHeight() + 3;
        if (listBottom > visibleBottom) {
          offset = listBottom - visibleBottom;
          return $('.js-settings-list').scrollTop($('.js-settings-list').scrollTop() + offset);
        }
      }
    };

    GuideGuideHTMLUI.prototype.onClickDropdownItem = function(event) {
      var $dropdown, $item, data, setting, value;
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
      $dropdown.find('.js-dropdown-button .js-value').text($item.text());
      data = {
        settings: {}
      };
      data.settings[setting] = value;
      return this.core.saveData(data);
    };

    GuideGuideHTMLUI.prototype.refreshSettings = function(settings) {
      var $dropdowns;
      $dropdowns = $('.js-dropdown');
      return $dropdowns.each((function(_this) {
        return function(index, el) {
          var $dropdown, $selected, setting, value;
          $dropdown = $(el);
          setting = $dropdown.attr('data-setting');
          value = settings[setting];
          $selected = $dropdown.find("[data-value='" + value + "']");
          return $dropdown.find('.js-dropdown-button .js-value').text(_this.messages[$selected.attr('data-localize')]());
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.onShowImporter = function(event) {
      event.preventDefault();
      if (this.core.isDemo()) {
        return;
      }
      this.panel.addClass('is-showing-importer');
      return this.panel.find('.js-import-input').val('');
    };

    GuideGuideHTMLUI.prototype.hideImporter = function() {
      return this.panel.removeClass('is-showing-importer');
    };

    GuideGuideHTMLUI.prototype.onClickCancelImport = function(event) {
      event.preventDefault();
      return this.panel.removeClass('is-showing-importer');
    };

    GuideGuideHTMLUI.prototype.onClickExportSets = function(event) {
      event.preventDefault();
      return this.core.exportSets();
    };

    GuideGuideHTMLUI.prototype.onClickImportSets = function(event) {
      var data, id;
      event.preventDefault();
      if (this.core.isDemo()) {
        return;
      }
      data = $(".js-import-input").val();
      if (data.indexOf("gist.github.com") > 0) {
        id = data.substring(data.lastIndexOf('/') + 1);
        return this.core.importSets(id);
      } else {
        return this.core.importSets(null);
      }
    };

    GuideGuideHTMLUI.prototype.showLoader = function() {
      return this.panel.addClass('is-loading');
    };

    GuideGuideHTMLUI.prototype.hideLoader = function() {
      return this.panel.removeClass('is-loading');
    };

    GuideGuideHTMLUI.prototype.onToggleGuides = function(event) {
      event.preventDefault();
      this.core.log("Toggle guides");
      return this.core.toggleGuides();
    };

    GuideGuideHTMLUI.prototype.onAlertButtonClick = function(event) {
      var callback;
      event.preventDefault();
      this.panel.find('.js-alert-title').text('');
      this.panel.find('.js-alert-message').text('');
      this.panel.removeClass('has-alert');
      callback = $(event.currentTarget).attr('data-callback');
      return GuideGuide[callback]();
    };

    GuideGuideHTMLUI.prototype.showUpdateIndicator = function(data) {
      var button;
      this.panel.addClass('has-update');
      button = this.panel.find('.js-has-update-button');
      button.attr('data-title', data.title);
      return button.attr('data-message', data.message);
    };

    GuideGuideHTMLUI.prototype.onClickCheckForUpdates = function(event) {
      event.preventDefault();
      return this.core.manualCheckForUpdates();
    };

    GuideGuideHTMLUI.prototype.showUpdateInfo = function() {
      return $('.js-has-update-button').click();
    };

    GuideGuideHTMLUI.prototype.onClickHasUpdateButton = function(event) {
      event.preventDefault();
      return this.core.alert({
        title: $(event.currentTarget).attr('data-title'),
        message: $(event.currentTarget).attr('data-message')
      });
    };

    GuideGuideHTMLUI.prototype.onClickDeleteSet = function(event) {
      var $set, group, id;
      event.preventDefault();
      $set = $(event.currentTarget).closest('.js-set');
      id = $set.attr('data-id');
      group = $set.attr('data-group');
      return this.core.deleteSet(group, id);
    };

    GuideGuideHTMLUI.prototype.onClickSaveSetFromGrid = function(event) {
      var data;
      event.preventDefault();
      data = this.getFormData();
      if (data.name.length === 0) {
        this.markInvalid(this.panel.find('.js-grid-form .js-set-name').closest('.js-input'));
      }
      if (this.panel.find('.js-grid-form .js-input').filter('.is-invalid').length > 0) {
        return;
      }
      return this.core.saveSet(this.getFormData());
    };

    GuideGuideHTMLUI.prototype.onClickSaveSetFromCustom = function(event) {
      var $form, name, set, string;
      event.preventDefault();
      $form = $('.js-custom-form');
      name = $form.find('.js-set-name').val();
      string = $('.js-custom-input').val().replace(/^\s+|\s+$/g, '');
      if (name.length === 0) {
        this.markInvalid($form.find('.js-set-name').closest('.js-input'));
      }
      if (this.panel.find('.js-custom-form .js-input').filter('.is-invalid').length > 0) {
        return;
      }
      if (string.length === 0) {
        return;
      }
      set = {
        id: $('#guideguide').find('.js-set-id').val(),
        name: name,
        contents: string
      };
      return this.core.saveSet(set);
    };

    GuideGuideHTMLUI.prototype.onClickEditSet = function(event) {
      var $form, $set, group, id, set;
      event.preventDefault();
      $set = $(event.currentTarget).closest('.js-set');
      id = $set.attr('data-id');
      group = $set.attr('data-group');
      set = this.core.getSets({
        set: id,
        group: group
      });
      $form = this.panel.find('.js-custom-form');
      $form.find('.js-set-name').val(set.name);
      $form.find('.js-set-id').val(set.id);
      return this.showCustomSetForm(set.string);
    };

    GuideGuideHTMLUI.prototype.onSelectSet = function(event) {
      var $selected, data, notation, set, _i, _len;
      event.preventDefault();
      $(event.currentTarget).closest('.js-set').toggleClass('is-selected');
      $selected = $('.js-set-list').find('.is-selected');
      notation = "";
      for (_i = 0, _len = $selected.length; _i < _len; _i++) {
        set = $selected[_i];
        data = {
          set: $(set).attr('data-id'),
          group: $(set).attr('data-group')
        };
        notation += "" + (this.core.getSets(data).string) + "\n";
      }
      return this.updateGuideCounter('.js-count-sets', notation);
    };

    GuideGuideHTMLUI.prototype.refreshSets = function(sets) {
      var $list;
      $list = this.panel.find('.js-set-list');
      $list.find('.js-set').remove();
      return $.each(sets, (function(_this) {
        return function(index, set) {
          var item;
          item = $('.js-set-item-template').clone(true).removeClass('js-set-item-template');
          item.find('.js-set-item-name').html(set.name);
          item.attr('data-group', "Default");
          item.attr('data-id', set.id);
          return $list.append(item);
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.onClickShowGridNewSetForm = function(event) {
      event.preventDefault();
      this.panel.addClass('is-showing-new-set-form');
      return this.panel.find('.js-grid-form').find('.js-set-name').focus();
    };

    GuideGuideHTMLUI.prototype.onClickShowCustomNewSetForm = function(event) {
      event.preventDefault();
      return this.showCustomSetForm();
    };

    GuideGuideHTMLUI.prototype.onClickShowSetsNewSetForm = function(event) {
      event.preventDefault();
      return this.core.getGGNFromExistingGuides((function(_this) {
        return function(string) {
          _this.core.log(string);
          return _this.showCustomSetForm(string);
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.showCustomSetForm = function(prefill) {
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

    GuideGuideHTMLUI.prototype.onClickHideNewSetForm = function(event) {
      event.preventDefault();
      return this.hideNewSetForm();
    };

    GuideGuideHTMLUI.prototype.alert = function(args) {
      this.panel.find('.js-alert-title').text(args.title);
      this.panel.find('.js-alert-message').html(args.message);
      this.panel.find('.js-alert-actions').html('');
      $.each(args.buttons, (function(_this) {
        return function(i, value) {
          var button, data;
          data = args.buttons[i];
          button = $('.js-button-template').clone().removeClass('js-button-template');
          button.find('a').text(data.label ? data.label : '').addClass(data.primary ? 'primary' : '').attr('data-callback', data.callback ? data.callback : '');
          return _this.panel.find('.js-alert-actions').append(button);
        };
      })(this));
      return this.panel.addClass('has-alert');
    };

    GuideGuideHTMLUI.prototype.getFormData = function() {
      var $checkboxes, $fields, $form, obj;
      $form = $('.js-grid-form');
      obj = {
        name: $('.js-grid-form .js-set-name').val(),
        contents: {}
      };
      $fields = $form.find('.js-grid-form-input');
      $fields.each(function(index, element) {
        var key;
        key = $(element).attr('data-type');
        return obj.contents[key] = $(element).val();
      });
      $checkboxes = $form.find('.js-checkbox');
      $checkboxes.each(function(index, element) {
        var key;
        key = $(element).attr('data-type');
        if ($(element).hasClass('checked')) {
          return obj.contents[key] = true;
        }
      });
      return obj;
    };

    GuideGuideHTMLUI.prototype.onClickLink = function(event) {
      var url;
      event.preventDefault();
      url = $(event.currentTarget).attr('href');
      return this.core.openURL(url);
    };

    GuideGuideHTMLUI.prototype.onClickTopGuide = function(event) {
      event.preventDefault();
      if (this.core.allowGuideActions) {
        return this.core.quickGuide("top");
      }
    };

    GuideGuideHTMLUI.prototype.onClickBottomGuide = function(event) {
      event.preventDefault();
      if (this.core.allowGuideActions) {
        return this.core.quickGuide("bottom");
      }
    };

    GuideGuideHTMLUI.prototype.onClickLeftGuide = function(event) {
      event.preventDefault();
      if (this.core.allowGuideActions) {
        return this.core.quickGuide("left");
      }
    };

    GuideGuideHTMLUI.prototype.onClickRightGuide = function(event) {
      event.preventDefault();
      if (this.core.allowGuideActions) {
        return this.core.quickGuide("right");
      }
    };

    GuideGuideHTMLUI.prototype.onClickHorizontalMidpoint = function(event) {
      event.preventDefault();
      if (this.core.allowGuideActions) {
        return this.core.quickGuide("horizontalMidpoint");
      }
    };

    GuideGuideHTMLUI.prototype.onClickVerticalMidpoint = function(event) {
      event.preventDefault();
      if (this.core.allowGuideActions) {
        return this.core.quickGuide("verticalMidpoint");
      }
    };

    GuideGuideHTMLUI.prototype.onClickClearGuides = function(event) {
      event.preventDefault();
      if (this.core.allowGuideActions) {
        return this.core.clearGuides();
      }
    };

    GuideGuideHTMLUI.prototype.onClickMakeGridFromForm = function(event) {
      var data;
      event.preventDefault();
      data = this.getFormData();
      if (this.panel.find('.js-grid-form .js-input').filter('is-invalid') > 0) {
        return;
      }
      if (!this.core.formIsValid(data)) {
        return;
      }
      return this.core.toggleAllowingGuideActions((function(_this) {
        return function() {
          return _this.core.makeGridFromForm(data, function() {
            return _this.core.toggleAllowingGuideActions();
          });
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.onClickMakeGridFromCusom = function(event) {
      var $form, string;
      event.preventDefault();
      $form = this.panel.find('.js-custom-form');
      string = this.panel.find('.js-custom-input').val().replace(/^\s+|\s+$/g, '');
      if (!($form.find('.js-input.is-invalid').length === 0 && string)) {
        return;
      }
      return this.core.toggleAllowingGuideActions((function(_this) {
        return function() {
          return _this.core.makeGridFromCustom(string, function() {
            return _this.core.toggleAllowingGuideActions();
          });
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.onClickMakeGridFromSet = function(event) {
      var $selected, set, sets, _i, _len;
      event.preventDefault();
      $selected = $('.js-set-list').find('.is-selected');
      if (!$selected.length) {
        return;
      }
      sets = [];
      for (_i = 0, _len = $selected.length; _i < _len; _i++) {
        set = $selected[_i];
        sets.push({
          id: $(set).attr('data-id'),
          group: $(set).attr('data-group')
        });
      }
      return this.core.toggleAllowingGuideActions((function(_this) {
        return function() {
          return _this.core.makeGridFromSet(sets, function() {
            return _this.core.toggleAllowingGuideActions();
          });
        };
      })(this));
    };

    GuideGuideHTMLUI.prototype.onClickInputBackground = function(event) {
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

    GuideGuideHTMLUI.prototype.onClickHelpTarget = function(event) {
      event.preventDefault();
      return $(event.currentTarget).closest('.js-help').toggleClass("is-helping");
    };

    GuideGuideHTMLUI.prototype.filteredList = function($list, type) {
      var $fields, filter;
      filter = function() {
        return $(this).attr('data-distribute') === type;
      };
      return $fields = $list.filter(filter);
    };

    GuideGuideHTMLUI.prototype.updateTheme = function(colors) {
      this.panel.removeClass('dark-theme light-theme').addClass("" + (colors.prefix || 'dark') + "-theme");
      if (!$("#theme").length) {
        $("head").append('<style id="theme">');
      }
      return $("#theme").text("#guideguide {\n  color: " + colors.text + ";\n  background-color: " + colors.background + ";\n}\n#guideguide a {\n  color: " + colors.text + ";\n}\n#guideguide a:hover {\n  color: " + colors.highlight + ";\n}\n#guideguide .nav a.is-selected {\n  color: " + colors.buttonSelect + ";\n}\n#guideguide .input {\n  background-color: " + colors.button + ";\n}\n#guideguide .input input, #guideguide .input textarea {\n  color: " + colors.text + ";\n}\n#guideguide .input.is-focused .input-shell {\n  border-color: " + colors.highlight + ";\n}\n#guideguide .input.is-invalid .input-shell {\n  border-color: " + colors.danger + ";\n}\n#guideguide .distribute-highlight .icon {\n  color: " + colors.highlight + ";\n}\n#guideguide .button {\n  background-color: " + colors.button + ";\n}\n#guideguide .button:hover {\n  background-color: " + colors.buttonHover + ";\n  color: " + colors.text + ";\n}\n#guideguide .button.primary {\n  background-color: " + colors.highlight + ";\n  color: #eee;\n}\n#guideguide .button.primary:hover {\n  background-color: " + colors.highlightHover + ";\n  color: #eee;\n}\n#guideguide .button-clear-guides:hover {\n  background-color: " + colors.danger + ";\n}\n#guideguide .set-list-set {\n  background-color: " + colors.button + ";\n}\n#guideguide .set-list-set:hover {\n  background-color: " + colors.buttonHover + ";\n}\n#guideguide .set-list-set:hover a {\n  color: " + colors.text + ";\n}\n#guideguide .set-list-set.is-selected {\n  background-color: " + colors.highlight + ";\n  color: #eee;\n}\n#guideguide .set-list-set.is-selected a {\n  color: #eee;\n}\n#guideguide .set-list-set.is-selected:hover {\n  background-color: " + colors.highlightHover + ";\n}\n#guideguide .dropdown.is-active .dropdown-button {\n  background-color: " + colors.highlight + ";\n}\n#guideguide .dropdown.is-active .dropdown-button:after {\n  background-color: " + colors.highlight + ";\n}\n#guideguide .dropdown.is-active .dropdown-button:hover, #guideguide .dropdown.is-active .dropdown-button:hover:after {\n  background-color: " + colors.highlightHover + ";\n}\n#guideguide .dropdown-button {\n  background-color: " + colors.button + ";\n}\n#guideguide .dropdown-button:before {\n  border-color: " + colors.text + " transparent transparent;\n}\n#guideguide .dropdown-button:hover, #guideguide .dropdown-button:hover:after {\n  background-color: " + colors.buttonHover + ";\n}\n#guideguide .dropdown-button:hover {\n  color: " + colors.text + ";\n}\n#guideguide .dropdown-button:after {\n  background-color: " + colors.button + ";\n  border-left: 2px solid " + colors.background + ";\n}\n#guideguide .dropdown-item {\n  background-color: " + colors.button + ";\n  border-top: 2px solid " + colors.background + ";\n}\n#guideguide .dropdown-item:hover {\n  color: " + colors.text + ";\n  background-color: " + colors.buttonHover + ";\n}\n#guideguide .alert-body {\n  background-color: " + colors.background + ";\n}\n#guideguide .scrollbar .handle {\n  background-color: " + colors.buttonSelect + ";\n}\n#guideguide .importer {\n  background-color: " + colors.background + ";\n}\n#guideguide .loader-background {\n  background-color: " + colors.background + ";\n}");
    };

    return GuideGuideHTMLUI;

  })();

}).call(this);
