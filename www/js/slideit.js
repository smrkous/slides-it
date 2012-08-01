var ModalWindow;

$(function() {
  $('.share-link').each(function() {
    var _this = this;
    return this.getModalArguments = function() {
      return {
        id: $(_this).data('presentation')
      };
    };
  });
  return $('[data-modal]').on('click', function(event) {
    var args, modal, page;
    page = $(this).data('modal');
    args = this.getModalArguments ? this.getModalArguments() : null;
    modal = new ModalWindow;
    modal.load(paths.modals[page], args);
    return event.preventDefault();
  });
});

String.prototype.translate = function(from, to) {
  var origChar, out, pos, _i, _len, _ref;
  out = "";
  _ref = this.split("");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    origChar = _ref[_i];
    pos = from.indexOf(origChar);
    out += pos !== -1 ? to.charAt(pos) : origChar;
  }
  return out;
};

String.prototype.webalize = function() {
  var out;
  out = this.toLowerCase();
  out = out.translate("áčďéěíňóřšťúůýžàäâèëêìïîòöôùüûñç", "acdeeinorstuuyzaaaeeeiiiooouuunc");
  out = out.replace(/[^a-z0-9]+/gm, '-');
  out = out.replace(/(^-)|(-$)/g, '');
  return out;
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
