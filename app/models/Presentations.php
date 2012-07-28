<?php

class Presentations extends BaseTable {


	public static function tableName() {
		return 'presentations';
	}


	public function findPresentationsByAuthor($authorId) {
		return $this->findBy([
				'author_id' => $authorId
			]);
	}


	public function findBySlugAndAuthor($slug, $authorId) {
		return $this->findOneBy([
				'slug' => $slug,
				'author_id' => $authorId
			]);
	}

}
