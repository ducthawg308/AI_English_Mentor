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

    Route::prefix('admin')->group(function () {
        Route::get('users', [UsersController::class, 'index'])->name('index');
        Route::post('users', [UsersController::class, 'store'])->name('store');
        Route::put('users/{id}', [UsersController::class, 'update'])->name('update');
        Route::delete('users/{id}', [UsersController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
