<?php

namespace App\Repositories;

interface RepositoryInterface
{
    /**
     * Find
     */
    public function find(int $id, array $columns = ['*']): mixed;

    /**
     * FindOrFail
     */
    public function findOrFail($id, array $columns = ['*']): mixed;

    /**
     * Get
     *
     * @param  array|mixed  $conditions
     * @param  array|mixed  $columns
     */
    public function get($conditions = [], $columns = ['*']): mixed;

    /**
     * Paginate
     *
     * @param  array|mixed  $conditions
     * @param  array|mixed  $columns
     * @return mixed
     */
    public function paginate($conditions = [], $columns = ['*']);

    /**
     * Create
     *
     * @param  array|mixed  $attributes
     * @return mixed
     */
    public function create($attributes = []);

    /**
     * Update
     *
     * @param  array|mixed  $attributes
     * @return mixed
     */
    public function update($id, $attributes = []);

    /**
     * Delete
     *
     * @return mixed
     */
    public function delete($id);
}
