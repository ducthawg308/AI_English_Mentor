<?php

namespace App\Providers;

use App\Repositories\User\UserRepository;
use App\Repositories\User\UserInterface;
use App\Services\User\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register User Repository
        $this->app->bind(UserInterface::class, UserRepository::class);

        // Register User Service
        $this->app->bind(UserService::class, function ($app) {
            return new UserService($app->make(UserInterface::class));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}