# Kế hoạch hoàn tất hồ sơ FCAJ sau Week 8

> Mục tiêu: chuyển QuantScope thành **Workshop cá nhân FCAJ** và hoàn tất hồ sơ cần thiết để xin mộc thực tập.  
> Nguồn quy định: `https://hcm-rules.awsfcaj.com/3-project/` (nội dung người dùng cung cấp ngày 2026-07-28).  
> Template bắt buộc: `https://github.com/thienluhoan/fcj-workshop-template`.

## 1. Điều kiện mộc thực tập — bắt buộc

- [ ] Hoàn thành project cá nhân QuantScope.
- [ ] Hoàn thành workshop report theo FCAJ template.
- [ ] Thời gian thực tập ít nhất 3 tháng — **PLACEHOLDER: điền ngày bắt đầu/kết thúc**.
- [ ] Lên văn phòng ít nhất 10 buổi — **PLACEHOLDER: bổ sung bảng ngày/check-in/evidence**.
- [ ] Post đủ 3 blog lên AWS Study Group — dùng drafts trong `docs/fcj_submission_drafts/blog_posts_vi_en.md`.

## 2. Khoảng trống giữa QuantScope và yêu cầu FCAJ

| FCAJ yêu cầu | QuantScope 8 tuần | Việc cần làm sau Week 8 |
|---|---|---|
| ≥3 AWS services | S3, Serverless (Lambda/ECS), Lambda; EventBridge/CloudWatch/IAM hỗ trợ | Deploy thật, lưu URL/log/screenshot/evidence |
| Workshop song ngữ VI/EN | Docs hiện chủ yếu tiếng Việt/English lẫn nhau | Chuyển workshop content sang Hugo `vi` + `en` cùng cấu trúc |
| Worklog Week 1–12 | Có plan Week 1–8 | Xác minh actual output Week 1–8; ghi Week 9–12 thực tế |
| 3 blog posts | Chưa có | Hoàn thiện/publish 3 drafts và lưu permalink/screenshot |
| Events participated | Chưa có thông tin | Điền mỗi event có evidence hoặc ghi không có nếu template yêu cầu |
| Self-evaluation/feedback | Chưa có | Điền từ draft, tự chọn Tốt/Khá/TB có nhận xét thực tế |
| Step-by-step + test + cleanup | Week 7 plan thiết kế nội dung | Thực hiện deployment, chụp evidence, viết lại bằng hướng dẫn tái lập |

## 3. Trình tự thực hiện sau Week 8

### Phase A — Khóa evidence kỹ thuật (1–2 ngày)

1. Hoàn tất Week 7 deployment và Week 8 verification trước.
2. Chạy, lưu kết quả có ngày/commit SHA:
   ```bash
   pytest -q
   cd frontend && npm run test && npm run build
   curl --fail http://<Serverless (Lambda/ECS)_PUBLIC_DNS>:8000/health
   ```
3. Chụp screenshots: S3 frontend, API health, Dashboard, Lambda logs, EventBridge, Budget, IAM role policy (redact account ID/key), private data bucket settings.
4. Ghi exact resources: region, public frontend URL, API URL, Lambda function name, scheduled rule, log group, cost alert. Không ghi secret/access key.

### Phase B — Tạo workshop riêng từ template (1–2 ngày)

1. Clone template sang repository riêng, ví dụ `quantscope-fcj-workshop`; **không chỉnh repository template gốc**.
2. Đọc `README`, `config.toml`, `content/`, theme/submodule và workflow của template trước khi thay đổi.
3. Cài Hugo theo version template yêu cầu; chạy local build trước khi viết nhiều:
   ```bash
   hugo server
   hugo --minify
   ```
4. Tạo cùng cây nội dung cho tiếng Việt và tiếng Anh. Dùng drafts trong `docs/fcj_submission_drafts/` làm source; không copy nguyên workshop sample.
5. Chỉ publish site khi tất cả navigation, links, images, language switcher và build pass.

### Phase C — Hoàn thiện report/worklog/blog/event (2–4 ngày)

- Điền thông tin sinh viên/thực tập placeholders.
- Review Week 1–8 theo output thực tế; viết Week 9–12, không copy plan thành completed work.
- Publish 3 blog, chèn permalink/evidence vào workshop.
- Điền event reports có ảnh/video thực.
- Điền self-evaluation và feedback trung thực.

### Phase D — QA và nộp (1 ngày)

- [ ] Đọc toàn bộ tiếng Việt và tiếng Anh: cấu trúc tương đương, nghĩa không lệch.
- [ ] Click mọi link/navigation/menu; code block có thể copy; screenshots rõ và không lộ data/credentials.
- [ ] Một người khác làm theo prerequisite → deploy/test → cleanup hoặc bạn tự chạy lại clean environment.
- [ ] Check mộc: 3 tháng, 10 buổi, 3 blogs, workshop, project.
- [ ] Gửi link workshop, GitHub repo, deployed demo, blogs và evidence theo kênh FCAJ — **PLACEHOLDER: xác nhận kênh/deadline nộp**.

## 4. Cấu trúc workshop đề xuất

```text
Introduction
├── Student Information
├── Worklog (Week 1–12)
├── Proposal
├── Blog Posts
├── Events Participated
├── Workshop: QuantScope AWS Research Platform
│   ├── Overview
│   ├── Prerequisites
│   ├── Architecture
│   ├── Step 1: IAM and least privilege
│   ├── Step 2: Private data bucket and static frontend bucket
│   ├── Step 3: Serverless (Lambda/ECS) Docker FastAPI
│   ├── Step 4: Lambda scheduled ingestion
│   ├── Step 5: EventBridge, CloudWatch and Budget
│   ├── Test and validation
│   └── Cleanup
├── Self Evaluation
└── Sharing and Feedback
```

## 5. Files đã soạn trước

| File | Trạng thái |
|---|---|
| `fcj_submission_drafts/workshop_overview_vi_en.md` | Draft song ngữ về project/workshop |
| `fcj_submission_drafts/worklog_week_01_12_vi_en.md` | Week 1–8 draft + Week 9–12 placeholders |
| `fcj_submission_drafts/blog_posts_vi_en.md` | 3 draft blog song ngữ |
| `fcj_submission_drafts/personal_events_evaluation_feedback.md` | Placeholders cá nhân, events, evaluation, feedback |
| `fcj_submission_drafts/workshop_steps_vi_en.md` | Outline step-by-step/test/cleanup song ngữ |

## 6. Thông tin cần bạn xác nhận sau

1. Thông tin sinh viên/thực tập.
2. Ngày thực tập để chứng minh ≥3 tháng.
3. 10 ngày lên văn phòng và evidence.
4. Events đã tham gia cùng ảnh/video.
5. Deadline/kênh/link nộp bài chính thức.
6. Các deployment URLs, AWS region/resource names thật.
7. Bạn có muốn dùng GitHub Pages, S3, hoặc nền tảng nào để host Hugo workshop sau khi đã đọc README template.
