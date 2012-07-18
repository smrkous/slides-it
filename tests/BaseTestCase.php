<?php

include LIBS_DIR . '/Mockista/MockistaInterface.php';
include LIBS_DIR . '/Mockista/Mockista.php';

class BaseTestCase extends PHPUnit_Framework_TestCase {

	protected function toArrayObject(array $array) {
		return \Nette\ArrayHash::from($array);
	}

}