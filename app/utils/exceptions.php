<?php

class DuplicateEntryException extends Exception {
	
}

class FatalErrorException extends RuntimeException {


	public function __construct($message) {
		parent::__construct($message, null, null);
	}

}