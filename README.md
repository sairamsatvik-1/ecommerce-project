# 🛒 MyShop: Your Modern E-commerce Platform

## 🌟 Overview

MyShop is a dynamic and intuitive e-commerce website designed to provide users with a seamless and enjoyable online shopping experience. Built with a robust Node.js backend and a responsive frontend, it offers a wide range of features to browse, purchase, and manage products effortlessly.
project link:https://ecommerce-project-wago.onrender.com/
## 🎥 Demo

## ✨ Features

* **User Authentication:** Secure login and signup process with OTP verification for new registrations. User profiles to manage personal details.
* **Product Catalog:** Browse a diverse range of products categorized into sections like "Featured Products", "Top Deals", and "New Arrivals".
* **Advanced Search & Filtering:**
    * Powerful search bar for quick product discovery.
    * Category-based filtering (e.g., Electronics, Footwear, Kitchen, Books, Accessories, Fitness).
    * Sorting options by price (low to high, high to low) and name (A to Z, Z to A).
* **Shopping Cart Management:**
    * Add items to cart with visual confirmation.
    * View cart contents in a convenient sidebar panel.
    * Adjust product quantities, remove individual items, or clear the entire cart.
* **Product Reviews & Ratings:**
    * View average star ratings for products.
    * Ability to submit reviews and ratings for purchased products.
* **Secure Checkout:** Multi-step checkout process with shipping details input and secure payment gateway integration (Razorpay).
    * Order confirmation and downloadable invoice after successful payment.
* **Dynamic Banners:** Engaging carousel on the homepage to highlight promotions and new collections.
* **Responsive Design:** Optimized for a smooth experience across various devices.
* **(Planned) AI Chatbot Integration:** (You can mention this as a future feature or if you successfully deploy it later)
    * An AI-powered chatbot (built with Python FastAPI and LangChain) to provide instant answers to FAQs.

## 🛠️ Technologies Used

### Frontend
* **HTML5**
* **CSS3**
* **JavaScript (Vanilla JS)**
* **Font Awesome** (for icons)

### Backend
* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database for flexible data storage.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **`express-session` & `connect-mongo`:** For session management.
* **`bcrypt`:** For password hashing and security.
* **`body-parser`:** For parsing incoming request bodies.
* **`nodemailer`:** For sending emails (e.g., OTPs).

### Database
* **MongoDB Atlas:** Cloud-hosted MongoDB service.

### Payment Gateway
* **Razorpay:** For secure online transactions.

### Deployment
* **Render:** Cloud platform for hosting Node.js services.

## 💻 Setup Instructions (For Local Development)

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* Node.js (LTS version recommended)
* npm (comes with Node.js)
* MongoDB Atlas account (or a local MongoDB instance)
* Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sairamsatvik-1/ecommerce-project.git](https://github.com/sairamsatvik-1/ecommerce-project.git)
    cd ecommerce-project
    ```
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add the following (replace with your actual credentials):
    ```env
    MONGODB_URI=your_mongodb_atlas_connection_string
    SESSION_SECRET=a_long_random_string_for_session_secret
    EMAIL_USER=your_gmail_email@gmail.com # For Nodemailer (e.g., myshopatforyou@gmail.com)
    EMAIL_PASS=your_gmail_app_password # For Nodemailer (e.g., waoc crbz fyjt jugm)
    PORT=3000
    ```
    * _Note:_ For Gmail, you might need to generate an "App password" if 2-Factor Authentication is enabled.
4.  **Run the application:**
    ```bash
    npm start
    # Or, if your start script is defined as 'node serverf.js'
    # node serverf.js
    ```
    The application should now be running locally, typically at `http://localhost:3000`.

## 🚀 Deployment

The project is continuously deployed on Render.
* **Live Site:** [https://ecommerce-project-wago.onrender.com/](https://ecommerce-project-wago.onrender.com/)

## 🤝 Contributors

This project was developed by the following contributors:

* **G.Sathish**
* **K.Sairamsatvik**
* **K.Srikarsitaram**
* **K.Kalyanram**
* **M.Revanth**

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. (If you have a LICENSE file, otherwise remove this section).

## 📧 Contact

Sairam Satvik - [kanumurisairam0@gmail.com]

Project Link: [https://github.com/sairamsatvik-1/ecommerce-project.git](https://github.com/sairamsatvik-1/ecommerce-project.git)
