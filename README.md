# School Management System

A comprehensive MEAN Stack-based school management system with role-based access control (RBAC) and basic CRUD functionalities.

## Features

### Admin Features
- ✅ Add & manage teachers, students, subjects, and grades
- ✅ Assign grades to teachers & students
- ✅ Full system access and oversight

### Teacher Features
- ✅ Assign marks to students for various subjects
- ✅ View assigned students & their grades
- ✅ Manage subject-specific data

### Student Features
- ✅ View their grades & marks
- ✅ Only see marks related to enrolled subjects
- ✅ Track academic progress

## Technology Stack

### Backend (Node.js + Express.js)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - Schema modeling and relationships
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend (Angular)
- **Angular 16** - Frontend framework
- **Angular Material** - UI components
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing
- **Angular Forms** - Form handling

## Project Structure

```
school-management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── Grade.js
│   │   └── Mark.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── subjects.js
│   │   ├── grades.js
│   │   └── marks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/app/
    │   ├── auth/
    │   ├── admin/
    │   ├── teacher/
    │   ├── student/
    │   ├── services/
    │   ├── guards/
    │   └── ...
    ├── package.json
    └── angular.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally)
- Angular CLI

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
npm start
```

The frontend will run on `http://localhost:4200`

## Default Users

After starting the application, you can create users with the following roles:

1. **Admin** - Full system access
2. **Teacher** - Can manage students and marks
3. **Student** - Can view their own grades

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject (Admin only)
- `PUT /api/subjects/:id` - Update subject (Admin only)
- `DELETE /api/subjects/:id` - Delete subject (Admin only)

### Grades
- `GET /api/grades` - Get all grades
- `POST /api/grades` - Create grade (Admin only)
- `PUT /api/grades/:id` - Update grade (Admin only)
- `DELETE /api/grades/:id` - Delete grade (Admin only)

### Marks
- `GET /api/marks` - Get marks (based on user role)
- `POST /api/marks` - Create mark (Admin/Teacher only)
- `PUT /api/marks/:id` - Update mark (Admin/Teacher only)
- `DELETE /api/marks/:id` - Delete mark (Admin/Teacher only)

## Role-Based Access Control (RBAC)

The system implements role-based access control with the following roles:

- **Admin**: Full access to all features and data
- **Teacher**: Access to assigned students and mark management
- **Student**: Access to personal grades and marks only

## Database Schema

### User
- name, email, password, role
- assignedSubjects, assignedGrades, enrolledGrade

### Subject
- name, description, assignedTeacher, grades

### Grade
- name, description, assignedTeacher, students, subjects

### Mark
- student, subject, grade, marks, term, assignedBy

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables
2. Deploy to your preferred platform
3. Ensure MongoDB is accessible

### Frontend Deployment (Vercel/Netlify)
1. Build the application:
```bash
ng build --configuration production
```
2. Deploy the `dist/` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For any issues or questions, please contact the development team.
