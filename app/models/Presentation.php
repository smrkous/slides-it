<?php

class PresentationContent {

	/** @var int */
	public $lastOrdinal;

	/** @var Slide[] */
	public $slides = array();


	public static function fromArray($data) {
		$content = new PresentationContent;

		if(isset($data['slides'])) {
			$content->slides = self::createSlides($data['slides']);
			unset($data['slides']);
		}

		foreach($data as $key => $val) {
			$content->$key = $val;
		}

		return $content;
	}


	private static function createSlides($data) {
		$slides = array();
		foreach($data as $slideData) {
			$slides[] = Slide::fromArray($slideData);
		}
		return $slides;
	}


	public function createHtmlSlides() {
		$html = array();

		$texy = new Texy();
		foreach($this->slides as $slide) {
			$html[] = $texy->process($slide->getContent());
		}

		return $html;
	}

}

class Slide extends \Nette\Object {

	/** @var int ordinal key used to identify a slide in presentation */
	private $ordinal;

	/** @var string html id of this slide */
	private $id;

	/** @var array array of section names [section => foo, subsection => bar] */
	private $sections = null;

	/** @var string */
	private $content;


	public static function fromArray($data) {
		$slide = new Slide;
		foreach($data as $key => $val) {
			$slide->$key = $val;
		}
		return $slide;
	}


	public function getOrdinal() {
		return $this->ordinal;
	}


	public function setOrdinal($ordinal) {
		$this->ordinal = $ordinal;
	}


	public function getId() {
		return $this->id;
	}


	public function setId($id) {
		$this->id = $id;
	}


	public function getSections() {
		return $this->sections;
	}


	public function setSections($sections) {
		$this->sections = $sections;
	}


	public function getContent() {
		return $this->content;
	}


	public function setContent($content) {
		$this->content = $content;
	}


	public function getSectionsInJson() {
		return \Nette\Utils\Json::encode($this->sections);
	}

}