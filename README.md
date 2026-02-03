## Event Ticketing Platform

A Full-Stack Event Management & Ticketing System with Secure Payments and QR-Based Ticket Validation

The Event Ticketing Platform is a complete, production-ready full-stack web application designed to simulate a real-world online ticketing system. It enables users to discover events, purchase tickets securely, and receive digital tickets, while empowering organizers to create events, manage ticket inventory, and monitor attendees through a dedicated dashboard.

This platform supports role-based access (Attendee & Organizer) and integrates modern web technologies to deliver a smooth and scalable experience.
This project demonstrates strong understanding of MERN stack development, RESTful APIs, authentication, payment integration, file uploads, and real-world feature design, making it an excellent portfolio-ready application.

## Key highlights of the platform include:

User Authentication & Authorization
Secure login and registration with role-based access control.

Event Creation & Management
Organizers can create events, upload event banners, define multiple ticket types, and update event details.

Online Ticket Booking
Attendees can browse events, select ticket quantities, and proceed to checkout seamlessly.

Secure Payments (Razorpay – Test Mode)
Integrated Razorpay payment gateway for handling online transactions safely.

QR Code–Based Tickets
Each successful ticket purchase generates a unique QR code, which can be used for entry verification at the event venue, mimicking real-world digital ticket validation systems.

Organizer Dashboard
View sold tickets, attendee details, and manage event operations efficiently.

Modern Tech Stack
Built using React (frontend), Node.js & Express (backend), and MongoDB (database), following clean architecture and best practices.



## Project Structure
```
event-ticketing-platform/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinaryConfig.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── eventController.js
│   │   ├── orderController.js
│   │   └── uploadController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── eventModel.js
│   │   ├── ticketModel.js
│   │   └── orderModel.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── orderRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.js
│   │   │   ├── EventForm.js
│   │   │   ├── OrganizerRoute.js
│   │   │   └── SearchBar.js
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── CreateEventPage.js
│   │   │   └── EventDetailsPage.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
└── README.md
```
## Installation (Local Setup)
Clone the Repository
```
git clone https://github.com/Yash19Singhal/event-ticketing-platform.git
cd event-ticketing-platform
```
Backend Setup
```
cd backend
npm install
npm run server
```


Backend runs on:
```
http://localhost:5000
```
Frontend Setup
```
cd frontend
npm install
npm start
```

Frontend runs on:
```
http://localhost:3000
```

## 👨‍💻 Author

Yash Singhal

GitHub: https://github.com/Yash19Singhal

## ⭐ Final Note

This project demonstrates real-world full-stack development skills, including backend architecture, frontend state management, authentication, and third-party integrations.
