# Store Rating System

A full-stack store rating application where users can discover stores, submit ratings, and manage their profiles. The application has separate dashboards and permissions for **Admins, Normal Users, and Store Owners**.

The project is built with React and TypeScript on the frontend, and Node.js, Express, TypeScript, Drizzle ORM, and PostgreSQL on the backend.

---

## What this project does

The application supports three types of users:

- **Admin** – manages users, stores, and the overall platform.
- **Normal User** – browses stores and submits or updates ratings.
- **Store Owner** – views the rating of their store and the users who have rated it.

Ratings are given on a scale of **1 to 5**.

---

## Project Structure

```text
store-rating/
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── ...
│   │   └── server.ts
│   ├── scripts/
│   │   └── seed-admin.ts
│   ├── drizzle.config.ts
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- DaisyUI

### Backend

- Node.js
- Express.js
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT authentication
- bcryptjs
- Zod
- Helmet
- CORS
- Cookie Parser
- Morgan

### Database

The application uses **PostgreSQL** with **Drizzle ORM**.

Drizzle handles the database schema, migrations, and type-safe queries.

---

# Main Features

## Authentication

There is one login system for all three roles. Once logged in, the user's role determines which parts of the application they can access.

The backend supports:

```text
ADMIN
USER
OWNER
```

Authentication includes:

- JWT-based login
- Protected routes
- Role-based authorization
- Password hashing with bcrypt
- Logout
- Change password

---

## Admin

An admin can manage the main parts of the platform.

### Dashboard

The dashboard shows:

- Total users
- Total stores
- Total ratings

### User and Store Management

Admins can:

- Add users
- Add admin users
- Add store owners
- Add stores
- View users
- View stores
- View individual user details
- Assign/manage store ownership
- Search and filter listings
- Sort listings
- Log out

---

## Normal User

A normal user can:

- Create an account
- Log in
- Browse all registered stores
- Search stores by name or address
- See a store's overall rating
- See their own rating
- Submit a rating from 1 to 5
- Update their existing rating
- Change their password
- Log out

A user can only have **one rating per store**. If they submit another rating for the same store, the existing rating is updated.

---

## Store Owner

Store owners have a smaller, focused dashboard.

They can:

- Log in
- Change their password
- See their store's average rating
- See the users who have submitted ratings for their store
- Log out

---

# Validation

The application follows the validation rules from the coding challenge:

| Field | Requirement |
|---|---|
| Name | 20–60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters |
| Password | At least one uppercase letter |
| Password | At least one special character |
| Email | Valid email format |
| Rating | Integer between 1 and 5 |

---

# Database

The backend uses three main tables.

### Users

```text
id
name
email
password_hash
address
role
created_at
```

Available roles:

```text
ADMIN
USER
OWNER
```

### Stores

```text
id
name
email
address
owner_id
created_at
```

### Ratings

```text
id
user_id
store_id
rating
created_at
updated_at
```

There is a unique constraint on:

```text
(user_id, store_id)
```

This makes sure that a user cannot create multiple rating entries for the same store.

---

# Getting Started

## Prerequisites

Make sure you have these installed:

- Node.js
- npm
- PostgreSQL
- Git

You can check your installations with:

```bash
node -v
npm -v
psql --version
```

---

# 1. Clone the Repository

```bash
git clone https://github.com/premrahi/store-rating.git
cd store-rating
```

---

# 2. Set Up the Backend

Go into the backend folder:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

---

## Backend Environment Variables

Create a file named:

```text
backend/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/store_rating

JWT_SECRET=your_super_secret_jwt_key

PORT=5000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
```

### What these variables are for

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `PORT` | Port used by the backend |
| `ADMIN_EMAIL` | Email for the seeded admin account |
| `ADMIN_PASSWORD` | Password for the seeded admin account |

**Do not commit `.env` files or other secrets to GitHub.**

---

# 3. Create the PostgreSQL Database

Create a database called:

```text
store_rating
```

For example, from `psql`:

```sql
CREATE DATABASE store_rating;
```

Your connection string should then look something like:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/store_rating
```

If you're using a hosted PostgreSQL service, use the connection string provided by that service.

---

# 4. Run the Database Migrations

From the `backend` folder:

```bash
npm run db:generate
```

Then apply the migrations:

```bash
npm run db:migrate
```

This will create/update the required database tables.

---

# 5. Create the Admin Account

You don't need to manually insert an admin into PostgreSQL.

The project already includes an admin seed script:

```text
backend/scripts/seed-admin.ts
```

