# JoharSetu — Backend Architecture Specification

## 1. Executive Summary & Technology Stack

JoharSetu's backend is a high-reliability, modular MVC monolithic server built with Node.js ES modules. It provides secure RESTful APIs, geospatial aggregations, and real-time bi-directional WebSockets to coordinate civic problem remediation across state, district, block, and ground-level field personnel.

### Core Technology Stack

| Layer / Concern | Technology | Version | Purpose / Scope |
|---|---|---|---|
| **Runtime Engine** | Node.js | `>=20.x` | Native ES Modules (`import`/`export`), asynchronous event loop |
| **Web Framework** | Express.js | `^4.19.2` | HTTP router, REST middleware pipeline, route error propagation |
| **Database & ODM** | MongoDB & Mongoose | `^8.5.2` | Document database, strict schema typing, indexes, lifecycle hooks |
| **Real-Time WebSockets**| Socket.IO | `^4.8.3` | Real-time chat rooms, live status alerts, socket authentication |
| **Schema Validation** | Zod | `^3.23.8` | Declarative request payload & parameter validation |
| **Authentication & Auth** | JSON Web Tokens & bcryptjs | `^9.0.2` / `^2.4.3` | Stateless Bearer token issuance, SHA-256 password salting & hashing |
| **Security Middleware** | Helmet & CORS | `^7.1.0` / `^2.8.5` | Cross-Origin protection, HTTP headers, CSP, proxy trust |
| **Structured Logging** | Pino & Pino-Pretty | `^9.3.2` / `^11.2.2` | Low-overhead JSON structured logging with request correlation IDs |
| **File / Media Storage** | Multer & Cloudinary SDK | `^2.3.0` / `^2.11.0` | Multi-part form streaming, image optimization, static CDN storage |
| **Background Processing**| Custom Event Queue & Nodemailer| Native / `^9.0.5` | Async notification dispatch, verification emails, password resets |
| **Automated Testing** | Jest & Supertest | `^29.7.0` / `^7.0.0` | Integration and unit test suite running in VM modules |

---

## 2. Architectural Pattern: Modular Layered Architecture

The backend adopts a **Domain-Driven Modular Monolith** design. Each business domain is partitioned into a self-contained module organized strictly across three architectural layers:

