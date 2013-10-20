(function() {
  var getData, saveData,
    _this = this;

  $(document).on('click', '.js-color-switcher-color', function(event) {
    event.preventDefault();
    $(this).closest('.js-color-switcher').find('.js-color-switcher-color').removeClass('is-selected');
    $(this).addClass('is-selected');
    window.guideguide.updateTheme($(this).attr('data-theme-name'));
    return $('body').attr('class', $(this).attr('data-theme-name'));
  });

  $(document).on('mousedown', '.js-document', function(event) {
    var $selection, artboard, css, doc, selection;
    event.originalEvent.preventDefault();
    if (!$(event.target).hasClass('js-artboard')) {
      return;
    }
    $('.js-document').find('.js-selection').remove();
    doc = {
      top: $('.js-document').offset().top,
      left: $('.js-document').offset().left
    };
    artboard = {
      top: $('.js-artboard').offset().top,
      left: $('.js-artboard').offset().left,
      width: $('.js-artboard').width(),
      height: $('.js-artboard').height()
    };
    selection = {
      anchorTop: event.pageY,
      anchorLeft: event.pageX
    };
    css = {
      top: selection.top - doc.top,
      left: selection.left - doc.top
    };
    $selection = $('.js-templates').find('.js-selection').clone().css(css);
    $('.js-document').append($selection);
    $(document).on('mousemove', '.js-document', function(event) {
      selection.left = event.pageX >= selection.anchorLeft ? selection.anchorLeft : event.pageX;
      if (selection.left < artboard.left) {
        selection.left = artboard.left - 1;
      }
      if (selection.left > selection.left) {
        selection.left = selection.left;
      }
      selection.top = event.pageY >= selection.anchorTop ? selection.anchorTop : event.pageY;
      if (selection.top < artboard.top) {
        selection.top = artboard.top - 1;
      }
      if (selection.top > selection.anchorTop) {
        selection.top = selection.anchorTop;
      }
      selection.width = event.pageX - selection.anchorLeft;
      if (event.pageX < artboard.left) {
        selection.width = artboard.left - selection.anchorLeft;
      }
      if (event.pageX > (artboard.left + artboard.width)) {
        selection.width = artboard.width - Math.abs((selection.left - artboard.left) + 1);
      }
      selection.height = event.pageY - selection.anchorTop;
      if (event.pageY < artboard.top) {
        selection.height = artboard.top - selection.anchorTop;
      }
      if (event.pageY > (artboard.top + artboard.height)) {
        selection.height = artboard.height - Math.abs((selection.top - artboard.top) + 1);
      }
      css = {
        left: selection.left - doc.left,
        width: Math.abs(selection.width),
        top: selection.top - doc.top,
        height: Math.abs(selection.height)
      };
      return $selection.css(css);
    });
    return $(document).on('mouseup', function(event) {
      if ($('.js-selection').width() <= 1 && $('.js-selection').height() <= 1) {
        $('.js-document').find('.js-selection').remove();
      }
      $(document).off('mousemove');
      return $(document).off('mouseup');
    });
  });

  $(document).on('click', '.js-dev-option', function(event) {
    var $option, data, key;
    event.preventDefault();
    $option = $(event.currentTarget);
    key = $option.attr('data-dev-option');
    data = getData();
    data[key] = !data[key];
    $option.find('.js-dev-option-value').text(data[key]);
    return saveData(data);
  });

  getData = function() {
    if (localStorage) {
      return JSON.parse(localStorage.getItem('guideguidedev'));
    }
  };

  saveData = function(data) {
    if (localStorage) {
      return localStorage.setItem('guideguidedev', JSON.stringify(data));
    }
  };

  $(function() {
    var data;
    data = getData() || new Object;
    data.submitData || (data.submitData = false);
    data.checkForUpdates || (data.checkForUpdates = false);
    saveData(data);
    $('.js-dev-option').each(function(index, el) {
      var key;
      key = $(el).attr('data-dev-option');
      return $(el).find('.js-dev-option-value').text(data[key]);
    });
    $(".js-panel").draggable({
      handle: ".js-panel-handle"
    }).resizable({
      handles: "n, e, s, w, ne, se, sw, nw"
    });
    $(".js-document").draggable({
      handle: ".js-document-handle"
    }).resizable({
      handles: "n, e, s, w, ne, se, sw, nw"
    });
    $(document).delegate('.js-guide.horizontal', 'mousedown', function(event) {
      var _this = this;
      return $(this).draggable({
        axis: "y",
        stop: function() {
          return $(_this).draggable("destroy");
        }
      });
    });
    return $(document).delegate('.js-guide.vertical', 'mousedown', function(event) {
      var _this = this;
      return $(this).draggable({
        axis: "x",
        stop: function() {
          return $(_this).draggable("destroy");
        }
      });
    });
  });

}).call(this);
