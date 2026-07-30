# QuantScope — Enterprise AWS Architecture Upgrade Plan

> **Mục tiêu:** Nâng cấp toàn diện kiến trúc hạ tầng của dự án QuantScope lên chuẩn **AWS Well-Architected Framework**, giải quyết triệt để các rủi ro về Bảo mật (Security), Tính sẵn sàng cao (Reliability/High Availability), và Hiệu suất Mạng (Network Performance) đã được phát hiện trong buổi review kiến trúc.

---

## 🏗️ Tổng quan các Hạng mục Cải tiến (5 Phases)

| Phase | Hạng mục | Độ ưu tiên | Rủi ro được giải quyết |
|---|---|---|---|
| **1** | **Frontend Security & Edge Caching** (CloudFront + Private S3) | Cao (P1) | Truy cập HTTP kém bảo mật, S3 Public. Cải thiện tốc độ tải trang (CDN caching). |
| **2** | **VPC & Network Redesign** (Public/Private Subnets, NAT, VPC Endpoints) | Rất Cao (P0) | Mạng lỏng lẻo. Đưa toàn bộ tài nguyên tính toán vào không gian mạng nội bộ (Private Subnet). |
| **3** | **Backend High Availability** (ASG + ALB + VPC Link) | Cao (P1) | Single Point of Failure (SPOF). EC2 sập sẽ làm chết toàn bộ API. Chống DDoS với ALB. |
| **4** | **Serverless Network Security** (VPC Lambdas) | Trung bình (P2) | Data Pipeline ghi dữ liệu qua public internet. Đưa Lambda vào VPC để ghi dữ liệu an toàn. |
| **5** | **Infrastructure as Code (IaC)** (Terraform / AWS CDK) | Trung bình (P2) | Quản lý hạ tầng thủ công (ClickOps) dễ sai sót và khó nhân bản (reproduce) môi trường. |

---

## 🛠️ Chi tiết Kế hoạch Triển khai (Step-by-Step)

### Phase 1: Frontend Security & Edge Caching
*Ngăn chặn việc truy cập trực tiếp vào S3 qua HTTP, cung cấp HTTPS chuẩn và cache tĩnh.*

1. **Khóa Public Access của S3 Frontend Bucket:**
   - Block tất cả Public Access trên bucket `quantscope-frontend-dev-...`.
2. **Triển khai Amazon CloudFront Distribution:**
   - Trỏ Origin về S3 Bucket của frontend.
   - Bật **Origin Access Control (OAC)** để cấp quyền cho CloudFront đọc nội dung S3 (S3 bucket policy chỉ allow cho CloudFront ARN).
3. **Cấu hình HTTPS:**
   - Yêu cầu cấp chứng chỉ SSL miễn phí bằng **AWS Certificate Manager (ACM)** (chứng chỉ phải tạo ở vùng `us-east-1` cho CloudFront).
   - Cấu hình Route 53 trỏ tên miền (nếu có) về CloudFront (Alias Record).
   - Chuyển hướng tự động HTTP sang HTTPS trên CloudFront.

### Phase 2: VPC & Network Redesign
*Xây dựng bộ khung xương mạng chuẩn doanh nghiệp, cô lập tài nguyên nội bộ.*

1. **Tạo Custom VPC mới (`quantscope-vpc`):**
   - Dải IP: `10.0.0.0/16`.
2. **Chia Subnets trải dài 2 Availability Zones (AZ A, AZ B):**
   - **2 Public Subnets** (chứa Load Balancer, NAT Gateway).
   - **2 Private Subnets** (chứa EC2, Lambda).
3. **Cấu hình Internet Gateway (IGW) & NAT Gateway:**
   - Gắn IGW vào VPC, setup Route Table cho Public Subnets ra IGW.
   - Tạo **1 NAT Gateway** ở Public Subnet AZ A (cần Elastic IP). Setup Route Table cho Private Subnets trỏ traffic `0.0.0.0/0` ra NAT Gateway.
