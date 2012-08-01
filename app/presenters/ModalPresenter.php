<?php

use Nette\Forms\Form;
use Nette\Utils\Strings;

class ModalPresenter extends BasePresenter {


	protected function beforeRender() {
		parent::beforeRender();
		$this->invalidateControl();
	}


	public function actionShare($id) {
		$shares = $this->context->shares
			->findByPresentation($id);

		$this->template->shares = $shares;
	}


	public function createComponentShareForm() {
		$form = $this->createFormPrototype();

		$form->addText('people', 'Username');
		$form->addSubmit('add', 'Add');

		$form->onSuccess = function($form) {
				throw new Nette\InvalidStateException("Not implemented yet");
			};

		return $form;
	}


	public function createComponentCreateForm() {
		$form = $this->createFormPrototype();

		$form->addText('name', 'Presentation Title')
			->setRequired();

		$form->addText('slug', 'URL representation')
			->setRequired();

		$form->onSuccess[] = callback($this, 'createPresentation');

		return $form;
	}


	public function createPresentation(Form $form) {
		if(!$this->user->isLoggedIn()) return;

		$userId = $this->user->id;
		$name = $form->values['name'];
		$slug = Strings::webalize($form->values['slug']);

		try {
			$p = $this->context->presentations
				->createPresentation($userId, $name, $slug);

			$this->redirect('Presentation:edit', [
				'username' => $this->user->identity->username,
				'slug' => $p->slug
			]);
		} catch(DuplicateEntryException $e) {
			$this->addMessage('One of your presentations already has this URL representation');
		}
	}
	
	private function addMessage($message) {
		if(!isset($this->template->messages)) {
			$this->template->messages = [];
		}
		$this->template->messages[] = $message;
	}

}