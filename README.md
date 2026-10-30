# SocialPulse – Social Media Analytics Dashboard

A full-stack starter project using React, Node.js, Express, PostgreSQL and Recharts.

## Features
- Register and login with JWT authentication
- Dashboard KPI cards and analytics charts
- Instagram and X/Twitter demo analytics
- Create, list and delete scheduled posts
- Profile endpoint
- Responsive dashboard UI

## Requirements
- Node.js 18+
- PostgreSQL 14+

## 1. Database setup
Create a PostgreSQL database:
```sql
CREATE DATABASE socialpulse;
```

## 2. Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Update `backend/.env` with your PostgreSQL username/password. The server creates the required tables and demo analytics data automatically on first start.

## 3. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## Demo
Register a new account from the login screen. Dashboard analytics use clearly labelled sample data until real platform API credentials are connected.

## Real Instagram / X API note
Real publishing and account analytics require approved Meta / X developer apps, access tokens and platform permissions. This project does not pretend to connect to real accounts; it includes an API-ready backend structure and demo data.