```text
                                  ┌─────────────────────────────┐
                                  │      Client Request         │
                                  └──────────────┬──────────────┘
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. PRESENTATION LAYER (modules/<domain>/presentation/)                                  │
│    ├── routes.js             : Express route definitions, HTTP method binding           │
│    ├── controller.js         : Parses HTTP request, executes service, formats response  │
│    └── validators.js         : Zod schemas verifying params, body, and query schemas    │
└────────────────────────────────────────────────┬────────────────────────────────────────┘
                                                 │ Validated DTO / Service Call
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. APPLICATION / SERVICE LAYER (modules/<domain>/application/)                          │
│    ├── service.js            : Core business logic, workflows, state machines           │
│    ├── auth.helper.js        : Specialized domain credential verification               │
│    └── event-emitters.js     : Triggers WebSocket events and asynchronous emails        │
└────────────────────────────────────────────────┬────────────────────────────────────────┘
                                                 │ Mongoose Queries & Mutations
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. PERSISTENCE & INFRASTRUCTURE LAYER (infrastructure/ & modules/<domain>/schemas/)     │
│    ├── schema.js             : Mongoose schema definitions, field validation, indexes   │
│    ├── mongo/client.js       : MongoDB connection pool management and reconnection     │
│    ├── socket/socketServer.js: WebSocket rooms, socket middleware, event distribution   │
│    └── storage/              : Cloudinary / Local filesystem static file handlers       │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Domain Module Directory & Responsibilities

The codebase at `BACKEND/src/modules` is structured into 8 distinct business domain modules:

```text
BACKEND/src/modules/
├── auth/                         # Multi-role authentication & session lifecycle
│   ├── application/              # Login, token generation, block & technician auth helpers
│   ├── infrastructure/           # Refresh token storage, JWT signing utilities
│   └── presentation/             # /api/v1/auth routes and controller endpoints
├── citizen/                      # Citizen problem statements & remediation tracking
│   ├── application/              # Challenge creation, status transitions, timeline builder
│   ├── infrastructure/           # Challenge schema, triage-updater helper, indexes
│   └── presentation/             # /api/v1/citizen endpoints
├── government/                   # Public Administration & Field Governance
│   ├── admins/                   # State & District Nodal Cell administration
│   ├── blocks/                   # Block Development Offices (BDO) & Block Directory
│   ├── departments/              # Line Departments (Electricity, Water, Road, Health)
│   ├── technicians/              # Field Technician roster, trade skills, credentials
│   ├── gis/                      # Spatial aggregation, district problem counts, coordinates
│   ├── heis/                     # Higher Education Institutions registration & review
│   ├── industries/               # Industry CSR partners & corporate registrations
│   ├── grants/                   # Government innovation grant allocations
│   └── overview/                 # State-wide KPI telemetry & department analytics
├── clarification/                # Bi-directional clarification chat system
│   ├── application/              # Thread creation, message persistence, unread counters
│   ├── infrastructure/           # Clarification schema, message models
│   └── presentation/             # /api/v1/clarification-chat REST endpoints
├── university/                   # Academic institutions & faculty research portal
├── industry/                     # CSR funds, expert consultations, tech adoption
├── media/                        # Multi-part file upload, evidence streaming, Cloudinary
└── users/                        # Global user accounts, profile management, roles
```

---

## 4. Database Architecture & Core Data Schemas

The database layer runs on **MongoDB Atlas** with Mongoose ODM models. Business relationships use explicit ObjectIds and embedded sub-documents for high read-performance:

```text
┌─────────────────────────┐         ┌────────────────────────────────┐
│         User            │         │           Challenge            │
│ ─────────────────────── │         │ ────────────────────────────── │
│ _id: ObjectId           │         │ _id: ObjectId                  │
│ email: String (Unique)  │         │ challengeId: String (Unique)   │
│ role: Enum              │◄───────┐│ citizen: { name, phone }       │
│ departmentId: ObjectId  │        ││ title: String                  │
│ blockId: ObjectId       │        ││ description: String            │
│ technicianId: String    │        ││ category: Enum                 │
└─────────────────────────┘        ││ priority: Enum                 │
                                   ││ status: Enum                   │
┌─────────────────────────┐        ││ latitude: Number               │
│       Department        │        ││ longitude: Number              │
│ ─────────────────────── │        ││ location: { district, block }  │
│ _id: ObjectId           │        ││ assignedDepartment: { ... }    │
│ deptId: String (Unique) │◄───────┼┤ assignedTechnician: { ... }    │
│ name: String            │        ││ resolutionDossier: { ... }     │
│ district: String        │        ││ timeline: [ { status, date } ] │
│ block: String           │        │└────────────────────────────────┘
│ headName: String        │        │
└─────────────────────────┘        │
             ▲                     │
             │ 1:N                 │
