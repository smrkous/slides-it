<?php

use Nette\Templating\Helpers;

class Presentations extends BaseTable {


	public static function tableName() {
		return 'presentations';
	}


	public function createPresentation($authorId, $name, $slug) {
		$title = Helpers::escapeHtml($name);
		$content = '<section class="slide" data-id="1"><h1>' . $title . '</h1></section>';
		return $this->createRow([
				'name' => $name,
				'slug' => $slug,
				'content' => $content,
				'last_slide_id' => 1,
				'author_id' => $authorId
			]);
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


	public function update($presentationId, $content, $lastSlideId) {
		$this->createOrUpdate([
			'id' => $presentationId,
			'content' => trim($content),
			'last_slide_id' => (int) $lastSlideId
		]);
	}

}
