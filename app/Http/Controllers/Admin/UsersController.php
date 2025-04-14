<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\User\UserService;

class UsersController extends Controller
{
    // Sử dụng constructor property promotion
    public function __construct(private UserService $userService) {}

    public function index(): Response 
    {
        $users = $this->userService->getAll();
        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }

}

