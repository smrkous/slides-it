editor = null;

$ -> 
				if typeof Mercury isnt 'undefined'
								editor = new Editor(lastSlideId);
								editor.run();
								Mercury.on 'region:update', (event, selection) -> 
												console.log selection.region.selection()
												
	
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


				insertSlide: ->
								@lastSlideId++;
								
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
								$.deck('next');
		
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
																slideIndex = this.substring 9
																return false # breaks iteration
		
								return slideIndex
		
		