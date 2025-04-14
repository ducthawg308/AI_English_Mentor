<?php

namespace App\Services\User;

use App\Services\BaseService;
use App\Repositories\User\UserInterface;

class UserService extends BaseService implements UserServiceInterface
{
    protected UserInterface $userRepository;

    public function __construct(UserInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAll(): mixed
    {
        return $this->userRepository->get();
    }

    public function paginate(): mixed
    {
        return $this->userRepository->paginate();
    }

    public function findById(int $id): mixed
    {
        return $this->userRepository->findOrFail($id);
    }

    public function create(array $data): mixed
    {
        return $this->userRepository->create($data);
    }

    public function update(int $id, array $data): mixed
    {
        return $this->userRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->userRepository->delete($id);
    }
}
