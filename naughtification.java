# ARCHITECTURE.md - System Architecture Documentation

```markdown
# Architecture Documentation - Notification & Audit Service

## 1. Service Relationship & Integration Contract

The Project Service and Notification & Audit Service operate in a **synchronous integration pattern** where the Project Service acts as the orchestrator. When a project milestone changes (create/update/delete/reopen), the Project Service makes sequential calls to:

- **Audit Service** via `auditService.recordAudit()` - captures immutable before/after state snapshots with actor IP address
- **Notification Service** via `notificationService.createNotification()` - dispatches real-time alerts to all team members

**Integration Contract:**
- Audit calls are **synchronous and transactional** - if audit fails, the entire project operation rolls back
- Notification calls are **synchronous but non-blocking** - failures are logged but don't rollback the transaction
- Both services expose **REST APIs** for query operations (GET /audit, GET /notifications)

---

## 2. Layered Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT / API CONSUMER                       │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTP Request
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CONTROLLER LAYER                              │
│  • Request validation & header extraction (X-User-Id, X-Org-Id)   │
│  • DTO mapping & response formatting                              │
│  • Exception handling (404, 403, 400)                            │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    PROJECT SERVICE                           │   │
│  │  • Business logic (create, update, delete)                 │   │
│  │  • Multi-tenant validation (org access)                    │   │
│  │  • Status transition validation                            │   │
│  │  • Orchestrates audit & notification calls                │   │
│  └──────────────┬──────────────┬───────────────────────────────┘   │
│                 │              │                                    │
│  ┌──────────────▼──────────────▼───────────────────────────────┐   │
│  │              AUDIT SERVICE          NOTIFICATION SERVICE     │   │
│  │  • Immutable audit entries       • Team member dispatch    │   │
│  │  • JSON state snapshots          • Read/unread tracking    │   │
│  │  • IP address capture            • User-based filtering    │   │
│  │  • Query by date/event type      • Mark as read           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     REPOSITORY LAYER                               │
│  • JPA repository interfaces                                       │
│  • Multi-tenant filtering (organisationId in all queries)         │
│  • Custom query methods for filtering (date, event type)          │
│  • Transaction management                                          │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                                │
│  • H2 Database (development) / PostgreSQL (production)            │
│  • Tables: projects, audit_logs, notifications                   │
│  • Immutability enforced at service level (no update/delete)     │
│  • Indices for performance (organisationId, timestamp)           │
└─────────────────────────────────────────────────────────────────────┘
```

**Complete Data Flow:**
1. Client sends request to `POST /api/projects` with headers (X-User-Id, X-Organisation-Id, X-Forwarded-For)
2. Controller validates headers and passes to ProjectService
3. ProjectService validates business rules (org access, input validation)
4. ProjectService saves the project and captures before/after state
5. **Synchronous Transactional Flow:** ProjectService calls AuditService.recordAudit()
   - AuditService serializes state to JSON
   - AuditService creates immutable AuditLog entry with IP address
   - AuditRepository saves the entry
6. **Synchronous Non-Blocking Flow:** ProjectService calls NotificationService.createNotification()
   - NotificationService fetches team members (placeholder for now)
   - NotificationService creates Notification entries with read=false
   - NotificationRepository saves all entries
7. ProjectService returns success response to client
8. Clients can query audit via `GET /api/audit/{projectId}` or notifications via `GET /api/notifications/unread`

---

## 3. Multi-Tenant B2B SaaS Appropriateness

This architecture is specifically designed for multi-tenant B2B SaaS with the following considerations:

**Data Isolation:**
- Every database query includes `organisationId` filter - no cross-tenant data leakage
- Audit logs and notifications both store `organisationId` for tenant isolation
- Users can only access their organisation's projects, audits, and notifications

**Compliance Ready:**
- Immutable audit logs satisfy SOC2, GDPR, and compliance requirements
- IP address capture provides security auditing for investigations
- Before/after state snapshots enable complete audit trails

**Scalability:**
- Clear separation of concerns allows independent scaling of services
- Query filtering at repository level (not in-memory) for performance
- Indices on organisationId and timestamp for efficient queries

**Security:**
- All endpoints require organisation context (headers)
- Validation at multiple layers (controller, service, repository)
- No raw SQL - ORM prevents injection attacks

---

