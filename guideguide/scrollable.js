(function() {
  var adjustScrollbar, onAdjust, onDragHandle, onMouseLeave, scrollTimer;

  scrollTimer = {};

  $(document).on('mouseenter', '.js-scrollable', function(event) {
    var $container, $contentInner, $contentOuter, scrollable;
    $container = $(this).closest('.js-scrollable');
    $contentOuter = $container.find('.js-scroll-outer');
    $contentInner = $container.find('.js-scroll-inner');
    scrollable = $contentInner.outerHeight() > $contentOuter.outerHeight();
    if (scrollable) {
      clearTimeout(scrollTimer);
      $container.addClass('scrollbar-is-visible');
      adjustScrollbar($container);
      $container.on('drag.scrollable', '.js-scrollbar-handle', $.throttle(100, onDragHandle));
      $container.on('dragstart.scrollable', '.js-scrollbar-handle', function(event, ui) {
        return $container.addClass('is-dragging');
      });
      $container.on('dragstop.scrollable', '.js-scrollbar-handle', function(event, ui) {
        return $container.removeClass('is-dragging');
      });
      $contentOuter.on('scroll.scrollable', $.throttle(50, onAdjust));
      $(document).on('mouseleave.scrollable', '.js-scrollable', onMouseLeave);
      return $(document).on('keyup.scrollable', '.js-scrollable', onAdjust);
    }
  });

  onDragHandle = function(event, ui) {
    var $container, $contentInner, $contentOuter, $scrollHandle, $scrollTrack, scrollAmmount, scrollPercent;
    $container = $(this).closest('.js-scrollable');
    $scrollHandle = $container.find('.js-scrollbar-handle');
    $scrollTrack = $container.find('.js-scrollbar-track');
    $contentOuter = $container.find('.js-scroll-outer');
    $contentInner = $container.find('.js-scroll-inner');
    scrollPercent = ui.position.top / ($scrollTrack.outerHeight() - $scrollHandle.outerHeight(true));
    scrollAmmount = ($contentInner.outerHeight() - $contentOuter.outerHeight()) * scrollPercent;
    return $contentOuter.scrollTop(scrollAmmount);
  };

  onAdjust = function(event) {
    return adjustScrollbar($(event.currentTarget).closest('.js-scrollable'));
  };

  adjustScrollbar = function($container) {
    var $contentInner, $contentOuter, $scrollHandle, $scrollTrack, scrollAmmount, scrollPercent;
    if ($container.hasClass('is-dragging')) {
      return;
    }
    $contentOuter = $container.find('.js-scroll-outer');
    $contentInner = $container.find('.js-scroll-inner');
    $scrollHandle = $container.find('.js-scrollbar-handle');
    $scrollTrack = $container.find('.js-scrollbar-track');
    scrollPercent = $contentOuter.scrollTop() / ($contentInner.outerHeight() - $contentOuter.outerHeight());
    if (scrollPercent > 1) {
      scrollPercent = 1;
    }
    if (scrollPercent < 0) {
      scrollPercent = 0;
    }
    scrollAmmount = scrollPercent * ($scrollTrack.outerHeight() - $scrollHandle.outerHeight(true));
    return $scrollHandle.css('top', scrollAmmount);
  };

  onMouseLeave = function(event) {
    var $container, $contentOuter,
      _this = this;
    $container = $(this).closest('.js-scrollable');
    $contentOuter = $container.find('.js-scroll-outer');
    $(document).off('.scrollable');
    $container.off('.scrollable');
    $contentOuter.off('.scrollable');
    $container = $(this).closest('.js-scrollable');
    if ($container.hasClass('scrollbar-is-visible')) {
      return scrollTimer = setTimeout(function() {
        return $container.removeClass('scrollbar-is-visible');
      }, 1000);
    }
  };

  $(function() {
    return $(".js-scrollbar-handle").draggable({
      addClasses: false,
      axis: "y",
      containment: "parent"
    });
  });

}).call(this);
