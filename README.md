🎟️ Event Ticketing Platform

A full-stack Event Ticketing Platform built with React, Node.js, Express, and MongoDB, enabling users to discover events, book tickets securely, and organizers to manage events, attendees, and sales analytics.

This project demonstrates real-world production concepts such as authentication, role-based access control, payment integration, cloud image uploads, and secure backend APIs.

🚀 Features
👤 User (Attendee)

Browse upcoming events

Search events by keyword

View event details

Book tickets securely

Razorpay payment integration (Test Mode)

View purchased tickets with QR codes

🧑‍💼 Organizer

Organizer dashboard

Create, edit, and delete events

Upload event banners (Cloudinary)

Manage ticket types & inventory

View event attendees

Sales analytics (total sales & ticket breakdown)

Protected organizer-only routes

🔐 Security & Auth

JWT-based authentication

Role-based authorization (attendee / organizer)

Secure password handling

Environment variable–based secrets

Backend validation for all critical inputs

🛠 Tech Stack
Frontend

React

React Router

Axios

Chart.js

Razorpay Checkout (Test Mode)

Backend

Node.js

Express.js

MongoDB & Mongoose

JWT Authentication

Razorpay API

Cloudinary (image uploads)

Multer

Express Async Handler

📂 Project Structure
event-ticketing-platform/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── .env (ignored)
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env (ignored)
│
└── README.md


▶️ How to Run the Project Locally
1️⃣ Clone the Repository
git clone https://github.com/Yash19Singhal/event-ticketing-platform.git
cd event-ticketing-platform

2️⃣ Start the Backend
cd backend
npm install
npm run server


Backend runs on:

http://localhost:5000

3️⃣ Start the Frontend

Open a new terminal:

cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3000

🌍 Deployment Ready

Environment-based configuration

Secure API key handling

Can be deployed on:

Frontend: Vercel / Netlify

Backend: Render / Railway / AWS / Heroku

Database: MongoDB Atlas


👨‍💻 Author

Yash Singhal
Full-Stack Developer
GitHub: @Yash19Singhal
