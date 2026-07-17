// src/main/java/com/taskbridge/notification/model/Notification.java
package com.taskbridge.notification.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Long organisationId;
    
    @Column(nullable = false)
    private String eventType;
    
    @Column(nullable = false)
    private Long projectId;
    
    @Column(nullable = false)
    private String message;
    
    @Column(nullable = false)
    private boolean read = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public Notification() {}
    
    public Notification(Long userId, Long organisationId, String eventType, 
                        Long projectId, String message) {
        this.userId = userId;
        this.organisationId = organisationId;
        this.eventType = eventType;
        this.projectId = projectId;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.read = false;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getOrganisationId() { return organisationId; }
    public void setOrganisationId(Long organisationId) { this.organisationId = organisationId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
