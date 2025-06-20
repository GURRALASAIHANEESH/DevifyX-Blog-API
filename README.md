# DevifyX Blog API

A fully functional RESTful API for a blogging platform built using **Node.js**, **Express**, and **Supabase**. This project handles user authentication, blog posts, comments, likes, categories, and admin features.

---

## 🚀 Project Overview

This API allows users to:

* Register and log in
* Create, read, update, and delete blog posts
* Comment on posts and reply to comments
* Like/unlike posts and comments
* View posts by category, tag, or author
* Admins can manage users and moderate comments

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: Supabase (PostgreSQL)
* **Auth**: Supabase Auth (JWT)
* **API Testing**: Postman

---

## 🔐 Environment Variables

Create a `.env` file with the following:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=5000
```

---

## 📦 Installation & Setup

```bash
git clone https://github.com/yourusername/devifyx-blog-api.git
cd devifyx-blog-api
npm install
cp .env.example .env # and fill in your env values
npm run dev
```

Ensure Supabase tables and schema are set up.

---

## 📘 API Endpoints Summary

### 🔹 Auth

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/profile`
* `PUT /auth/profile`
* `PUT /auth/change-password`

### 🔹 Posts

* `POST /posts`
* `GET /posts`
* `GET /posts/:id`
* `PUT /posts/:id`
* `DELETE /posts/:id`
* `GET /posts/search?q=...`
* `GET /posts/featured`
* `GET /posts/tag/:tagName`
* `GET /posts/:postId/likes`
* `POST /posts/:postId/like`
* `GET /posts/users/:userId/posts`

### 🔹 Comments

* `POST /posts/:postId/comments`
* `GET /posts/:postId/comments`
* `PUT /comments/:commentId`
* `DELETE /comments/:commentId`
* `POST /comments/:commentId/replies`
* `GET /comments/:commentId/replies`
* `POST /comments/:commentId/like`
* `GET /comments/:commentId/likes`

### 🔹 Categories & Tags

* `GET /categories`
* `POST /categories` (admin)
* `GET /categories/:categoryId/posts`
* `GET /tags`

### 🔹 Admin

* `GET /admin/users`
* `DELETE /admin/users/:userId`
* `GET /admin/comments`
* `DELETE /admin/comments/:commentId`

---

## ✅ Features Implemented

* User registration and JWT-based authentication
* Role-based authorization with admin routes
* Input validation and sanitization
* Blog CRUD operations with pagination, filtering, sorting
* Nested comments and replies
* Like/unlike support for posts and comments
* Category and tag-based post filtering
* Admin features for user/comment moderation
* Robust error handling with proper status codes
* Postman Collection for API testing

---

## 📹 Video Demo

\[Insert video link here once ready]

---

## 📝 Assumptions / Additional Features

* Admin privileges are controlled via user metadata (`is_admin`)
* All input is sanitized at controller-level
* Rate limiting should be implemented with middleware like `express-rate-limit` (optional improvement)
* Postman collection includes all major routes with JWT auth support

---

## 📄 License

MIT

---

## 🙌 Acknowledgments

Thanks to Supabase for the backend power and Node.js for its simplicity.

---

##
