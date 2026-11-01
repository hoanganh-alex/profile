---
name: ok-tech-ui-designer
description: Thiết kế giao diện (UI) desktop tools, dashboard, launcher, client tools hoặc web tools theo phong cách modern tech tối giản, phẳng, macOS frame kết hợp kỹ thuật cắt vát góc (chamfer) ở panel và button. Kích hoạt khi cần dựng giao diện kỹ thuật chuẩn chỉ: không glow, không neon, chữ thường toàn bộ, màu aqua đặc, font JetBrains Mono, và ẩn thanh cuộn.
---

# Chamfer Tech Desktop UI

Quy chuẩn thiết kế giao diện cho phần mềm desktop, dashboard, launcher, client tools và web tools. Tối giản, phẳng, dứt khoát, đậm chất kỹ thuật.

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)

* **Không trang trí thừa:** Tuyệt đối không glow, không neon, không dải gradient sặc sỡ, không bóng phát sáng, không icon/emoji trang trí vô nghĩa.
* **Thực dụng:** Mọi thành phần hiển thị đều phải có chức năng rõ ràng. Không có lý do tồn tại thì loại bỏ ngay lập tức.
* **Tốc độ:** Phản hồi giao diện tức thì, chuyển đổi trạng thái dứt khoát (`120ms ease`).

---

## 2. Màu Sắc (Color Palette)

* **Nền chính (Background):**
  * Web/Mica: Kính mờ sáng `backdrop-filter: blur(30px)`, nền `rgba(255, 255, 255, 0.82)`.
  * Nền phụ / fallback máy yếu: Màu phẳng đặc `rgba(248, 250, 252, 1)` (Slate-50).
* **Màu nhấn (Accent Color):** Xanh aqua đặc, dùng cho fill, viền nhấn, icon:
  * Màu chính: `#0284C7`
  * Màu phụ: `#0EA5E9`, `#38BDF8`
* **Màu chữ:**
  * Chữ chính: `#0F172A`, `#1E293B` (tương phản cao).
  * Chữ phụ: `#64748B` (tối thiểu, không dùng nhạt hơn). `#94A3B8` chỉ dùng cho viền, icon tĩnh, placeholder.
* **Trạng thái hệ thống (Solid Colors - Không Glow):**
  * Thành công: `#16A34A`
  * Cảnh báo: `#D97706`
  * Thất bại / Lỗi: `#DC2626`

---

## 3. Typography & Chữ Viết

* **Phông chữ:** `JetBrains Mono` (hoặc `SF Mono`, `Fira Code`).
* **Quy tắc chữ thường (Lowercase Rule):**
  * Toàn bộ nhãn (labels), tiêu đề (headings), nút bấm (buttons) và trạng thái đều viết thường.
  * Không dùng `text-transform: uppercase`.
  * Chỉ viết hoa khi bắt buộc đối với tên riêng hoặc từ viết tắt kỹ thuật (ví dụ: `PID`, `API`, `GPU`, `SHA-256`, `RWX`).
* **Căn chỉnh:** Mọi số liệu, phiên bản và dữ liệu cột phải căn thẳng hàng theo trục mono.

---

## 4. Hình Khối & Kỹ Thuật Cắt Vát (Chamfer Geometry)

### 4.1 Khung Cửa Sổ Ngoài (Window Frame)

* Bo góc mềm mại kiểu macOS: `border-radius: 14px` đến `18px`.
* Viền mỏng: `1px solid rgba(226, 232, 240, 0.95)` hoặc `rgba(255, 255, 255, 0.6)`.
* Đổ bóng nhẹ, mềm, không màu: `box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12)`.
* Không cắt vát khung ngoài.

### 4.2 Cắt Vát Góc Panel & Card Con

* Cắt vát góc trên bên trái bằng `clip-path`, phẳng, không hiệu ứng nếp gập (dog-ear):

```css
clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
```

