# Field Management System

A supervision platform for student field training — tracking applications, attendance, and tasks under one accountable record.

## Overview

FMS connects three roles in a field training programme:

- **Students** file placement applications, log daily attendance, and receive assigned tasks.
- **Supervisors** verify logbook entries, assign tasks, and approve student submissions.
- **Instructors** accept or reject applications, manage departments, and oversee the full cohort.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 3 |
| Components | Ant Design 6 |
| State | Redux Toolkit |
| Routing | React Router 7 |
| HTTP | Axios |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A running [FSMS Backend](https://github.com/Henryharrison000005/FSMS_BACKEND) instance

### Installation

```bash
git clone https://github.com/Henryharrison000005/curator.git
cd curator
npm install
```

### Environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Development

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── common/
│   ├── components/      # Shared UI (Breadcrumb, Header, Settings, ProtectedRoute)
│   └── layouts/         # MainLayout (sidebar + header shell)
├── modules/
│   ├── attendance/      # StudentLogbook, SupervisorAttendance, InstructorAttendance
│   ├── auth/            # Login, authentication service
│   ├── instructor/      # InstructorApplications, InstructorDepartmentManagement
│   ├── registration/    # StudentRegistration
│   ├── settings/        # Role-specific settings pages
│   └── task/            # StudentTask, SupervisorTask, TaskForm
├── pages/
│   ├── Home.jsx         # Public landing page
│   └── RoleHome.jsx     # Authenticated role dashboard
├── store/               # Redux store configuration
└── styles/              # Shared CSS (component.css)
```

## Routes

| Path | Role | Description |
|------|------|-------------|
| `/` | All (auth) | Role-based dashboard |
| `/Login` | Public | Sign in |
| `/StudentRegistration` | Public | Submit field application |
| `/StudentTask` | Student | View assigned tasks |
| `/StudentLogbook` | Student | Log daily field attendance |
| `/StudentSettings` | Student | Account settings |
| `/SupervisorTasks` | Supervisor | Create and manage tasks |
| `/SupervisorAttendance` | Supervisor | Verify student attendance |
| `/SupervisorSettings` | Supervisor | Account settings |
| `/InstructorApplications` | Instructor | Review and accept/reject applications |
| `/InstructorDepartmentManagement` | Instructor | Manage student-supervisor assignments |
| `/InstructorAttendance` | Instructor | Monitor cohort attendance |
| `/InstructorSettings` | Instructor | Account settings |

## Default Credentials

When an instructor accepts a student application, the default password is set to the student's **surname in capital letters**. The student should change it after first login.

| Role | Example Email | Default Password |
|------|--------------|-----------------|
| Student | `masawi@student.com` | `MASAWI` |
| Supervisor | `supervisor@fsms.com` | `supervisor123` |
| Instructor | `instructor@fsms.com` | `instructor123` |

## License

This project is private and not publicly licensed.
