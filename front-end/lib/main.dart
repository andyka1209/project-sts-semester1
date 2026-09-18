import 'package:flutter/material.dart';
import 'package:salomon_bottom_bar/salomon_bottom_bar.dart';

import 'pages/HomePage.dart';
import 'pages/create_post_page.dart';
import 'pages/profile_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'BlogApp',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const MainPage(),
    );
  }
}

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _currentIndex = 0;
  // Kunci buat paksa HomePage rebuild pas balik ke tab Home
  int _homeRefreshKey = 0;

  final List<String> _titles = const [
    'BlogApp',
    'Buat Artikel',
    'Profil',
  ];

  Widget _getPage() {
    switch (_currentIndex) {
      case 0:
        return HomePage(key: ValueKey('home_$_homeRefreshKey'));
      case 1:
        return const CreatePostPage();
      case 2:
        return const ProfilePage();
      default:
        return const HomePage();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.blue,
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Icon(Icons.book, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 8),
            Text(
              _titles[_currentIndex],
              style: const TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        actions: [
          // Tombol login UDAH DIHAPUS
          // Cuma ada tombol refresh sekarang
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.black),
            onPressed: () {
              setState(() => _homeRefreshKey++);
            },
          ),
        ],
      ),
      body: _getPage(),
      bottomNavigationBar: SalomonBottomBar(
        currentIndex: _currentIndex,
        onTap: (i) {
          setState(() {
            _currentIndex = i;
            if (i == 0) _homeRefreshKey++;
          });
        },
        items: [
          SalomonBottomBarItem(
            icon: const Icon(Icons.home),
            title: const Text("Home"),
            selectedColor: Colors.purple,
          ),
          SalomonBottomBarItem(
            icon: const Icon(Icons.add_box),
            title: const Text("Buat"),
            selectedColor: Colors.orange,
          ),
          SalomonBottomBarItem(
            icon: const Icon(Icons.person),
            title: const Text("Profil"),
            selectedColor: Colors.teal,
          ),
        ],
      ),
    );
  }
}