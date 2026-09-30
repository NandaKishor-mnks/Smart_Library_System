# Smart Library Management System

A web-based Smart Library Management System developed to digitally manage library operations such as students, teachers, books, book circulation, returns, borrowing history, fines, and notifications.

## Features

- Firebase Email & Password Authentication
- Forgot Password / Password Reset
- Student Management
- Teacher Management
- Book Management
- Book Issue / Circulation
- Book Return Management
- Automatic Fine Calculation
- Borrowing History
- Notifications
- Search and Filter
- Library Dashboard
- Cloud Firestore Database
- Firebase Data Synchronization

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Firebase Authentication
- Firebase Cloud Firestore
- GitHub

## Firebase Integration

Firebase is used as the backend database and authentication service.

The application connects to Firebase through JavaScript:

```text
User
  |
  v
Smart Library Web Application
  |
  v
JavaScript
  |
  v
Firebase Bridge
  |
  +----------------------+
  |                      |
  v                      v
Firebase             Cloud Firestore
Authentication       Database
