# 🚀 Deployment Guide

## Quick Start Options

### Option 1: Render (Recommended - Free)
- **Backend**: Node.js web service
- **Frontend**: Static site
- **Database**: MongoDB Atlas (free tier)
- **Cost**: $0/month

### Option 2: Docker
- **Setup**: Docker containers
- **Hosting**: Any VPS (DigitalOcean, AWS, etc.)
- **Cost**: $5-10/month

### Option 3: Vercel + Heroku
- **Frontend**: Vercel (free)
- **Backend**: Heroku (paid tier)
- **Cost**: $5-7/month

---

## 🎯 Render Deployment (Easiest)

### Step 1: GitHub Setup
```bash
# Create GitHub repo at github.com
git remote add origin https://github.com/YOUR_USERNAME/school-management-system.git
git push -u origin master
```

### Step 2: Backend Deployment
1. Go to [render.com](https://render.com) → Sign up
2. Connect GitHub account
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - **Name**: `school-api`
   - **Runtime**: `Node`
   - **Root Directory**: `backend`
   - **Build**: `npm install`
   - **Start**: `npm start`
   - **Environment**:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school-db
     JWT_SECRET=your-secret-key
     ```

### Step 3: Frontend Deployment
1. Click "New +" → "Static Site"
2. Select same repository
3. Configure:
   - **Name**: `school-frontend`
   - **Root Directory**: `frontend`
   - **Build**: `npm install && npm run build`
   - **Publish**: `dist/school-management`

### Step 4: Connect Frontend to Backend
Update `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://school-api.onrender.com/api'
};
```

---

## 🐳 Docker Deployment

### Local Development
```bash
docker-compose up -d
# Access at http://localhost
```

### Production Server
```bash
# On your server
git clone https://github.com/YOUR_USERNAME/school-management-system.git
cd school-management-system
docker-compose up -d
```

---

## 📋 Pre-Deployment Checklist

- [ ] Create MongoDB Atlas database
- [ ] Set environment variables
- [ ] Update production API URL
- [ ] Test all features
- [ ] Check CORS settings

---

## 🔧 Environment Variables

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-management
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.onrender.com/api'
};
```

---

## 🌐 Access URLs

After deployment:
- **Frontend**: `https://your-app-name.onrender.com`
- **Backend API**: `https://your-api-name.onrender.com/api`
- **MongoDB**: MongoDB Atlas dashboard

---

## 🛠️ Troubleshooting

### Common Issues
1. **CORS Errors**: Update `CORS_ORIGIN` in backend
2. **Database Connection**: Check MongoDB URI
3. **Build Failures**: Verify Node.js version compatibility
4. **404 Errors**: Ensure API routes are correct

### Commands
```bash
# Check logs (Render)
# Go to Dashboard → Logs

# Docker logs
docker-compose logs -f

# Restart services
docker-compose restart
```

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.mongodb.com/atlas
- **Docker**: https://docs.docker.com

---

**🎉 Your School Management System is ready for production!**
