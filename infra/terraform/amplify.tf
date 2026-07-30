resource "aws_amplify_app" "frontend" {
  name = "${var.project_name}-frontend"

  # Cấu hình Custom Rule bắt buộc cho SPA (React/Vue/Vite)
  # Chuyển hướng mọi request không phải là file tĩnh về index.html
  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }
}

# Tạo nhánh môi trường "main"
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = "main"
}

# In ra URL sau khi deploy
output "amplify_default_domain" {
  value = aws_amplify_app.frontend.default_domain
}

output "amplify_branch_url" {
  value = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.frontend.default_domain}"
}
