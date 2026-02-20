# 🏗️ Vùng Đất Mới — City Builder 3D

## Stack hiện tại
- **Engine:** Babylon.js (PBR, Shadow, Post-processing)
- **Model:** GLB/GLTF (kéo thả vào game)
- **File chính:** `index.html` (single-file, mở trực tiếp trên trình duyệt)

---

## 🖥️ Chạy local

```bash
# Cách 1: Mở trực tiếp
# Double-click index.html (một số trình duyệt block file:// cho GLB loader)

# Cách 2: Local server (khuyên dùng)
npx serve .
# hoặc
python -m http.server 8080
# Mở http://localhost:8080
```

---

## 🎨 Pipeline tự build model 3D (miễn phí 100%)

### Phần mềm cần cài

| Phần mềm | Mục đích | Link |
|---|---|---|
| **Blender 4.x** | Modeling, sculpt, rig, animate | https://www.blender.org/download/ |
| **VS Code** | Code editor | https://code.visualstudio.com/ |
| **Claude Code Extension** | AI coding assistant | VS Code Marketplace |

### Blender Workflow → Game

```
1. Blender: Tạo model (nhà, cây, nhân vật...)
2. Blender: UV Unwrap → Texture Paint hoặc Shader Nodes
3. Blender: Rigging + Animation (nếu cần)
4. File → Export → glTF 2.0 (.glb)
   - Format: GLB (Binary)
   - Include: ✅ Mesh ✅ Materials ✅ Animations
   - Transform: ✅ +Y Up
5. Kéo thả file .glb vào game
```

### Blender Tips cho Game Assets

```
- Giữ polycount thấp (< 5000 tri cho props, < 10000 cho nhân vật)
- Dùng PBR Principled BSDF shader (tương thích Babylon.js)
- Export texture size 512x512 hoặc 1024x1024 (web performance)
- Đặt origin ở chân model (để đặt lên mặt đất chuẩn)
- Scale: 1 Blender unit = 1 game unit
```

---

## 📁 Cấu trúc project đề xuất (mở rộng)

```
vung-dat-moi/
├── index.html          # Game chính
├── assets/
│   ├── models/         # File .glb từ Blender
│   │   ├── player.glb
│   │   ├── npc_farmer.glb
│   │   ├── house_wood.glb
│   │   ├── tree_oak.glb
│   │   └── rock_01.glb
│   ├── textures/       # Texture maps
│   │   ├── ground_albedo.png
│   │   └── ground_normal.png
│   └── audio/          # Sound effects
│       ├── chop.mp3
│       └── build.mp3
├── js/
│   ├── game.js         # Game logic
│   ├── player.js       # Player controller
│   ├── npc.js          # NPC AI
│   ├── building.js     # Building system
│   └── loader.js       # Asset loader
├── css/
│   └── style.css       # UI styles
├── package.json
└── README.md
```

---

## 🔧 Phát triển tiếp với VS Code + Claude Code

### Những thứ nên nhờ Claude Code hỗ trợ:

1. **Tách file:** Chuyển từ single-file HTML sang project nhiều file (js/css riêng)
2. **Asset loader:** Viết hệ thống load GLB tự động từ folder `assets/models/`
3. **Animation system:** Blend animations từ Blender (idle, walk, harvest...)
4. **Terrain nâng cao:** Heightmap texture, multi-material terrain
5. **Particle effects:** Lửa, khói, bụi khi khai thác
6. **Sound system:** Âm thanh cho từng hành động
7. **Save/Load:** LocalStorage hoặc file JSON
8. **Multiplayer:** WebSocket server (tùy chọn)

### Lệnh hữu ích trong Claude Code terminal:

```bash
# Khởi tạo project Node.js
npm init -y
npm install serve

# Chạy dev server
npx serve .

# Hoặc dùng Vite (hot reload)
npm create vite@latest . -- --template vanilla
npm install babylonjs @babylonjs/loaders
npm run dev
```

---

## 📚 Tài liệu tham khảo

- **Babylon.js Docs:** https://doc.babylonjs.com/
- **Babylon.js Playground:** https://playground.babylonjs.com/
- **Blender Manual:** https://docs.blender.org/manual/
- **glTF Spec:** https://www.khronos.org/gltf/
- **Blender → Babylon.js Guide:** https://doc.babylonjs.com/features/featuresDeepDive/importers/blender

---

Chúc bạn build game vui! 🎮
