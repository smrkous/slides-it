
$ -> 
				$('.share-link').on 'click', ->
								id = $(this).data('presentation')
								
								modal = new ModalWindow
								modal.load(paths.modals.share, id: id)
								
								return false


class ModalWindow
				constructor: ->
												@_container = $('<div class=modal>')
												
												
												@_header = $('<div class=modal-header>')
																.appendTo(@_container)
												
												@_headerContent = $('<h3>')
																.appendTo(@_header)
												
												
												@_body = $('<div class=modal-body>')
																.appendTo(@_container)
												
												
												@_footer = $('<div class=modal-footer>')
																.appendTo(@_container)
												
												$('<button class="btn btn-success">')
																.text('OK')
																.appendTo(@_footer)
																.click => @_container.remove()
				
				
				show: ->
								@_container.hide()
								@_container.appendTo $('body')
								@_container.fadeIn()
				
				
				load: (url, data) ->
								$.get url, data or {}, (result) =>
												if result.snippets
																@header result.snippets['snippet--header']
																@body result.snippets['snippet--body']
												@show()
				
				
				updateOrReturn: (element, content) ->
								return element.html() if typeof content is undefined
								element.html(content)
				
				
				header: (content) ->
								@updateOrReturn(@_headerContent, content)

				
				body: (content) ->
								@updateOrReturn(@_body, content)