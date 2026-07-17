# SPEC.md - Notification & Audit Service Technical Specification

```markdown
# Notification & Audit Service - Technical Specification

## 1. Overview
This document specifies the technical implementation of the Notification & Audit Service for TaskBridge. The service provides real-time notifications for project milestone changes and maintains an immutable audit log of all state changes for compliance purposes.

## 2. Data Models

### 2.1 Project Model (Existing)
```java
Project {
    Long id
    String name
    String description
    String status  // CREATED, UPDATED, CLOSED, REOPENED
    Long organisationId
    Long createdBy
    LocalDateTime createdAt
    LocalDateTime updatedAt
}
```

### 2.2 Audit Log Model
```java
AuditLog {
    Long id
    String eventType        // PROJECT_CREATED, PROJECT_UPDATED, PROJECT_DELETED, PROJECT_REOPENED
    String entityType       // "Project"
    Long entityId           // Project ID
    Long userId             // Actor user ID
    Long organisationId     // Multi-tenant isolation
    String previousState    // JSON snapshot of previous state
    String newState         // JSON snapshot of new state
    LocalDateTime timestamp // Immutable - set once on creation
    String ipAddress        // Actor's IP address (added per scope change)
}
```
**Constraints:**
- Audit entries are IMMUTABLE - no UPDATE or DELETE operations permitted
- Timestamp is set once at creation and never modified
- All fields are required except previousState (null for CREATE events)

### 2.3 Notification Model
```java
Notification {
    Long id
    Long userId             // Recipient user ID
    Long organisationId     // Multi-tenant isolation
    String eventType        // PROJECT_CREATED, PROJECT_UPDATED, PROJECT_DELETED, PROJECT_REOPENED
    Long projectId          // Related project
    String message          // Human-readable notification text
    boolean read            // Default: false
    LocalDateTime createdAt
}
```

## 3. API Contracts

### 3.1 Project Service APIs (Existing)
**Base URL:** `/api/projects`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new project |
| PATCH | `/{projectId}/status` | Update project status |
| DELETE | `/{projectId}` | Delete project |
| GET | `/team/{organisationId}` | Get team projects |

**Headers Required:**
- `X-User-Id`: Current user ID
- `X-Organisation-Id`: Organisation ID for multi-tenant isolation
- `X-Forwarded-For`: Client IP address (for audit)

### 3.2 Audit Service APIs
**Base URL:** `/api/audit`

#### GET `/api/audit/{projectId}`
Get audit history for a specific project

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| from | DateTime | No | Start date (ISO-8601) |
| to | DateTime | No | End date (ISO-8601) |
| eventType | String | No | Filter by event type |

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "eventType": "PROJECT_UPDATED",
        "entityType": "Project",
        "entityId": 123,
        "userId": 456,
        "organisationId": 789,
        "previousState": "{\"status\":\"CREATED\"}",
        "newState": "{\"status\":\"IN_PROGRESS\"}",
        "timestamp": "2026-07-17T10:30:00",
        "ipAddress": "192.168.1.1"
    }
]
```

**Error Responses:**
- `401 Unauthorized` - Missing/invalid user ID
- `403 Forbidden` - User not in same organisation
- `404 Not Found` - Project not found

### 3.3 Notification Service APIs
**Base URL:** `/api/notifications`

#### GET `/api/notifications/unread`
Get all unread notifications for current user

**Headers Required:**
- `X-User-Id`: Current user ID

**Response:** `200 OK`
```json
[
    {
        "id": 1,
        "userId": 456,
        "organisationId": 789,
        "eventType": "PROJECT_CREATED",
        "projectId": 123,
        "message": "Project created: New Feature",
        "read": false,
        "createdAt": "2026-07-17T10:30:00"
    }
]
```

#### PATCH `/api/notifications/{id}/read`
Mark a notification as read

**Headers Required:**
- `X-User-Id`: Current user ID

**Response:** `200 OK` (No body)

**Error Responses:**
- `401 Unauthorized` - Missing/invalid user ID
- `403 Forbidden` - Cannot mark another user's notification
- `404 Not Found` - Notification not found

## 4. Integration Points

### 4.1 Project Service → Audit Service
**Trigger:** Any project milestone state change (create/update/delete)

**Flow:**
1. ProjectService performs the operation
2. Before state is captured (for updates/deletes)
3. ProjectService calls AuditService.recordAudit()
4. AuditService creates IMMUTABLE audit entry
5. Audit entry is persisted

**Integration Code:**
```java
auditService.recordAudit(
    "PROJECT_UPDATED",          // eventType
    "Project",                   // entityType
    projectId,                   // entityId
    userId,                      // userId
    organisationId,              // organisationId
    oldState,                    // previousState (snapshot)
    newState,                    // newState (snapshot)
    ipAddress                    // ipAddress
);
```

### 4.2 Project Service → Notification Service
**Trigger:** Any project milestone state change (create/update/delete)

**Flow:**
1. ProjectService performs the operation
2. ProjectService calls NotificationService.createNotification()
3. NotificationService retrieves all team members
4. Creates notification records for each team member
5. Notifications are persisted with read=false

**Integration Code:**
```java
notificationService.createNotification(
    organisationId,              // organisationId
    "PROJECT_CREATED",           // eventType
    projectId,                   // projectId
    "Project created: " + name   // message
);
```

## 5. Business Rules & Constraints

### 5.1 Multi-Tenant Isolation
- All queries must include `organisationId` filter
- Users can only access projects/audits/notifications from their organisation
- Audit logs include `organisationId` for isolation

### 5.2 Audit Immutability
- Audit entries are WRITE-ONLY and READ-ONLY
- No UPDATE or DELETE operations allowed at any level
- Timestamp is set once at creation
- Repository extends JpaRepository but only uses save() and find*() methods

### 5.3 Validation Rules
- Project name cannot be empty
- Organisation ID must be valid
- Status must be one of: CREATED, UPDATED, CLOSED, REOPENED
- User ID must be valid and have org access

## 6. Testing Requirements

### Test Coverage Required:
1. ✅ Notification dispatch to all team members on project state change
2. ✅ Audit entry creation on project milestone updates
3. ✅ Audit immutability (cannot delete/overwrite)
4. ✅ Audit history query by date range
5. ✅ Audit history query by event type
6. ✅ Unauthorised user cannot access another organisation's audit log

## 7. Copilot Contribution Notes

### Sections Drafted with Copilot:
- Initial data model structures
- Basic repository interfaces
- Controller method signatures

### Sections Manually Refined:
- Security validation logic (multi-tenant isolation)
- Error handling patterns
- Audit immutability enforcement
- IP address capture integration

### Key Human Judgments Applied:
- Enforced strict immutability at service layer
- Added organisation validation to all queries
- Designed notification dispatch mechanism
- Structured before/after state capture

---

*Last Updated: 2026-07-17*
*Version: 1.0*
```