4. **VPC Gateway Endpoint cho S3:**
   - Tạo S3 Gateway Endpoint và gắn vào Route Table của Private Subnets. Điều này giúp EC2 và Lambda giao tiếp với S3 hoàn toàn qua mạng nội bộ AWS, không bị tính phí Data Transfer out.

### Phase 3: Backend High Availability (EC2)
*Xóa bỏ SPOF (Single Point of Failure), ẩn EC2 khỏi Internet.*

1. **Tạo Application Load Balancer (ALB):**
   - Đặt ALB nội bộ (Internal) trong Private Subnets, hoặc Public ALB trong Public Subnets (tùy thuộc API Gateway hỗ trợ VPC Link ra sao).
   - Chuyển **API Gateway** sang dùng **VPC Link** nối thẳng vào Internal ALB.
2. **Tạo Launch Template:**
   - Cấu hình AMI, Instance Type (`t3.micro`), Security Group (chỉ nhận traffic từ ALB), và IAM Instance Profile (đọc S3).
   - Nhúng `UserData` script để tự động khởi động Docker container FastAPI khi boot máy.
3. **Tạo Auto Scaling Group (ASG):**
   - Sử dụng Launch Template vừa tạo.
   - Triển khai ASG trải dài trên 2 Private Subnets.
   - Cấu hình Min: 1, Desired: 2, Max: 4 (đảm bảo lúc nào cũng có ít nhất 1-2 instances phục vụ).
   - Gắn ASG vào Target Group của ALB.

### Phase 4: Serverless Network Security (Data Pipeline)
*Bảo mật luồng crawl dữ liệu chứng khoán ban đêm.*

1. **Đưa Lambda (Producer & Consumer) vào VPC:**
   - Cấu hình VPC attachment cho Lambda vào 2 Private Subnets.
   - Cấu hình Security Group cho Lambda (Outbound `0.0.0.0/0`).
2. **Xác thực Luồng Mạng (Network Flow Validation):**
   - Đảm bảo Lambda Consumer có thể gọi ra Yahoo Finance / API ngoài để tải dữ liệu (Thông qua NAT Gateway tạo ở Phase 2).
   - Đảm bảo Lambda Consumer ghi data lớn vào S3 nhanh và miễn phí (Thông qua VPC S3 Gateway Endpoint tạo ở Phase 2).

### Phase 5: Chuẩn hóa IaC và Monitoring (Tùy chọn nhưng cần thiết)
1. **AWS WAF (Web Application Firewall):**
   - Đính kèm WAF vào CloudFront (bảo vệ Frontend) và API Gateway (nếu dùng REST API) / hoặc đính vào ALB để chống SQL Injection, XSS, Rate Limiting cơ bản.
2. **Infrastructure as Code:**
   - Viết toàn bộ kiến trúc trên bằng **Terraform** hoặc **AWS CDK** để dễ dàng deploy tự động và quản lý sự thay đổi.

---

## 📈 Lợi ích sau khi nâng cấp

- **Bảo mật tối đa (Security):** Mọi API, máy chủ đều ẩn sau CloudFront, API Gateway và nằm trong mạng Private. Chặn hoàn toàn việc truy cập trực tiếp từ Internet vào máy chủ.
- **Tính khả dụng cực cao (High Availability):** Có thể chịu được sự cố sập cả 1 Availability Zone (Datacenter) của AWS mà hệ thống không bị gián đoạn.
- **Tốc độ (Performance):** Frontend load nhanh hơn toàn cầu nhờ CDN. Backend xử lý song song và tự scale khi bị tải nặng.
- **Tuân thủ chuẩn Enterprise (Compliance):** Sẵn sàng để vượt qua các bài System Architecture Audit khắt khe nhất của mọi doanh nghiệp hoặc tổ chức tài chính.
