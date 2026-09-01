# ⚡ FU-DEVER Member & Client Portal

<p align="center">
  <img src="public/icons/layout/fu-dever-logo.png" alt="FU-DEVER Logo" width="96" height="96" />
</p>

<p align="center">
  <b>Cổng không gian học thuật & Trung tâm chỉ huy thành viên FU-DEVER</b><br />
  <i>Đại học FPT Đà Nẵng · "WORK HARD - PLAY HARD"</i>
</p>

<p align="center">
  <a href="https://client.fudever.com"><img src="https://img.shields.io/badge/Production-client.fudever.com-0066CC?style=for-the-badge&logo=vercel&logoColor=white" alt="Production Domain" /></a>
  <a href="https://github.com/fudever-club/dever-client"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" /></a>
  <img src="https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Ant_Design-5.0-0170FE?style=for-the-badge&logo=ant-design&logoColor=white" alt="Ant Design" />
  <img src="https://img.shields.io/badge/Cloudflare_R2-Storage-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
</p>

---

## 🌐 Tổng Quan Phân Hệ (Overview)

`dever-client` là nền tảng quản lý học thuật và phát triển kỹ năng dành riêng cho các thành viên thuộc Câu lạc bộ Lập trình FU-DEVER:
- **Đấu trường LeetCode:** Bảng xếp hạng giải thuật realtime, Heatmap đóng góp và thống kê bài tập AC.
- **DEVER Studio Writer:** Trình soạn thảo bài viết kỹ thuật chuẩn Markdown tích hợp Cloudflare R2 Upload, Live Code Block, Mermaid Diagrams và Khung Callouts.
- **Trung tâm chỉ huy (Command Center Dashboard):** Bento Grid Magic UI, thanh tiến trình EXP & Leveling, hệ thống huy hiệu 3D.
- **Hồ sơ & Danh bạ thành viên:** Kết nối mạng lưới sinh viên CNTT các thế hệ Gen 1 đến Gen 9.

---

## ✨ Tính Năng Nổi Bật (Key Features)

- 🏆 **Gamification Engine:** Hệ thống tích lũy điểm danh vọng EXP, Leveling, chuỗi ngày điểm danh (Streak Counter) và bộ sưu tập Huy hiệu 3D thành tích.
- 📊 **LeetCode Leaderboard & Activity Heatmap:** Đồng bộ hóa tự động trạng thái nộp bài thuật toán, hiển thị bục Podium Top 3 đảo thứ tự thông minh trên Mobile/Desktop.
- ✍️ **DEVER Studio Writer v3.0:**
  - 3 chế độ xem: Split View (Song song), Focus View (Toàn màn hình), Preview View.
  - Tự động lưu bản nháp (`Auto-Save` sau 2 giây).
  - Tải ảnh trực tiếp lên **Cloudflare R2** hoặc dán ảnh chụp màn hình từ Clipboard (`Ctrl+V`).
  - Hộp thoại sinh tự động: Bảng biểu (Table Generator), Mã nguồn đa ngôn ngữ, Khung cảnh báo (Callouts).
- 🛡️ **Hồ sơ & Bảo mật:** Đánh giá phần trăm hoàn thiện hồ sơ (`% Complete`) mở khóa huy hiệu *Security Sentinel*.

---

## 💻 Cài Đặt & Chạy Cục Bộ (Local Development)

### Yêu cầu:
- Node.js 20+ và npm / yarn / pnpm
- Dịch vụ Backend đang chạy trên cổng `5000`

### 1. Cài đặt dependencies:
```bash
git clone https://github.com/fudever-club/dever-client.git
cd dever-client
npm ci
```

### 2. Cấu hình biến môi trường:
Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_SERVER=http://localhost:5000
NEXT_PUBLIC_LANDING_URL=http://localhost:3000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3002
NEXT_PUBLIC_ADMIN_URL=http://localhost:3003
```

### 3. Khởi chạy ứng dụng:
```bash
npm run dev -- -p 3002
```
Mở trình duyệt tại: `http://localhost:3002/vi/sign-in`

---

## 🧪 Kiểm Thử & Đóng Gói (Quality Checks)

```bash
# Kiểm tra linter
npm run lint

# Đóng gói Production
npm run build
```

---

## 📄 Bản Quyền & Giấy Phép (License)

Dự án được phát triển và duy trì bởi **Ban Kỹ Thuật Câu lạc bộ Lập trình FU-DEVER** - Đại học FPT Đà Nẵng.  
Phát hành theo giấy phép [MIT License](LICENSE).
