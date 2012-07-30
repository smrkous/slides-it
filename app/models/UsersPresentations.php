<?php

use Nette\Caching\IStorage;

class UserPresentations extends BaseTable {

	/** @var Users */
	private $users;

	/** @var Presentations */
	private $presentations;


	public function __construct(Nette\Database\Connection $db, IStorage $storage, Users $users, Presentations $presentations) {
		parent::__construct($db, $storage);
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


	/**
	 * @return \Nette\Database\Table\ActiveRow
	 */
	public function findByUsernameAndSlug($username, $slug) {
		$user = $this->users->findByUsername($username);
		if(!$user) {
			throw new \Nette\InvalidStateException("User '$user' doesn't exist");
		}

		return $this->presentations->findBySlugAndAuthor($slug, $user->id);
	}

}
