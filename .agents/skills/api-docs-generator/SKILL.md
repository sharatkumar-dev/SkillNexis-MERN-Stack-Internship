---
name: api-docs-generator
description: Procedures and templates for generating complete Postman Collection v2.1 files and VS Code REST Client (.http) automated testing scripts for backend APIs.
---

# API Documentation & Test Generation Skill

This skill ensures consistent and comprehensive automated API test scripts and Postman schemas for each project.

## VS Code REST Client (`requests.http`) Template

```http
@baseUrl = http://localhost:5000/api
@authToken = {{loginUser.response.body.data.token}}

### 1. Health Check
GET {{baseUrl}}/health
Content-Type: application/json

### 2. Register New User
# @name registerUser
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "password": "Password123!"
}

### 3. Login User (Captures @authToken)
# @name loginUser
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "Password123!"
}

### 4. Authenticated Request Example
GET {{baseUrl}}/tasks
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

## Postman Collection (`postman_collection.json`) Schema v2.1

Ensure valid JSON structure adhering to:
- `info`: `name`, `schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"`
- `item`: Array of grouped folders or requests with `name`, `request` (`method`, `header`, `body`, `url`), and `event` (Tests script for automatic token capture if needed).
