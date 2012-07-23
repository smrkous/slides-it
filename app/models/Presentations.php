<?php

class Presentations extends BaseTable {


	public static function tableName() {
		return 'presentations';
	}


	/**
	 * @cache(expire = 3600, sliding = true)
	 * @return \Nette\Database\Table\ActiveRow|FALSE
	 */
	public function findBySlugAndAuthor($slug, $authorId) {
		return $this->findOneBy([
				'slug' => $slug,
				'author_id' => $authorId
			]);
	}

}
