import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;

class Comment {
  final int id;
  final int postId;
  final String authorName;
  final String content;
  final DateTime createdAt;

  Comment({
    required this.id,
    required this.postId,
    required this.authorName,
    required this.content,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] ?? 0,
      postId: json['postId'] ?? 0,
      authorName: json['authorName'] ?? 'Anonim',
      content: json['content'] ?? '',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}

class CommentService {
  static String get _baseUrl {
    if (kIsWeb) return 'http://localhost:3000/api/comments';
    return 'http://10.0.2.2:3000/api/comments';
  }

  static Future<List<Comment>> getComments(int postId) async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/$postId'));
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        final List data = body['data'] ?? [];
        return data.map((j) => Comment.fromJson(j)).toList();
      } else {
        throw Exception('Gagal ambil komentar (${response.statusCode})');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<bool> createComment({
    required int postId,
    required String authorName,
    required String content,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/$postId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'authorName': authorName,
          'content': content,
        }),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return true;
      } else {
        throw Exception('Gagal kirim komentar (${response.statusCode})');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}