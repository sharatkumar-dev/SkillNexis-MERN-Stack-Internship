---
name: postman-collection-generator
description: >-
  Provides procedures and templates for generating Postman Collection v2.1 JSON files
  and VS Code REST Client .http test files for REST APIs.
---

# Postman & HTTP Test File Generator

Use this skill when preparing API testing artifacts, Postman collection exports, or `.http` scratch files for manual verification in VS Code / Antigravity IDE.

## REST Client (.http) Format Template
Create a `requests.http` file at the root of the project:

```http
@baseUrl = http://localhost:5000/api
@authToken = eyJhbGciOi...

### Health Check
GET {{baseUrl}}/health HTTP/1.1

### Register User
# @name registerUser
POST {{baseUrl}}/auth/register HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

### Login User
# @name loginUser
POST {{baseUrl}}/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

### Get Protected Data
GET {{baseUrl}}/notes HTTP/1.1
Authorization: Bearer {{authToken}}
```
