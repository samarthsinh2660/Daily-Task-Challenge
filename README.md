# Daily Task Challenge

A web application designed to help two users (Samarth and Krishika) stay on track with their daily tasks. The app also includes a "pool money" feature where the user who completes at least 50% of their tasks (while the other completes 0%) is declared the winner. The winner functionality can be reset manually.

## Features

- **Task Management:**  
  - Add new tasks with a radio selection for the user (Samarth or Krishika).  
  - Toggle task completion and delete tasks.
  - Tasks automatically expire 24 hours after creation.

- **Pool Money Management:**  
  - Increase or decrease the pool money with the provided buttons.
  
- **Winner Calculation:**  
  - Checks if one user has completed ≥50% of their tasks while the other has completed 0% of theirs.
  - Displays the winner.
  - Provides a "Reset Winner" button to clear all tasks and reset the winner functionality.

## Technologies Used

- **Backend:**  
  - Node.js  
  - Express  
  - CORS  
  - dotenv

- **Frontend:**  
  - React  
  - Vite  
  - CSS (Dark Theme)

## Folder Structure

```
/YourProject
├── /Backend
│   ├── node_modules/
│   ├── package.json
│   ├── .env          # Contains PORT and FRONTEND_URL variables
│   └── server.js
└── /Frontend
    ├── node_modules/
    ├── package.json
    ├── .env          # Contains VITE_BACKEND_URL variable
    ├── public/
    ├── src/
    │   └── App.jsx
    ├── App.css
    └── vite.config.js
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) installed on your system.
- npm or yarn package manager.

### Setup Instructions

#### Backend

1. Navigate to the **Backend** folder:
   ```bash
   cd Backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the **Backend** folder with the following content:
   ```dotenv
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   or use nodemon:
   ```bash
   nodemon server.js
   ```

#### Frontend

1. Navigate to the **Frontend** folder:
   ```bash
   cd Frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the **Frontend** folder with the following content:
   ```dotenv
   VITE_BACKEND_URL=http://localhost:3000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to [http://localhost:5173](http://localhost:5173) to view the app.

## Usage

- **Adding Tasks:**  
  Enter a task title, select a user (user1 or user2), and click "Add Task."

- **Task Actions:**  
  Mark tasks as complete/undo, or delete them.

- **Pool Money:**  
  Use the “+” and “–” buttons to increase or decrease the pool money.

- **Winner Functionality:**  
  Click "Check Winner" to see if a winner is declared based on the defined criteria.  
  Click "Reset Winner" to clear all tasks and reset the winner calculation.

## License

This project is licensed under the [MIT License](LICENSE).

```

--
