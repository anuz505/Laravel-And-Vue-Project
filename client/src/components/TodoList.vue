<template>
    <div class="min-h-screen bg-white text-black font-sans">
        <!-- Decorative Lines -->
        <div class="fixed top-0 left-0 w-full h-2 bg-black"></div>
        <div class="fixed bottom-0 left-0 w-full h-2 bg-black"></div>

        <div class="max-w-5xl mx-auto px-4 py-12 md:py-20">
            <!-- Header -->
            <div class="mb-16 relative">
                <div class="absolute -left-4 top-0 bottom-0 w-1 bg-black"></div>
                <h1
                    class="text-8xl md:text-9xl font-black tracking-tighter mb-2 relative"
                    style="text-shadow: 6px 6px 0px #000"
                >
                    TODO
                </h1>
                <p
                    class="text-gray-900 text-xs uppercase tracking-[0.3em] font-mono ml-1"
                >
                    {{ currentDate }}
                </p>
            </div>

            <!-- Add Todo Form -->
            <div
                class="mb-16 bg-black text-white p-8 md:p-10 relative overflow-hidden group"
            >
                <!-- Corner accents -->
                <div
                    class="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-white"
                ></div>
                <div
                    class="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-white"
                ></div>

                <form @submit.prevent="handleAddTodo">
                    <div class="space-y-5">
                        <input
                            v-model="newTodo.title"
                            type="text"
                            placeholder="WHAT NEEDS TO BE DONE?"
                            class="w-full px-6 py-5 text-xl font-bold bg-white text-black border-4 border-black focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all placeholder:text-gray-400 placeholder:font-normal"
                            required
                        />
                        <textarea
                            v-model="newTodo.description"
                            placeholder="Add details... (optional)"
                            class="w-full px-6 py-5 bg-white text-black border-4 border-black focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all resize-none placeholder:text-gray-400"
                            rows="3"
                        ></textarea>
                        <button
                            type="submit"
                            class="w-full py-5 bg-white text-black font-black text-lg border-4 border-white hover:bg-black hover:text-white hover:border-white active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                            :disabled="loading"
                        >
                            {{ loading ? "ADDING..." : "+ ADD TASK" }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Error Message -->
            <div
                v-if="error"
                class="mb-6 bg-black text-white px-6 py-4 border-4 border-black font-bold uppercase tracking-wide"
            >
                ⚠️ {{ error }}
            </div>

            <!-- Stats Bar -->
            <div
                v-if="todos.length > 0"
                class="mb-8 grid grid-cols-3 gap-4 text-sm font-mono"
            >
                <div
                    class="bg-white text-black px-6 py-6 text-center border-4 border-black relative overflow-hidden group hover:bg-black hover:text-white transition-all"
                >
                    <div class="text-4xl font-black mb-1">
                        {{ todos.length }}
                    </div>
                    <div class="text-xs uppercase tracking-[0.2em] font-bold">
                        TOTAL
                    </div>
                    <div
                        class="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-black border-r-transparent group-hover:border-t-white"
                    ></div>
                </div>
                <div
                    class="bg-black text-white px-6 py-6 text-center border-4 border-black relative overflow-hidden group hover:bg-white hover:text-black transition-all"
                >
                    <div class="text-4xl font-black mb-1">
                        {{ completedCount }}
                    </div>
                    <div class="text-xs uppercase tracking-[0.2em] font-bold">
                        DONE
                    </div>
                    <div
                        class="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-white border-r-transparent group-hover:border-t-black"
                    ></div>
                </div>
                <div
                    class="bg-white text-black px-6 py-6 text-center border-4 border-black relative overflow-hidden group hover:bg-black hover:text-white transition-all"
                >
                    <div class="text-4xl font-black mb-1">
                        {{ pendingCount }}
                    </div>
                    <div class="text-xs uppercase tracking-[0.2em] font-bold">
                        PENDING
                    </div>
                    <div
                        class="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-black border-r-transparent group-hover:border-t-white"
                    ></div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading && todos.length === 0" class="text-center py-20">
                <div
                    class="inline-block animate-spin h-16 w-16 border-8 border-black border-t-transparent"
                ></div>
                <p
                    class="mt-6 text-black font-mono font-bold uppercase tracking-wider"
                >
                    Loading tasks...
                </p>
            </div>

            <!-- Empty State -->
            <div
                v-else-if="todos.length === 0"
                class="text-center py-20 border-4 border-dashed border-black bg-white"
            >
                <div class="text-8xl mb-6">✏️</div>
                <p
                    class="text-black text-2xl font-black uppercase tracking-wider mb-2"
                >
                    No tasks yet
                </p>
                <p class="text-gray-700 text-sm font-mono">
                    Add your first task to get started
                </p>
            </div>

            <!-- Todo List -->
            <div v-else class="space-y-4">
                <div
                    v-for="todo in todos"
                    :key="todo.id"
                    class="group bg-white text-black border-4 border-black hover:translate-x-2 hover:translate-y-2 transition-all duration-200 relative"
                    :class="{ 'opacity-50': todo.is_completed }"
                    style="box-shadow: 8px 8px 0px #000"
                >
                    <div class="p-6 md:p-8">
                        <div class="flex items-start gap-5">
                            <!-- Checkbox -->
                            <button
                                @click="handleToggleTodo(todo.id)"
                                class="mt-1 flex-shrink-0 w-8 h-8 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all transform hover:rotate-12"
                                :class="
                                    todo.is_completed
                                        ? 'bg-black text-white'
                                        : 'bg-white'
                                "
                            >
                                <svg
                                    v-if="todo.is_completed"
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="4"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </button>

                            <!-- Content -->
                            <div class="flex-1 min-w-0">
                                <h3
                                    class="text-xl md:text-2xl font-black mb-2 uppercase tracking-tight"
                                    :class="
                                        todo.is_completed
                                            ? 'line-through text-gray-400'
                                            : ''
                                    "
                                >
                                    {{ todo.title }}
                                </h3>
                                <p
                                    v-if="todo.description"
                                    class="text-gray-700 text-sm mb-3 font-mono"
                                >
                                    {{ todo.description }}
                                </p>
                                <div
                                    class="text-xs text-gray-500 font-mono uppercase tracking-wider"
                                >
                                    {{ formatDate(todo.created_at) }}
                                </div>
                            </div>

                            <!-- Actions -->
                            <div
                                class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <button
                                    @click="startEdit(todo)"
                                    class="px-4 py-4 bg-white border-4 border-black hover:bg-black hover:text-white transition-all transform hover:-rotate-6"
                                    title="Edit"
                                >
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    @click="handleDeleteTodo(todo.id)"
                                    class="px-4 py-4 bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-all transform hover:rotate-6"
                                    title="Delete"
                                >
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- Decorative corner -->
                    <div
                        class="absolute -top-2 -right-2 w-6 h-6 bg-black"
                    ></div>
                </div>
            </div>

            <!-- Edit Modal -->
            <div
                v-if="editingTodo"
                class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4 z-50"
                @click.self="cancelEdit"
            >
                <div
                    class="bg-white text-black p-10 max-w-lg w-full border-8 border-black relative"
                    style="box-shadow: 16px 16px 0px rgba(255, 255, 255, 0.2)"
                >
                    <!-- Decorative corners -->
                    <div
                        class="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-black"
                    ></div>
                    <div
                        class="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-black"
                    ></div>

                    <h2
                        class="text-4xl font-black mb-8 uppercase tracking-tighter"
                    >
                        Edit Task
                    </h2>
                    <form @submit.prevent="handleUpdateTodo" class="space-y-6">
                        <div>
                            <label
                                class="block text-xs font-black mb-3 uppercase tracking-[0.2em]"
                                >Title</label
                            >
                            <input
                                v-model="editForm.title"
                                type="text"
                                class="w-full px-5 py-4 bg-white border-4 border-black focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all font-bold"
                                required
                            />
                        </div>
                        <div>
                            <label
                                class="block text-xs font-black mb-3 uppercase tracking-[0.2em]"
                                >Description</label
                            >
                            <textarea
                                v-model="editForm.description"
                                class="w-full px-5 py-4 bg-white border-4 border-black focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all resize-none font-mono"
                                rows="4"
                            ></textarea>
                        </div>
                        <div class="flex gap-4 pt-4">
                            <button
                                type="button"
                                @click="cancelEdit"
                                class="flex-1 py-4 bg-white text-black border-4 border-black hover:bg-black hover:text-white font-black uppercase tracking-wider transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                class="flex-1 py-4 bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                :disabled="loading"
                            >
                                {{ loading ? "SAVING..." : "SAVE" }}
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

const currentDate = computed(() => {
    const date = new Date();
    return date
        .toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        .toUpperCase();
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
