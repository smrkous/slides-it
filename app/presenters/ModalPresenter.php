<?php

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

		return $form;
	}

}