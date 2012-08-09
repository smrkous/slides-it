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
								@currentSlideIndex = 0
								@slides = []
								$('#editor-container > section.slide').each (i, el) =>
												if not el.id
																el.id = 'slide-' + $(el).data('id')
												@slides.push new Slide(this, $(el))
	
	
				initializeDeck: ->
								$.deck '#editor-container .slide', 
												selectors: 
																container: '#editor-container'

	
				run: -> 
								@previewer = new SlidePreviewer(this)
								
								for slide in @slides
												slide.element.attr  'data-mercury', 'full'


				save: ->
								cont = $('#editor-container').clone()
								
								scalers = cont.find('.deck-slide-scaler')
								if scalers.size() isnt 0
												scalers.children().unwrap()
							 
								allowedAttrs = ['data-id', 'id', 'class']
								
								cont.children().each () ->
												attrs = this.attributes
												names = (a.name for a in attrs when a.name not in allowedAttrs)
												$(this).removeAttr names.join(' ')
								
								htmlContent = cont.html()
								$.post('', { data: htmlContent, lastSlideId: @lastSlideId })
				
				
				insertAbbr: (selection) ->
								handler = new AbbrHandler
								handler.handle selection


				insertSlide: ->
								currentElement = @getCurrentSlide().element
								
								element = $('<section>')
												.addClass('slide')
												.attr('data-mercury', 'full')
												.data('id', @lastSlideId)
												.attr('id', 'slide-' + @lastSlideId)
												.insertAfter(currentElement);
								
								slide = new Slide(this, element)
								
								@slides.splice(@currentSlideIndex + 1, 0, slide)
								@previewer.insertSlide(slide)
								
								@lastSlideId++;
								@currentSlideIndex++;
								
								@initializeDeck()
								$.deck('go', @currentSlideIndex);
								Mercury.trigger('reinitialize');
				
				
				editHierarchy: ->
								@previewer.showHierarchy()
								
								
				getCurrentSlide: ->
								return @slides[@currentSlideIndex]



class SlidePreviewer
				constructor: (@editor) ->
								@init()
								@setupUpdater()
				
				
				setupUpdater: ->
								window.setInterval((=>
												@updatePreview()
								), 5000)
				
				
				init: ->
								@previews = []
								
								$('#slide-preview section.slide')
												.wrapAll($('<div class=preview-container>'))
												.each (i, el) =>
																preview = new SlidePreview(@editor, $(el), @editor.slides[i])
																@previews.push preview
								
								$('#slide-preview section.slide').on 'click', (e) => 
												@updatePreview()
												
												slide = $(e.delegateTarget)
												idx = slide.parent().prevAll('.deck-container').size()
												
												$.deck 'go', idx
												
												@editor.currentSlideIndex = idx
								
								$(window).resize => @resize()
								
								@resize()
								
				
				insertSlide: (slide) ->
								currentPreviewCont = @getCurrentPreview().container
								
								element = $('<section>')
												.addClass('slide')
												.data('id', @editor.lastSlideId)
												.attr('id', 'slide-' + @editor.lastSlideId)
												.insertAfter(currentPreviewCont)
												
								preview = new SlidePreview(@editor, element, slide);
								
								preview.container.hide()
								preview.container.slideDown()
								
								newIdx = @editor.currentSlideIndex + 1
								@previews.splice(newIdx, 0, preview)


				updatePreview: ->
								slide = @editor.getCurrentSlide().element
								if slide.find('.deck-slide-scaler').size() isnt 0
												slide = slide.children()
		
								htmlContent = slide.html()
								@getCurrentPreview().setContent(slide.html())
				
				
				getCurrentPreview: ->
								currentIdx = @editor.currentSlideIndex
								return @previews[currentIdx]


				resize: ->
								height = $(window).height()
								$('#slide-preview').height(height)
				
				
				showHierarchy: ->
								$('#slide-preview').animate(
												width: $(window).width()
								)
								.addClass('hierarchy')
								
								$.each @previews, (i, preview) =>
												preview.container.wrap $('<div class=slide-config>')
												configContainer = preview.container.parent()
												


class Slide
				constructor: (@editor, @element) ->
								@parent = null
								
				
				getLevel: ->
								return @element.attr('id').split('/').length - 1
				
				
				getId: ->
								return @element.attr('id')
				
				
				getSimpleId: ->
								[path..., id] = @getId().split('/')
								return id
				
				
				getIdPath: ->
								[path..., id] = @getId().split('/')
								if path.length isnt 0
												return path.join('/') + '/'
								else 
												return ''
				
				
				setParent: (parent) ->
								@parent = parent
								path = if parent then parent.getId() + '/' else ''
								@element.attr('id', path + @getSimpleId())
								
				
				getParent: ->
								return @parent
				


class SlidePreview
				constructor: (@editor, @element, @slide) ->
								@element.wrap $('<div class="deck-container">')
								@container = @element.parent()


				setContent: (content) ->
								@element.html(content)



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