---
name: mern-deployment
description: >-
  Procedures, configuration files, and checklists for deploying MERN applications to Render (Backend),
  Vercel (Frontend), and MongoDB Atlas (Database), with production-grade security and CORS handling.
---

# MERN Cloud Deployment Guide (Render, Vercel, MongoDB Atlas)

This skill provides full-stack deployment runbooks and configuration templates to deploy MERN applications to production.

---

## 1. MongoDB Atlas Setup

1. **Cluster Creation**: Create a Free Shared M0 Cluster.
2. **Database User**: Create a database user with read/write privileges (avoid special characters in password or URL-encode them).
3. **Network Access**: Add IP Access `0.0.0.0/0` (Allow Access from Anywhere) to permit cloud backend connections from dynamic Render IPs.
4. **Connection String**:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

---

## 2. Express Backend Deployment (Render)

### Configuration Checklist:
- Set `NODE_ENV=production`
- Listen on `process.env.PORT || 5000`
- Add a health-check endpoint:
  ```javascript
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
  });
  ```
- **CORS Configuration**:
  ```javascript
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL, // e.g. https://my-app.vercel.app
  ].filter(Boolean);

  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS'));
      }
    },
    credentials: true
  }));
  ```

### Render Web Service Settings:
- **Environment**: Node
- **Root Directory**: `Week 4/capstone-ecommerce-app/backend` (or backend folder)
- **Build Command**: `npm install`
- **Start Command**: `node src/server.js` (or `npm start`)
- **Environment Variables**:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `MONGO_URI=<Atlas_Connection_String>`
  - `JWT_SECRET=<Strong_Random_Secret>`
  - `CLIENT_URL=https://<your-vercel-app>.vercel.app`

---

## 3. React + Vite Frontend Deployment (Vercel)

### Single Page Application (SPA) Routing Fix:
When deploying React Router SPAs on Vercel, direct navigation or page refresh on routes like `/cart` or `/admin/dashboard` will cause 404 errors unless a `vercel.json` rewrites rule is present in the frontend root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Vercel Project Settings:
- **Framework Preset**: Vite
- **Root Directory**: `Week 4/capstone-ecommerce-app/frontend` (or frontend folder)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL=https://<your-render-backend>.onrender.com/api`

---

## 4. Pre-Deployment Verification Checklist

- [ ] Run `npm run build` locally in frontend to ensure zero compile or bundling errors.
- [ ] Ensure backend `.env` is NOT committed to Git (`.gitignore` contains `.env`).
- [ ] Ensure `.env.example` is committed with all required environment variable keys and dummy values.
- [ ] Test API endpoints with production payload in `requests.http`.
- [ ] Confirm `/api/health` returns HTTP 200 OK.
