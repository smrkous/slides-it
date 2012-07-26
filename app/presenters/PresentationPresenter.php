<?php

class PresentationPresenter extends BasePresenter {

	private $presentation;

	public function actionEdit() {
		$isPost = $this->getRequest()
			->isMethod(Nette\Http\IRequest::POST);

		if($isPost) {
			$content = $this->getParam('data');

			if(!$content)
				$this->terminate();

			$this->context->presentations->createOrUpdate([
				'id' => $this->getPresentation()->id,
				'content' => $content
			]);
		}
	}

	public function renderShow() {
		$this->template->presentation = $this->getPresentation();
	}

	public function renderEdit() {
		$this->template->presentation = $this->getPresentation();
	}

	protected function getPresentation() {
		if($this->presentation !== null) {
			return $this->presentation;
		}

		$username = $this->getParam('username');
		$slug = $this->getParam('slug');

		$author = $this->context->users->findByUsername($username);
		if(!$author) {
			throw Exception(); //TODO predelat
		}

		$presentation = $this->context->presentations
			->findBySlugAndAuthor($slug, $author->id);
		if(!$presentation) {
			throw Exception(); // TODO predelat
		}

		$this->presentation = $presentation;
		return $this->presentation;
	}

}
