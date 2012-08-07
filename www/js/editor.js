var AbbrHandler, Editor, SlidePreviewer, editor, insertAbbr,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

editor = null;

$(function() {
  if (typeof Mercury !== 'undefined') {
    editor = new Editor(lastSlideId);
    editor.run();
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
    this.previewer = new SlidePreviewer(this);
    return $('#editor-container section.slide').attr('data-mercury', 'full');
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
    var currentSlide, currentSlideIndex;
    this.lastSlideId++;
    currentSlideIndex = this.getCurrentSlideIndex();
    currentSlide = $('#editor-container .deck-current');
    $('<section>').addClass('slide').attr('data-mercury', 'full').attr('data-id', this.lastSlideId).insertAfter(currentSlide);
    this.previewer.insertSlide();
    this.initializeDeck();
    $.deck('go', currentSlideIndex + 1);
    return Mercury.trigger('reinitialize');
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

SlidePreviewer = (function() {

  function SlidePreviewer(editor) {
    this.editor = editor;
    this.init();
    this.setupUpdater();
  }

  SlidePreviewer.prototype.setupUpdater = function() {
    var _this = this;
    return window.setInterval((function() {
      return _this.updatePreview();
    }), 5000);
  };

  SlidePreviewer.prototype.init = function() {
    var _this;
    _this = this;
    $('#slide-preview section.slide').wrap($('<div class="deck-container">'));
    $('#slide-preview section.slide').on('click', function() {
      var idx;
      _this.updatePreview();
      idx = $(this).parent().prevAll('.deck-container').size();
      return $.deck('go', idx);
    });
    $(window).resize(function() {
      return _this.resize();
    });
    return this.resize();
  };

  SlidePreviewer.prototype.insertSlide = function() {
    var currentPreviewCont, slide;
    currentPreviewCont = this.getCurrentSlidePreview().parent();
    slide = $('<section>').addClass('slide').attr('data-id', this.editor.lastSlideId);
    return $('<div class="deck-container">').append(slide).insertAfter(currentPreviewCont).hide().slideDown();
  };

  SlidePreviewer.prototype.updatePreview = function() {
    var htmlContent, slide;
    slide = $.deck('getSlide');
    if (slide.find('.deck-slide-scaler').size() !== 0) {
      slide = slide.children();
    }
    htmlContent = slide.html();
    return this.getCurrentSlidePreview().html(htmlContent);
  };

  SlidePreviewer.prototype.getCurrentSlidePreview = function() {
    var slideIndex;
    slideIndex = editor.getCurrentSlideIndex();
    return $('#slide-preview section.slide').eq(slideIndex);
  };

  SlidePreviewer.prototype.resize = function() {
    var height;
    height = $(window).height();
    return $('#slide-preview').height(height);
  };

  return SlidePreviewer;

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
