<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Get all todos
    Route::get('/todos', [TodoController::class, 'index']);
    
    // Create new todo
    Route::post('/todos', [TodoController::class, 'store']);
    
    // Get single todo
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    
    // Update todo
    Route::put('/todos/{id}', [TodoController::class, 'update']);
    
    // Delete todo
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
    
    // Toggle todo completion
    Route::patch('/todos/{id}/toggle', [TodoController::class, 'toggleComplete']);
});