Make sure these are present in your `backend/.env`:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
```

Then run:

```bash
npm run seed
```

The script hashes the password and creates the user with the `ADMIN` role.

You should see something similar to:

```text
Admin ready: admin@example.com
```

### Changing the admin credentials

If you want to use different admin credentials, change:

```env
ADMIN_EMAIL=newadmin@example.com
ADMIN_PASSWORD=NewAdmin@123
```

and run:

```bash
npm run seed
```

again.

If the email already exists, the seed script updates the password hash instead of creating another account.

---

# 6. Start the Backend

For development:

```bash
npm run dev
```

The backend will normally be available at:

```text
http://localhost:5000
```

The API base URL is:

```text
http://localhost:5000/api
```

For a production build:

```bash
npm run build
npm start
```

---

# 7. Set Up the Frontend

Open a **new terminal** and go back to the project root:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where the backend API is running.

---

# 8. Start the Frontend

From the `frontend` folder:

```bash
npm run dev
```

Vite will show the local URL in the terminal. Normally it will be:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# Running the Full Application

You need two terminals while developing.

### Terminal 1 — Backend

```bash
cd store-rating/backend
npm install
npm run db:migrate
npm run seed
npm run dev
```

### Terminal 2 — Frontend

```bash
cd store-rating/frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Testing the Application

A simple way to test the complete flow is:

### 1. Login as Admin

Use the credentials from:

```text
backend/.env
```

For example:

```text
Email: admin@example.com
Password: Admin@12345
```

### 2. Create a Normal User

From the admin panel, create a user with:

- Name
- Email
- Password
- Address
- Role: `USER`

### 3. Create a Store Owner

Create another user with:

- Name
- Email
- Password
- Address
- Role: `OWNER`

### 4. Add a Store

Create a store and assign the store owner to it.

### 5. Test the Normal User

Log in as the normal user and check that they can:

- Browse stores
- Search stores
- See overall ratings
- Submit a rating
- Update their rating

For example:

```text
Rating: 5
```

### 6. Test the Store Owner

Log in as the owner and verify that they can see:

- Their assigned store
- The average rating
- Users who rated the store

### 7. Test the Admin

Finally, log back in as the admin and check:

- Dashboard statistics
- User list
- Store list
- Search/filtering
- Sorting
- User management
- Store management

---

# Available Commands

## Backend

Run these commands from:

```text
backend/
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the backend in development mode |
| `npm run build` | Builds the TypeScript backend |
| `npm start` | Starts the built backend |
| `npm run db:generate` | Generates Drizzle migrations |
| `npm run db:migrate` | Applies database migrations |
| `npm run db:studio` | Opens Drizzle Studio |
| `npm run seed` | Creates/updates the admin account |

## Frontend

Run these commands from:

```text
frontend/
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the frontend |
| `npm run preview` | Previews the production build |

---

# Development Flow

At a high level, requests flow through the application like this:

```text
PostgreSQL
    ↓
Backend API
    ↓
Frontend
    ↓
Browser
```

The frontend communicates with the backend through HTTP API requests. Authentication and role-based permissions are handled by the backend.

---

# Database Changes

If you modify the Drizzle schema, generate a new migration:

```bash
cd backend
npm run db:generate
```

Then apply it:

```bash
npm run db:migrate
```

If you want to inspect the database during development:

```bash
npm run db:studio
```

---

# Security

Some of the security-related measures used in the backend include:

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- Protected API routes
- Helmet for HTTP security headers
- Zod validation
- CORS configuration
- Cookie handling
- Environment variables for configuration

Keep secrets such as database credentials and JWT keys inside `.env` files and never commit them to the repository.

---

# Challenge Requirements

This project was built around the provided FullStack Intern Coding Challenge.

The main requirements covered by the application include:

- Admin, Normal User, and Store Owner roles
- User registration and login
- Store management
- User management
- Store ratings from 1 to 5
- Updating submitted ratings
- Role-specific dashboards
- Store search
- Filtering
- Sorting
- Password updates
- Logout

The challenge also specifies the following validation requirements:

```text
Name: 20–60 characters
Address: maximum 400 characters
Password: 8–16 characters
Password: at least one uppercase character
Password: at least one special character
Email: standard email validation
```

---

# Repository

GitHub:

https://github.com/premrahi/store-rating

---

# Author

**Prem Rahi**

GitHub:

https://github.com/premrahi

---

# Quick Start

If PostgreSQL is already configured, you can get the application running with:

### Backend

```bash
cd backend
npm install
npm run db:migrate
npm run seed
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

Use the admin credentials configured in:

```text
backend/.env
```
