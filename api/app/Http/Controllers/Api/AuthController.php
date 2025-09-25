<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Jobs\SendWelcomeEmail;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(StoreUserRequest $request)
    {
        $password = Hash::make($request['password']);
        $data = [
            'name' => $request->name,
            "email" =>  $request->email,
            "password" => $password,
            "role" => $request->role
        ];
        $user = User::create($data);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Gửi mail qua Job (queue)
        try {
            Mail::to($user->email)->queue(new WelcomeMail($user));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }

        return response()->json([
            'status' => true,
            'message' => 'Đăng ký thành công',
            'data' => [
                'user' => $user,
                'token' => $token
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Email hoặc mật khẩu không đúng',
            ], 401);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('auth_token')->plainTextToken;
        $cookie = cookie(
            'token',          // tên cookie
            $token,           // giá trị
            60 * 24 * 7,      // thời gian sống (phút) = 7 ngày
            '/',              // path
            null,             // domain
            true,             // Secure -> chỉ HTTPS
            true              // HttpOnly -> JS không đọc được
        );

        return response()->json([
            'status' => true,
            'message' => 'Đăng nhập thành công',
            'data' => [
                'user' => $user,
            ]
        ])->cookie($cookie);;
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đăng xuất thành công'
        ])->cookie('token', '', -1);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => true,
            'message' => 'Thông tin tài khoản',
            'data' => $request->user()
        ]);
    }
}
