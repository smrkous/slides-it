<?php


class PasswordUtilsTest extends BaseTestCase {

	private $password = "a";

	public function testHashGeneration() {
		$hash = PasswordUtils::generateHash($this->password);
		$this->assertEquals(128, \Nette\Utils\Strings::length($hash));
	}

	public function testPasswordValidation() {
		$hash = PasswordUtils::generateHash($this->password);
		$this->assertTrue(PasswordUtils::validatePassword($this->password, $hash));
	}
}

