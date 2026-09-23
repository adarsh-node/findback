# FindBack

> A modern Lost & Found platform that helps people report, discover, claim, and return lost belongings.

FindBack is a full-stack Lost & Found web application built to solve a real-world problem: helping people reconnect with belongings they have lost.

Users can browse reports publicly, create Lost or Found reports, upload images, search and filter items, submit claims, receive notifications, and complete a two-sided handover process.

---

## Features

- 🔐 User registration and login
- 🔒 JWT authentication with HttpOnly cookies
- 📋 Create Lost and Found reports
- 🖼️ Multiple image uploads with Cloudinary
- 🔎 Search and filter reports
- 📍 Store item locations using GeoJSON
- ✏️ Edit and delete active reports
- 🤝 Ownership claim workflow
- ✅ Claim approval and rejection
- 🔄 Two-sided handover confirmation
- 🔔 Claim and handover notifications
- 👤 User profile and personal reports
- 📱 Responsive interface
- ⚖️ Privacy Policy, Terms of Service and Community Guidelines
- 📩 Contact / Support page

### Claim & Handover Workflow

```text
Found Item
    ↓
Submit Claim + Identifying Message
    ↓
Report Owner Reviews
    ↓
Approve / Reject
    ↓
Owner Hands Over Item
    ↓
Claimant Confirms Receipt
    ↓
Returned
```

The item is marked as returned only after both sides confirm the handover.

---

## Screenshots

### Home / Browse Reports

![FindBack Home](screenshots/home.png)

### Create a Report

![Create Report](screenshots/create-report.png)

### Report Details — Lost Item

![Lost Report Details](screenshots/report-details-lost.png)

### Report Details — Found Item & Claim

![Found Report Claim](screenshots/report-details-claim.png)

### User Profile

![FindBack Profile](screenshots/profile.png)

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Redux Toolkit
- Lucide React

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- Mongoose
- Multer

### Database & Services

- MongoDB Atlas
- Cloudinary

### Tools

- Git & GitHub
- Postman
- Thunder Client

---

## Project Structure

```text
findback/
├── client/       # React frontend
├── server/       # Node.js + Express backend
├── screenshots/  # Project screenshots
├── package.json
└── README.md
```

---

## Upcoming Features

- 🔍 Lost report response workflow
- 📍 Advanced location-based search
- 🤖 Smart item matching
- 🖼️ AI-powered image matching
- 💬 Real-time communication
- 📧 Email notifications
- 📱 Mobile application

---

## Author

### Adarsh

B.Tech — Information Technology

- GitHub: https://github.com/adarsh-node
- LinkedIn: https://www.linkedin.com/in/adarsh-techie/
- Portfolio: https://adarsh-techie.vercel.app/

---

## Project Status

🚧 **FindBack is actively under development.**

More features and improvements are planned as the project evolves.