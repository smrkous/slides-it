<?php

use Nette\Caching\Cache;
use Nette\Caching\IStorage;
use Nette\InvalidStateException;
use Nette\Object;
use Nette\Reflection\Method;

/**
 * Description of MethodCallCacher
 *
 * @author Radek Ježdík <jezdik.radek@gmail.com>
 */
trait MethodCallCacher {

	private static $PREFIX = 'c_';


	public function __call($name, $args) {
		if(static::isPrefixed($name)) {
			$methodName = $this->unprefix($name);
			return $this->callOrLoad($methodName, $args, $this->cacheStorage);
		} else {
			if(get_parent_class() !== false) {
				return parent::__call($name, $args);
			} else {
				throw new FatalErrorException('Method ' . $name . ' not exists');
			}
		}
	}


	protected function isPrefixed($name) {
		return Nette\Utils\Strings::startsWith($name, self::$PREFIX);
	}


	private function unprefix($name) {
		return substr($name, strlen(self::$PREFIX));
	}


	/**
	 * 
	 * @param Object $that
	 * @param string $name
	 * @param array $args
	 */
	protected function callOrLoad($name, $args, IStorage $storage) {
		$className = get_class($this);

		if(!method_exists($this, $name)) {
			throw new InvalidStateException("Trying to call undefined cached method $className::$name");
		}

		$cache = new Cache($storage, 'cached-methods');
		$key = $className . $name . md5(serialize($args));

		if(!isset($cache[$key])) {
			$methodReflection = new Method($className, $name);

			$annotation = $methodReflection->getAnnotation('cache');
			$dependencies = $this->getDependencies($annotation);

			$return = $methodReflection->invokeArgs($this, $args);
			$cache->save($key, $return, $dependencies);

			return $return;
		}
		return $cache[$key];
	}


	private function getDependencies($annotation) {
		$depends = [];
		foreach($annotation as $key => $val) {
			$KEY = strtoupper($key);
			try {
				$constant = constant('\Nette\Caching\Cache::' . $KEY);
				$depends[$constant] = $val;
			} catch(Exception $e) {
				throw new Nette\InvalidStateException("Uknown cache option '$KEY'");
			}
		}
		return $depends;
	}

}