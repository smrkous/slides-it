editor = null;

$ -> 
				if typeof Mercury isnt 'undefined'
								editor = new Editor(lastSlideId);
								editor.run();
								
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
								@previewer = new SlidePreviewer(this)
		
								$('#editor-container section.slide').attr 'data-mercury', 'full'


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
								
								@previewer.insertSlide()
		
								@initializeDeck()
								$.deck('go', currentSlideIndex + 1);
		
								Mercury.trigger('reinitialize');
				
		
				getCurrentSlideIndex: ->
								slideIndex = -1
		
								classNames = $('#editor-container').attr 'class'
								$.each classNames.split(/\s+/), ->
												if this.substring(0, 9) is 'on-slide-'
																slideIndex = parseInt(this.substring 9)
																return false # breaks iteration
		
								return slideIndex



class SlidePreviewer
				constructor: (@editor) ->
								@init()
								@setupUpdater()
				
				
				setupUpdater: ->
								window.setInterval((=>
												@updatePreview()
								), 5000)
				
				
				init: ->
								_this = this
								
								$('#slide-preview section.slide')
												.wrap($('<div class="deck-container">'))
								
								$('#slide-preview section.slide').on 'click', -> 
												_this.updatePreview()
												idx = $(this).parent().prevAll('.deck-container').size()
												$.deck 'go', idx
								
								$(window).resize ->
												_this.resize()
								
								@resize()
								
				
				insertSlide: ->
								currentPreviewCont = @getCurrentSlidePreview().parent()
								
								slide = $('<section>')
												.addClass('slide')
												.attr('data-id', @editor.lastSlideId)
												
								$('<div class="deck-container">')
												.append(slide)
												.insertAfter(currentPreviewCont)
												.hide()
												.slideDown()


				updatePreview: ->
								slide = $.deck('getSlide')
								if slide.find('.deck-slide-scaler').size() isnt 0
												slide = slide.children()
		
								htmlContent = slide.html()
		
								@getCurrentSlidePreview().html(htmlContent)
				
				
				getCurrentSlidePreview: ->
								slideIndex = editor.getCurrentSlideIndex()
								return $('#slide-preview section.slide').eq(slideIndex)


				resize: ->
								height = $(window).height()
								$('#slide-preview').height(height)



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