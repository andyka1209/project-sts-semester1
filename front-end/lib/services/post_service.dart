import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'auth_service.dart';

// ============================================================
// CLASS POST (MODEL)
// ============================================================
class Post {
  final int id;
  final int categoryId;
  final String title;
  final String content;
  final String? imageUrl;
  final String status;
  final String? categoryName;
  final String? authorName;
  final int commentCount;

  Post({
    required this.id,
    required this.categoryId,
    required this.title,
    required this.content,
    this.imageUrl,
    required this.status,
    this.categoryName,
    this.authorName,
    this.commentCount = 0,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] ?? 0,
      categoryId: json['categoryId'] ?? 0,
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      imageUrl: json['imageUrl'],
      status: json['status'] ?? 'published',
      categoryName: json['categoryName'] ?? json['category_name'],
      authorName: json['authorName'] ?? json['author_name'] ?? 'Admin',
      commentCount: json['commentCount'] ?? json['comment_count'] ?? 0,
    );
  }
}

// ============================================================
// CLASS POST SERVICE (API)
// ============================================================
class PostService {
  static String get _baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api/posts';
    }
    return 'http://10.0.2.2:3000/api/posts';
  }

  // GET semua posts (gak butuh token)
  static Future<List<Post>> getAllPosts() async {
    try {
      final response = await http.get(Uri.parse(_baseUrl));
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        final List data = body['data'] ?? [];
        return data.map((json) => Post.fromJson(json)).toList();
      } else {
        throw Exception('Gagal ambil posts (${response.statusCode})');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // GET post by ID (gak butuh token)
  static Future<Post> getPostById(int id) async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/$id'));
      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        return Post.fromJson(body['data']);
      } else {
        throw Exception('Gagal ambil post (${response.statusCode})');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  // POST buat artikel baru (BUTUH TOKEN)
  static Future<bool> createPost({
    required String title,
    required String content,
    required int categoryId,
    Uint8List? imageBytes,
    String? imageName,
  }) async {
    final token = await AuthService.getToken();  // <-- AMBIL TOKEN
    final uri = Uri.parse(_baseUrl);

    final request = http.MultipartRequest('POST', uri)
      ..headers['Authorization'] = 'Bearer $token'  // <-- KIRIM TOKEN
      ..fields['title'] = title
      ..fields['content'] = content
      ..fields['categoryId'] = categoryId.toString();

    if (imageBytes != null && imageName != null) {
      request.files.add(
        http.MultipartFile.fromBytes(
          'image',
          imageBytes,
          filename: imageName,
        ),
      );
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201 || response.statusCode == 200) {
      return true;
    } else {
      throw Exception(
          'Gagal buat artikel (${response.statusCode}): ${response.body}');
    }
  }

  // PUT update artikel (BUTUH TOKEN)
  static Future<bool> updatePost({
    required int id,
    required String title,
    required String content,
    required int categoryId,
    Uint8List? imageBytes,
    String? imageName,
  }) async {
    final token = await AuthService.getToken();  // <-- AMBIL TOKEN
    final uri = Uri.parse('$_baseUrl/$id');

    final request = http.MultipartRequest('PUT', uri)
      ..headers['Authorization'] = 'Bearer $token'  // <-- KIRIM TOKEN
      ..fields['title'] = title
      ..fields['content'] = content
      ..fields['categoryId'] = categoryId.toString();

    if (imageBytes != null && imageName != null) {
      request.files.add(
        http.MultipartFile.fromBytes(
          'image',
          imageBytes,
          filename: imageName,
        ),
      );
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return true;
    } else {
      throw Exception(
          'Gagal update artikel (${response.statusCode}): ${response.body}');
    }
  }

  // DELETE artikel (BUTUH TOKEN)
  static Future<bool> deletePost(int id) async {
    try {
      final token = await AuthService.getToken();  // <-- AMBIL TOKEN
      final response = await http.delete(
        Uri.parse('$_baseUrl/$id'),
        headers: {
          'Authorization': 'Bearer $token',  // <-- KIRIM TOKEN
        },
      );
      if (response.statusCode == 200) {
        return true;
      } else {
        throw Exception('Gagal hapus artikel (${response.statusCode})');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}