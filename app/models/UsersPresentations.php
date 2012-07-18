<?php

class UserPresentations extends BaseTable {

	/** @var Users */
	private $users;


	/** @var Presentations */
	private $presentations;


	public function __construct(Nette\Database\Connection $db, Users $users, Presentations $presentations) {
		parent::__construct($db);
		$this->users = $users;
		$this->presentations = $presentations;
	}


	/**
	 * @return \Nette\Database\Table\Selection
	 */
	public function findPresentationsByUsername($username) {
		$user = $this->users->findByUsername($username);

		return $this->presentations->findBy([
				'author_id' => $user->id
			]);
	}

}
