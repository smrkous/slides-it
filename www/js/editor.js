var AbbrHandler, Editor, editor, insertAbbr,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

editor = null;

$(function() {
  if (typeof Mercury !== 'undefined') {
    editor = new Editor(lastSlideId);
    editor.run();
    Mercury.on('region:update', function(event, selection) {
      return console.log(selection.region.selection());
    });
    return Mercury.modalHandlers.insertAbbr = insertAbbr;
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

  Editor.prototype.insertAbbr = function(selection) {
    var handler;
    handler = new AbbrHandler;
    return handler.handle(selection);
  };

  Editor.prototype.insertSlide = function() {
    var currentPreview, currentSlide, currentSlideIndex;
    this.lastSlideId++;
    currentSlideIndex = this.getCurrentSlideIndex();
    currentSlide = $('#editor-container .deck-current');
    $('<section>').addClass('slide').attr('data-mercury', 'full').attr('data-id', this.lastSlideId).insertAfter(currentSlide);
    currentPreview = this.getCurrentSlidePreview();
    $('<section>').addClass('slide').attr('data-id', this.lastSlideId).insertAfter(currentPreview).hide().fadeIn();
    this.initializeDeck();
    $.deck('go', currentSlideIndex + 1);
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
        slideIndex = parseInt(this.substring(9));
        return false;
      }
    });
    return slideIndex;
  };

  return Editor;

})();

AbbrHandler = (function() {

  function AbbrHandler() {}

  AbbrHandler.prototype.handle = function(selection) {
    var modal;
    return modal = Mercury.modal('/mercury/modals/abbr.html', {
      handler: 'insertAbbr',
      title: 'Insert Abbreviation'
    });
  };

  return AbbrHandler;

})();

insertAbbr = function() {
  var container, selection,
    _this = this;
  selection = Mercury.region.selection();
  container = selection.commonAncestor(true).closest('abbr');
  if (container && container.length !== 0) {
    this.element.find('#abbr').val(container.text());
    this.element.find('#explanation').val(container.attr('title'));
  } else {
    this.element.find('#abbr').val(selection.textContent());
  }
  return this.element.find('form').on('submit', function(event) {
    var abbr, expl;
    event.preventDefault();
    abbr = _this.element.find('#abbr').val();
    expl = _this.element.find('#explanation').val();
    if (container && container.length) {
      container.text(abbr).attr('title', expl);
    } else {
      selection.insertNode($('<abbr>').text(abbr).attr('title', expl));
    }
    return _this.hide();
  });
};
