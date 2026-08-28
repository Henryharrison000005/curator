# Field Management System (FSMS)

A supervision platform for student field training — tracking applications, attendance, and tasks under one accountable record.

## Overview

FSMS connects three roles in a field training programme:

- **Students** file placement applications, log daily attendance, and receive assigned tasks.
- **Supervisors** verify logbook entries, assign tasks, and approve student submissions.
- **Instructors** accept or reject applications, manage departments, and oversee the full cohort.

## Project Structure

```
field-management-system/
├── curator/            # Frontend (React + Vite)
└── FSMS_BACKEND/       # Backend (Laravel)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 3, Ant Design 6 |
| State | Redux Toolkit |
| Routing | React Router 7 |
| Backend | Laravel (PHP) |
| Auth | JWT (tymon/jwt-auth) |

## Getting Started

### Prerequisites

- Node.js 18+
- PHP 8.1+ with Composer
- MySQL or compatible database

### Backend Setup

```bash
cd FSMS_BACKEND
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

The API runs at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd curator
npm install
```

Create a `.env` file in the `curator/` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Default Credentials

When an instructor accepts a student application, the default password is set to the student's **surname in capital letters**. The student should change it after first login.

| Role | Example Email | Default Password |
|------|--------------|-----------------|
| Student | `masawi@student.com` | `MASAWI` |
| Supervisor | `supervisor@fsms.com` | `supervisor123` |
| Instructor | `instructor@fsms.com` | `instructor123` |

## License

This project is private and not publicly licensed.
