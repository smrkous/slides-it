
$ -> 
				$('.share-link').each ->
								this.getModalArguments = =>
												return id: $(this).data('presentation')
								
				
				$('[data-modal]').on 'click', (event) ->
								page = $(this).data('modal')
								args = if this.getModalArguments then this.getModalArguments() else null
								
								modal = new ModalWindow
								modal.load(paths.modals[page], args)
								
								event.preventDefault()


String::translate = (from, to) -> 
				out = ""
				for origChar in this.split("")
								pos = from.indexOf(origChar);
								out += if pos isnt -1 then to.charAt pos else origChar
				return out


String::webalize = ->
				out = this.toLowerCase()
				out = out.translate(
								"áčďéěíňóřšťúůýžàäâèëêìïîòöôùüûñç",
								"acdeeinorstuuyzaaaeeeiiiooouuunc"
				)
				out = out.replace /[^a-z0-9]+/gm, '-'
				out = out.replace /(^-)|(-$)/g, ''
				return out


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
												
								@_headerContent = $('<h3 id=snippet--modal_header>')
												.appendTo(@_header)
												
												
								@_body = $('<div class=modal-body id=snippet--modal_body>')
												.appendTo(@_container)
												
												
								@_footer = $('<div class=modal-footer id=snippet--modal_footer>')
												.appendTo(@_container)
												
												
								@_backdrop = $('<div class=modal-backdrop>')
				
				
				show: ->
								body = $('body')
								
								@_backdrop.hide()
								@_container.hide()
								
								@_backdrop.appendTo body
								@_container.appendTo body
								
								@_backdrop.fadeIn()
								@_container.fadeIn()
				
				
				load: (url, data) ->
								$.get url, data or {}, (payload) =>
												@show()
												jQuery.nette.success(payload)
				
				
				close: ->
								@_container.remove()
								@_backdrop.remove()
							
				
				updateOrReturn: (element, content) ->
								return element.html() if typeof content is undefined
								element.html(content)
				
				
				header: (content) ->
								@updateOrReturn(@_headerContent, content)

				
				body: (content) ->
								@updateOrReturn(@_body, content)

				
				footer: (content) ->
								@updateOrReturn(@_footer, content)