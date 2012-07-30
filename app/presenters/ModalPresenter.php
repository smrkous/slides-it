<?php

use Nette\Forms\Form;

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

		$form->addText('name', 'Presentation Title');

		$form->addText('slug', 'URL representation');

		$form->onSuccess[] = callback($this, 'createPresentation');

		return $form;
	}


	public function createPresentation(Form $form) {
		if(!$this->user->isLoggedIn()) return;

		$userId = $this->user->id;
		$name = $form->values['name'];
		$slug = $form->values['slug'];

		$p = $this->context->presentations
			->createPresentation($userId, $name, $slug);

		$this->redirect('Presentation:edit', [
			'username' => $this->user->identity->username,
			'slug' => $p->slug
		]);
	}

}