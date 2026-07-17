// src/main/java/com/taskbridge/project/controller/ProjectController.java
package com.taskbridge.project.controller;

import com.taskbridge.project.model.Project;
import com.taskbridge.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }
    
    @PostMapping
    @PostMapping
public ResponseEntity<Project> createProject(@Valid @RequestBody Project project,
                                              @RequestHeader("X-User-Id") Long userId,
                                              @RequestHeader(value = "X-Forwarded-For", required = false) String ipAddress) {
        Project created = projectService.createProject(project, userId, ipAddress);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PatchMapping("/{projectId}/status")
    public ResponseEntity<Project> updateStatus(@PathVariable Long projectId,
                                                 @RequestParam String status,
                                                 @RequestHeader("X-User-Id") Long userId,
                                                 @RequestHeader("X-Forwarded-For") String ipAddress) {
        Project updated = projectService.updateProjectStatus(projectId, status, userId, ipAddress);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId,
                                               @RequestHeader("X-User-Id") Long userId,
                                               @RequestHeader("X-Forwarded-For") String ipAddress) {
        projectService.deleteProject(projectId, userId, ipAddress);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/team/{organisationId}")
    public ResponseEntity<List<Project>> getTeamProjects(@PathVariable Long organisationId,
                                                          @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(projectService.getProjectsByTeam(organisationId, userId));
    }
}
