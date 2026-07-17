# README.md - TaskBridge Notification & Audit Service

```markdown
# TaskBridge - Notification & Audit Service

## Overview

TaskBridge is a B2B SaaS project collaboration platform for distributed engineering teams. This repository contains the **Notification & Audit Service** that sits alongside the existing Project Service, providing real-time notifications for project milestone changes and maintaining an immutable audit log of all state changes for compliance purposes.

### Key Features

- **Immutable Audit Logging** - Captures all project state changes with before/after snapshots
- **Real-time Notifications** - Dispatches alerts to all team members on project updates
- **Multi-tenant Isolation** - Strict data segregation between organisations
- **Compliance Ready** - IP address capture, timestamped audit trails
- **REST APIs** - Clean, well-documented endpoints for all operations

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Primary programming language (LTS) |
| **Spring Boot** | 3.1.5 | Application framework and dependency injection |
| **Spring Data JPA** | 3.1.5 | ORM and database abstraction |
| **Hibernate** | 6.2.13 | JPA implementation |
| **H2 Database** | 2.2.224 | Development database (in-memory) |
| **PostgreSQL** | 15+ | Production database (planned) |

### Testing & Quality

| Technology | Version | Purpose |
|------------|---------|---------|
| **JUnit 5** | 5.10.0 | Unit testing framework |
| **Mockito** | 5.5.0 | Mocking framework for tests |
| **AssertJ** | 3.24.2 | Fluent assertions for tests |

### Build & Deployment

| Technology | Version | Purpose |
|------------|---------|---------|
| **Maven** | 3.9.0 | Build automation and dependency management |
| **Docker** | Latest | Containerization (planned) |
| **Git** | Latest | Version control |

### Development Tools

| Tool | Purpose |
|------|---------|
| **GitHub Copilot** | AI-assisted development |
| **VS Code / IntelliJ IDEA** | IDE (preferred) |
| **Postman** | API testing |
| **H2 Console** | Database management |

---

## Project Structure

```
taskbridge/
├── .github/
│   └── copilot-instructions.md      # Copilot custom instructions
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── taskbridge/
│   │   │           ├── project/
│   │   │           │   ├── model/
│   │   │           │   │   └── Project.java
│   │   │           │   ├── repository/
│   │   │           │   │   └── ProjectRepository.java
│   │   │           │   ├── service/
│   │   │           │   │   └── ProjectService.java
│   │   │           │   └── controller/
│   │   │           │       └── ProjectController.java
│   │   │           ├── audit/
│   │   │           │   ├── model/
│   │   │           │   │   └── AuditLog.java
│   │   │           │   ├── repository/
│   │   │           │   │   └── AuditRepository.java
│   │   │           │   ├── service/
│   │   │           │   │   └── AuditService.java
│   │   │           │   └── controller/
│   │   │           │       └── AuditController.java
│   │   │           ├── notification/
│   │   │           │   ├── model/
│   │   │           │   │   └── Notification.java
│   │   │           │   ├── repository/
│   │   │           │   │   └── NotificationRepository.java
│   │   │           │   ├── service/
│   │   │           │   │   └── NotificationService.java
│   │   │           │   └── controller/
│   │   │           │       └── NotificationController.java
│   │   │           └── TaskBridgeApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── taskbridge/
│                   ├── audit/
│                   │   └── AuditServiceTest.java
│                   └── project/
│                       └── ProjectServiceTest.java
├── ARCHITECTURE.md                   # Architecture documentation
├── IMPACT_ANALYSIS.md                # Scope change impact analysis
├── PR_DESCRIPTION.md                 # Pull request description
├── PROMPTS.md                         # Prompt engineering documentation
├── README.md                          # This file
├── REVIEW.md                          # Code review documentation
├── SPEC.md                            # Technical specification
├── TOOL_STRATEGY.md                   # Copilot tool strategy
└── pom.xml                            # Maven build file
```

---

## Architecture Overview

This project follows a **multi-service layered architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                         │
│         (Request/Response Handling & Validation)          │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    SERVICE LAYER                           │
│   ┌─────────────────────────────────────────────────────┐   │
│   │          PROJECT SERVICE                           │   │
│   │   • Business Logic                                 │   │
│   │   • Orchestrates Audit & Notification              │   │
│   └────────────┬──────────────────────────┬────────────┘   │
│                │                          │                │
│   ┌────────────▼──────────┐   ┌──────────▼────────────┐   │
│   │   AUDIT SERVICE       │   │  NOTIFICATION SERVICE │   │
│   │   • Immutable logging │   │   • Team notification │   │
│   │   • JSON snapshots    │   │   • Read status       │   │
│   └───────────────────────┘   └──────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   REPOSITORY LAYER                         │
│              (Data Access & Multi-tenant Filtering)        │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   DATABASE LAYER                           │
│              (H2 / PostgreSQL)                             │
└─────────────────────────────────────────────────────────────┘
```

### Service Integration

| Integration | Pattern | Description |
|-------------|---------|-------------|
| **Project → Audit** | Synchronous, Transactional | Audit failures rollback the project operation |
| **Project → Notification** | Synchronous, Non-blocking | Notification failures are logged but don't rollback |

