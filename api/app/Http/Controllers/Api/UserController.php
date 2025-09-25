<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\UserResource;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);

        // Phân trang
        $users = User::orderBy('id', 'desc')->paginate($limit);

        return response()->json([
            'status' => true,
            'message' => 'Lấy danh sách người dùng thành công',
            'data' => UserResource::collection($users),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
                'last_page'    => $users->lastPage(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
            ]
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $password = Hash::make($request['password']);
        $data = [
            'name' => $request->name,
            "email" =>  $request->email,
            "password" => $password,
            "role" => $request->role
        ];
        $user = User::create($data);
        return response()->json([
            'status' => true,
            'message' => 'Đăng ký thành công',
            'data' => [
                'user' => $user,
            ]
        ], 201);
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->only(['name', 'email', 'role', 'is_active']));
        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
