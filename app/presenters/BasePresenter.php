<?php

use Kdyby\Extension\Forms\BootstrapRenderer\BootstrapRenderer;
use Nette\Application\UI\Form;

abstract class BasePresenter extends Nette\Application\UI\Presenter {

	protected function beforeRender() {
		parent::beforeRender();
		$this->template->username = $this->user->identity->username;
	}

	public function createFormPrototype() {
		$form = new Form;
		$form->setRenderer(new BootstrapRenderer());
		return $form;
	}

}
