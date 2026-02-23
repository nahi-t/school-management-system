# 🚀 Vercel + Render Deployment Guide

## 📋 Your MongoDB Credentials
- **Username**: `nahomketema553_db_user`
- **Password**: `5AW8e7tGzjuKeInZ`
- **Cluster**: `cluster0.z7vcfut.mongodb.net`
- **Database**: `school-management`
- **Full URI**: `mongodb+srv://nahomketema553_db_user:5AW8e7tGzjuKeInZ@cluster0.z7vcfut.mongodb.net/school-management`

---

## 🎯 Deployment Strategy
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free Tier)
- **Database**: MongoDB Atlas (Free)

---

## 📱 Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy Frontend
```bash
cd frontend
vercel --prod
```

### Step 3: Vercel Configuration
Create `frontend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/school-management"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 4: Update API URL
After Vercel deployment, update `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-name.onrender.com/api'
};
```

---

## 🖥️ Backend Deployment (Render)

### Step 1: Prepare for Render
1. Push to GitHub first:
```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. **Configure Service**:
   - **Name**: `school-management-api`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Environment Variables
Add these in Render Dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://nahomketema553_db_user:5AW8e7tGzjuKeInZ@cluster0.z7vcfut.mongodb.net/school-management
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-12345
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Step 4: Deploy
Click "Create Web Service" - Render will auto-deploy!

---

## 🔗 Connect Frontend to Backend

### After Both Deployments:
1. **Get URLs**:
   - Frontend: `https://your-app-name.vercel.app`
   - Backend: `https://your-api-name.onrender.com`

2. **Update Frontend**:
   ```typescript
   // frontend/src/environments/environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://your-api-name.onrender.com/api'
   };
   ```

3. **Redeploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

---

## 🛠️ Troubleshooting

### CORS Issues
Update backend CORS origin:
```
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Database Connection
Test MongoDB connection in Render logs:
```bash
# Check Render dashboard → Logs tab
```

### Build Errors
Ensure Node.js version compatibility:
- Frontend: Node 18+
- Backend: Node 18+

---

## 📊 Cost Breakdown

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month
- **Render**: 750 hours/month (free tier)
- **MongoDB Atlas**: 512MB storage

### Total Cost: $0/month! 🎉

---

## 🔄 Auto-Deployment Setup

### GitHub Integration:
1. Connect both Vercel and Render to your GitHub repo
2. Enable auto-deployment on `master` branch
3. Push updates trigger automatic deployments

### Workflow:
```bash
# Make changes
git add .
git commit -m "Update features"
git push origin master
# 🚀 Auto-deploys to both platforms!
```

---

## 📱 Access Your App

After deployment:
- **Live App**: `https://your-app-name.vercel.app`
- **API Docs**: `https://your-api-name.onrender.com/api`
- **Database**: MongoDB Atlas Dashboard

---

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set in Render
- [ ] CORS origin updated
- [ ] Frontend API URL updated
- [ ] Test all user roles (admin, teacher, student)
- [ ] Verify mark creation and teacher assignment
- [ ] Check responsive design

---

**🎉 Your School Management System is now live!**
