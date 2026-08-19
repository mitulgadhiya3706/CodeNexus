# CodeNexus

CodeNexus is a full-stack developer networking platform that helps developers connect with other developers based on their profiles, skills, and interests.

## Features

* User authentication and authorization
* Developer profile creation and editing
* Discover and connect with other developers
* Send, accept, and reject connection requests
* Connections management
* Real-time chat between connected users
* Premium membership with Silver and Gold plans
* Razorpay payment integration
* Responsive and modern user interface

## Tech Stack

### Frontend

* React.js
* React Router
* Redux Toolkit
* Tailwind CSS
* DaisyUI
* Axios
* Lucide React
* Lottie React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Socket.io

### Payment

* Razorpay

### Tools

* Git
* GitHub
* Postman

## Project Structure

```text
CodeNexus/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/
    ├── routes/
    ├── models/
    ├── middlewares/
    ├── utils/
    ├── config/
    └── app.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd CodeNexus
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the backend:

```env
PORT=7777
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create/update the frontend environment file:

```env
VITE_BASE_URL=http://localhost:7777
```

## Main Functionalities

### Authentication

Users can register, log in, and securely access protected features using JWT-based authentication.

### Developer Networking

Users can discover other developers, view their profiles, and send connection requests.

### Connection Management

Users can accept or reject received requests and manage their connections.

### Real-Time Chat

Connected users can communicate through real-time messaging powered by Socket.io.

### Premium Membership

CodeNexus provides Silver and Gold membership plans with additional features. Razorpay is integrated for payment processing.

## API

The backend provides REST APIs for:

* Authentication
* User profiles
* Connection requests
* Connections
* Chat
* Premium membership
* Payment processing

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## Author

**Mitul Gadhiya**

Live Demo: [https://code-nexus-web-ten.vercel.app/](https://code-nexus-web-ten.vercel.app/)
