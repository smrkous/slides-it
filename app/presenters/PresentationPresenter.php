<?php

class PresentationPresenter extends BasePresenter {

	private $presentation;


	protected function startup() {
		parent::startup();

		$username = $this->getParam('username');
		$slug = $this->getParam('slug');

		$author = $this->context->users->findByUsername($username);

		if(!$author) throw Exception();

		$this->presentation = $this->context->presentations
			->findBySlugAndAuthor($slug, $author->id);

		if(!$this->presentation) throw Exception();

		if($this->request->isPost()) {
			$data = $this->getParam('data');
			dump($data);
			$content = PresentationContent::fromArray($data);

			$this->context->presentations->save($this->presentation->id, $content);

			$this->terminate();
		}
	}


	protected function beforeRender() {
		parent::beforeRender();

		$content = unserialize($this->presentation->content);

		$this->template->presentation = $this->presentation;
		$this->template->content = $content;
		$this->template->htmlSlides = $content->createHtmlSlides();
	}

}
