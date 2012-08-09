var AbbrHandler, Editor, Slide, SlidePreview, SlidePreviewer, editor, insertAbbr,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

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
    var _this = this;
    this.lastSlideId = lastSlideId;
    this.initializeDeck();
    this.currentSlideIndex = 0;
    this.slides = [];
    $('#editor-container > section.slide').each(function(i, el) {
      if (!el.id) {
        el.id = 'slide-' + $(el).data('id');
      }
      return _this.slides.push(new Slide(_this, $(el)));
    });
  }

  Editor.prototype.initializeDeck = function() {
    return $.deck('#editor-container .slide', {
      selectors: {
        container: '#editor-container'
      }
    });
  };

  Editor.prototype.run = function() {
    var slide, _i, _len, _ref, _results;
    this.previewer = new SlidePreviewer(this);
    _ref = this.slides;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slide = _ref[_i];
      _results.push(slide.element.attr('data-mercury', 'full'));
    }
    return _results;
  };

  Editor.prototype.save = function() {
    var allowedAttrs, cont, htmlContent, scalers;
    cont = $('#editor-container').clone();
    scalers = cont.find('.deck-slide-scaler');
    if (scalers.size() !== 0) {
      scalers.children().unwrap();
    }
    allowedAttrs = ['data-id', 'id', 'class'];
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
      return $(this).removeAttr(names.join(' '));
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
    var currentElement, element, slide;
    currentElement = this.getCurrentSlide().element;
    element = $('<section>').addClass('slide').attr('data-mercury', 'full').data('id', this.lastSlideId).attr('id', 'slide-' + this.lastSlideId).insertAfter(currentElement);
    slide = new Slide(this, element);
    this.slides.splice(this.currentSlideIndex + 1, 0, slide);
    this.previewer.insertSlide(slide);
    this.lastSlideId++;
    this.currentSlideIndex++;
    this.initializeDeck();
    $.deck('go', this.currentSlideIndex);
    return Mercury.trigger('reinitialize');
  };

  Editor.prototype.editHierarchy = function() {
    return this.previewer.showHierarchy();
  };

  Editor.prototype.getCurrentSlide = function() {
    return this.slides[this.currentSlideIndex];
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
    var _this = this;
    this.previews = [];
    $('#slide-preview section.slide').wrapAll($('<div class=preview-container>')).each(function(i, el) {
      var preview;
      preview = new SlidePreview(_this.editor, $(el), _this.editor.slides[i]);
      return _this.previews.push(preview);
    });
    $('#slide-preview section.slide').on('click', function(e) {
      var idx, slide;
      _this.updatePreview();
      slide = $(e.delegateTarget);
      idx = slide.parent().prevAll('.deck-container').size();
      $.deck('go', idx);
      return _this.editor.currentSlideIndex = idx;
    });
    $(window).resize(function() {
      return _this.resize();
    });
    return this.resize();
  };

  SlidePreviewer.prototype.insertSlide = function(slide) {
    var currentPreviewCont, element, newIdx, preview;
    currentPreviewCont = this.getCurrentPreview().container;
    element = $('<section>').addClass('slide').data('id', this.editor.lastSlideId).attr('id', 'slide-' + this.editor.lastSlideId).insertAfter(currentPreviewCont);
    preview = new SlidePreview(this.editor, element, slide);
    preview.container.hide();
    preview.container.slideDown();
    newIdx = this.editor.currentSlideIndex + 1;
    return this.previews.splice(newIdx, 0, preview);
  };

  SlidePreviewer.prototype.updatePreview = function() {
    var htmlContent, slide;
    slide = this.editor.getCurrentSlide().element;
    if (slide.find('.deck-slide-scaler').size() !== 0) {
      slide = slide.children();
    }
    htmlContent = slide.html();
    return this.getCurrentPreview().setContent(slide.html());
  };

  SlidePreviewer.prototype.getCurrentPreview = function() {
    var currentIdx;
    currentIdx = this.editor.currentSlideIndex;
    return this.previews[currentIdx];
  };

  SlidePreviewer.prototype.resize = function() {
    var height;
    height = $(window).height();
    return $('#slide-preview').height(height);
  };

  SlidePreviewer.prototype.showHierarchy = function() {
    var _this = this;
    $('#slide-preview').animate({
      width: $(window).width()
    }).addClass('hierarchy');
    return $.each(this.previews, function(i, preview) {
      var configContainer;
      preview.container.wrap($('<div class=slide-config>'));
      return configContainer = preview.container.parent();
    });
  };

  return SlidePreviewer;

})();

Slide = (function() {

  function Slide(editor, element) {
    this.editor = editor;
    this.element = element;
    this.parent = null;
  }

  Slide.prototype.getLevel = function() {
    return this.element.attr('id').split('/').length - 1;
  };

  Slide.prototype.getId = function() {
    return this.element.attr('id');
  };

  Slide.prototype.getSimpleId = function() {
    var id, path, _i, _ref;
    _ref = this.getId().split('/'), path = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), id = _ref[_i++];
    return id;
  };

  Slide.prototype.getIdPath = function() {
    var id, path, _i, _ref;
    _ref = this.getId().split('/'), path = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), id = _ref[_i++];
    if (path.length !== 0) {
      return path.join('/') + '/';
    } else {
      return '';
    }
  };

  Slide.prototype.setParent = function(parent) {
    var path;
    this.parent = parent;
    path = parent ? parent.getId() + '/' : '';
    return this.element.attr('id', path + this.getSimpleId());
  };

  Slide.prototype.getParent = function() {
    return this.parent;
  };

  return Slide;

})();

SlidePreview = (function() {

  function SlidePreview(editor, element, slide) {
    this.editor = editor;
    this.element = element;
    this.slide = slide;
    this.element.wrap($('<div class="deck-container">'));
    this.container = this.element.parent();
  }

  SlidePreview.prototype.setContent = function(content) {
    return this.element.html(content);
  };

  return SlidePreview;

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
