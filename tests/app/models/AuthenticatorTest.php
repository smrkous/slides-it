<?php

class AuthenticatorTest extends BaseTestCase {

	private static $username = 'myUsername';
	private static $password = 'abc1234';
	private static $hash = 'f7e6bfae9dbc85e24ad15bdb3c173faf4db8da36e3e94c8dd848e60de52d7f22773abbb6b569690bbb7af9d9dc72385519bc140aef9e206c2aae71bb7ff20946';


	public function testValidUser() {
		$authenticator = $this->getStandardAuthenticator();
		$identity = $authenticator->authenticate([
			self::$username,
			self::$password,
			]);

		$this->assertInstanceOf('Nette\Security\Identity', $identity);
	}


	public function testUnknownUser() {
		$this->setExpectedException('Nette\Security\AuthenticationException');

		$wrongUsername = self::$username . 'UNKNOWN';

		$model = $this->mockUsersModel();
		$model->findByUsername($wrongUsername)
			->once
			->andReturn(null);
		$model->freeze();

		$authenticator = $this->createAuthenticator($model);

		$authenticator->authenticate([
			$wrongUsername,
			self::$password,
		]);
	}


	public function testWrongPassword() {
		$this->setExpectedException('Nette\Security\AuthenticationException');

		$authenticator = $this->getStandardAuthenticator();
		$authenticator->authenticate([
			self::$username,
			self::$password . 'wrong',
		]);
	}


	private function getStandardAuthenticator() {
		$model = $this->mockUsersModel();

		$row = $this->mockActiveRow();

		$model->findByUsername(self::$username)
			->once
			->andReturn($row);

		$model->freeze();

		return $this->createAuthenticator($model);
	}


	private function mockUsersModel() {
		return Mockista\mock('Users');
	}


	private function createAuthenticator($model) {
		return new Authenticator($model);
	}


	private function mockActiveRow() {
		$row = Mockista\mock();

		$data = [
			'id' => 1,
			'username' => self::$username,
			'hash' => self::$hash,
		];
		foreach($data as $key => $val) {
			$row->$key = $val;
		}

		$row->toArray()->andReturn($data);
		return $row;
	}

}