┌─────────────────────────┐        │
│       Technician        │        │
│ ─────────────────────── │        │
│ _id: ObjectId           │        │
│ technicianId: String    ├────────┘
│ name: String            │
│ specialization: String  │
│ phone: String           │
│ credentials: { ... }    │
│ status: Enum            │
└─────────────────────────┘
```

### Key Schemas & Collections
1. **`challenges`**: Core entity representing citizen problems. Stores geospatial coordinates (`latitude`, `longitude`), administrative hierarchy (`district`, `block`, `panchayat`), attached media, and progressive workflow state.
2. **`departments`**: Master list of administrative departments with assigned jurisdictional areas.
3. **`blocks`**: Block administrative units with dedicated BDO user credentials and assigned issues.
4. **`technicians`**: Field technician roster linked to departments, including hashed portal access credentials and field trade specializations.
5. **`clarification_messages`**: Chat messages between citizens and authorities tied to specific challenges.
6. **`users`**: Global authentication accounts with role-based attributes (`role`, `status`, `lastLogin`).

---

## 5. Authentication, Multi-Role RBAC & Token Lifecycle

JoharSetu enforces strict multi-role authentication covering all tiers of governance:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                ROLE MATRIX & ACCESS CONTROL                            │
├───────────────────┬──────────────────────────────────┬─────────────────────────────────┤
│ Role Key          │ Scope of Authority               │ Primary Portals Accessible      │
├───────────────────┼──────────────────────────────────┼─────────────────────────────────┤
│ `CITIZEN`         │ Personal challenges, feedback    │ /citizen                        │
│ `NODAL` / `ADMIN` │ District-wide triage & blocks    │ /nodal, /government, /admin     │
│ `BLOCK`           │ Block-level issue delegation     │ /block                          │
│ `DEPARTMENT`      │ Department remediation & tech dir│ /department                     │
│ `TECHNICIAN`      │ Assigned field tasks, resolution │ /technician                     │
│ `UNIVERSITY`/`HEI`│ Problem statement bank & R&D     │ /university                     │
│ `FACULTY`         │ Research projects & solutions    │ /faculty                        │
│ `INDUSTRY`        │ CSR grants, tech adoption        │ /industry                       │
└───────────────────┴──────────────────────────────────┴─────────────────────────────────┘
```

### Authentication Flow
1. Client sends credentials (`email`/`password` or `technicianId`/`password`) to `/api/v1/auth/login`.
2. Auth service verifies salt/hash via `bcryptjs` and checks role validity across specialized domain helpers (`block-auth.helper.js`, `technician-auth.helper.js`).
3. Server returns a signed JWT containing payload `{ id, email, role, department, district, block }`.
4. Subsequent requests pass `Authorization: Bearer <token>`, validated by the `authenticate` middleware.

---

## 6. Real-Time WebSocket Infrastructure (`socketServer.js`)

Real-time synchronization runs on top of the native Node.js HTTP server:

```text
[ Browser / Mobile Client ]
             ▲
             │ Socket.IO Handshake (WSS / Long Polling)
             ▼
[ SocketServer (initializeSocketServer) ]
             ▲
   ┌─────────┴────────────────────────┐
   ▼                                  ▼
[ Room: challenge:<id> ]     [ Room: district:<name> ]
(Live Clarification Chat)    (Live Triage & Remediation Alert)
```

- **Authentication via Socket Handshake**: Client passes JWT token during connection handshake; socket session verifies user identity.
- **Challenge Discussion Rooms**: Automatically joins rooms keyed by `challenge:<challengeId>`.
- **Event Catalog**:
  - `chat:join` / `chat:leave`: Manages room presence.
  - `chat:message`: Broadcasts persisted messages to both citizen and in-charge.
  - `chat:typing`: Broadcasts typing indicators.
  - `challenge:updated`: Notifies connected dashboards of status changes (e.g. `Accepted`, `Resolved`).

---

## 7. Reliability, Process Lifecycle & Security

1. **Port Lingering & Auto-Retry (`listenWithRetry`)**:
   - `server.js` implements an exponential retry loop for `EADDRINUSE` handling, preventing dev server restart collisions.
2. **Graceful Shutdown (`shutdown`)**:
   - Handles `SIGTERM` and `SIGINT` signals by:
     - Terminating active Socket.IO connections.
     - Closing idle and active keep-alive HTTP sockets via `server.closeAllConnections()`.
     - Disconnecting Mongoose database connections before calling `process.exit(0)`.
3. **Resilient Error Propagation**:
   - Global `unhandledRejection` and `uncaughtException` listeners log errors through Pino without abruptly crashing the application.
   - Centralized `errorHandler` middleware formats errors into predictable JSON structures:
     ```json
     {
       "success": false,
       "error": {
         "code": "NOT_FOUND",
         "message": "Challenge CHL-1029 not found"
       }
     }
     ```
4. **Defensive Security Controls**:
   - Helmet headers (`Cross-Origin-Resource-Policy`).
   - CORS origin validation with credential support.
   - Request body size limits (10MB) to prevent buffer exhaustion attacks.
