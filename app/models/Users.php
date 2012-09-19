<?php

class Users extends BaseTable {


	public static function tableName() {
		return 'users';
	}


	/**
	 * @return \Nette\Database\Table\Selection
	 */
	public function findByUsername($username) {
		return $this->findOneBy(array(
				'username' => $username
			));
	}


	public function follow($followerId, $followingUsername) {
		$following = $this->findByUsername($followingUsername);

		if(!$following) return;

		try {
			$this->connection->table('followings')->insert(array(
				'user_id' => $followerId,
				'following_id' => $following->id
			));
		} catch(PDOException $e) {
			if($e->getCode() == 23000) return;
			throw $e;
		}
	}


	public function unfollow($followerId, $followingUsername) {
		$following = $this->findByUsername($followingUsername);

		if(!$following) return;

		$this->connection->table('followings')->where(array(
			'user_id' => $followerId,
			'following_id' => $following->id
		))->delete();
	}


	public function isFollowed($userId, $byFolllowerId) {
		return $this->connection->table('followings')->where(array(
			'user_id' => $byFolllowerId,
			'following_id' => $userId
		))->count() === 1;
	}

}
