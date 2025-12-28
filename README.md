# Backend API Documentation

**Base URL:** [https://clinicallymanic-iota.vercel.app](https://clinicallymanic-iota.vercel.app)

This repository contains the backend API for the application. It is built with **Node.js**, **Express**, and **MongoDB**, following a modular and scalable architecture.

---

## 🚀 Features

* RESTful API structure
* Modular folder organization
* MongoDB with Mongoose
* Environment-based configuration
* Error handling with custom errors
* Ready for authentication & authorization integration

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB & Mongoose**
* **TypeScript**
* **dotenv**
* **CORS**

---

## 📦 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
```

4. Run the server:

```bash
npm run dev
```

---

## 🌐 API Base URL

```text
https://clinicallymanic-iota.vercel.app
```

Use this base URL to access all API endpoints.

---

## 📚 API Endpoints (Example)

### Health Check

```http
GET /
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running"
}
```

> Add your module-wise endpoints here (Auth, Users, Products, etc.)

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── modules/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── config/
├── app.ts
└── server.ts
```

---

## ❗ Error Handling

* Centralized error handler
* Custom `AppError` class
* Proper HTTP status codes

---

## ✅ Scripts

```bash
npm run dev     # Run in development mode
npm run build   # Build the project
npm start       # Run production build
```

---

## 📌 Deployment

The backend is deployed on **Vercel**.

Deployment URL:
👉 [https://clinicallymanic-iota.vercel.app](https://clinicallymanic-iota.vercel.app)

---

## 👤 Author

**Saurav Sarkar**

---

## 📄 License

This project is licensed under the MIT License.
