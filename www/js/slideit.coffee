
$ -> 
				$('.share-link').on 'click', ->
								id = $(this).data('presentation')
								
								modal = new ModalWindow
								modal.load(paths.modals.share, id: id)
								
								return false
								
				
				$('#new-presentation-link').on 'click', ->
								modal = new ModalWindow
								modal.load(paths.modals.create)
								
								return false


String::webalize = ->
				return this.toLowerCase().replace(/[^a-z0-9]+/gm, '-').replace(/(^-)|(-$)/g, '')


class ModalWindow
				constructor: ->
								@_container = $('<div class=modal>')
												
												
								@_header = $('<div class=modal-header>')
												.appendTo(@_container)
								
								@_closeButton = $('<a class=close>')
												.text('x')
												.attr('href', '#')
												.appendTo(@_header)
												.click( => @close())
												
								@_headerContent = $('<h3>')
												.appendTo(@_header)
												
												
								@_body = $('<div class=modal-body>')
												.appendTo(@_container)
												
												
								@_footer = $('<div class=modal-footer>')
												.appendTo(@_container)
				
				
				show: ->
								@_container.hide()
								@_container.appendTo $('body')
								@_container.fadeIn()
				
				
				load: (url, data) ->
								$.get url, data or {}, (result) =>
												if result.snippets
																@header result.snippets['snippet--header']
																@body result.snippets['snippet--body']
																@footer result.snippets['snippet--footer']
												@show()
				
				
				close: ->
								@_container.remove()
							
				
				updateOrReturn: (element, content) ->
								return element.html() if typeof content is undefined
								element.html(content)
				
				
				header: (content) ->
								@updateOrReturn(@_headerContent, content)

				
				body: (content) ->
								@updateOrReturn(@_body, content)

				
				footer: (content) ->
								@updateOrReturn(@_footer, content)