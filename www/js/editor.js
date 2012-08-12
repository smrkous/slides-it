var Editor, Slide, SlidePreviewer,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$(function() {
  $.fn.exclude = function() {
    var indicesToExclude;
    indicesToExclude = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return this.not(function(idx) {
      return __indexOf.call(indicesToExclude, idx) >= 0;
    });
  };
  return $(window).resize();
});

Editor = (function() {

  function Editor(lastOrdinal, slides) {
    this.lastOrdinal = lastOrdinal;
    this.slides = slides;
    this.previewer = new SlidePreviewer(this);
    this.container = $('#editor-container');
    this.init();
  }

  Editor.prototype.init = function() {
    var _this;
    this._createEditors();
    this.editors = this.container.children();
    this.currentIndex = 0;
    this.editors.next().hide();
    _this = this;
    $('#menu-save').on('click', function() {
      _this.save();
      return false;
    });
    return $('#menu-remove').on('click', function() {
      _this.removeCurrent();
      return false;
    });
  };

  Editor.prototype._createEditors = function() {
    var slide, textArea, _i, _len, _ref, _results;
    _ref = this.slides;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      slide = _ref[_i];
      textArea = this._createTextAreaFor(slide);
      _results.push(this.container.append(textArea));
    }
    return _results;
  };

  Editor.prototype._createTextAreaFor = function(slide) {
    return $('<textarea class=editor>').val(slide.content).on('change', function() {
      return slide.content = $(this).val();
    });
  };

  Editor.prototype.show = function(index) {
    if (index >= this.editors.size()) {
      index = this.editors.size() - 1;
    }
    this.editors.eq(this.currentIndex).hide();
    this.editors.eq(index).show();
    return this.currentIndex = index;
  };

  Editor.prototype.insertSlide = function(index) {
    var content, id, ordinal, slide, textarea;
    if (!index) {
      index = this.editors.length;
    }
    ordinal = this.lastOrdinal;
    id = 'slide-' + this.lastOrdinal;
    content = "";
    slide = new Slide(ordinal, id, content);
    textarea = this._createTextAreaFor(slide);
    textarea.insertAfter(this.editors.eq(index - 1));
    this.slides.splice(index, 0, slide);
    this.editors = this.container.children();
    this.previewer.insertSlide(index, slide);
    this.lastOrdinal++;
    return this.show(index);
  };

  Editor.prototype.removeCurrent = function() {
    if (this.editors.size() === 1) {
      return;
    }
    this.editors.eq(this.currentIndex).remove();
    this.editors = this.editors.exclude(this.currentIndex);
    this.previewer.removeSlide(this.currentIndex);
    this.slides.splice(this.currentIndex, 1);
    return this.show(this.currentIndex);
  };

  Editor.prototype.save = function() {
    return $.post('', {
      data: {
        lastOrdinal: this.lastOrdinal,
        slides: this.slides
      }
    });
  };

  return Editor;

})();

SlidePreviewer = (function() {

  function SlidePreviewer(editor) {
    this.editor = editor;
    this.element = $('#slide-preview');
    this.element.children().wrapAll($('<div id=preview-container>'));
    this.container = $('#preview-container');
    this.init();
  }

  SlidePreviewer.prototype.init = function() {
    var insertButton, _this;
    _this = this;
    $(document).on('click', '#slide-preview .deck-container', function() {
      var selectedIndex;
      selectedIndex = $(this).prevAll('.deck-container').size();
      return _this.editor.show(selectedIndex);
    });
    $(window).on('resize', function() {
      var top, winHeight;
      winHeight = $(this).height();
      top = _this.container.position().top;
      return _this.element.height(winHeight - top);
    });
    insertButton = $('<button>Insert Slide</button>');
    this.element.append(insertButton);
    insertButton.on('click', function() {
      return _this.editor.insertSlide();
    });
    return this.update();
  };

  SlidePreviewer.prototype.insertSlide = function(index, slide) {
    var preview;
    preview = $('<div class=deck-container>').append("<section class=slide>");
    preview.insertAfter(this.previews.eq(index - 1));
    preview.hide();
    preview.slideDown();
    return this.update();
  };

  SlidePreviewer.prototype.removeSlide = function(index) {
    this.previews.eq(index).remove();
    this.previews = this.previews.exclude(index);
    return this.update();
  };

  SlidePreviewer.prototype.update = function() {
    var allExceptOne, _this;
    this.previews = this.container.children('.deck-container');
    this.container.children('.betweener').remove();
    allExceptOne = this.previews.prev('.deck-container');
    $('<div class=betweener>').insertAfter(allExceptOne);
    _this = this;
    return this.container.children('.betweener').on('click', function() {
      var index;
      index = $(this).prevAll('.deck-container').size();
      return _this.editor.insertSlide(index);
    });
  };

  return SlidePreviewer;

})();

Slide = (function() {

  function Slide(ordinal, id, content, sections) {
    this.ordinal = ordinal;
    this.id = id;
    this.content = content;
    this.sections = sections;
  }

  return Slide;

})();
