import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class User {
  final int id;
  final String username;
  final String role;
  User({required this.id, required this.username, required this.role});
  bool get isAdmin => role == 'admin';
  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json['id'] ?? 0,
        username: json['username'] ?? '',
        role: json['role'] ?? 'user',
      );
  Map<String, dynamic> toJson() =>
      {'id': id, 'username': username, 'role': role};
}

class AuthService {
  static String get _baseUrl {
    if (kIsWeb) return 'http://localhost:3000/api/auth';
    return 'http://10.0.2.2:3000/api/auth';
  }

  static const _keyToken = 'auth_token';
  static const _keyUser = 'auth_user';

  static Future<User> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    final body = jsonDecode(response.body);

    if (response.statusCode != 200) {
      throw Exception(body['message'] ?? 'Login gagal');
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken, body['data']['token']);
    await prefs.setString(_keyUser, jsonEncode(body['data']['user']));

    return User.fromJson(body['data']['user']);
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyUser);
  }

  static Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString(_keyUser);
    if (userStr == null) return null;
    return User.fromJson(jsonDecode(userStr));
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyToken);
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }
}