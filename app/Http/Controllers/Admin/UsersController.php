<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\User\UserService;
use App\Http\Requests\Admin\StoreuserRequest;
use App\Http\Requests\Admin\UpdateuserRequest;
use Illuminate\Http\JsonResponse;

class UsersController extends Controller
{
    public function __construct(private UserService $userService) {}

    /**
     * Hiển thị danh sách users
     */
    public function index(): Response 
    {
        $users = $this->userService->getAll();
        return Inertia::render('admin/users', [
            'users' => $users
        ]);
    }

    /**
     * Tạo user mới
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Mã hóa password
            $validated['password'] = bcrypt($validated['password']);

            // Tạo user
            $user = $this->userService->create($validated);

            return response()->json([
                'message' => 'Tạo user thành công',
                'user' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin user
     */
    public function update(UpdateuserRequest $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Xử lý password nếu có
            if (isset($validated['password'])) {
                $validated['password'] = bcrypt($validated['password']);
            } else {
                unset($validated['password']); // Loại bỏ password nếu không thay đổi
            }

            // Cập nhật user
            $this->userService->update($id, $validated);

            return response()->json([
                'message' => 'Cập nhật user thành công',
                'user' => $this->userService->findById($id)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi cập nhật user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa user
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            // Kiểm tra user có tồn tại
            $user = $this->userService->findById($id);

            // Xóa user
            $this->userService->delete($id);

            return response()->json([
                'message' => 'Xóa user thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi xóa user: ' . $e->getMessage()
            ], 500);
        }
    }
}