package com.qskill.todo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    // Get all tasks
    @GetMapping
    public List<Task> getTasks() {
        return repository.findAll();
    }

    // Add task
    @PostMapping
    public Task addTask(@RequestBody Task task) {
        return repository.save(task);
    }

    // Update task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task newTask) {

        return repository.findById(id)
                .map(task -> {

                    task.setTitle(newTask.getTitle());
                    task.setDescription(newTask.getDescription());
                    task.setCompleted(newTask.isCompleted());

                    return ResponseEntity.ok(repository.save(task));

                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // Complete task
    @PutMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(
            @PathVariable Long id) {

        return repository.findById(id)
                .map(task -> {

                    task.setCompleted(true);

                    return ResponseEntity.ok(repository.save(task));

                })
                .orElse(ResponseEntity.notFound().build());
    }
}