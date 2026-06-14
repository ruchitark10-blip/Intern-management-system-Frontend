# 🚀 Intern Management System

A **web-based Intern Management System** designed to streamline the management of interns, mentors, tasks, attendance, and performance tracking within an organization.

This system helps organizations efficiently manage internship programs through role-based dashboards for **Admins, Mentors, and Interns**.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Tech Stack](#️-tech-stack)
* [System Modules](#-system-modules)
* [Project Structure](#-project-structure)
* [Installation & Setup](#️-installation--setup)
* [Environment Variables](#-environment-variables)
* [API Features](#-api-features)
* [Security Features](#-security-features)
* [Future Enhancements](#-future-enhancements)
* [Contributing](#-contributing)
* [Developers](#-developer)

---

# 📖 Overview

The **Intern Management System** is a centralized platform that simplifies intern onboarding, mentor allocation, attendance tracking, task management, and performance monitoring.

It provides:

✅ **Admin Dashboard** for complete intern management
✅ **Mentor Dashboard** to monitor intern performance
✅ **Intern Portal** for task tracking and attendance
✅ **Role-Based Authentication & Authorization**

---

# ✨ Features

## 👨‍💼 Admin Module

* 🔐 Secure authentication & authorization
* 👨‍🎓 Manage interns (**Add / Edit / Delete / View**)
* 🧑‍🏫 Assign mentors to interns
* 📅 Track intern attendance
* 📊 Monitor task progress & performance
* 📑 Generate reports and analytics

---

## 👨‍🎓 Intern Module

* 🔐 Secure login and profile management
* 📋 View assigned tasks and projects
* ✅ Submit task updates
* 📅 Mark attendance
* 📝 Update personal profile

---

## 👨‍🏫 Mentor Module

* 👥 Manage assigned interns
* 📂 Review task submissions
* 📊 Track intern progress

---

# 🛠️ Tech Stack

## Frontend

* **React.js**
* **Next.js** 
* **Tailwind CSS**
* **Axios**

## Backend

* **Node.js**
* **Express.js**

## Database

* **MongoDB**
* **Mongoose**

## Authentication & Security

* **JWT (JSON Web Token)**

---

# 🧩 System Modules

### 1. Authentication Module

* Login & Registration
* JWT Authentication
* Password Encryption
* Role-Based Access

### 2. Intern Management

* Add/Edit/Delete Interns
* Assign Mentors
* View Intern Profiles

### 3. Task Management

* Create Tasks
* Assign Projects
* Update Progress
* Submission Tracking

### 4. Attendance Management

* Daily Attendance
* Attendance Tracking
* Status Monitoring

### 5. Performance Tracking

* Ratings & Evaluation
* Performance Reports

### 6. Dashboard & Analytics

* Admin Dashboard
* Mentor Dashboard
* Intern Dashboard
* Performance Metrics

---


# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
Frontend: git clone https://github.com/ruchitark10-blip/Intern-management-system-Frontend.git

Backend:git clone https://github.com/ruchitark10-blip/Intern-management-system-Backend.git
```

---

## 2️⃣ Install Dependencies

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd client
npm install
```

---

## 3️⃣ Environment Variables

Create a `.env` file inside the **server/** directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 4️⃣ Run the Application

### Start Backend Server

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

---

# 🌐 API Features

* User Authentication
* Role-Based Access Control
* Intern Registration & Management
* Mentor Assignment
* Task Creation & Tracking
* Attendance Management
* Performance Evaluation
* Dashboard Analytics

---

# 🔒 Security Features

✔ Password Hashing using **bcrypt.js**
✔ **JWT Authentication**
✔ Protected Routes
✔ Role-Based Authorization
✔ Input Validation & Error Handling

---


# 🚀 Future Enhancements

* 📧 Email Notifications
* 🎓 Certificate Generation
* 🏖 Leave Management
* 💬 Real-Time Chat System
* 📊 Advanced Analytics Dashboard
* 📱 Mobile Application Support

---

# 🤝 Contributing

Contributions are welcome!

To contribute:

1. **Fork** the repository
2. Create a new feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a **Pull Request**

---

# 👨‍💻 Developer

## Ruchita Kadav

## Shivam Namdev

## Kanika  

**MERN Stack Developer**

### Tech Expertise

* Node.js
* React.js
* Next.js
* MongoDB
* Express.js

### Organization

**Solstra Info IT**

---

## ⭐ Support

If you found this project useful, please consider giving it a **star ⭐** on GitHub.

Made with ❤️ by **  Ruchita Kadav & Shivam Namdev**
