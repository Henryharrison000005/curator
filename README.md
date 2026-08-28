# Field Management System (FSMS)

A full-stack supervision platform for student field training — tracking applications, attendance, and tasks under one accountable record.

## Overview

FSMS connects three roles in a field training programme:

- **Students** — file placement applications, log daily attendance, and receive assigned tasks.
- **Supervisors** — verify logbook entries, assign tasks, and approve student submissions.
- **Instructors** — accept or reject applications, manage departments, and oversee the full cohort.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 3, Ant Design 6 |
| State | Redux Toolkit |
| Routing | React Router 7 |
| HTTP | Axios |
| PDF | jsPDF + jsPDF-AutoTable |
| Notifications | React Toastify |
| Backend | Laravel 12 (PHP 8.2+) |
| Auth | JWT (tymon/jwt-auth) |
| Database | PostgreSQL |
| Queue | Laravel (database driver) |

## Project Structure

```
field-management-system/
├── curator/                    # Frontend
│   ├── src/
│   │   ├── common/             # Shared components & layouts
│   │   │   ├── components/     # BreadCrump, MainHeader, ProtectedRoute, SettingsPage
│   │   │   └── layouts/        # MainLayout (sidebar + header)
│   │   ├── modules/            # Feature modules
│   │   │   ├── attendance/     # StudentLogbook, SupervisorAttendance, InstructorAttendance
│   │   │   ├── auth/           # Login + authentication service
│   │   │   ├── instructor/     # InstructorApplications, InstructorDepartmentManagement
│   │   │   ├── registration/   # StudentRegistration
│   │   │   ├── settings/       # Role-specific settings pages
│   │   │   └── task/           # StudentTask, SupervisorTask, TaskForm
│   │   ├── pages/              # Home, RoleHome
│   │   ├── store/              # Redux store (reducers, auth)
│   │   └── styles/             # component.css
│   └── public/                 # Static assets
│
└── FSMS_BACKEND/               # Backend
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/    # Auth, Student, Supervisor, Instructor, Task, etc.
    │   │   └── Requests/       # Form request validation
    │   ├── Models/             # Eloquent models
    │   └── Policies/           # Authorization policies
    ├── config/                 # App, auth, cors, jwt, database, mail, etc.
    ├── database/
    │   ├── migrations/         # Database schema
    │   └── seeders/            # Seed data
    ├── routes/
    │   └── api.php             # API routes
    └── storage/                # Logs, cache, sessions
```

## Getting Started

### Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer
- PostgreSQL

### Backend Setup

```bash
cd FSMS_BACKEND
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=fsms_db
DB_USERNAME=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Then run migrations and start the server:

```bash
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

## API Endpoints

All routes are prefixed with `/api` and require a JWT token unless noted.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| GET/POST | `/api/students` | List / create students |
| GET/PUT/DELETE | `/api/students/{id}` | Get / update / delete student |
| GET/POST | `/api/supervisors` | List / create supervisors |
| GET/POST | `/api/instructors` | List / create instructors |
| GET/POST | `/api/departments` | List / create departments |
| GET/POST | `/api/tasks` | List / create tasks |
| GET/POST | `/api/task-assignments` | List / create task assignments |
| GET/POST | `/api/field-applications` | List / create field applications |
| GET/POST | `/api/attendance-logbooks` | List / create attendance logbooks |
| GET/POST | `/api/student-documents` | List / create student documents |
| GET/POST | `/api/email-notifications` | List / create email notifications |
| GET/POST | `/api/suggestion-feedback` | List / create suggestion feedback |
| GET/POST | `/api/system-logs` | List / create system logs |

## Default Credentials

When an instructor accepts a student application, the default password is set to the student's **surname in capital letters**. The student should change it after first login.

| Role | Example Email | Default Password |
|------|--------------|-----------------|
| Student | `masawi@student.com` | `MASAWI` |
| Supervisor | `supervisor@fsms.com` | `supervisor123` |
| Instructor | `instructor@fsms.com` | `instructor123` |

## License

This project is private and not publicly licensed.
