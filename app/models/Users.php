<?php

class Users extends BaseTable {


	public static function tableName() {
		return 'users';
	}


	/**
	 * @return \Nette\Database\Table\Selection
	 */
	public function findByUsername($username) {
		return $this->findOneBy([
				'username' => $username
			]);
	}

}
