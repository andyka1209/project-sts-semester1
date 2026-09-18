import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class SavedPostsService {
  static const _key = 'saved_post_ids';

  static Future<Set<int>> getSavedIds() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw == null) return {};
    final List decoded = jsonDecode(raw);
    return decoded.map((e) => e as int).toSet();
  }

  static Future<bool> toggle(int postId) async {
    final prefs = await SharedPreferences.getInstance();
    final ids = await getSavedIds();

    if (ids.contains(postId)) {
      ids.remove(postId);
    } else {
      ids.add(postId);
    }

    await prefs.setString(_key, jsonEncode(ids.toList()));
    return ids.contains(postId);
  }

  static Future<bool> isSaved(int postId) async {
    final ids = await getSavedIds();
    return ids.contains(postId);
  }
}