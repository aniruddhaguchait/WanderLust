# 🌍 WanderLust  
**A full-stack travel listings & review platform inspired by Airbnb**

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1.0-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![Mongoose](https://img.shields.io/badge/Mongoose-8.19.2-red?logo=mongoose)

![Passport.js](https://img.shields.io/badge/Passport.js-0.7.0-blue?logo=passport)
![Joi](https://img.shields.io/badge/Joi-18.0.1-purple)
![Express--Session](https://img.shields.io/badge/Express_Session-1.18.2-lightblue)
![EJS](https://img.shields.io/badge/EJS-3.1.10-orange)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap)

![License](https://img.shields.io/badge/License-ISC-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

> Discover places. Share experiences. Travel smarter.

WanderLust is a **full-stack web application** where users can explore travel listings, create stays, leave reviews, and manage accounts securely — built using **Node.js, Express, MongoDB, and EJS**.

This project focuses on **real-world backend architecture**, authentication, validation, and clean MVC structure rather than just basic CRUD functionality.

---

## 🚀 Live Demo
🔗 *Coming Soon*

---

## 🤔 What’s This About?

Most beginner projects stop once “CRUD works”.

**WanderLust** goes further by implementing:
- Authentication & sessions
- Flash messaging
- Nested routes
- Validation & error handling
- MVC architecture
- Server-side rendering

In short — **how real Express apps are built in production**.

---

## 🧩 The Problem We’re Solving

Travel platforms need to:
- Manage users securely
- Handle listings with prices & images
- Support reviews per listing
- Validate user input
- Fail gracefully when things break

WanderLust solves this using a **robust Express backend** and **EJS-based UI**, without unnecessary frontend complexity.

---

## ✨ Features

### 🔑 Authentication & Users
- User signup & login
- Password hashing with `passport-local-mongoose`
- Session-based authentication
- Flash success & error messages

### 🏠 Listings
- Create, read, update, delete listings
- Image-based listing cards
- Price formatting (₹ INR)
- RESTful routing

### ⭐ Reviews
- Add & delete reviews
- Reviews linked to listings
- Nested routes (`/listings/:id/reviews`)
- MongoDB population

### 🛡️ Validation & Error Handling
- Joi schema validation
- Custom `ExpressError` class
- Async error wrapper
- HTTP-only cookies
- Method override for PUT & DELETE

### 🎨 UI
- EJS templates with layouts (`ejs-mate`)
- Bootstrap 5 responsive design
- Reusable navbar & footer
- Clean flash alerts

---

## 🧠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Joi
- Express Session
- Connect Flash
- Method Override

### Frontend
- EJS
- Bootstrap 5
- Font Awesome

---

## 📁 Project Structure
WanderLust/
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   ├── users/
│   └── error.ejs
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── schema.js          # Joi validation schemas
├── app.js             # Main Express app
└── package.json


---

## 🔌 Core Routes

### Listings
- `GET /listings` – View all listings
- `GET /listings/new` – New listing form
- `POST /listings` – Create listing
- `GET /listings/:id` – Listing details
- `GET /listings/:id/edit` – Edit listing
- `PUT /listings/:id` – Update listing
- `DELETE /listings/:id` – Delete listing

### Reviews
- `POST /listings/:id/reviews`
- `DELETE /listings/:id/reviews/:reviewId`

### Users
- `GET /signup`
- `POST /signup`
- `GET /login`
- `POST /login`

---

## ⚙️ How It Works

1. MongoDB stores users, listings & reviews
2. Passport.js handles authentication
3. Sessions maintain login state
4. Joi validates incoming data
5. EJS renders server-side views
6. Flash messages provide feedback
7. Centralized error middleware handles failures

---

## 🧪 Challenges Faced

- Managing nested routes with `mergeParams`
- Handling async errors cleanly
- Structuring MVC in Express
- Session & authentication edge cases
- Validating deeply nested form data

---

## 🚧 What’s Next?

Planned improvements:
- 🔐 Authorization (owner-only edits)
- 🗺️ Map integration (Mapbox)
- ☁️ Image uploads (Cloudinary)
- ❤️ Wishlist / favorites
- 🌙 Dark mode
- 🚀 Deployment (Render / Railway)

---

## 🧑‍💻 Author

**Aniruddha Guchait**  
Full-Stack Web Developer (MERN)

Built as part of **Apna College – Sigma 8.0** learning journey.

---

## 📜 License

MIT License  
Feel free to use, modify, and learn from it.

---

## ☕ Acknowledgments

- Apna College
- MongoDB & Express documentation
- Passport.js docs
- And lots of coffee ☕
