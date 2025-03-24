# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Calculator App Frontend

A modern, secure calculator application built with React, Vite, and Redux Toolkit. This application features two-factor authentication, calculation history, and a responsive design.

## Features

- 🔐 **Secure Authentication**

  - Firebase Authentication with ID tokens
  - Two-Factor Authentication (2FA) via email
  - Protected routes and secure API communication
  - Persistent authentication state with Redux

- 🧮 **Calculator Functionality**

  - Basic arithmetic operations (addition, subtraction, multiplication, division)
  - Real-time calculation display
  - Clear function for input reset
  - Input validation and error handling

- 📊 **Calculation History**

  - Save and view calculation history
  - Edit existing calculations with real-time validation
  - Delete unwanted calculations
  - Persistent storage with PostgreSQL backend
  - Automatic history loading on login

- 🎨 **User Interface**
  - Modern, responsive design with Tailwind CSS
  - Dark mode calculator display
  - User profile management
  - Loading states and error handling
  - Modal dialogs for editing calculations

## Tech Stack

- React 18
- Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Firebase Authentication
- Fetch API for HTTP requests
- React Router for navigation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project credentials
- Backend API URL

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd calculator-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
calculator-app/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── calculator/    # Calculator components
│   │   ├── login/        # Login components
│   │   ├── navbar/       # Navigation components
│   │   └── profile/      # User profile components
│   ├── redux/
│   │   └── slices/       # Redux state management
│   ├── utils/            # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Usage

1. **Authentication**

   - Sign up with email and password using Firebase
   - Enable 2FA in profile settings
   - Log in with email and 2FA code
   - Session persistence across page reloads

2. **Calculator**

   - Use the calculator interface for basic arithmetic
   - View calculation history in real-time
   - Edit or delete saved calculations
   - Clear input with the 'C' button

3. **Profile Management**
   - View and update user profile
   - Manage 2FA settings
   - View calculation history
   - Secure logout functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
