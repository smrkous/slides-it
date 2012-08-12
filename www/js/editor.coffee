
$ ->
				$.fn.exclude = (indicesToExclude...) ->
								return this.not (idx) -> idx in indicesToExclude
				
				$(window).resize()
				
				
class Editor
				constructor: (@lastOrdinal, @slides) ->
								@previewer = new SlidePreviewer(this)
								@container = $('#editor-container')
								
								@init()
				
				
				init: ->
								@_createEditors()
								
								@editors = @container.children()
								@currentIndex = 0
								
								@editors.next().hide()  # hides all editors except the first one
								
								_this = this
								$('#menu-save').on 'click', -> _this.save(); false
								$('#menu-remove').on 'click', -> _this.removeCurrent(); false
				
				
				_createEditors: ->
								for slide in @slides
												textArea = @_createTextAreaFor(slide)
												@container.append(textArea)
				
				
				_createTextAreaFor: (slide) ->
								return $('<textarea class=editor>')
												.val(slide.content)
												.on 'change', ->
																slide.content = $(this).val()
				
				
				show: (index) ->
								if index >= @editors.size()
												index = @editors.size() - 1
								
								@editors.eq(@currentIndex).hide()
								@editors.eq(index).show()
								@currentIndex = index
				
				
				insertSlide: (index) ->
								if not index
												index = @editors.length
								
								ordinal = @lastOrdinal
								id = 'slide-' + @lastOrdinal
								content = ""
								
								slide = new Slide(ordinal, id, content)
								
								textarea = @_createTextAreaFor(slide)
								textarea.insertAfter(@editors.eq(index - 1))
								
								@slides.splice(index, 0, slide)
								@editors = @container.children()
								
								@previewer.insertSlide(index, slide)
								
								@lastOrdinal++
								
								@show(index)
				
			 
				removeCurrent: ->
								return if @editors.size() is 1
								
								@editors.eq(@currentIndex).remove()
								@editors = @editors.exclude(@currentIndex)
								@previewer.removeSlide(@currentIndex)
								@slides.splice(@currentIndex, 1)
								@show(@currentIndex)
				
				
				save: ->
								$.post '',
												data: {
																lastOrdinal: @lastOrdinal,
																slides: @slides
												}
								


class SlidePreviewer
				constructor: (@editor) ->
								@element = $('#slide-preview')
								@element.children()
												.wrapAll($('<div id=preview-container>'))
								
								@container = $('#preview-container')
								
								@init()
				
				
				init: ->
								_this = this
								
								$(document).on 'click', '#slide-preview .deck-container', ->
												selectedIndex = $(this).prevAll('.deck-container').size()
												_this.editor.show(selectedIndex)
								
								$(window).on 'resize', ->
												winHeight = $(this).height()
												top = _this.container.position().top
												_this.element.height(winHeight - top)
								
								insertButton = $('<button>Insert Slide</button>')
								@element.append(insertButton)
								insertButton.on 'click', ->
												_this.editor.insertSlide()
								
								@update()
					
					
				insertSlide: (index, slide) ->
								preview = $('<div class=deck-container>')
												.append("<section class=slide>")
								preview.insertAfter(@previews.eq(index - 1))
								
								preview.hide()
								preview.slideDown()
								
								@update()
				
				
				removeSlide: (index) ->
								@previews.eq(index).remove();
								@previews = @previews.exclude(index)
								@update()
				
				
				update: ->
								@previews = @container.children('.deck-container')
								
								@container.children('.betweener').remove();
								allExceptOne = @previews.prev('.deck-container')
								$('<div class=betweener>').insertAfter(allExceptOne)
								
								_this = this
								@container.children('.betweener').on 'click', ->
												index = $(this).prevAll('.deck-container').size();
												_this.editor.insertSlide(index)



class Slide
				constructor: (@ordinal, @id, @content, @sections) ->
								