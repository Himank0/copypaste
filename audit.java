// src/main/java/com/taskbridge/audit/model/AuditLog.java
package com.taskbridge.audit.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String eventType;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private Long entityId;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Long organisationId;
    
    @Column(columnDefinition = "TEXT")
    private String previousState;
    
    @Column(columnDefinition = "TEXT")
    private String newState;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    private String ipAddress;
    
    public AuditLog() {}
    
    public AuditLog(String eventType, String entityType, Long entityId, 
                    Long userId, Long organisationId, String previousState, 
                    String newState, String ipAddress) {
        this.eventType = eventType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.userId = userId;
        this.organisationId = organisationId;
        this.previousState = previousState;
        this.newState = newState;
        this.ipAddress = ipAddress;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getOrganisationId() { return organisationId; }
    public void setOrganisationId(Long organisationId) { this.organisationId = organisationId; }
    public String getPreviousState() { return previousState; }
    public void setPreviousState(String previousState) { this.previousState = previousState; }
    public String getNewState() { return newState; }
    public void setNewState(String newState) { this.newState = newState; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
// src/main/java/com/taskbridge/audit/repository/AuditRepository.java
package com.taskbridge.audit.repository;

import com.taskbridge.audit.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityIdAndOrganisationId(Long entityId, Long organisationId);
    
    @Query("SELECT a FROM AuditLog a WHERE a.entityId = :entityId AND a.organisationId = :orgId " +
           "AND a.timestamp BETWEEN :from AND :to")
    List<AuditLog> findByEntityIdAndOrganisationIdAndDateRange(
            @Param("entityId") Long entityId,
            @Param("orgId") Long organisationId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);
    
    @Query("SELECT a FROM AuditLog a WHERE a.entityId = :entityId AND a.organisationId = :orgId " +
           "AND a.eventType = :eventType")
    List<AuditLog> findByEntityIdAndOrganisationIdAndEventType(
            @Param("entityId") Long entityId,
            @Param("orgId") Long organisationId,
            @Param("eventType") String eventType);
}

// src/main/java/com/taskbridge/audit/service/AuditService.java
package com.taskbridge.audit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskbridge.audit.model.AuditLog;
import com.taskbridge.audit.repository.AuditRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditService {
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    private final AuditRepository auditRepository;
    private final ObjectMapper objectMapper;
    
    public AuditService(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
        this.objectMapper = new ObjectMapper();
    }
    
    @Transactional
    public void recordAudit(String eventType, String entityType, Long entityId, 
                            Long userId, Long organisationId, Object previousState, 
                            Object newState, String ipAddress) {
        try {
            String prevJson = previousState != null ? objectMapper.writeValueAsString(previousState) : null;
            String newJson = newState != null ? objectMapper.writeValueAsString(newState) : null;
            
            AuditLog auditLog = new AuditLog(
                eventType, entityType, entityId, userId, organisationId,
                prevJson, newJson, ipAddress
            );
            
            auditRepository.save(auditLog);
            logger.info("Audit recorded: {} for entity: {}", eventType, entityId);
        } catch (Exception e) {
            logger.error("Failed to record audit: {}", e.getMessage());
            throw new RuntimeException("Audit recording failed", e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<AuditLog> getAuditHistory(Long projectId, Long organisationId, 
                                          LocalDateTime from, LocalDateTime to, 
                                          String eventType) {
        if (from != null && to != null) {
            return auditRepository.findByEntityIdAndOrganisationIdAndDateRange(
                projectId, organisationId, from, to);
        } else if (eventType != null && !eventType.isEmpty()) {
            return auditRepository.findByEntityIdAndOrganisationIdAndEventType(
                projectId, organisationId, eventType);
        } else {
            return auditRepository.findByEntityIdAndOrganisationId(projectId, organisationId);
        }
    }
}

// src/main/java/com/taskbridge/notification/service/NotificationService.java
package com.taskbridge.notification.service;

import com.taskbridge.notification.model.Notification;
import com.taskbridge.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationRepository notificationRepository;
    
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    
    @Transactional
    public void createNotification(Long organisationId, String eventType, 
                                   Long projectId, String message) {
        // In real app, get all team members from org
        // For demo, create for user 1 (assuming team has multiple users)
        Long[] teamMembers = {1L, 2L, 3L}; // Example team members
        
        for (Long userId : teamMembers) {
            Notification notification = new Notification(
                userId, organisationId, eventType, projectId, message
            );
            notificationRepository.save(notification);
        }
        
        logger.info("Notifications created for {} team members", teamMembers.length);
    }
    
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }
    
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new SecurityException("Cannot mark another user's notification");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
        logger.info("Notification marked as read: {}", notificationId);
    }
}

// src/main/java/com/taskbridge/audit/controller/AuditController.java
package com.taskbridge.audit.controller;

import com.taskbridge.audit.model.AuditLog;
import com.taskbridge.audit.service.AuditService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {
    private final AuditService auditService;
    
    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }
    
    @GetMapping("/{projectId}")
    public ResponseEntity<List<AuditLog>> getAuditHistory(
            @PathVariable Long projectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) String eventType,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Organisation-Id") Long organisationId) {
        
        List<AuditLog> history = auditService.getAuditHistory(projectId, organisationId, from, to, eventType);
        return ResponseEntity.ok(history);
    }
}

// src/main/java/com/taskbridge/notification/controller/NotificationController.java
package com.taskbridge.notification.controller;

import com.taskbridge.notification.model.Notification;
import com.taskbridge.notification.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnread(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id,
                                            @RequestHeader("X-User-Id") Long userId) {
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok().build();
    }
}
