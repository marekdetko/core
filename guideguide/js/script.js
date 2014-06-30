(function() {
  window.initGuideGuide = function(bridge) {
    return window.GuideGuide = new GuideGuideCore({
      bridge: bridge
      
    }, function(gg) {
      return gg.log("GuideGuide Ready");
    });
  };

}).call(this);
