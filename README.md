# SocialPulse – Social Media Analytics Dashboard

## Project Overview

SocialPulse is a full-stack web application designed to manage social media posts and monitor social media analytics through a simple and interactive dashboard.

## Features

* User Registration and Login
* Secure Authentication
* Interactive Analytics Dashboard
* Social Media Statistics and Charts
* Create and Delete Posts
* Scheduled Posts Management
* PostgreSQL Database Integration
* User Profile Page

## Technologies Used

**Frontend:**

* React.js
* Vite
* CSS
* Recharts

**Backend:**

* Node.js
* Express.js
* JWT Authentication

**Database:**

* PostgreSQL

## Project Structure

```text
SocialPulse/
├── backend/
│   ├── middleware/
│   ├── db.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/priyasekar0204/SocialPulse-Dashboard.git
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` and configure the database URL and JWT secret.

### 3. Database Setup

* Install PostgreSQL.
* Create a database named `socialpulse`.
* Configure the database connection in the `.env` file.

### 4. Start Backend

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Note

The analytics dashboard currently uses sample/demo data. Real Instagram and X API integration is not included in this version.

## Project Status

Basic full-stack functionality implemented and tested.
