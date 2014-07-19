(function() {
  window.initGuideGuide = function(bridge) {
    return window.GuideGuide = new GuideGuideCore({
      bridge: bridge
    }, function(gg) {
      return gg.log("GuideGuide Ready");
    });
  };

  $(function() {
    return $('.tooltipped').tipsy({
      gravity: function() {
        return $(this).attr('data-tip-dir') || 'n';
      },
      delayIn: 1000
    });
  });

}).call(this);
