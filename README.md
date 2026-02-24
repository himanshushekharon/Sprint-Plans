# 🚀 Sprint Plans

**Sprint Plans** is a state-of-the-art project management and team collaboration platform. Designed with a focus on modern aesthetics and smooth user experiences, it helps teams track progress, manage tasks, and optimize their workflow velocity.

## ✨ Key Features

*   **🔒 Secure Authentication:** Robust user login and registration powered by **JWT** (JSON Web Tokens) and **Bcrypt** password hashing.
*   **📊 Dynamic Flow Dashboard:** A premium, interactive dashboard with real-time data visualization (Sprint Velocity, Task Distribution, and Project Health).
*   **🌓 Adaptive Theme Engine:** Seamless Light and Dark mode toggling with glassmorphism UI effects that adapt instantly.
*   **📂 Project & Task Management:** Create projects, assign tasks to team members, set priorities, and track progress deadlines.
*   **🛡️ Profile & Security Settings:** Manage personal information, update avatars, and handle secure password resets.
*   **✨ Immersive UI/UX:** Built with sleek micro-animations, glowing hover effects, and responsive mobile-first layouts using **Framer Motion**.

## 🛠️ Technology Stack

**Frontend (Client)**
*   **[React.js](https://reactjs.org/)** (via Vite) - Component-based UI formulation
*   **[Framer Motion](https://www.framer.com/motion/)** - High-performance complex CSS animations
*   **[Lucide React](https://lucide.dev/)** - Beautiful, consistent iconography
*   **Vanilla CSS** - Custom variables and advanced styling (no bulky CSS frameworks)

**Backend (Server)**
*   **[Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)** - Fast and minimalist web framework
*   **[MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)** - Flexible NoSQL database schema management
*   **[JWT](https://jwt.io/) & [Bcryptjs](https://www.npmjs.com/package/bcryptjs)** - For secure cryptographic authentication protocols

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
*   Node.js installed on your local machine.
*   MongoDB running locally or a MongoDB Atlas URI.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/himanshushekharon/Sprint-Plans.git
   cd sprint-plans
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory and add your variables:*
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/sprintplans
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```
   *Start the backend server:*
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   # Open a new terminal tab
   cd Frontend
   npm install
   ```
   *Start the frontend development server:*
   ```bash
   npm run dev
   ```

4. **Open Application:** Navigate to `http://localhost:5173` in your browser.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/himanshushekharon/Sprint-Plans/issues).

## 📝 License

This project is licensed under the MIT License.
