# JobBoard — MERN Stack Internship Project

A responsive full-stack job board built with React + Vite, Node.js, Express, MongoDB/Mongoose, JWT authentication, bcrypt password hashing, and Multer resume uploads.

## Features
- Responsive homepage, featured jobs, job search and filters
- Job details and candidate application with PDF/DOC/DOCX resume upload
- Candidate and employer accounts (role-based access)
- Employer dashboard to create, edit, delete jobs and review applications
- Candidate dashboard to view submitted applications
- JWT-protected API routes and bcrypt password hashing
- Optional SMTP email notifications via environment variables

## Requirements
- Node.js 20.19+ (recommended current LTS), npm
- MongoDB local install or MongoDB Atlas connection string

## Setup
1. Open this folder in VS Code.
2. Backend:
   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run dev
   ```
   Fill in `MONGO_URI` and a long random `JWT_SECRET` in `server/.env`.
3. In a second terminal, frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
4. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## First use
- Create an account and choose either Candidate or Employer.
- Employer: open Dashboard and create a job.
- Candidate: browse jobs, open details, and apply with a resume.

## Email notifications
SMTP is optional. Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM` in `.env`. Without SMTP values, applications still save successfully and the API logs that email is not configured.

## API routes
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`
- `POST /api/applications/:jobId` (multipart form, field `resume`)
- `GET /api/applications/mine`, `GET /api/applications/employer`, `PATCH /api/applications/:id/status`
- `GET /api/health`

## Deployment notes
Deploy the backend as a Node web service and the frontend as a static site. Set production environment variables in the host dashboard, set `CLIENT_URL` to the deployed frontend origin, and set the frontend `VITE_API_URL` to the backend URL plus `/api`. Use persistent/object storage for resumes in production; this starter stores uploads on the server filesystem, which is not persistent on many free hosts. Never commit `.env` or real credentials.
