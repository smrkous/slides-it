<?php

class UserPresenter extends BasePresenter {

	private $username;


	protected function beforeRender() {
		parent::beforeRender();
		$this->username = $this->getParameter('username');
	}


	public function renderDefault() {
		$presentations = $this->context->userPresentations
			->findPresentationsByUsername($this->username);

		$this->template->username = $this->username;
		$this->template->presentations = $presentations;
	}

}
