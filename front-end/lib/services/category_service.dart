import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;

class Category {
  final int id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(id: json['id'] ?? 0, name: json['name'] ?? '');
  }
}

class CategoryService {
  static String get _baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api/categories';
    }
    return 'http://10.0.2.2:3000/api/categories';
  }

  static Future<List<Category>> getAllCategories() async {
    try {
      final response = await http.get(Uri.parse(_baseUrl));

      if (response.statusCode == 200) {
        final Map<String, dynamic> body = jsonDecode(response.body);
        final List data = body['data'] ?? [];
        return data.map((json) => Category.fromJson(json)).toList();
      } else {
        throw Exception('Gagal ambil kategori (${response.statusCode})');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}
