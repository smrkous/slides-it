<?php

use Nette\Caching\IStorage;
use Nette\Database\Connection;

abstract class BaseTable extends Nette\Object {

	/** @var Connection */
	protected $connection;


	/** @var IStorage */
	protected $cacheStorage;


	public function __construct(Nette\Database\Connection $db, IStorage $storage) {
		$this->connection = $db;
		$this->cacheStorage = $storage;
	}


	protected static function tableName() {
		
	}


	/**
	 * @return \Nette\Database\Table\Selection
	 */
	protected function getTable() {
		$tableName = static::tableName();
		return $this->connection->table($tableName);
	}


	/**
	 * @return \Nette\Database\Table\Selection
	 */
	public function findAll() {
		return $this->getTable();
	}


	/**
	 * @param array $values
	 * @return \Nette\Database\Table\Selection
	 */
	public function findBy(array $values) {
		return $this->getTable()
				->where($values);
	}


	/**
	 * @param array $values
	 * @return \Nette\Database\Table\ActiveRow|FALSE
	 */
	public function findOneBy(array $values) {
		return $this->findBy($values)
				->limit(1)
				->fetch();
	}


	/**
	 * @param int $id
	 * @return \Nette\Database\Table\ActiveRow|FALSE
	 */
	public function find($id) {
		return $this->findOneBy(array('id' => $id));
	}


	/**
	 * Creates and inserts new row to database.
	 *
	 * @param  array row values
	 * @return \Nette\Database\Table\ActiveRow created row
	 * @throws DuplicateEntryException
	 */
	protected function createRow(array $values) {
		try {
			return $this->getTable()->insert($values);
		} catch(PDOException $e) {
			if($e->getCode() == 23000) {
				throw new DuplicateEntryException();
			} else {
				throw $e;
			}
		}
	}


	/**
	 * Insert or update row in database
	 *
	 * @param  array
	 * @return \Nette\Database\Table\ActiveRow automatically found based on first "column => value" pair in $values
	 */
	public function createOrUpdate(array $values) {
		$pairs = array();
		foreach($values as $key => $value) {
			$pairs[] = "$key = ?";
		}

		$pairs = implode(', ', $pairs);
		$values = array_values($values);

		$this->connection->queryArgs(
			"INSERT INTO {$this->tableName} SET " . $pairs .
			' ON DUPLICATE KEY UPDATE ' . $pairs, array_merge($values, $values)
		);

		return $this->findOneBy(func_get_arg(0));
	}

}