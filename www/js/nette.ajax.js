/**
 * AJAX Nette Framework plugin for jQuery
 *
 * @copyright   Copyright (c) 2009 Jan Marek
 * @license     MIT
 * @link        http://addons.nette.org/cs/jquery-ajax
 * @version     0.2
 */

jQuery.extend({
	nette: {
		updateSnippet: function (id, html) {
			var snippet = $("#" + id)
			snippet.html(html);
			snippet.find('form').each(function() {
				Nette.initForm(this);
			});
		},

		success: function (payload) {
			// redirect
			if (payload.redirect) {
				window.location.href = payload.redirect;
				return;
			}

			// snippets
			if (payload.snippets) {
				for (var i in payload.snippets) {
					jQuery.nette.updateSnippet(i, payload.snippets[i]);
				}
			}
		}
	}
});

jQuery.ajaxSetup({
	success: jQuery.nette.success,
	dataType: "json"
});



/**
 * AJAX form plugin for jQuery
 *
 * @copyright  Copyright (c) 2009 Jan Kuchař, Copyright (c) 2009 Jan Marek
 * @license    MIT
 * @link       http://addons.nette.org/cs/ajax-form-s-eventy
 * @version    0.1
 */

jQuery.fn.extend({
	ajaxSubmit: function (e,callback) {
		var form;
		var sendValues = {};

		// submit button
		if (this.is(":submit")) {
			form = this.parents("form");
			sendValues[this.attr("name")] = this.val() || "";

		// form
		} else if (this.is("form")) {
			form = this;

		// invalid element, do nothing
		} else {
			return null;
		}

		// Vynecháme výchozí akci prohlížeče
		e.preventDefault();

		// validation
		if (form.get(0).onsubmit && !form.get(0).onsubmit()) {
			// Zastavíme vykonávání jakýchkoli dalších eventů
			e.stopImmediatePropagation();
			return null;
		}

		// Abychom formulář neodeslali zbytečně vícekrát
		if(form.data("ajaxSubmitCalled")==true)
			return null;

		form.data("ajaxSubmitCalled",true);

		// Tím, že zaregistruji ajaxové odeslání až teď, tak se provede jako poslední. (až po všech ostatních)
		form.one("submit",function(){
			// get values
			var values = form.serializeArray();

			for (var i = 0; i < values.length; i++) {
				var name = values[i].name;

				// multi
				if (name in sendValues) {
					var val = sendValues[name];

					if (!(val instanceof Array)) {
						val = [val];
					}

					val.push(values[i].value);
					sendValues[name] = val;
				} else {
					sendValues[name] = values[i].value;
				}
			}

			// send ajax request
			var ajaxOptions = {
				url: form.attr("action"),
				data: sendValues,
				type: form.attr("method") || "get"
			};

			ajaxOptions.complete = function(){
				form.data("ajaxSubmitCalled",false);
			}
			
			ajaxOptions.success = callback ? callback : jQuery.nette.success

			return jQuery.ajax(ajaxOptions);
		})

		e.stopImmediatePropagation();
		form.submit();
		return null;
	}
});