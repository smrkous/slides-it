var ModalWindow;

$(function() {
  $('.share-link').on('click', function() {
    var id, modal;
    id = $(this).data('presentation');
    modal = new ModalWindow;
    modal.load(paths.modals.share, {
      id: id
    });
    return false;
  });
  return $('#new-presentation-link').on('click', function() {
    var modal;
    modal = new ModalWindow;
    modal.load(paths.modals.create);
    return false;
  });
});

String.prototype.webalize = function() {
  return this.toLowerCase().replace(/[^a-z0-9]+/gm, '-').replace(/(^-)|(-$)/g, '');
};

ModalWindow = (function() {

  function ModalWindow() {
    var _this = this;
    this._container = $('<div class=modal>');
    this._header = $('<div class=modal-header>').appendTo(this._container);
    this._closeButton = $('<a class=close>').text('x').attr('href', '#').appendTo(this._header).click(function() {
      return _this.close();
    });
    this._headerContent = $('<h3>').appendTo(this._header);
    this._body = $('<div class=modal-body>').appendTo(this._container);
    this._footer = $('<div class=modal-footer>').appendTo(this._container);
  }

  ModalWindow.prototype.show = function() {
    this._container.hide();
    this._container.appendTo($('body'));
    return this._container.fadeIn();
  };

  ModalWindow.prototype.load = function(url, data) {
    var _this = this;
    return $.get(url, data || {}, function(result) {
      if (result.snippets) {
        _this.header(result.snippets['snippet--header']);
        _this.body(result.snippets['snippet--body']);
        _this.footer(result.snippets['snippet--footer']);
      }
      return _this.show();
    });
  };

  ModalWindow.prototype.close = function() {
    return this._container.remove();
  };

  ModalWindow.prototype.updateOrReturn = function(element, content) {
    if (typeof content === void 0) {
      return element.html();
    }
    return element.html(content);
  };

  ModalWindow.prototype.header = function(content) {
    return this.updateOrReturn(this._headerContent, content);
  };

  ModalWindow.prototype.body = function(content) {
    return this.updateOrReturn(this._body, content);
  };

  ModalWindow.prototype.footer = function(content) {
    return this.updateOrReturn(this._footer, content);
  };

  return ModalWindow;

})();
