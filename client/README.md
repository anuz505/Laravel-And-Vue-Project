# Todo List Application - Vue.js Frontend

A modern, responsive Todo List application built with Vue 3 and Vite, connected to a Laravel backend API.

## Features

✨ **Full CRUD Operations**

-   Create new todos with title and description
-   View all todos with completion status
-   Edit existing todos
-   Delete todos
-   Toggle completion status

🎨 **Modern UI**

-   Beautiful gradient design
-   Responsive layout (mobile-friendly)
-   Smooth animations and transitions
-   Visual feedback for actions
-   Todo statistics (total, completed, pending)

## Tech Stack

-   **Vue 3** - Progressive JavaScript framework
-   **Vite** - Next generation frontend tooling
-   **Composition API** - Modern Vue development
-   **Fetch API** - HTTP requests to Laravel backend

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

-   Chromium-based browsers (Chrome, Edge, Brave, etc.):
    -   [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
    -   [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
-   Firefox:
    -   [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
    -   [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── TodoList.vue      # Main todo list component
│   ├── services/
│   │   └── api.js            # API service for backend communication
│   ├── App.vue               # Root component
│   └── main.js               # Application entry point
├── .env                      # Environment variables
└── package.json              # Dependencies
```

## Setup Instructions

### Prerequisites

-   Node.js 20.x or 22.x
-   Laravel backend running on `http://localhost:8000`

### Installation

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

-   Copy `.env.example` to `.env` if needed
-   Update `VITE_API_URL` if your Laravel backend is on a different URL:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## API Endpoints Used

The Vue app connects to these Laravel API endpoints:

-   `GET /api/v1/todos` - Fetch all todos
-   `POST /api/v1/todos` - Create a new todo
-   `PUT /api/v1/todos/{id}` - Update a todo
-   `DELETE /api/v1/todos/{id}` - Delete a todo
-   `PATCH /api/v1/todos/{id}/toggle` - Toggle completion status

## Component Overview

### TodoList.vue

The main component that handles:

-   Displaying the todo list
-   Creating new todos via a form
-   Editing todos in a modal
-   Deleting todos with confirmation
-   Toggling completion status with checkboxes
-   Showing statistics (total, completed, pending)
-   Error handling and loading states

### API Service (api.js)

Centralized API service that:

-   Handles all HTTP requests
-   Manages request/response formatting
-   Provides error handling
-   Configures base URL from environment variables

## Usage

1. **Add a Todo**: Enter a title and optional description, then click "Add Todo"
2. **Complete a Todo**: Click the checkbox next to a todo
3. **Edit a Todo**: Click the edit (✏️) button to open the edit modal
4. **Delete a Todo**: Click the delete (🗑️) button and confirm

## CORS Configuration

Make sure your Laravel backend has CORS properly configured to allow requests from your Vue app. The backend should allow:

-   Origin: `http://localhost:5173` (or your Vue dev server URL)
-   Methods: GET, POST, PUT, PATCH, DELETE
-   Headers: Content-Type, Accept

## Troubleshooting

### Cannot connect to API

-   Ensure Laravel backend is running on `http://localhost:8000`
-   Check CORS configuration in Laravel
-   Verify `.env` file has correct `VITE_API_URL`

### Todos not loading

-   Check browser console for errors
-   Verify API endpoints are working (use Postman/curl)
-   Ensure database is migrated and seeded if needed

## Future Enhancements

-   [ ] Add filtering (all/active/completed)
-   [ ] Add sorting options
-   [ ] Add due dates
-   [ ] Add priority levels
-   [ ] Add categories/tags
-   [ ] Add search functionality
-   [ ] Add bulk actions
-   [ ] Add dark mode
