<?php

namespace App\Repositories;

use Illuminate\Contracts\Container\BindingResolutionException;

/**
 * Class BaseRepository
 */
abstract class BaseRepository implements RepositoryInterface
{
    protected object $model;

    /**
     * The number of models to return for pagination.
     */
    protected int $perPage = 15;

    /**
     * BaseRepository constructor
     */
    public function __construct()
    {
        $this->setModel();
        // $this->setPerPage(config('const.per_page'));
    }

    /**
     * The abstract method getModel
     */
    abstract public function getModel(): string;

    /**
     * Function setPerPage
     */
    public function setPerPage(int $perPage): object
    {
        $this->perPage = $perPage;

        return $this;
    }

    /**
     * The setter model
     *
     *
     * @throws BindingResolutionException
     */
    public function setModel(): void
    {
        $this->model = app()->make(
            $this->getModel()
        );
    }

    /**
     * The function help get record
     *
     * @param  array  $conditions
     * @param  array  $columns
     */
    public function get($conditions = [], $columns = ['*']): mixed
    {
        return $this->model->where($conditions)->select($columns)->get();
    }

    /**
     * The function help get record has pagination
     *
     * @param  array  $conditions
     * @param  array  $columns
     */
    public function paginate($conditions = [], $columns = ['*']): mixed
    {
        return $this->model->where($conditions)->select($columns)->paginate($this->perPage);
    }

    /**
     * The function help find item by id
     *
     * @param  string[]  $columns
     */
    public function find(int $id, $columns = ['*']): mixed
    {
        return $this->model->find($id, $columns);
    }

    /**
     * The function help get find or fail
     */
    public function findOrFail($id, array $columns = ['*']): mixed
    {
        return $this->model->findOrFail($id, $columns);
    }

    /**
     * The function add new record
     *
     * @param  array  $attributes
     */
    public function create($attributes = []): mixed
    {
        $this->model->fill($attributes);

        return $this->model->create($attributes);
    }

    /**
     * The function help update record
     *
     * @param  array  $attributes
     * @return false|mixed
     */
    public function update($id, $attributes = []): mixed
    {
        $result = $this->find($id);
        if ($result) {
            $this->model->fill($attributes);
            $result->update($attributes);

            return $result;
        }

        return false;
    }

    /**
     * The function help delete item
     */
    public function delete($id): bool
    {
        $result = $this->find($id);
        if ($result) {
            return $result->delete();
        }

        return false;
    }
}
