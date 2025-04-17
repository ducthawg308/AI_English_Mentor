<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserInterface;
use Illuminate\Support\Facades\Hash;

class UserService extends BaseService
{
    public function __construct(UserInterface $repository)
    {
        $this->repository = $repository;
    }

    public function create(array $data)
    {
        // Mã hóa password nếu có
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        // Xử lý password nếu có
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        return $this->repository->update($id, $data);
    }

    public function find($id)
    {
        return $this->repository->find($id);
    }
}