# 🎥 YouTube Backend API

A RESTful backend inspired by YouTube, built with **Node.js**, **Express.js**, **MongoDB**, and **Cloudinary**. It provides secure JWT authentication, video management, comments, subscriptions, likes/dislikes, media uploads, and search functionality.

---

## 🚀 Features

### 👤 User

- User Registration
- User Login (JWT Authentication)
- Update Profile
- Upload Profile Picture
- Subscribe / Unsubscribe Channels

### 🎬 Videos

- Upload Videos
- Upload Thumbnails
- Update Video Details
- Delete Videos
- Get All Videos
- Get My Videos
- Get Video by ID
- Like & Dislike Videos
- Track Video Views
- Search by Category
- Search by Tags

### 💬 Comments

- Add Comment
- Update Comment
- Delete Comment
- Get All Comments of a Video

---

# 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT**
- **bcrypt**
- **Cloudinary**
- **Express File Upload**
- **Fuse.js**

---

# 📁 Project Structure

```text
youtube-backend/
│
├── config/
│   ├── cloudinary.js
│   └── jwtSecret.js
│
├── middleware/
│   └── auth.middleware.js
│
├── models/
│   ├── user.model.js
│   ├── video.model.js
│   └── comment.model.js
│
├── routes/
│   ├── user.routes.js
│   ├── video.routes.js
│   └── comment.routes.js
│
├── index.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yashodipdeore/YouTube-Backend.git
```

Move into the project

```bash
cd YouTube-Backend
```

Install dependencies

```bash
npm install
```

Run the server

```bash
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 🔑 Authentication

Protected routes require a JWT token.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📌 API Endpoints

## User

| Method | Endpoint                      | Description         |
| ------ | ----------------------------- | ------------------- |
| POST   | `/api/v1/user/signup`         | Register User       |
| POST   | `/api/v1/user/login`          | Login               |
| PUT    | `/api/v1/user/update-profile` | Update Profile      |
| POST   | `/api/v1/user/subscribe`      | Subscribe Channel   |
| PUT    | `/api/v1/user/unsubscribe`    | Unsubscribe Channel |

---

## Videos

| Method | Endpoint                           | Description        |
| ------ | ---------------------------------- | ------------------ |
| GET    | `/api/v1/video`                    | Get All Videos     |
| GET    | `/api/v1/video/my-videos`          | Get My Videos      |
| GET    | `/api/v1/video/:id`                | Get Video by ID    |
| POST   | `/api/v1/video/upload`             | Upload Video       |
| PUT    | `/api/v1/video/update/:id`         | Update Video       |
| DELETE | `/api/v1/video/delete/:id`         | Delete Video       |
| POST   | `/api/v1/video/:id/like`           | Like Video         |
| POST   | `/api/v1/video/:id/dislike`        | Dislike Video      |
| GET    | `/api/v1/video/category/:category` | Search by Category |
| GET    | `/api/v1/video/tags/:tag`          | Search by Tag      |

---

## Comments

| Method | Endpoint                            | Description             |
| ------ | ----------------------------------- | ----------------------- |
| POST   | `/api/v1/comment/new`               | Add Comment             |
| PUT    | `/api/v1/comment/:commentId`        | Update Comment          |
| DELETE | `/api/v1/comment/:commentId`        | Delete Comment          |
| GET    | `/api/v1/comment/comments/:videoId` | Get Comments of a Video |

---

# 📬 Postman Collection

Test every endpoint using the Postman collection.

**Collection Link**

https://yashodipdeore2006-9100194.postman.co/workspace/Authentication~a3a09213-e042-41dd-98ff-0d6d5446d197/collection/49119947-8545804d-9344-4a05-8e12-c46579fc88a6?action=share&creator=49119947

Example:

```text
https://www.postman.com/your-workspace/collection/xxxxxxxx/youtube-backend-api
```

---

# 🗄 Database Models

### User

```javascript
{
  channelName,
  email,
  phone,
  password,
  logoUrl,
  logoId,
  subscribers[],
  subscribedChannels[]
}
```

### Video

```javascript
{
  title,
  description,
  user_id,
  videoUrl,
  thumbnailUrl,
  thumbnailId,
  category,
  tags[],
  likedBy[],
  disLikedBy[],
  viewedBy[]
}
```

Virtual Fields

- likes
- dislikes
- views

### Comment

```javascript
{
  (video_id, user_id, commentText);
}
```

---

# 🚀 Future Improvements

- Refresh Tokens
- Email Verification
- Watch History
- Playlists
- Notifications
- Video Recommendations
- Pagination
- Admin Dashboard

---

# 👨‍💻 Author

**Yashodip Deore**

GitHub: **https://github.com/yashodipdeore2006**

---

⭐ If you found this project useful, consider giving it a star!
