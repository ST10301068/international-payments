<img width="1710" height="567" alt="image" src="https://github.com/user-attachments/assets/695ee1a9-cdfa-4101-b359-8ae118827df8" />

# 🌍💳 International Payment System — Part 2

Welcome to **Part 2** of the **International Payment System Project**!  
Building a  **secure full-stack payment portal** that integrates **authentication**, **encryption**, **DevSecOps**, and **frontend-backend communication**.  

---

## 🧠 Overview

Our team developed:
- A **Backend API** using **Express.js** and **MongoDB**
- A **React Frontend Application**
- A **DevSecOps pipeline** with **CircleCI**, **SonarCloud**, and **Docker**

This project emphasizes **security**, **compliance**, and **secure DevOps practices**.  
All requirements from **Part 1** (security considerations) will be **validated** in this Part.

---

## ⚙️ Backend Requirements (Node.js + Express)


### 🔐 Authentication
- Implementation of **user registration, login, and logout**.
- Used **salting** 🧂 and **hashing** 🔑 for password storage.

### 🔒 Security
- Implementation of **SSL certificate** for secure HTTPS communication with the frontend.
- Protectection against **all cyberattacks** outlined in Part 1 (e.g., XSS, CSRF, injection attacks, brute force, etc.).

### 🗃️ Database
- Used **MongoDB**.
- Ensured **input sanitization** and **query validation** to prevent **NoSQL injection**.

---

## 💻 Frontend Requirements (React)

Frontend web app :

### 👤 Authentication
- Users can **register** and **login** securely (handled by backend API).

### 💰 Payments
- Users can **create new payments** with required information.
- Includes a **status** field (default: `pending`).
- Displays a **list of existing payments** for each user.

### 🧱 Security
- Sanitization of all inputs to prevent:
  - **SQL injection** 
  - **NoSQL injection**
- Serve **all traffic over HTTPS** using SSL.

---

## 🚀 DevSecOps Implementation

Implementation of **secure CI/CD pipeline** using the following tools:

### 🔄 CircleCI
- Automation of  build and deployment workflows.
- Trigger pipeline runnning on every code push.

### 🧠 SonarCloud (SonarQube)
- Integration with CircleCI to perform **code quality** and **security scans** automatically.

---

## 🧩 Summary of Requirements

| Feature | Description |
|----------|-------------|
| 🔐 **Password Security** | Using salting + hashing before database storage |
| 🧾 **Input Whitelisting** | Validation inputs using RegEx |
| 🌐 **SSL Security** | All communications over HTTPS |
| 🛡️ **Attack Protection** | Protectection against XSS, CSRF, Injection, etc. |
| 🧰 **DevSecOps** | Implementation CircleCI, SonarCloud, and Docker |


---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd international-payment-system


