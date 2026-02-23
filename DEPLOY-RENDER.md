# 🚀 Render Full-Stack Deployment Guide

## 📋 Your MongoDB Credentials
- **Username**: `nahomketema553_db_user`
- **Password**: `5AW8e7tGzjuKeInZ`
- **Cluster**: `cluster0.z7vcfut.mongodb.net`
- **Database**: `school-management`
- **Full URI**: `mongodb+srv://nahomketema553_db_user:5AW8e7tGzjuKeInZ@cluster0.z7vcfut.mongodb.net/school-management`

---

## 🎯 Render Deployment (Both Frontend + Backend)

Render can host both your Angular frontend and Node.js backend!

---

## 📱 Frontend Deployment (Render Static Site)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin master
```

### Step 2: Deploy Frontend to Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Select your GitHub repository
4. **Configure**:
   - **Name**: `school-management-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/school-management`
   - **Add Custom Domain** (optional)

### Step 3: Environment Variables for Frontend
```
API_URL=https://your-backend-name.onrender.com/api
```

---

## 🖥️ Backend Deployment (Render Web Service)

### Step 1: Deploy Backend to Render
1. Click "New +" → "Web Service"
2. Select same GitHub repository
3. **Configure**:
   - **Name**: `school-management-api`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 2: Backend Environment Variables
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://nahomketema553_db_user:5AW8e7tGzjuKeInZ@cluster0.z7vcfut.mongodb.net/school-management
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-12345
CORS_ORIGIN=https://your-frontend-name.onrender.com
```

---

## 🔗 Connect Frontend to Backend

### Update Frontend API URL
After backend deployment, get the URL and update:

1. **Get Backend URL**: From Render dashboard (e.g., `https://school-management-api.onrender.com`)

2. **Update Environment File**:
   ```typescript
   // frontend/src/environments/environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://school-management-api.onrender.com/api'
   };
   ```

3. **Push and Redeploy**:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push origin master
   ```

---

## 🛠️ Render Configuration Files

### Create render.yaml (Optional)
Create `render.yaml` in root directory:
```yaml
services:
  # Backend Service
  - type: web
    name: school-management-api
    env: node
    repo: https://github.com/YOUR_USERNAME/school-management-system.git
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://nahomketema553_db_user:5AW8e7tGzjuKeInZ@cluster0.z7vcfut.mongodb.net/school-management
      - key: JWT_SECRET
        value: your-super-secure-jwt-secret-key-change-this-12345
      - key: CORS_ORIGIN
        value: https://school-management-frontend.onrender.com

  # Frontend Service
  - type: web
    name: school-management-frontend
    env: static
    repo: https://github.com/YOUR_USERNAME/school-management-system.git
    rootDir: frontend
    buildCommand: npm install && npm run build
    publishDir: dist/school-management
    envVars:
      - key: API_URL
        value: https://school-management-api.onrender.com/api
```

---

## 🔄 Auto-Deployment Workflow

### GitHub Integration
1. Connect Render to your GitHub repository
2. Enable auto-deploy on `master` branch pushes
3. Both services auto-deploy when you push changes

### Development Workflow
```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin master

# 🚀 Both frontend and backend auto-deploy!
```

---

## 📊 Render Free Tier Benefits

### What's Included:
- **Web Services**: 750 hours/month (free tier)
- **Static Sites**: Unlimited
- **SSL Certificates**: Free
- **Custom Domains**: Free
- **Auto-HTTPS**: Free
- **GitHub Integration**: Free

### Limits:
- **Web Service**: 512MB RAM, shared CPU
- **Sleeps after 15 minutes** inactivity
- **Wakes up** on next request (may take 30 seconds)

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. CORS Errors
```bash
# Update CORS_ORIGIN in backend environment
CORS_ORIGIN=https://your-frontend-name.onrender.com
```

#### 2. Database Connection
```bash
# Test MongoDB connection
# Check Render logs for connection errors
```

#### 3. Frontend Not Loading
```bash
# Check build output directory
# Ensure publish directory is: dist/school-management
```

#### 4. Backend Sleep Issues
```bash
# Free tier sleeps after 15 minutes
# Consider upgrading for 24/7 availability
```

---

## 📱 Production URLs

After deployment:
- **Frontend**: `https://school-management-frontend.onrender.com`
- **Backend API**: `https://school-management-api.onrender.com/api`
- **API Health Check**: `https://school-management-api.onrender.com/api/auth/me`

---

## 🎯 Production Checklist

### Pre-Deployment:
- [ ] MongoDB Atlas cluster running
- [ ] Environment variables configured
- [ ] CORS origin set correctly
- [ ] JWT secret is secure

### Post-Deployment:
- [ ] Test user registration/login
- [ ] Test admin dashboard
- [ ] Test teacher mark assignment
- [ ] Test student view
- [ ] Check mobile responsiveness
- [ ] Verify all API endpoints

---

## 💰 Upgrade Options

### Render Paid Plans:
- **Starter**: $7/month - No sleep, better performance
- **Standard**: $25/month - More resources, faster
- **Pro**: $75/month - High performance

### When to Upgrade:
- App becomes slow
- Need 24/7 availability
- More users/traffic

---

## 🎉 Success!

Your School Management System is now:
- ✅ Deployed on Render
- ✅ Using MongoDB Atlas
- ✅ Auto-deploys from GitHub
- ✅ SSL secured
- ✅ Production ready

**Access your live app at the URL provided by Render!** 🚀
