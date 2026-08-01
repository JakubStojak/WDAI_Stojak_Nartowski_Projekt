# ecommerce_website_project

A web application project developed for the **Introduction to Web Applications** course at **AGH University of Science and Technology**.

**Authors:** Jakub Stojak, Adam Nartowski

---

## Tech Stack & Libraries

### **Frontend**
* **[React](https://react.dev/)** – UI library.
* **[TypeScript](https://www.typescriptlang.org/)** – Static typing for robust code.
* **[Material UI (MUI)](https://mui.com/)** – Component library for professional design.
* **React Router** – Client-side navigation management.
* **Axios** – HTTP client for API communication.

### **Backend**
* **Node.js & Express** – Server-side environment and framework.
* **SQLite3** – Lightweight, file-based relational database.
* **Sequelize** – ORM (Object-Relational Mapping) for database management.
* **Security & Authentication:**
    * **bcrypt** – Industry-standard password hashing.
    * **JWT (JSON Web Token)** – Secure access and refresh token handling.
    * **cookie-parser** – Middleware for managing tokens in cookies.
    * **CORS** – Cross-Origin Resource Sharing configuration.

**Data Source:** Product information is integrated from the external [DummyJSON API](https://dummyjson.com/products).

---

## Setup and Installation

To run the project locally, follow the steps below.

### 1. Clone and Install Dependencies
The project consists of two separate modules (Frontend and Backend) that require independent installation.

**Frontend:**
```bash
cd src/my-app
npm install


**Backend:**
In a new terminal (or from the root directory):

```bash
cd server
npm install
```

### 2. Environment Variables Configuration (.env)

In the `server` directory, create a `.env` file and configure it as follows:

```text
PORT=3003
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### 3. Running the Application

Launch two terminal windows simultaneously:

**Terminal 1 (Frontend):**

```bash
cd src/my-app
npm start
```

**Terminal 2 (Backend):**

```bash
cd server
node server.js
```

---

# Features & Functionality

The application is a functional e-commerce platform. The home page features a "Product of the Month" section, which can be dynamically updated by an administrator.

The products section includes a list with filtering capabilities and category divisions. Users can add products to their cart in any quantity and access detailed product pages. These details display descriptions fetched from dummyjson.com alongside user reviews posted directly on the platform. Every registered user has the ability to submit a review, limited to one per account. Reviews display both a timestamp and a star rating.

Authentication consists of a straightforward email and password login system. There is a UI popup for password recovery, though it is currently non-functional (mockup). Users without an account can register, which securely creates a new user profile in the backend. The login system utilizes JWT (JSON Web Tokens) paired with refresh tokens for secure session management.

Once logged in, users can manage their shopping cart by adding, removing, adjusting quantities, or entirely clearing items. Upon checkout, orders are persisted in the database (similar to the reviews). Cart totals and quantities are calculated dynamically in real-time.

The user dashboard allows individuals to track their order history, manage their submitted reviews, and view accumulated loyalty points for previous orders. Users can also personalize their experience by setting a custom nickname, which the application uses for personalized greetings. Additionally, users with administrator privileges have access to specialized tools in the panel, such as removing reviews they deem inappropriate. The dashboard also includes a toggle for a Dark Theme mode.
