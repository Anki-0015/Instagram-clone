# Instagram Clone (Spring Boot + React + MySQL)

This is a minimal full-stack Instagram-style app with a Spring Boot backend, React (Vite) frontend, and MySQL database.

- Backend: Spring Boot, JWT auth, JPA, MySQL
- Frontend: React + Vite, Axios, React Router
- DB: MySQL (use MySQL Workbench to manage the `instagram_db` database)

## Quickstart

1) Backend
- Configure DB creds in `backend/src/main/resources/application.properties`
- Start API:
```bash
cd backend
mvn spring-boot:run
```

2) Frontend
- Start the React dev server:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Default API base URL
Frontend uses `VITE_API_URL` (defaults to `http://localhost:8080`) – set in `frontend/.env.local` if you need to override.

## Feature highlights
- Sign up / Login with JWT
- Create posts (image URL + caption)
- Feed (your posts + people you follow)
- Like/Unlike, Comments (basic endpoints wired)
- User profiles, follow/unfollow

## Notes
- For demo simplicity, image uploads are by URL. You can extend with file uploads later.
- Ensure the DB is running and accessible. You can create the DB via MySQL Workbench:
```sql
CREATE DATABASE instagram_db;
```
