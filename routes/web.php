<?php

use App\Http\Controllers\Admin\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('admin/users',[UsersController::class,'index'])->name('admin.users');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
