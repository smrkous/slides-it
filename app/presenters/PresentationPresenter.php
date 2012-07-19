<?php

class PresentationPresenter extends BasePresenter {

	private $presentation;


	protected function beforeRender() {
		parent::beforeRender();
		$username = $this->getParam('username');
		$slug = $this->getParam('slug');

		$author = $this->context->users->findByUsername($username);
		if(!$author) {
			throw Exception(); //TODO predelat
		}

		$presentation = $this->context->presentations->
			c_findBySlugAndAuthor($slug, $author->id);
		if(!$presentation) {
			throw Exception(); // TODO predelat
		}
		$this->presentation = $presentation;
	}


	public function renderShow() {
		$this->template->presentation = $this->presentation;
	}

}
