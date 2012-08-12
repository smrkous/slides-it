<?php

class Presentations extends BaseTable {


	public static function tableName() {
		return 'presentations';
	}


	public function createPresentation($authorId, $name, $slug) {
		$underline = '';
		$nameLength = Nette\Utils\Strings::length($name);
		for($i = 0; $i < $nameLength; $i++) {
			$underline .= '=';
		}

		$data = [
			'lastOrdinal' => 1,
			'slides' => [[
				'id' => 'slide-1',
				'ordinal' => 1,
				'content' => $name . "\n" . $underline
			]]
		];

		$content = PresentationContent::fromArray($data);

		return $this->createRow([
				'name' => $name,
				'slug' => $slug,
				'content' => serialize($content),
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


	public function save($presentationId, $content) {
		$contentSerialised = serialize($content);

		$this->createOrUpdate([
			'id' => $presentationId,
			'content' => trim($contentSerialised)
		]);
	}

}
