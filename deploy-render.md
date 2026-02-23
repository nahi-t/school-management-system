# Render Deployment Guide

## Automatic Deployment with Render

### 1. Push to GitHub
```bash
# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/school-management-system.git

# Push to GitHub
git push -u origin master
```

### 2. Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. **Backend Settings:**
   - Name: `school-management-api`
   - Runtime: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-management
     JWT_SECRET=your-super-secure-jwt-secret-key-here
     CORS_ORIGIN=https://your-app-name.onrender.com
     ```

### 3. Deploy Frontend to Render

1. Click "New +" → "Static Site"
2. Select the same GitHub repository
3. **Frontend Settings:**
   - Name: `school-management-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist/school-management`
   - Environment Variables:
     ```
     API_URL=https://your-app-name.onrender.com/api
     ```

### 4. Update Frontend API URL

After deployment, update your frontend environment:
- Go to your frontend service on Render
- Note the URL (e.g., `https://school-management-frontend.onrender.com`)
- Update the API calls to use your backend URL

## Alternative: Docker Deployment

### For VPS/Dedicated Server

1. Install Docker on your server
2. Clone your repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/school-management-system.git
   cd school-management-system
   ```
3. Run with Docker:
   ```bash
   docker-compose up -d
   ```

### Environment Configuration

Create `.env` file in backend:
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-management
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=https://yourdomain.com
```
