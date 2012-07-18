<?php

class Presentations extends BaseTable {


	public static function tableName() {
		return 'presentations';
	}


	/**
	 * @return \Nette\Database\Table\Selection
	 */
	public function findBySlugAndAuthor($slug, $authorId) {
		return $this->findOneBy([
				'slug' => $slug,
				'author_id' => $authorId
			]);
	}

}
