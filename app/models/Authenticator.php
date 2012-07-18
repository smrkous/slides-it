<?php

use Nette\Security as NS;

/**
 * Users authenticator.
 *
 * @author     John Doe
 * @package    MyApplication
 */
class Authenticator extends Nette\Object implements NS\IAuthenticator {

	private $users;

	public function __construct(Users $users) {
		$this->users = $users;
	}

	/**
	 * Performs an authentication
	 * @param  array
	 * @return Nette\Security\Identity
	 * @throws Nette\Security\AuthenticationException
	 */
	public function authenticate(array $credentials) {
		list($username, $password) = $credentials;

		$row = $this->users->findByUsername($username);

		if(!$row) {
			throw new NS\AuthenticationException("User '$username' not found.", self::IDENTITY_NOT_FOUND);
		}

		$valid = PasswordUtils::validatePassword($password, $row->hash);

		if(!$valid) {
			throw new NS\AuthenticationException("Invalid password.", self::INVALID_CREDENTIAL);
		}

		unset($row->hash);

		return new NS\Identity($row->id, null, $row->toArray());
	}

}
