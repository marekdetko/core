(function() {
  var addGuide, devData, getOS;

  getOS = function() {
    var os;
    os = 'Unknown';
    if (navigator.appVersion.indexOf("Mac") >= 0) {
      os = 'MacOS';
    }
    if (navigator.appVersion.indexOf("Windows") >= 0) {
      os = 'Win';
    }
    if (navigator.appVersion.indexOf("X11") >= 0) {
      os = 'UNIX';
    }
    if (navigator.appVersion.indexOf("Linux") >= 0) {
      os = 'Linux';
    }
    return os;
  };

  addGuide = function(location, orientation) {
    var artboardPosition, guide;
    artboardPosition = $('.js-document').find('.js-artboard').position();
    guide = $('.js-templates').find('.js-guide').clone().attr('class', '').addClass('guide js-guide ' + orientation);
    if (orientation === 'horizontal') {
      guide.css('top', (location + artboardPosition.top) + 'px');
    } else {
      guide.css('left', (location + artboardPosition.left) + 'px');
    }
    return $('.js-document').append(guide);
  };

  devData = JSON.parse(localStorage.getItem('guideguidedev')) || new Object();

  window.Application = {
    id: 'web',
    name: 'GuideGuide web',
    version: '0.0.0',
    os: getOS(),
    localization: 'en-us',
    env: 'development',
    guideguideVersion: '0.0.0',
    submitAnonymousData: devData.submitData || false,
    checkForUpdates: devData.checkForUpdates || false
  };

  $(document).on('guideguide:getExistingGuides', function(event, callback) {
    var $artboard, docGuides, guides,
      _this = this;
    guides = [];
    docGuides = $('.js-document').find('.js-guide');
    $artboard = $('.js-document').find('.js-artboard');
    docGuides.each(function(index, el) {
      var $el, guide;
      $el = $(el);
      guide = {};
      if ($el.hasClass('horizontal')) {
        guide.orientation = 'horizontal';
        guide.location = $el.position().top - $artboard.position().top;
      }
      if ($el.hasClass('vertical')) {
        guide.orientation = 'vertical';
        guide.location = $el.position().left - $artboard.position().left;
      }
      return guides.push(guide);
    });
    return callback(guides);
  });

  $(document).on('guideguide:getData', function(event, callback) {
    var data;
    data = JSON.parse(localStorage.getItem('guideguide')) || new Object();
    data.application = Application;
    console.log('GuideGuide web returned', data);
    return callback(data);
  });

  $(document).on('guideguide:setData', function(event, data) {
    localStorage.setItem('guideguide', JSON.stringify(data));
    return console.log('GuideGuide web saved:', data);
  });

  $(document).on('guideguide:toggleGuides', function(event) {
    return $(".js-document").toggleClass('is-showing-guides');
  });

  $(document).on('guideguide:resetGuides', function(event) {
    return $('.js-document').find('.js-guide').remove();
  });

  $(document).on('guideguide:getDocumentInfo', function(event, callback) {
    var $selection, activeDocument, artboardPosition, info;
    activeDocument = $('.js-document').find('.js-artboard');
    artboardPosition = activeDocument.position();
    $selection = $('.js-document').find('.js-selection');
    info = {
      isSelection: $selection.length ? true : false,
      width: $selection.length ? $selection.width() + 1 : activeDocument.width(),
      height: $selection.length ? $selection.height() + 1 : activeDocument.height(),
      ruler: 'pixels',
      offsetX: $selection.length ? $selection.position().left - artboardPosition.left : 0,
      offsetY: $selection.length ? $selection.position().top - artboardPosition.top : 0
    };
    return callback(info);
  });

  $(document).on('guideguide:addGuides', function(event, guides) {
    var _this = this;
    return $.each(guides, function(index, guide) {
      return addGuide(guide.location, guide.orientation);
    });
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

  $(function() {
    addGuide(10, 'horizontal');
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
