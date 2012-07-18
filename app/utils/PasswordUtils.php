<?php

class PasswordUtils {

	public static function generateHash($password) {
		$salt = bin2hex(mcrypt_create_iv(32, MCRYPT_DEV_URANDOM));

		$hash = static::hash($salt, $password);
		$final = $salt . $hash;

		return $final;
	}

	public static function validatePassword($password, $hash) {
		$salt = substr($hash, 0, 64);
		$validHash = substr($hash, 64, 64);

		$testHash = static::hash($salt, $password);

		return ($testHash === $validHash);
	}

	private static function hash($salt, $password) {
		return hash('SHA256', $salt . $password);
	}

}