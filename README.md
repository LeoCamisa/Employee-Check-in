# 🕒 Employee Check-In System

The Employee Check-In System is a comprehensive solution for managing the daily check-ins of employees in a company. It provides a secure and efficient way for employees to record their attendance, and for administrators to monitor and manage these records in real-time.

## 📄 Project Overview

This system is designed to facilitate accurate and efficient time tracking for employees. The key features include real-time record viewing for administrators, secure authentication for employees.

## 🛠 Technologies Used

This project leverages modern technologies to ensure a robust and scalable solution:

- **React JS**
- **TypeScript**
- **GraphQL**
- **Apollo**
- **Material UI**

## 🌐 Setup and Installation

### 📋 Prerequisites

- Ensure the backend API is running. Follow the setup instructions available [here](https://github.com/LeoCamisa/register-api).
- Node.js and Yarn should be installed on your system.

### 📦 Installation

Navigate to the project directory and install the necessary dependencies:

```bash
npm install
```
### ▶️ Running the Application
To start the application, run:
```bash
npm run dev
```
The application will be accessible at: http://localhost:3001.

### 🔑 Accessing the Application
👨‍💼 Administrator Login
Open the GraphQL Playground at http://localhost:3000/graphql.
Execute the following mutation to create an administrator user:
```bash
mutation {
  createUser(input: {
    name: "admin",
    email: "admin@efficlin.com",
    password: "pw123",
    role: "admin"
  }) {
    id
    name
    email
    role
  }
}
```

### 👥 Creating a New User
Log in as the administrator using the credentials created above.
Navigate to the administration page and fill in the details to create a new user. Ensure the role is set to "colaborador" for them to access the register point feature.
The new user can now log in and record their check-ins.

### 📅 Registering Check-Ins
Log in with the newly created user credentials.
Add new check-in records through the user interface.
### 📝 License
This project is licensed under the MIT License. See the LICENSE file for more details
