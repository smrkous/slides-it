<?php

use Nette\Caching\Storages\MemoryStorage;

class ExtendedMemoryStorage extends MemoryStorage {

	private $depends;


	public function write($key, $data, array $dp) {
		parent::write($key, $data, $dp);
		foreach($dp as $dpName => $val) {
			if($dpName == \Nette\Caching\Cache::EXPIRE) {
				$this->depends[$key][$dpName] = time() + $val;
			}
		}
	}


	public function read($key) {
		$val = parent::read($key);
		if($val) {
			$expire = \Nette\Caching\Cache::EXPIRE;
			if(isset($this->depends[$key][$expire])) {
				if(time() > $this->depends[$key][$expire]) {
					$this->remove($key);
					return null;
				}
			}
		}
		return $val;
	}

}

class CachedClass {

	use MethodCallCacher;
	private $cacheStorage;


	public function __construct() {
		$this->cacheStorage = new ExtendedMemoryStorage();
	}


	/** @cache(expire = 1, sliding = true) */
	public function getRandomNumber() {
		return rand(0, 10e10);
	}


	/** @cache(dfghjkl = 1) */
	public function getRandomNumber2() {
		return rand(0, 10e10);
	}

}

/**
 * Description of MethodCallCacher
 *
 * @author Radek Ježdík <jezdik.radek@gmail.com>
 */
class MethodCallCacherTest extends BaseTestCase {


	public function testCachedMethod() {
		$obj = new CachedClass();
		$c1 = $obj->c_getRandomNumber();
		$c2 = $obj->c_getRandomNumber();
		$this->assertEquals($c1, $c2);
	}


	public function testNonCachedMethod() {
		$obj = new CachedClass();
		$c1 = $obj->getRandomNumber();
		$c2 = $obj->getRandomNumber();
		$this->assertNotEquals($c1, $c2);
	}


	public function testInvalidCacheConstant() {
		$this->setExpectedException('\Nette\InvalidStateException');
		$obj = new CachedClass();
		$obj->c_getRandomNumber2();
	}


	public function testNonPrefixedMethod() {
		$this->setExpectedException('FatalErrorException');
		$obj = new CachedClass();
		$obj->getFooo();
	}


	public function testUndefinedCachedMethod() {
		$this->setExpectedException('\Nette\InvalidStateException');
		$obj = new CachedClass();
		$obj->c_getFooo();
	}

}