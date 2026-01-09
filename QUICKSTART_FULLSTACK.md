# Todo API - Quick Start Guide

Complete guide to run the Laravel backend and Vue.js frontend for the Todo application.

## Prerequisites

-   **PHP** 8.1 or higher
-   **Composer** 2.x
-   **Node.js** 20.x or 22.x
-   **MySQL/PostgreSQL** or SQLite
-   **Git**

## Project Overview

This is a full-stack Todo application with:

-   **Backend**: Laravel 11 REST API
-   **Frontend**: Vue 3 + Vite SPA
-   **Database**: MySQL/PostgreSQL/SQLite

## Quick Start

### 1. Backend Setup (Laravel)

#### Install Dependencies

```bash
composer install
```

#### Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

#### Configure Database

Edit `.env` file and set your database credentials:

**For MySQL/PostgreSQL:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todo_api
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**For SQLite (easier for development):**

```env
DB_CONNECTION=sqlite
# Comment out or remove other DB_ variables
```

If using SQLite, create the database file:

```bash
touch database/database.sqlite
```

#### Run Migrations

```bash
php artisan migrate
```

#### Configure CORS

Edit `config/cors.php` to allow your Vue app:

```php
'allowed_origins' => ['http://localhost:5173'],
```

Or in `.env`:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

#### Start Laravel Server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

**Test the API:**

```bash
curl http://localhost:8000/api/v1/todos
```

### 2. Frontend Setup (Vue.js)

#### Navigate to Client Directory

```bash
cd client
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment

The `.env` file is already created with:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Update if your Laravel server runs on a different port.

#### Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

## Running Both Servers

You'll need **two terminal windows**:

**Terminal 1 - Laravel Backend:**

```bash
# From project root
php artisan serve
```

**Terminal 2 - Vue Frontend:**

```bash
# From project root
cd client
npm run dev
```

Then open your browser to: `http://localhost:5173`

## Using Docker (Optional)

If you have Docker installed:

```bash
# Build and start containers
docker-compose up -d

# Run migrations
docker-compose exec app php artisan migrate

# Stop containers
docker-compose down
```

## API Endpoints

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| GET    | `/api/v1/todos`             | Get all todos     |
| POST   | `/api/v1/todos`             | Create a new todo |
| GET    | `/api/v1/todos/{id}`        | Get a single todo |
| PUT    | `/api/v1/todos/{id}`        | Update a todo     |
| DELETE | `/api/v1/todos/{id}`        | Delete a todo     |
| PATCH  | `/api/v1/todos/{id}/toggle` | Toggle completion |

## Testing the API with cURL

**Get all todos:**

```bash
curl http://localhost:8000/api/v1/todos
```

**Create a todo:**

```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"This is a test"}'
```

**Update a todo:**

```bash
curl -X PUT http://localhost:8000/api/v1/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Todo"}'
```

**Toggle completion:**

```bash
curl -X PATCH http://localhost:8000/api/v1/todos/1/toggle
```

**Delete a todo:**

```bash
curl -X DELETE http://localhost:8000/api/v1/todos/1
```

## Common Issues & Solutions

### CORS Errors

**Problem:** Frontend can't connect to backend
**Solution:**

1. Check `config/cors.php` has the correct allowed origins
2. Clear Laravel config cache: `php artisan config:clear`
3. Restart Laravel server

### Database Connection Error

**Problem:** Laravel can't connect to database
**Solution:**

1. Verify database credentials in `.env`
2. Ensure database exists
3. For SQLite, ensure `database/database.sqlite` file exists
4. Run: `php artisan config:clear`

### Port Already in Use

**Problem:** Port 8000 or 5173 is already taken
**Solution:**

```bash
# For Laravel, specify different port
php artisan serve --port=8001

# For Vite, it will auto-increment to 5174, or specify in vite.config.js
```

### Vue App Not Loading

**Problem:** Blank page or errors in console
**Solution:**

1. Check if backend is running: `curl http://localhost:8000/api/v1/todos`
2. Check browser console for errors
3. Verify `.env` file in client directory
4. Clear browser cache

## Production Deployment

### Backend (Laravel)

```bash
# Install dependencies (production only)
composer install --optimize-autoloader --no-dev

# Configure environment
cp .env.example .env
# Edit .env with production settings

# Generate key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend (Vue)

```bash
cd client

# Build for production
npm run build

# The dist/ folder contains production files
# Deploy dist/ folder to your web server
```

## Project Structure

```
todo-api/
├── app/
│   ├── Http/Controllers/
│   │   └── TodoController.php
│   └── Models/
│       └── Todo.php
├── client/                    # Vue.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── TodoList.vue
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.vue
│   └── package.json
├── database/
│   └── migrations/
│       └── create_todos_table.php
├── routes/
│   └── api.php
└── .env
```

## Next Steps

1. ✅ Start Laravel backend
2. ✅ Run migrations
3. ✅ Start Vue frontend
4. ✅ Open browser to `http://localhost:5173`
5. 🎉 Start creating todos!

## Additional Resources

-   [Laravel Documentation](https://laravel.com/docs)
-   [Vue.js Documentation](https://vuejs.org)
-   [Vite Documentation](https://vitejs.dev)

## Support

If you encounter any issues:

1. Check this guide's troubleshooting section
2. Review Laravel logs: `storage/logs/laravel.log`
3. Check browser console for frontend errors
4. Verify both servers are running

Happy coding! 🚀
