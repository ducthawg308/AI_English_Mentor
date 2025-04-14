<?php

namespace App\Services\User;

interface UserServiceInterface
{
    /**
     * Lấy danh sách tất cả người dùng
     */
    public function getAll(): mixed;

    /**
     * Lấy danh sách người dùng có phân trang
     */
    public function paginate(): mixed;

    /**
     * Tìm người dùng theo ID
     */
    public function findById(int $id): mixed;

    /**
     * Tạo người dùng mới
     */
    public function create(array $data): mixed;

    /**
     * Cập nhật người dùng
     */
    public function update(int $id, array $data): mixed;

    /**
     * Xóa người dùng
     */
    public function delete(int $id): bool;
}
