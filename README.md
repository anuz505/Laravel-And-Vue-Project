# Todo Application - Laravel + Vue.js with Docker

A full-stack todo application built with Laravel backend API and Vue.js frontend, fully containerized using Docker and Docker Compose. This project demonstrates DevOps best practices including multi-container orchestration, load balancing, and service isolation.

## 📋 Task Description

1. **Setup a Laravel application with Nginx and MySQL using Docker Compose**

    - Configure Laravel API backend
    - Setup MySQL database
    - Configure Nginx as reverse proxy with load balancing
    - Implement multiple PHP-FPM instances for high availability

2. **Setup a Vue.js application and deploy using Docker**
    - Build modern Vue.js frontend with Tailwind CSS
    - Configure Vite development server
    - Containerize the frontend application

## 🚀 Technologies Used

### Backend

-   **Laravel 11** - PHP web framework
-   **MySQL 8.0** - Relational database
-   **Nginx** - Web server and reverse proxy with load balancing
-   **PHP-FPM 8.2** - FastCGI Process Manager (2 instances) and can be scaled for more.

### Frontend

-   **Vue.js 3** - Progressive JavaScript framework
-   **Vite** - Next-generation frontend tooling
-   **Tailwind CSS** - Utility-first CSS framework
-   **Axios** - HTTP client for API calls

### DevOps

-   **Docker** - Containerization platform
-   **Docker Compose** - Multi-container orchestration
-   **Git** - Version control

## 📁 Project Structure

```
todo-api/
├── app/                          # Laravel application code
│   ├── Http/
│   │   └── Controllers/
│   │       └── TodoController.php   # API endpoints for todos
│   └── Models/
│       ├── Todo.php              # Todo model
│       └── User.php              # User model
├── client/                       # Vue.js frontend application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css          # Tailwind CSS styles
│   │   ├── components/
│   │   │   └── TodoList.vue      # Main todo component
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.vue               # Root component
│   │   └── main.js               # Vue app entry point
│   ├── Dockerfile                # Frontend Docker configuration
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Tailwind configuration
│   └── vite.config.js            # Vite configuration
├── config/                       # Laravel configuration files
│   ├── app.php
│   ├── cors.php                  # CORS configuration
│   └── database.php              # Database configuration
├── database/
│   └── migrations/
│       └── 2026_01_08_150831_create_todos_table.php
├── docker/
│   └── nginx.conf                # Nginx configuration with load balancing
├── routes/
│   └── api.php                   # API routes
├── docker-compose.yml            # Multi-container orchestration
├── Dockerfile                    # Backend Docker configuration
└── README.md                     # This file
```

## 🏗️ Architecture

The application uses a **microservices architecture** with the following containers:

1. **php1 & php2** - Two PHP-FPM instances for load balancing
2. **nginx** - Reverse proxy and load balancer (port 8000)
3. **db** - MySQL database server (port 3307)
4. **frontend** - Vue.js development server (port 5173)

All services communicate through a custom Docker network `todo-network`.

## 🛠️ Setup Instructions

### Prerequisites

-   Docker Desktop (Windows/Mac) or Docker Engine (Linux)
-   Docker Compose V2
-   Git

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd todo-api
    ```

2. **Start all services with Docker Compose**

    ```bash
    docker-compose up -d
    ```

    This command will:

    - Build all Docker images
    - Create and start all containers
    - Setup the MySQL database
    - Run Laravel migrations automatically
    - Start the frontend development server

3. **Verify all containers are running**

    ```bash
    docker-compose ps
    ```

    You should see 5 containers running:

    - `todo-api-php1`
    - `todo-api-php2`
    - `todo-api-nginx`
    - `todo-api-db`
    - `frontend`

4. **Access the application**
    - **Frontend**: http://localhost:5173
    - **Backend API**: http://localhost:8000/api
    - **Health Check**: http://localhost:8000

## 📡 API Endpoints

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/todos`             | Get all todos                 |
| POST   | `/api/todos`             | Create a new todo             |
| GET    | `/api/todos/{id}`        | Get a specific todo           |
| PUT    | `/api/todos/{id}`        | Update a todo                 |
| PATCH  | `/api/todos/{id}/toggle` | Toggle todo completion status |
| DELETE | `/api/todos/{id}`        | Delete a todo                 |

### Example API Request

```bash
# Create a todo
curl -X POST http://localhost:8000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "description": "Master containerization", "is_completed": false}'

# Get all todos
curl http://localhost:8000/api/todos
```

## 🎨 Features

### Backend Features

-   RESTful API architecture
-   Database migrations
-   CORS configuration for frontend communication
-   Load balanced across 2 PHP-FPM instances
-   Automatic migration on container startup

### Frontend Features

-   Modern black & white brutalist design
-   Real-time todo management (Create, Read, Update, Delete)
-   Task completion tracking
-   Statistics dashboard (Total, Done, Pending)
-   Responsive design for mobile and desktop
-   Form validation
-   Error handling and loading states

## 🐳 Docker Configuration Details

### Nginx Load Balancing

The Nginx configuration (`docker/nginx.conf`) implements **round-robin load balancing** between two PHP-FPM containers:

```nginx
upstream php-fpm {
    server php1:9000;
    server php2:9000;
}
```

### Volume Mounting

-   Backend code mounted at `/var/www` for hot-reloading
-   Frontend code mounted at `/app` with node_modules persistence
-   MySQL data persisted in `dbdata` volume

## 🔧 Troubleshooting

### Stop all containers

```bash
docker-compose down
```

### Rebuild containers after code changes

```bash
docker-compose up -d --build
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Access container shell

```bash
# Backend
docker exec -it todo-api-php1 sh

# Frontend
docker exec -it frontend sh

# Database
docker exec -it todo-api-db mysql -u root -p
```

### Reset database

```bash
docker-compose down -v
docker-compose up -d
```

## 🚦 Testing the Application

1. Open http://localhost:5173 in your browser
2. Add a new todo task using the form
3. Click the checkbox to mark tasks as complete
4. Edit tasks using the edit button (appears on hover)
5. Delete tasks using the delete button
6. View statistics in the dashboard (Total, Done, Pending)

## 📝 Development Workflow

### Adding New Features

1. **Backend**: Add routes in `routes/api.php` and controllers in `app/Http/Controllers/`
2. **Frontend**: Create components in `client/src/components/` and update services in `client/src/services/`
3. **Database**: Create migrations using `docker exec -it todo-api-php1 php artisan make:migration`

### Environment Variables

Backend environment variables are configured in `.env` file:

-   `DB_HOST=db`
-   `DB_PORT=3306`
-   `DB_DATABASE=todo_db`
-   `DB_USERNAME=todo_user`
-   `DB_PASSWORD=secret`