## 4. Key Design Decisions & Trade-offs

### Decision 1: Synchronous vs Asynchronous Audit

**Chosen:** Synchronous (audit happens in the same transaction as the project update)

**Trade-off:**
- ✅ **Pros:** Guaranteed audit consistency (no lost audit records), simple rollback, immediate feedback
- ❌ **Cons:** Performance impact if audit database is slow, blocks the main operation

**Alternative Considered:** Asynchronous (audit via message queue)

**Why Chosen:** Compliance requires guaranteed audit records - cannot risk losing audit entries. The audit operation is fast enough (JSON serialization + INSERT) to not significantly impact performance.

---

### Decision 2: Hardcoded Team Members vs User Service Integration

**Chosen:** Placeholder team members {1L, 2L, 3L} with TODO comment

**Trade-off:**
- ✅ **Pros:** Quick implementation, works for demos, decoupled from User Service
- ❌ **Cons:** Not production-ready, fails with real user IDs, technical debt

**Alternative Considered:** Integrate User Service immediately

**Why Chosen:** User Service isn't available yet - this service can be built independently. The TODO comment clearly marks the gap for future integration. This is a pragmatic trade-off that allows shipping the feature on time.

---

### Decision 3: Service-Level vs Database-Level Immutability

**Chosen:** Service-level immutability (no update/delete methods in service layer)

**Trade-off:**
- ✅ **Pros:** Application logic controls mutability, easier to reason about, no database triggers needed
- ❌ **Cons:** Could bypass via direct repository access (needs team discipline)

**Alternative Considered:** Database triggers or constraints

**Why Chosen:** Service-level immutability provides more flexibility and is easier to test. Repository access is only through service layer in production code, making this safe. Added documentation to enforce the rule.

---

### Decision 4: Multi-Service vs Single Service Layout

**Chosen:** Separate services (Project, Audit, Notification) within the same codebase

**Trade-off:**
- ✅ **Pros:** Clear separation of concerns, independent evolution, easier testing, modular
- ❌ **Cons:** More files to manage, potential duplicate code, more complex navigation

**Alternative Considered:** Single monolithic service

**Why Chosen:** The separation aligns with the problem domain - each service has distinct responsibilities. This makes the codebase more maintainable and prepares for potential future microservices migration.

---

### Decision 5: Synchronous Notifications

**Chosen:** Notifications are sent synchronously within the request lifecycle

**Trade-off:**
- ✅ **Pros:** Simple implementation, immediate feedback, guaranteed delivery
- ❌ **Cons:** Adds latency to the main operation, blocks the user's request

**Alternative Considered:** Asynchronous notifications via message queue or @Async

**Why Chosen:** For the current scale, synchronous is simpler and sufficient. The operation is fast (just database inserts). If performance becomes an issue, we can easily switch to @Async without changing the API contract.

---

## 5. Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Language | Java 17 | Modern LTS version |
| Framework | Spring Boot 3.1.x | REST APIs, dependency injection |
| ORM | Spring Data JPA | Database abstraction |
| Database | H2 (dev) / PostgreSQL (prod) | Data persistence |
| Validation | Jakarta Validation | Input validation |
| Logging | SLF4J + Logback | Structured logging |
| JSON | Jackson | State snapshot serialization |
| Testing | JUnit 5 + Mockito | Unit and integration tests |
| Build | Maven | Dependency management |

---

## 6. Deployment Considerations

**Containerization:**
- Each service can run in its own container
- Shared database but independent schemas

**Scaling:**
- Audit and Notification services can scale independently
- Read replicas for audit query endpoints

**Monitoring:**
- Structured logs for each service
- Metrics for audit recording latency
- Alerts for notification delivery failures

**Backup & Recovery:**
- Audit logs backed up daily (compliance requirement)
- Immutable audit logs protect against data corruption

---

*Architecture Document Version: 1.0*
*Last Updated: 2026-07-17*
*Architectural Decisions: 5 documented*
*Technology Stack: 9 components*
```

This ARCHITECTURE.md covers:
- ✅ Service relationship and integration contract
- ✅ Layered architecture with data flow diagram
- ✅ Multi-tenant B2B SaaS appropriateness
- ✅ 5 key design decisions with trade-offs
- ✅ Technology stack summary
- ✅ Deployment considerations
