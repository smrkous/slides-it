<?php

class Shares extends BaseTable {


	public static function tableName() {
		return 'shares';
	}


	/**
	 * @return \Nette\Database\Table\Selection
	 */
	public function findByPresentation($presentationId) {
		return $this->findBy([
				'presentation_id' => $presentationId
			]);
	}

}