---

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.9+
- Git
- IDE (VS Code with Copilot extension recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/taskbridge/taskbridge.git
cd taskbridge
```

2. **Build the project**
```bash
mvn clean install
```

3. **Run the application**
```bash
mvn spring-boot:run
```

4. **Access the application**
- API: `http://localhost:8080/api`
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:taskbridge`
  - Username: `sa`
  - Password: (empty)

---

## API Endpoints

### Project Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create a new project |
| PATCH | `/api/projects/{id}/status` | Update project status |
| DELETE | `/api/projects/{id}` | Delete a project |
| GET | `/api/projects/team/{orgId}` | Get all projects for a team |

**Headers Required:**
- `X-User-Id`: Current user ID
- `X-Organisation-Id`: Organisation ID for multi-tenant isolation
- `X-Forwarded-For`: Client IP address (for audit)

### Audit Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit/{projectId}` | Get audit history with filters (from, to, eventType) |

### Notification Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/unread` | Get all unread notifications |
| PATCH | `/api/notifications/{id}/read` | Mark notification as read |

---

## Testing

### Run Tests
```bash
mvn test
```

### Test Coverage
- 8 test cases implemented
- Coverage: Unit tests for services, integration tests for controllers
- Covers: Immutability, multi-tenant isolation, date filtering, event filtering

### Test Scenarios
1. ✅ Notification dispatch to all team members
2. ✅ Audit entry creation on project state change
3. ✅ Audit immutability (cannot delete/overwrite)
4. ✅ Audit history query by date range
5. ✅ Audit history query by event type
6. ✅ Unauthorised user access prevention
7. ✅ IP address capture in audit logs
8. ✅ REOPENED event triggers audit + notifications

---

## Development with GitHub Copilot

This project was built using GitHub Copilot with comprehensive prompt engineering. See documentation:

- **[PROMPTS.md](PROMPTS.md)** - Complete prompt chain and corrections
- **[TOOL_STRATEGY.md](TOOL_STRATEGY.md)** - Copilot feature usage and scenarios
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Custom Copilot rules

### Copilot Features Used
- ✅ Ask Mode (Chat)
- ✅ Edit Mode
- ✅ Agent Mode
- ✅ @workspace
- ✅ #file References
- ✅ /explain Command
- ✅ /tests Command
- ✅ /doc Command
- ✅ Inline Ghost Text

### AI-Assisted Development Breakdown
- **AI-Generated:** ~75% (models, repositories, controllers, tests scaffolding)
- **Human-Written:** ~25% (security, validation, business logic, documentation)

---

## Documentation

| Document | Description |
|----------|-------------|
| [SPEC.md](SPEC.md) | Technical specification with data models and API contracts |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture and design decisions |
| [REVIEW.md](REVIEW.md) | Code review of AI-generated Project Service |
| [IMPACT_ANALYSIS.md](IMPACT_ANALYSIS.md) | Scope change impact analysis |
| [PR_DESCRIPTION.md](PR_DESCRIPTION.md) | Pull request description |
| [PROMPTS.md](PROMPTS.md) | Prompt engineering documentation |
| [TOOL_STRATEGY.md](TOOL_STRATEGY.md) | Copilot tool strategy and reflection |

---

## Database Schema

### Projects Table
```sql
CREATE TABLE projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    organisation_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    organisation_id BIGINT NOT NULL,
    previous_state TEXT,
    new_state TEXT,
    ip_address VARCHAR(45) NOT NULL,
    timestamp TIMESTAMP NOT NULL
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    organisation_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    project_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);
```

---

## Security Features

- **Multi-tenant Isolation:** All queries filter by `organisationId`
- **Input Validation:** All endpoints validate input data
- **Audit Trail:** Every change is logged with actor and IP
- **Immutable Audit Logs:** No updates or deletes allowed
- **Secure Headers:** `X-User-Id`, `X-Organisation-Id` required

---

## Known Issues & Technical Debt

| Issue | Priority | Status |
|-------|----------|--------|
| Team members hardcoded ({1L, 2L, 3L}) | High | TODO - Integrate User Service |
| No pagination on audit queries | Medium | TODO - Add pagination |
| No caching strategy | Medium | TODO - Implement caching |
| IPv6 validation incomplete | Low | TODO - Add comprehensive validation |
| Data retention policy not implemented | High | TODO - Add auto-deletion |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

### Commit Convention
Use Conventional Commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Testing
- `refactor:` Code refactoring
- `chore:` Maintenance

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## Contact

- **Tech Lead:** [tech.lead@taskbridge.com](mailto:tech.lead@taskbridge.com)
- **Product Team:** [product@taskbridge.com](mailto:product@taskbridge.com)
- **Security Team:** [security@taskbridge.com](mailto:security@taskbridge.com)

---

## Acknowledgments

- Built with ❤️ using GitHub Copilot
- Special thanks to the product team for the requirements
- Thanks to the security team for compliance guidance

---

## Quick Links

- [API Documentation](#api-endpoints)
- [Getting Started](#getting-started)
- [Architecture](#architecture-overview)
- [Testing](#testing)
- [Development Guide](#development-with-github-copilot)

---

*Last Updated: 2026-07-17*
*Version: 1.0.0*
*Status: Ready for Review*
```

This README.md provides:
- ✅ Complete technology stack declaration
- ✅ Project overview and key features
- ✅ Architecture diagram and service integration
- ✅ Getting started guide with prerequisites
- ✅ API endpoint documentation
- ✅ Testing information
- ✅ Copilot development documentation links
- ✅ Database schema
- ✅ Security features
- ✅ Known issues and technical debt
- ✅ Contribution guidelines
- ✅ Quick links for navigation
