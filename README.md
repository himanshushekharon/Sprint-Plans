# 🚀 Sprint Plans

**Sprint Plans** is a modern, state-of-the-art project management and team collaboration platform. It offers a sleek, intuitive interface for teams to visually track progress, assign tasks, and organize sprints effectively. Equipped with real-time data visualization, responsive glassmorphism design, and robust secure authentication, it acts as a central hub to optimize team productivity and workflow velocity.

## 🌟 Live Demo
* **Frontend Application:** [https://sprint-plans.vercel.app](https://sprint-plans.vercel.app)
* **Backend API Location:** [https://sprint-plans-backend.onrender.com/api](https://sprint-plans-backend.onrender.com/api)

## ✨ Key Features

*   **🔒 Secure Authentication:** Robust, multi-provider user login and registration powered by **Clerk** (Google, GitHub, and Email) across the entire stack.
*   **📊 Dynamic Flow Dashboard:** A premium, interactive dashboard with real-time data visualization (Sprint Velocity, Task Distribution, and Project Health).
*   **🌓 Adaptive Theme Engine:** Seamless Light and Dark mode toggling with glassmorphism UI effects that adapt instantly.
*   **📂 Project & Task Management:** Create projects, assign tasks to team members, set priorities, and track progress deadlines securely stored in MongoDB.
*   **🛡️ Profile & Security Settings:** Fully integrated with Clerk's native `<UserProfile />` settings page for bank-grade account management.
*   **✨ Immersive UI/UX:** Built with sleek micro-animations, glowing hover effects, and responsive mobile-first layouts using **Framer Motion**.

## 🛠️ Technology Stack

**Frontend (Client)**
*   **[React 19](https://reactjs.org/)** (via **Vite**) - Component-based UI formulation
*   **[Framer Motion](https://www.framer.com/motion/)** - High-performance scroll and layout animations
*   **[Clerk](https://clerk.com/)** (`@clerk/clerk-react`) - Seamless social and email authentication
*   **[Lucide React](https://lucide.dev/)** - Beautiful, consistent SVG iconography
*   **Axios** - Promise-based HTTP client for API requests
*   **OGL & Vanilla CSS** - Custom WebGL particles and advanced styling without bulky frameworks
*   **Deployed on:** Vercel

**Backend (Server)**
*   **[Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)** - Fast and minimalist web framework
*   **[MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)** - Hosted on MongoDB Atlas for cloud database schema management
*   **[Clerk SDK](https://clerk.com/)** (`@clerk/backend`) - Enterprise-grade backend token verification
*   **CORS & Dotenv** - Cross-origin resource sharing and environment configurations
*   **Deployed on:** Render

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
*   Node.js installed on your local machine.
*   A **MongoDB Atlas URI** connection string.
*   A **Clerk** account for Authentication API keys.

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
   *Create a `.env` file in the Backend folder with:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   CLERK_SECRET_KEY=sk_test_...
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
   *Create a `.env.local` file in the Frontend folder with:*
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   VITE_API_URL=http://localhost:5000/api
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
