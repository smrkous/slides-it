editor = null;

$ -> 
				if typeof Mercury isnt 'undefined'
								editor = new Editor(lastSlideId);
								editor.run();
								Mercury.on 'region:update', (event, selection) -> 
												console.log selection.region.selection()
								
								Mercury.modalHandlers.insertAbbr = insertAbbr
												
	
####################################################

class Editor
				constructor: (@lastSlideId) ->
								@initializeDeck()
	
	
				initializeDeck: ->
								$.deck '#editor-container .slide', 
												selectors: 
																container: '#editor-container'
	
	
				run: -> 
								# update for changes in currently edited slide
								window.setInterval (=>
												@updatePreview()
								), 5000
								
								that = this
								$('#slide-preview section.slide').live 'click', ->
												that.updatePreview()
												idx = $(this).prevAll('.slide').size()
												$.deck 'go', idx
		
								$('#editor-container > .slide').attr 'data-mercury', 'full'


				save: ->
								cont = $('#editor-container').clone()
								
								scalers = cont.find('.deck-slide-scaler')
								if scalers.size() isnt 0
												scalers.children().unwrap()
							 
								allowedAttrs = ['data-id', 'id']
								
								cont.children().each () ->
												attrs = this.attributes
												names = (a.name for a in attrs when a.name not in allowedAttrs)
												$(this).removeAttr names.join(' ')
												$(this).addClass('slide')
								
								htmlContent = cont.html()
								$.post('', { data: htmlContent, lastSlideId: @lastSlideId })
				
				
				insertAbbr: (selection) ->
								handler = new AbbrHandler
								handler.handle selection


				insertSlide: ->
								@lastSlideId++;
								
								currentSlideIndex = @getCurrentSlideIndex()
								
								currentSlide = $('#editor-container .deck-current')
								$('<section>')
												.addClass('slide')
												.attr('data-mercury', 'full')
												.attr('data-id', @lastSlideId)
												.insertAfter(currentSlide);
								
								currentPreview = @getCurrentSlidePreview()
								$('<section>')
												.addClass('slide')
												.attr('data-id', @lastSlideId)
												.insertAfter(currentPreview)
												.hide()
												.fadeIn()
		
								@initializeDeck()
								$.deck('go', currentSlideIndex + 1);
		
								Mercury.trigger('reinitialize');


				updatePreview: ->
								slide = $.deck('getSlide')
								if slide.find('.deck-slide-scaler').size() isnt 0
												slide = slide.children()
		
								htmlContent = slide.html()
		
								@getCurrentSlidePreview().html(htmlContent)
				
				
				getCurrentSlidePreview: ->
								slideIndex = @getCurrentSlideIndex()
								return $('#slide-preview section.slide').eq(slideIndex)
				
		
				getCurrentSlideIndex: ->
								slideIndex = -1
		
								classNames = $('#editor-container').attr 'class'
								$.each classNames.split(/\s+/), ->
												if this.substring(0, 9) is 'on-slide-'
																slideIndex = parseInt(this.substring 9)
																return false # breaks iteration
		
								return slideIndex
				

class AbbrHandler
				handle: (selection) ->
								modal = Mercury.modal '/mercury/modals/abbr.html', 
												handler: 'insertAbbr',
												title: 'Insert Abbreviation'
							 #selection.wrap('<abbr title=neco>', true)
								#if selection and selection.commonAncestor
												#container = selection.commonAncestor(true).closest('abbr');
												
insertAbbr = -> 
				selection = Mercury.region.selection()
				
				container = selection.commonAncestor(true).closest('abbr')
				if container && container.length isnt 0
								@element.find('#abbr').val(container.text())
								@element.find('#explanation').val(container.attr('title'))
				else
								@element.find('#abbr').val(selection.textContent())
				
				@element.find('form').on 'submit', (event) =>
								event.preventDefault()
								
								abbr = @element.find('#abbr').val()
								expl = @element.find('#explanation').val()
								
								if container && container.length
											 container.text(abbr).attr('title', expl)
								else
												selection.insertNode($('<abbr>').text(abbr).attr('title', expl))
								
								@hide()