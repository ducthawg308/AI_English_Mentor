<?php

namespace App\Repositories\User;

use App\Repositories\BaseRepository;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class UserRepository extends BaseRepository implements UserInterface
{
    public function __construct()
    {
        $this->model = app(User::class);
    }

    public function all()
    {
        return $this->model->all()->map(function ($user) {
            if ($user->avatar) {
                $user->avatar = Storage::url($user->avatar);
            }
            return $user;
        });
    }

    public function create(array $data)
    {
        if (isset($data['avatar']) && $data['avatar'] instanceof \Illuminate\Http\UploadedFile) {
            $data['avatar'] = $data['avatar']->store('avatars', 'public');
        }
        return parent::create($data);
    }

    public function update($id, array $data)
    {
        $user = $this->find($id);
        if (isset($data['avatar']) && $data['avatar'] instanceof \Illuminate\Http\UploadedFile) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $data['avatar']->store('avatars', 'public');
        }
        return parent::update($id, $data);
    }

    public function delete($id)
    {
        $user = $this->find($id);
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        return parent::delete($id);
    }
}