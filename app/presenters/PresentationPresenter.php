<?php

class PresentationPresenter extends BasePresenter {

	private $presentation;


	public function actionEdit() {
		$isPost = $this->getRequest()
			->isMethod(Nette\Http\IRequest::POST);

		if($isPost) {
			$this->savePresentation();
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

		$presentation = $this->context->userPresentations
			->findByUsernameAndSlug($username, $slug);
		if(!$presentation) {
			throw Exception(); // TODO predelat
		}

		$this->presentation = $presentation;
		return $this->presentation;
	}


	private function savePresentation() {
		$presentationId = $this->getPresentation()->id;
		$content = $this->getParam('data');
		$lastSlideId = $this->getParam('lastSlideId');

		if(!$content) $this->terminate();

		$this->context->presentations
			->update($presentationId, $content, $lastSlideId);
	}

}
