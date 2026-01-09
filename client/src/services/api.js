const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const config = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    // Get all todos
    async getTodos() {
        return this.request("/todos");
    }

    // Create a new todo
    async createTodo(todoData) {
        return this.request("/todos", {
            method: "POST",
            body: JSON.stringify(todoData),
        });
    }

    // Update a todo
    async updateTodo(id, todoData) {
        return this.request(`/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify(todoData),
        });
    }

    // Delete a todo
    async deleteTodo(id) {
        return this.request(`/todos/${id}`, {
            method: "DELETE",
        });
    }

    // Toggle todo completion
    async toggleTodo(id) {
        return this.request(`/todos/${id}/toggle`, {
            method: "PATCH",
        });
    }
}

export default new ApiService();
