var ModalWindow;

$(function() {
  return $('.share-link').on('click', function() {
    var id, modal;
    id = $(this).data('presentation');
    modal = new ModalWindow;
    modal.load(paths.modals.share, {
      id: id
    });
    return false;
  });
});

ModalWindow = (function() {

  function ModalWindow() {
    var _this = this;
    this._container = $('<div class=modal>');
    this._header = $('<div class=modal-header>').appendTo(this._container);
    this._headerContent = $('<h3>').appendTo(this._header);
    this._body = $('<div class=modal-body>').appendTo(this._container);
    this._footer = $('<div class=modal-footer>').appendTo(this._container);
    $('<button class="btn btn-success">').text('OK').appendTo(this._footer).click(function() {
      return _this._container.remove();
    });
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
      }
      return _this.show();
    });
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

  return ModalWindow;

})();
