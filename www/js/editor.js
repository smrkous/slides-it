var Editor, editor,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

editor = null;

$(function() {
  if (typeof Mercury !== 'undefined') {
    editor = new Editor(lastSlideId);
    editor.run();
    return Mercury.on('region:update', function(event, selection) {
      return console.log(selection.region.selection());
    });
  }
});

Editor = (function() {

  function Editor(lastSlideId) {
    this.lastSlideId = lastSlideId;
    this.initializeDeck();
  }

  Editor.prototype.initializeDeck = function() {
    return $.deck('#editor-container .slide', {
      selectors: {
        container: '#editor-container'
      }
    });
  };

  Editor.prototype.run = function() {
    var that,
      _this = this;
    window.setInterval((function() {
      return _this.updatePreview();
    }), 5000);
    that = this;
    $('#slide-preview section.slide').live('click', function() {
      var idx;
      that.updatePreview();
      idx = $(this).prevAll('.slide').size();
      return $.deck('go', idx);
    });
    return $('#editor-container > .slide').attr('data-mercury', 'full');
  };

  Editor.prototype.save = function() {
    var allowedAttrs, cont, htmlContent, scalers;
    cont = $('#editor-container').clone();
    scalers = cont.find('.deck-slide-scaler');
    if (scalers.size() !== 0) {
      scalers.children().unwrap();
    }
    allowedAttrs = ['data-id', 'id'];
    cont.children().each(function() {
      var a, attrs, names;
      attrs = this.attributes;
      names = (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = attrs.length; _i < _len; _i++) {
          a = attrs[_i];
          if (_ref = a.name, __indexOf.call(allowedAttrs, _ref) < 0) {
            _results.push(a.name);
          }
        }
        return _results;
      })();
      $(this).removeAttr(names.join(' '));
      return $(this).addClass('slide');
    });
    htmlContent = cont.html();
    return $.post('', {
      data: htmlContent,
      lastSlideId: this.lastSlideId
    });
  };

  Editor.prototype.insertSlide = function() {
    var currentPreview, currentSlide;
    this.lastSlideId++;
    currentSlide = $('#editor-container .deck-current');
    $('<section>').addClass('slide').attr('data-mercury', 'full').attr('data-id', this.lastSlideId).insertAfter(currentSlide);
    currentPreview = this.getCurrentSlidePreview();
    $('<section>').addClass('slide').attr('data-id', this.lastSlideId).insertAfter(currentPreview).hide().fadeIn();
    this.initializeDeck();
    $.deck('next');
    return Mercury.trigger('reinitialize');
  };

  Editor.prototype.updatePreview = function() {
    var htmlContent, slide;
    slide = $.deck('getSlide');
    if (slide.find('.deck-slide-scaler').size() !== 0) {
      slide = slide.children();
    }
    htmlContent = slide.html();
    return this.getCurrentSlidePreview().html(htmlContent);
  };

  Editor.prototype.getCurrentSlidePreview = function() {
    var slideIndex;
    slideIndex = this.getCurrentSlideIndex();
    return $('#slide-preview section.slide').eq(slideIndex);
  };

  Editor.prototype.getCurrentSlideIndex = function() {
    var classNames, slideIndex;
    slideIndex = -1;
    classNames = $('#editor-container').attr('class');
    $.each(classNames.split(/\s+/), function() {
      if (this.substring(0, 9) === 'on-slide-') {
        slideIndex = this.substring(9);
        return false;
      }
    });
    return slideIndex;
  };

  return Editor;

})();
