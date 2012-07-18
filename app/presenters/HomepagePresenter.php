<?php

class HomepagePresenter extends BasePresenter {


	protected function startup() {
		parent::startup();
		if($this->shouldShowDashboard()) {
			$this->view = 'dashboard';
		}
	}


	private function shouldShowDashboard() {
		return $this->user->loggedIn && $this->view == 'default';
	}


	public function renderDefault() {
		
	}

}
