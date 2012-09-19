<?php

class UserPresenter extends BasePresenter {

	private $viewedUser;


	protected function startup() {
		parent::startup();

		$username = $this->getParam('username');
		$this->viewedUser = $this->context->users->findByUsername($username);
	}


	public function renderDefault($username) {
		$this->template->username = $username;
		$this->template->presentations = $this->getPresentations();
		$this->template->isFollowed = $this->isUserFollowed();
	}


	private function getPresentations() {
		return $this->context->presentations
				->findPresentationsByAuthor($this->viewedUser->id);
	}


	private function isUserFollowed() {
		$userId = $this->viewedUser->id;
		$followerId = $this->user->id;
		return $this->context->users->isFollowed($userId, $followerId);
	}


	public function handleFollow() {
		$this->toggleFollow(true);
	}


	public function handleUnfollow() {
		$this->toggleFollow(false);
	}


	private function toggleFollow($follow) {
		if(!$this->user->isLoggedIn()) return;

		$userId = $this->user->id;
		$followingUsername = $this->getParam('username');

		$model = $this->context->users;

		if($follow) {
			$model->follow($userId, $followingUsername);
		} else {
			$model->unfollow($userId, $followingUsername);
		}

		$this->redirect('this', array('username' => $followingUsername));
	}

}
