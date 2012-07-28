<?php

use Kdyby\Extension\Forms\BootstrapRenderer\BootstrapRenderer;
use Nette\Application\UI\Form;

abstract class BasePresenter extends Nette\Application\UI\Presenter {


	public function createFormPrototype() {
		$form = new Form;
		$form->setRenderer(new BootstrapRenderer());
		return $form;
	}

}
