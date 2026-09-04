# Week 3 Full-Stack Integration Standards

## 1. Project Organization
Each assignment and project in Week 3 should follow a clean, decoupled client-server architecture:
- `backend/`: Express server, MongoDB Mongoose models, JWT auth middleware, Multer file upload handlers, `.env.example`, `requests.http`, and `postman_collection.json`.
- `frontend/`: React + Vite SPA, React Router v6+, Axios instance with Bearer token interceptor, Context API state management, and modern responsive CSS.

## 2. API Communication & Security
- All backend responses must adhere to the standardized format:
  - Success: `{ "success": true, "message": "...", "data": ... }`
  - Error: `{ "success": false, "message": "...", "errors": [...] }`
- Always implement CORS on Express backends to allow requests from the Vite frontend (`http://localhost:5173` or dynamic origin).
- Passwords must be hashed using `bcryptjs` with 10 salt rounds before storage.
- Use `jsonwebtoken` for generating and verifying Bearer tokens.
- File uploads with Multer must validate file type (images only) and enforce file size limits (5MB maximum).

## 3. Frontend Architecture
- Store authentication state in a dedicated `AuthContext` with persistent tokens in `localStorage`.
- Implement `ProtectedRoute` components that redirect unauthenticated users to `/login`.
- Centralize API calls using a dedicated Axios instance (`src/api/axiosInstance.js`) that automatically attaches the JWT token to request headers.
- Provide clear user feedback for loading states, validation errors, and success notifications.

## 4. Required Artifacts
For every completed assignment:
- A clear, descriptive `README.md` with setup and execution steps.
- `.env.example` in backend and frontend where applicable.
- `requests.http` test script with multiple test cases.
- `postman_collection.json` v2.1 export.
