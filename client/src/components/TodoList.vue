<template>
    <div class="todo-app">
        <div class="container">
            <h1 class="app-title">📝 My Todo List</h1>

            <!-- Add Todo Form -->
            <div class="add-todo-section">
                <form @submit.prevent="handleAddTodo" class="todo-form">
                    <div class="form-group">
                        <input
                            v-model="newTodo.title"
                            type="text"
                            placeholder="What needs to be done?"
                            class="todo-input"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <textarea
                            v-model="newTodo.description"
                            placeholder="Description (optional)"
                            class="todo-textarea"
                            rows="2"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="loading"
                    >
                        {{ loading ? "Adding..." : "+ Add Todo" }}
                    </button>
                </form>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
                {{ error }}
            </div>

            <!-- Loading State -->
            <div v-if="loading && todos.length === 0" class="loading">
                Loading todos...
            </div>

            <!-- Todo List -->
            <div v-else class="todos-container">
                <div v-if="todos.length === 0" class="empty-state">
                    <p>No todos yet. Add one to get started! 🎯</p>
                </div>

                <div v-else class="todos-list">
                    <div
                        v-for="todo in todos"
                        :key="todo.id"
                        class="todo-item"
                        :class="{ completed: todo.is_completed }"
                    >
                        <div class="todo-content">
                            <input
                                type="checkbox"
                                :checked="todo.is_completed"
                                @change="handleToggleTodo(todo.id)"
                                class="todo-checkbox"
                            />
                            <div class="todo-details">
                                <h3 class="todo-title">{{ todo.title }}</h3>
                                <p
                                    v-if="todo.description"
                                    class="todo-description"
                                >
                                    {{ todo.description }}
                                </p>
                                <span class="todo-date">
                                    {{ formatDate(todo.created_at) }}
                                </span>
                            </div>
                        </div>
                        <div class="todo-actions">
                            <button
                                @click="startEdit(todo)"
                                class="btn btn-edit"
                                title="Edit"
                            >
                                ✏️
                            </button>
                            <button
                                @click="handleDeleteTodo(todo.id)"
                                class="btn btn-delete"
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div v-if="todos.length > 0" class="stats">
                    <span>Total: {{ todos.length }}</span>
                    <span>Completed: {{ completedCount }}</span>
                    <span>Pending: {{ pendingCount }}</span>
                </div>
            </div>

            <!-- Edit Modal -->
            <div
                v-if="editingTodo"
                class="modal-overlay"
                @click.self="cancelEdit"
            >
                <div class="modal">
                    <h2>Edit Todo</h2>
                    <form @submit.prevent="handleUpdateTodo" class="todo-form">
                        <div class="form-group">
                            <label>Title</label>
                            <input
                                v-model="editForm.title"
                                type="text"
                                class="todo-input"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea
                                v-model="editForm.description"
                                class="todo-textarea"
                                rows="3"
                            ></textarea>
                        </div>
                        <div class="modal-actions">
                            <button
                                type="button"
                                @click="cancelEdit"
                                class="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="btn btn-primary"
                                :disabled="loading"
                            >
                                {{ loading ? "Saving..." : "Save Changes" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

const todos = ref([]);
const loading = ref(false);
const error = ref(null);

const newTodo = ref({
    title: "",
    description: "",
});

const editingTodo = ref(null);
const editForm = ref({
    title: "",
    description: "",
});

// Computed properties
const completedCount = computed(() => {
    return todos.value.filter((todo) => todo.is_completed).length;
});

const pendingCount = computed(() => {
    return todos.value.filter((todo) => !todo.is_completed).length;
});

// Fetch todos
const fetchTodos = async () => {
    try {
        loading.value = true;
        error.value = null;
        const response = await api.getTodos();
        todos.value = response.data;
    } catch (err) {
        error.value = err.message || "Failed to fetch todos";
    } finally {
        loading.value = false;
    }
};

// Add todo
const handleAddTodo = async () => {
    if (!newTodo.value.title.trim()) return;

    try {
        loading.value = true;
        error.value = null;
        const response = await api.createTodo({
            title: newTodo.value.title,
            description: newTodo.value.description,
            is_completed: false,
        });
        todos.value.unshift(response.data);
        newTodo.value = { title: "", description: "" };
    } catch (err) {
        error.value = err.message || "Failed to add todo";
    } finally {
        loading.value = false;
    }
};

// Toggle todo
const handleToggleTodo = async (id) => {
    try {
        error.value = null;
        const response = await api.toggleTodo(id);
        const index = todos.value.findIndex((todo) => todo.id === id);
        if (index !== -1) {
            todos.value[index] = response.data;
        }
    } catch (err) {
        error.value = err.message || "Failed to toggle todo";
    }
};

// Delete todo
const handleDeleteTodo = async (id) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
        error.value = null;
        await api.deleteTodo(id);
        todos.value = todos.value.filter((todo) => todo.id !== id);
    } catch (err) {
        error.value = err.message || "Failed to delete todo";
    }
};

