# PROMPTS.md - Prompt Engineering Documentation

```markdown
# Prompt Engineering Documentation - GitHub Copilot Usage

## Overview
This document captures the complete prompt chain used to build the Notification & Audit Service and SPEC.md using GitHub Copilot. The prompts demonstrate strategic use of multiple Copilot features and prompting techniques to achieve production-quality code.

**Copilot Features Used:**
- ✅ Ask Mode (Chat)
- ✅ Edit Mode (Inline editing)
- ✅ Agent Mode (Multi-file generation)
- ✅ @workspace Context
- ✅ #file References
- ✅ /explain Command
- ✅ Inline Ghost Text Suggestions

**Prompting Techniques Demonstrated:**
- ✅ Role-Based Prompting
- ✅ Decomposition
- ✅ Specificity
- ✅ Constraint-Based
- ✅ Iterative Refinement
- ✅ Few-Shot Learning

---

## 1. Initial Setup & Planning Phase

### Prompt 1: Technical Specification Generation

**Exact Text:**
> *"Act as a senior software architect. Generate a technical specification for a Notification & Audit Service with the following requirements:*
> 
> *1. Audit logs must be immutable (no updates/deletes)*
> *2. Notifications go to all team members on project changes*
> *3. Audit history queryable by project ID with date range and event type filters*
> *4. Multi-tenant B2B SaaS architecture*
> *5. Include data models, API contracts, and integration points*
> 
> *Format as a professional SPEC.md document."*

**Copilot Feature:** Ask Mode (Chat)

**Prompting Technique:** Role-Based + Specificity

**Rationale:** 
- Role-based ("senior software architect") sets expert context
- Specific requirements prevent ambiguous output
- Clear deliverable format requested

**Copilot Output:** Generated comprehensive SPEC.md with data models, API endpoints, and integration patterns.

**Outcome:** ✅ Excellent - 80% usable. Required minor refinements for Java-specific syntax.

---

### Prompt 2: @workspace Context for Architecture Validation

**Exact Text:**
> *"@workspace Review the current project structure and architecture. Does this multi-service layout support the Notification & Audit Service requirements? Identify any gaps."*

**Copilot Feature:** Ask Mode + @workspace

**Prompting Technique:** Decomposition

**Rationale:**
- Used @workspace to give Copilot full project context
- Decomposed by asking specifically about gaps
- Validated architecture before coding

**Copilot Output:** Identified missing packages and suggested proper package structure.

**Outcome:** ✅ Good - Copilot understood the multi-service layout requirement.

---

## 2. Data Model Generation Phase

### Prompt 3: Audit Model Generation

**Exact Text:**
> *"#file:src/main/java/com/taskbridge/project/model/Project.java Generate an AuditLog entity class that:*
> 
> *- Captures eventType, entityType, entityId, userId, organisationId*
> *- Stores previousState and newState as JSON strings*
> *- Has automatic timestamp on creation (immutable)*
> *- Follows the same pattern as the Project model*
> *- Includes validation annotations*
> *- Write a repository interface extending JpaRepository*
> 
> *Ensure NO update or delete methods are exposed in the service layer."*

**Copilot Feature:** Ask Mode + #file Reference

**Prompting Technique:** Constraint-Based + Few-Shot

**Rationale:**
- #file gives context about existing patterns
- Constraint-based ("NO update or delete methods") enforces immutability
- Few-shot learning from existing Project model

**Copilot Output:** Generated AuditLog entity with all required fields, validation, and repository with only save/find methods.

**Outcome:** ✅ Excellent - Copilot correctly understood immutability constraint.

---

### Prompt 4: Notification Model Generation

**Exact Text:**
> *"Generate a Notification model similar to AuditLog but with:*
> 
> *- userId, organisationId, eventType, projectId, message, read status, createdAt*
> *- Default read=false*
> *- Validation annotations*
> *- Repository with findByUserIdAndReadFalse method*
> *- Follow same naming and package structure"*

**Copilot Feature:** Inline Ghost Text Suggestions + Ask Mode

**Prompting Technique:** Specificity + Few-Shot

**Rationale:**
- Specific fields listed for clarity
- "Similar to" uses few-shot from AuditLog
- Explicitly requested the repository method needed

**Copilot Output:** Generated complete Notification model with Repository.

**Outcome:** ✅ Good - Required minor correction for proper annotation usage.

---

## 3. Service Logic Development Phase

### Prompt 5: Audit Service Implementation

**Exact Text:**
> *"#file:src/main/java/com/taskbridge/audit/model/AuditLog.java #file:src/main/java/com/taskbridge/audit/repository/AuditRepository.java*
> 
> *Generate an AuditService with:*
> 
> *1. recordAudit() method that creates immutable audit entries*
> *2. getAuditHistory() method with date range and event type filters*
> *3. No update or delete operations (enforce immutability)*
> *4. Transactional annotations*
> *5. Structured logging using SLF4J*
> *6. Exception handling for audit failures*
> 
> *Use ObjectMapper for JSON serialization."*

**Copilot Feature:** Ask Mode + #file References

**Prompting Technique:** Decomposition + Constraint-Based

**Rationale:**
- Decomposed into clear numbered requirements
- #file provides context for models and repositories
- Constraint-based (#3) explicitly enforces immutability

**Copilot Output:** Generated complete AuditService with all methods, logging, and immutability enforcement.

**Outcome:** ✅ Excellent - Fully functional, only minor naming conventions refined.

---

### Prompt 6: Notification Service Implementation

**Exact Text:**
> *"Generate a NotificationService that:*
> 
> *- createNotification() sends notifications to ALL team members*
> *- getUnreadNotifications() returns unread notifications for a user*
> *- markAsRead() marks a notification as read (with user validation)*
> *- Include proper error handling and logging*
> *- Use the NotificationRepository"*

**Copilot Feature:** Edit Mode

**Prompting Technique:** Specificity + Iterative Refinement

**Rationale:**
- Specific methods requested
- Edit Mode used for iterative refinement
- "ALL team members" emphasises the requirement

**Copilot Output:** Generated NotificationService but initially used hardcoded users.

**Outcome:** ⚠️ Required refinement - Copilot assumed team member list instead of generating method to fetch from org.

---

### Prompt 7: Refined Notification Service

**Exact Text:**
> *"Refine the NotificationService. Instead of hardcoding team members, add a TODO comment explaining that in production we should fetch team members from the User Service. For now, use a list of example users [1L, 2L, 3L] as placeholders."*

**Copilot Feature:** Edit Mode + Inline Ghost Text

**Prompting Technique:** Iterative Refinement

**Rationale:**
- Used Edit Mode to refine the existing code
- Added realistic TODO for production
- Provided clear instruction on what to replace

**Copilot Output:** Updated code with comment and placeholder implementation.

**Outcome:** ✅ Good - Properly flagged the architecture gap.

---

## 4. Integration Phase

### Prompt 8: Project Service Integration

**Exact Text:**
> *"#file:src/main/java/com/taskbridge/project/service/ProjectService.java*
> 
> *Update the ProjectService to:*
> 
> *1. Inject AuditService and NotificationService*
> *2. In createProject(): call auditService.recordAudit() and notificationService.createNotification()*
> *3. In updateProjectStatus(): capture old state, call auditService.recordAudit() with before/after*
> *4. In deleteProject(): call auditService.recordAudit() and notificationService.createNotification()*
> *5. Add ipAddress parameter to all public methods*
> *6. Use @Transactional for consistency"*

**Copilot Feature:** Agent Mode + #file Reference

**Prompting Technique:** Decomposition + Constraint-Based

**Rationale:**
- Agent Mode for multi-file changes
- Decomposed into clear numbered steps
- #file provides full context of existing service

**Copilot Output:** Generated complete integration code across all methods.

**Outcome:** ✅ Excellent - Accurate integration with all dependencies.

---

## 5. Controller Generation Phase

### Prompt 9: Audit Controller

**Exact Text:**
> *"Generate an AuditController with endpoints:*
> 
> *- GET /api/audit/{projectId} - Get audit history with optional from, to, eventType parameters*
> *- Use @DateTimeFormat for date parameters*
> *- Include userId and organisationId from headers for authentication*
> *- Return ResponseEntity with proper HTTP status codes*
> *- Follow REST API best practices"*

**Copilot Feature:** Ask Mode + /explain Command

**Prompting Technique:** Specificity + Role-Based

**Rationale:**
- Specific endpoints requested
- Asked for REST best practices (role-based)
- Used /explain to verify parameter handling

**Copilot Output:** Generated complete controller with all endpoints and proper annotations.

**Outcome:** ✅ Excellent - Proper validation and error handling.

---

### Prompt 10: Notification Controller

**Exact Text:**
> *"Create a NotificationController with:*
> 
> *- GET /api/notifications/unread - Get all unread notifications for current user*
> *- PATCH /api/notifications/{id}/read - Mark notification as read*
> *- Validate that user can only access their own notifications*
> *- Return 404 if notification not found*
> *- Return 403 if user tries to access someone else's notification"*

**Copilot Feature:** Agent Mode

**Prompting Technique:** Constraint-Based

**Rationale:**
- Agent Mode for generating new controller
- Clear constraints (404, 403 cases)
- Emphasised security validation

**Copilot Output:** Generated controller with security checks.

**Outcome:** ✅ Good - Required minor correction for header extraction.

---

## 6. Test Generation Phase

### Prompt 11: Test Cases Generation

**Exact Text:**
> *"#file:src/main/java/com/taskbridge/audit/service/AuditService.java*
> 
> *Generate JUnit 5 test cases covering:*
> 
> *1. Audit entry creation on project state change*
> *2. Audit immutability (cannot delete or overwrite)*
> *3. Audit history query by date range*
> *4. Audit history query by event type*
> *5. Unauthorised user cannot access another org's audit log*
> *6. Notification dispatch to all team members*
> 
> *Use Mockito for mocking dependencies.*
> *Follow AAA pattern (Arrange, Act, Assert)."*

**Copilot Feature:** Ask Mode + /tests Command

**Prompting Technique:** Decomposition + Few-Shot

**Rationale:**
- /tests command specifically for test generation
- Decomposed into 6 clear test cases
- AAA pattern for consistency

**Copilot Output:** Generated test class with all 6 test cases.

**Outcome:** ✅ Good - Required adding proper assertions.

---

## 7. Documentation Phase

### Prompt 12: JavaDoc Generation

**Exact Text:**
> *"#file:src/main/java/com/taskbridge/project/service/ProjectService.java*
> 
> *Generate comprehensive JavaDoc for all public methods including:*
> *- Parameter descriptions*
> *- Return value descriptions*
> *- Throws/Exception documentation*
> *- Usage examples where helpful"*

**Copilot Feature:** Edit Mode + /doc Command

**Prompting Technique:** Specificity + Role-Based

**Rationale:**
- /doc command specifically for documentation
- Specific sections requested
- Role-based ("comprehensive" documentation)

**Copilot Output:** Generated complete JavaDoc.

**Outcome:** ✅ Excellent - Professional documentation.

---

## 8. Post-Generation Corrections

### Correction 1: Missing IP Address in Audit

**Problem:** Initial Copilot output for AuditService didn't include IP address parameter.

**What Copilot Produced:**
```java
public void recordAudit(String eventType, String entityType, Long entityId, 
                        Long userId, Long organisationId, Object previousState, 
                        Object newState) {
    // No IP parameter
}
```

**What Was Wrong:** Missing IP address capture as required by scope change.

**How I Fixed:** 
```java
public void recordAudit(String eventType, String entityType, Long entityId, 
                        Long userId, Long organisationId, Object previousState, 
                        Object newState, String ipAddress) {
    // Added IP parameter
    this.ipAddress = ipAddress;
}
```

**Method Used:** Manual edit + Edit Mode refinement.

---

### Correction 2: Hardcoded Team Members

**Problem:** NotificationService initially hardcoded team members.

**What Copilot Produced:**
```java
public void createNotification(Long organisationId, String eventType, 
                               Long projectId, String message) {
    Long[] teamMembers = {1L}; // Hardcoded single user
    for (Long userId : teamMembers) {
        // Create notifications
    }
}
```

**What Was Wrong:** Only one team member, should be all team members.

**How I Fixed:**
```java
public void createNotification(Long organisationId, String eventType, 
                               Long projectId, String message) {
    // TODO: In production, fetch from User Service
    Long[] teamMembers = {1L, 2L, 3L}; // Example team members
    
    for (Long userId : teamMembers) {
        // Create notifications
    }
}
```

**Method Used:** Edit Mode refinement.

---

### Correction 3: Missing Validation Annotations

**Problem:** Initial AuditLog model had no validation annotations.

**What Copilot Produced:**
```java
@Entity
public class AuditLog {
    private String eventType;
    private String entityType;
    private Long entityId;
    // No validation
}
```

**What Was Wrong:** Could accept null values.

**How I Fixed:**
```java
@Entity
public class AuditLog {
    @Column(nullable = false)
    private String eventType;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private Long entityId;
    // Added validation
}
```

**Method Used:** Manual edit.

---

### Correction 4: Missing Transactional Annotations

**Problem:** Service methods missing @Transactional.

**What Copilot Produced:**
```java
public class AuditService {
    public void recordAudit(...) {
        auditRepository.save(auditLog);
    }
}
```

**What Was Wrong:** No transaction management.

**How I Fixed:**
```java
public class AuditService {
    @Transactional
    public void recordAudit(...) {
        auditRepository.save(auditLog);
    }
}
```

**Method Used:** Edit Mode + Inline edit.

---

### Correction 5: Incorrect JSON Serialization

**Problem:** ObjectMapper not handling null objects.

**What Copilot Produced:**
```java
String prevJson = objectMapper.writeValueAsString(previousState);
String newJson = objectMapper.writeValueAsString(newState);
```

**What Was Wrong:** NullPointerException if previousState or newState is null.

**How I Fixed:**
```java
String prevJson = previousState != null ? objectMapper.writeValueAsString(previousState) : null;
String newJson = newState != null ? objectMapper.writeValueAsString(newState) : null;
```

**Method Used:** Manual edit.

---

### Correction 6: Missing Exception Handling

**Problem:** No try-catch for JSON serialization.

**What Copilot Produced:**
```java
String prevJson = objectMapper.writeValueAsString(previousState);
auditRepository.save(auditLog);
```

**What Was Wrong:** JSON errors would crash the service.

**How I Fixed:**
```java
try {
    String prevJson = previousState != null ? objectMapper.writeValueAsString(previousState) : null;
    auditRepository.save(auditLog);
} catch (Exception e) {
    logger.error("Failed to record audit: {}", e.getMessage());
    throw new RuntimeException("Audit recording failed", e);
}
```

**Method Used:** Manual edit.

---

### Correction 7: Missing IP in Controller Headers

**Problem:** Controller endpoints didn't capture IP header.

**What Copilot Produced:**
```java
@PostMapping
public ResponseEntity<Project> createProject(@Valid @RequestBody Project project,
                                              @RequestHeader("X-User-Id") Long userId) {
    // No IP capture
}
```

**What Was Wrong:** IP address not being passed to service.

**How I Fixed:**
```java
@PostMapping
public ResponseEntity<Project> createProject(@Valid @RequestBody Project project,
                                              @RequestHeader("X-User-Id") Long userId,
                                              @RequestHeader("X-Forwarded-For") String ipAddress) {
    Project created = projectService.createProject(project, userId, ipAddress);
}
```

**Method Used:** Manual edit.

---

### Correction 8: Missing REOPENED Status Validation

**Problem:** Status validation didn't include REOPENED.

**What Copilot Produced:**
```java
// No validation for new status
project.setStatus(newStatus);
```

**What Was Wrong:** Could set invalid status values.

**How I Fixed:**
```java
// In ProjectService
private void validateStatus(String status) {
    Set<String> validStatuses = Set.of("CREATED", "UPDATED", "CLOSED", "REOPENED");
    if (!validStatuses.contains(status)) {
        throw new IllegalArgumentException("Invalid status: " + status);
    }
}
```

**Method Used:** Manual edit.

---

## Summary of Corrections

| # | Issue | Severity | Fix Method | Impact |
|---|-------|----------|------------|--------|
| 1 | Missing IP parameter | High | Manual + Edit Mode | Required for compliance |
| 2 | Hardcoded team members | Medium | Edit Mode | Production blocker |
| 3 | Missing validation | High | Manual | Data integrity |
| 4 | Missing @Transactional | Medium | Edit Mode | Data consistency |
| 5 | Null JSON serialization | High | Manual | Prevent crashes |
| 6 | Missing exception handling | Medium | Manual | Prevent crashes |
| 7 | Missing IP headers | High | Manual | Required for compliance |
| 8 | Missing REOPENED validation | Medium | Manual | Business rule |

---

## Key Learnings

### What Worked Well:
1. **@workspace context** significantly improved Copilot's understanding
2. **#file references** ensured consistency with existing code
3. **Constraint-based prompts** effectively enforced immutability
4. **Edit Mode** was excellent for iterative refinements

### What Needed Human Intervention:
1. **Security/privacy considerations** - AI missed GDPR implications
2. **Business logic validation** - Status transitions, team member logic
3. **Production concerns** - Exception handling, null safety
4. **Architecture decisions** - Multi-tenant isolation patterns

### Copilot Feature Effectiveness:

| Feature | Effectiveness | Best Use Case |
|---------|--------------|---------------|
| Ask Mode | ⭐⭐⭐⭐⭐ | Specification, brainstorming |
| Edit Mode | ⭐⭐⭐⭐ | Targeted refinements |
| Agent Mode | ⭐⭐⭐ | Multi-file generation |
| @workspace | ⭐⭐⭐⭐⭐ | Contextual understanding |
| #file | ⭐⭐⭐⭐⭐ | Pattern consistency |
| /explain | ⭐⭐⭐⭐ | Understanding code |
| /tests | ⭐⭐⭐ | Test scaffolding |
| /doc | ⭐⭐⭐⭐ | Documentation generation |

---

*Documentation Completed: 2026-07-17*
*Total Prompts Used: 12*
*Corrections Applied: 8*
*Estimated Copilot Contribution: 70%*
*Estimated Human Contribution: 30%*
```
