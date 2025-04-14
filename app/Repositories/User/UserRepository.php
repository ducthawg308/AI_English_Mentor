<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Repositories\BaseRepository;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * Trả về class model để BaseRepository gọi app()->make()
     */
    public function getModel(): string
    {
        return User::class;
    }

    // Có thể bổ sung thêm các hàm đặc thù xử lý User ở đây nếu muốn
}