* Các góc còn lại bo nhẹ `4px` đến `8px`.

### 4.3 Cắt Vát Góc Nút Bấm (Button)

* Nút bấm nhỏ (chiều cao `< 36px`) dùng tỉ lệ vát từ `6px` đến `8px` để tránh xô lệch chữ:

```css
clip-path: polygon(7px 0, 100% 0, 100% 100%, 0 100%, 0 7px);
```

### 4.4 Kỹ Thuật Giữ Viền Khi Dùng `clip-path`

Do `clip-path` triệt tiêu `border` và `box-shadow` thông thường của CSS, áp dụng cấu trúc 2 lớp (Wrapper Pattern):

```html
<!-- Lớp ngoài: tạo viền bằng nền màu viền + clip-path + padding 1px -->
<div style="clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px); background: #E2E8F0; padding: 1px;">
  <!-- Lớp trong: nền nội dung cùng clip-path -->
  <div style="clip-path: polygon(9px 0, 100% 0, 100% 100%, 0 100%, 0 9px); background: rgba(255, 255, 255, 0.9); padding: 16px;">
    <!-- Nội dung bên trong -->
  </div>
</div>
```

---

## 5. Thanh Tiêu Đề (Titlebar)

* **Tối giản tuyệt đối:** Chỉ chứa cụm 3 nút macOS Traffic Lights (Đỏ `#FF5F56`, Vàng `#FFBD2E`, Xanh lá `#27C93F`) ở góc trên bên trái.
* Cả 3 nút có tương tác thật (Đóng, Thu nhỏ, Chạy lại chuỗi).
* Có vùng kéo thả cửa sổ (`drag region`).
* Không đặt chữ thừa, slogan hoặc icon rườm rà trên thanh tiêu đề.

---

## 6. Bố Cục & Trải Nghiệm (Layout & UX)

* **Bố cục 2 cột ngang:**
  * Cột trái: Trạng thái hệ thống, mục tiêu tiến trình và nút thao tác chính.
  * Cột phải: Khung cập nhật, log, thông số hoặc cài đặt phụ.
* **Tự động hoá luồng (1-Click Pipeline):**
  * Mở ứng dụng tự động kiểm tra driver/môi trường -> tự động đồng bộ payload -> sẵn sàng thao tác bằng 1 click.
* **Xử lý cuộn:**
  * Ẩn triệt để thanh cuộn chuột mặc định:

```css
scrollbar-width: none !important;
::-webkit-scrollbar { display: none !important; }
```

  * Danh sách dài có hiệu ứng mờ dần đáy để báo hiệu còn nội dung:

```css
mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
-webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
```

---

## 7. Trạng Thái Tương Tác (Micro-Interactions)

* **Hover:** Đổi màu nền hoặc viền dứt khoát trong `120ms ease`. Không dùng hiệu ứng phát sáng glow.
* **Focus:** Viền `2px solid #0284C7`, offset `2px`.
* **Active:** Hạ tông màu nền tối đi một bậc.
* **Loading:** Thanh tiến trình phẳng hoặc spinner tối giản màu `#0284C7`.
* **Disabled:** Giảm `opacity: 0.5`, con trỏ `cursor: not-allowed`.

---

## 8. Hướng Dẫn Đa Nền Tảng (Cross-Platform)

* **Web / Electron / Tauri (HTML + CSS + Tailwind):** Sử dụng `backdrop-filter: blur(30px)` kết hợp `clip-path` và `mask-image`.
* **C# WPF (XAML):** Dùng DWM API để kích hoạt Mica/Acrylic trên Windows 11; cắt vát bằng `Path` hoặc `Polygon` kết hợp `RenderTransform`.
* **C++ Dear ImGui:** Sử dụng `DrawList->AddPolyline` và `AddConvexPolyFilled` để vẽ góc vát phẳng; dùng nền bán trong suốt đặc, không cố giả lập blur để tránh tụt FPS.

