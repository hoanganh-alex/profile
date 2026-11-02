# Nguyễn Hoàng Anh (Alex) // Chamfer Tech Desktop UI

Giao diện Desktop Dashboard & Client Tool hiện đại thiết kế chuẩn theo kỹ thuật **Chamfer Tech Minimal UI**: phẳng, dứt khoát, phong cách macOS frame, cắt vát góc (chamfer geometry) chuẩn chỉ, tích hợp Discord Lanyard Realtime Presence, Spotify Live Sync và HQ Audio Player.

---

## Đặc Trưng Kỹ Thuật (Specification)

* **Chuẩn chamfer geometry:** Cắt vát góc trên bên trái (`clip-path: polygon(...)`) kết hợp kiến trúc 2-layer wrapper giữ viền 1px sắc nét.
* **Khung macOS Window Frame:** Bo góc `16px`, viền Slate siêu mỏng, bóng mềm tự nhiên, không glow, không dải màu neon.
* **macOS Traffic Lights:** Cụm 3 nút Đỏ, Vàng, Xanh lá ở góc trên bên trái hỗ trợ tương tác thực tế (Khóa/Launcher, Thu gọn/Compact, Đồng bộ lại chuỗi/Sync Telemetry).
* **Bố cục 2 cột ngang:**
  * **Cột trái:** Trạng thái hệ thống, profile, pipeline 1-click thao tác nhanh (Copy Discord, Copy Link, Sync Payload), typewriter greeting, tech stack và audio controller.
  * **Cột phải:** Khung cập nhật viễn trắc thời gian thực: Discord Realtime Presence (Lanyard WebSocket), Spotify listening bar, game/code activity, affiliated servers và direct connections.
* **Typography:** `JetBrains Mono` toàn bộ, tuân thủ nghiêm ngặt quy tắc chữ thường (lowercase rule) chuẩn phong cách kỹ thuật.
* **Xử lý cuộn:** Ẩn triệt để thanh cuộn chuột mặc định (`scrollbar-width: none`) kết hợp mask mờ dần đáy (`mask-image`).
* **Tốc độ phản hồi:** Chuyển đổi trạng thái vi tương tác dứt khoát `120ms ease`.

---

## Công Nghệ Sử Dụng

* **HTML5 Semantic & Modern CSS3** (Mica/Acrylic `backdrop-filter: blur(30px)`, `clip-path` wrapper pattern, `mask-image`).
* **JetBrains Mono** & **FontAwesome 6**.
* **Discord Lanyard WebSocket API** (`wss://api.lanyard.rest/socket`) & REST fallback.
* **Vanilla JavaScript ES6+** & Web Audio API Synthesizer (phản hồi âm thanh click dứt khoát).

## Demo
* **[Vanilla JavaScript ES6+](https://hoanganh-alex.github.io/profile/)**.