// Start editing
const startEdit = (todo) => {
    editingTodo.value = todo;
    editForm.value = {
        title: todo.title,
        description: todo.description || "",
    };
};

// Cancel edit
const cancelEdit = () => {
    editingTodo.value = null;
    editForm.value = { title: "", description: "" };
};

// Update todo
const handleUpdateTodo = async () => {
    if (!editForm.value.title.trim()) return;

    try {
        loading.value = true;
        error.value = null;
        const response = await api.updateTodo(editingTodo.value.id, {
            title: editForm.value.title,
            description: editForm.value.description,
        });
        const index = todos.value.findIndex(
            (todo) => todo.id === editingTodo.value.id
        );
        if (index !== -1) {
            todos.value[index] = response.data;
        }
        cancelEdit();
    } catch (err) {
        error.value = err.message || "Failed to update todo";
    } finally {
        loading.value = false;
    }
};

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Load todos on mount
onMounted(() => {
    fetchTodos();
});
</script>

<style scoped>
.todo-app {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.app-title {
    text-align: center;
    color: white;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.add-todo-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    margin-bottom: 2rem;
}

.todo-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: #333;
}

.todo-input,
.todo-textarea {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.3s;
}

.todo-input:focus,
.todo-textarea:focus {
    outline: none;
    border-color: #667eea;
}

.todo-textarea {
    resize: vertical;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #5a6268;
}

.btn-edit {
    background: transparent;
    padding: 0.5rem;
    font-size: 1.2rem;
}

.btn-edit:hover {
    transform: scale(1.1);
}

.btn-delete {
    background: transparent;
    padding: 0.5rem;
    font-size: 1.2rem;
}

.btn-delete:hover {
    transform: scale(1.1);
}

.error-message {
    background: #f44336;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
}

.loading {
    text-align: center;
    color: white;
    font-size: 1.2rem;
    padding: 2rem;
}

.todos-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;
}

.todos-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    transition: all 0.3s;
}

.todo-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
}

.todo-item.completed {
    opacity: 0.7;
    border-left-color: #28a745;
}

.todo-item.completed .todo-title {
    text-decoration: line-through;
    color: #6c757d;
}

.todo-content {
    display: flex;
    align-items: start;
    gap: 1rem;
    flex: 1;
}

.todo-checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-top: 0.25rem;
}

.todo-details {
    flex: 1;
}

.todo-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.5rem 0;
}

.todo-description {
    color: #666;
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
}

.todo-date {
    font-size: 0.8rem;
    color: #999;
}

.todo-actions {
    display: flex;
    gap: 0.5rem;
}

.stats {
    display: flex;
    justify-content: space-around;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid #e0e0e0;
    font-weight: 600;
    color: #666;
}

.stats span {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal h2 {
    margin: 0 0 1.5rem 0;
    color: #333;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

@media (max-width: 640px) {
    .app-title {
        font-size: 2rem;
    }

    .add-todo-section,
    .todos-container {
        padding: 1rem;
    }

    .todo-item {
        flex-direction: column;
        gap: 1rem;
    }

    .todo-actions {
        width: 100%;
        justify-content: flex-end;
    }

    .stats {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
