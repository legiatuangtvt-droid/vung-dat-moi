# CLAUDE.md — Workflow Rules

## Git Workflow
- **Auto commit & push**: Sau mỗi lần thực hiện thay đổi file, PHẢI tự động commit và push lên GitHub.
  - Commit message ngắn gọn, mô tả đúng thay đổi
  - Luôn kết thúc commit message với `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
  - Push ngay sau commit, không đợi user yêu cầu
- **Branch**: Làm việc trên `main` trừ khi user yêu cầu tạo branch khác
- **Không force push**: Không bao giờ dùng `--force` trừ khi user yêu cầu rõ ràng

## Project Structure
```
vung-dat-moi/
├── index.html          # HTML shell + script tags
├── css/style.css       # All CSS
├── js/
│   ├── data.js         # Constants (ERAS, RES, NEEDS, BLDS) + game state (G, P)
│   ├── engine.js       # Babylon.js setup, terrain, getH(), mkPBR()
│   ├── humanoid.js     # mkHuman(), animHuman(), disposeHuman()
│   ├── nature.js       # Trees, rocks, bushes + initial spawn
│   ├── player.js       # Player mesh + movement
│   ├── npc.js          # NPC AI (idle/walk/harvest/rest)
│   ├── building.js     # GLB loader + building placement
│   ├── ui.js           # UI rendering, showToast(), setSpeed()
│   ├── save.js         # Save/Load (LocalStorage)
│   └── main.js         # Interaction, game tick, render loop
└── README.md
```

## Script Load Order (important!)
Scripts load as global `<script>` tags in index.html. Order matters:
1. data.js → 2. engine.js → 3. humanoid.js → 4. nature.js → 5. player.js → 6. npc.js → 7. ui.js → 8. building.js → 9. save.js → 10. main.js

## Tech Stack
- **Engine**: Babylon.js (CDN, not npm)
- **Rendering**: PBR materials, shadow maps, bloom, ACES tonemapping
- **No bundler**: Vanilla JS, mở trực tiếp hoặc `npx serve .`
- **Save**: LocalStorage, auto-save every 60s

## Coding Conventions
- Vietnamese UI text, English code comments
- Short variable names in game logic (G = game state, P = player state)
- Use `bl` for BLDS.find callback, `rs` for RES.find callback (avoid shadow variables)
- All functions and variables are global scope
