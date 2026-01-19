# SLO Criticality Matrix

A modern, open-source dashboard for managing Service Level Objective (SLO) criticality definitions across applications and services. Built with Next.js 16 and TypeScript.

![Dashboard Screenshot](docs/screenshots/dashboard.png)

## ✨ Features

### Core Functionality

- **Application Management** - Organize services by application with metadata (Manager, ITAO, Business Owner)
- **Service Time Windows** - Define multiple operating windows per service with different schedules
- **Escalation Tiers** - Configure priority escalation based on service degradation time
- **Priority Levels** - 6 severity levels (Pc, P1, P2, P3, P3c, P4) with visual color coding

### Validation & Analysis

- **Overlap Detection** - Automatic detection of conflicting time windows
- **Gap Analysis** - Identifies uncovered timeframes in service schedules
- **Visual Indicators** - Clear warning badges for configuration issues

### Visualization

- **Weekly Timeline View** - Interactive 24x7 grid showing service coverage
- **Degradation Slider** - Real-time priority escalation simulation
- **Color-Coded Schedule** - Visual representation of operating windows

### Data Export

- **Excel Export** - Multi-sheet export with:
  - Applications overview
  - Services list
  - Time windows with escalation tiers
  - Weekly coverage matrix

## 🛠 Tech Stack

| Technology                                    | Purpose                         |
| --------------------------------------------- | ------------------------------- |
| [Next.js 16](https://nextjs.org/)             | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript            |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first CSS framework     |
| [Lucide React](https://lucide.dev/)           | Icon library                    |
| [xlsx](https://sheetjs.com/)                  | Excel file generation           |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-org/slo-criticality-matrix.git
cd slo-criticality-matrix

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main dashboard page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ApplicationCard.tsx       # App list item
│   ├── ApplicationDetailView.tsx # App modal with services
│   ├── ServiceOverviewCard.tsx   # Service summary card
│   ├── ServiceDetailView.tsx     # Service modal with entries
│   ├── ServiceTimelineView.tsx   # 24x7 timeline visualization
│   └── ServiceEntryForm.tsx      # Add/edit time windows
├── data/
│   └── mockData.ts       # Sample data for development
├── lib/
│   ├── criticalityUtils.ts   # Priority color helpers
│   ├── validationUtils.ts    # Overlap & gap detection
│   ├── exportUtils.ts        # Excel export
│   └── timelineUtils.ts      # Timeline helpers
└── types/
    └── index.ts          # TypeScript interfaces
```

## 📊 Data Model

### Entity Relationship Diagram

```mermaid
erDiagram
    APPLICATION ||--o{ SERVICE : "has many"
    SERVICE ||--o{ SERVICE_ENTRY : "has many"
    SERVICE_ENTRY ||--o{ ESCALATION_TIER : "has many"

    APPLICATION {
        string id PK
        string appId UK "External ID (APP-001)"
        string name
        string manager
        string itao
        string businessOwner
    }

    SERVICE {
        string id PK
        string appId FK "Links to Application"
        string serviceName
    }

    SERVICE_ENTRY {
        string id PK
        array operatingDays "Mon, Tue, Wed..."
        string operatingStartTime "09:00"
        string operatingEndTime "17:00"
    }

    ESCALATION_TIER {
        string priority "Pc, P1, P2, P3, P3c, P4"
        int minDowntimeMinutes
        int maxDowntimeMinutes "null = unlimited"
    }
```

### Data Flow

```
┌─────────────────┐
│   Application   │  One application can have many services
└────────┬────────┘
         │ 1:N (linked via appId)
         ▼
┌─────────────────┐
│    Service      │  One service can have many time windows
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────┐
│  ServiceEntry   │  One entry = operating hours for specific days
│  (Time Window)  │  with escalation tiers
└────────┬────────┘
         │ 1:N
         ▼
┌─────────────────┐
│ EscalationTier  │  Priority level based on downtime duration
└─────────────────┘
```

> **📝 Adding Data:** See [`src/data/mockData.ts`](src/data/mockData.ts) for detailed instructions on adding applications, services, and time windows.

### Application

```typescript
interface AppMasterData {
  id: string;
  appId: string; // e.g., "APP-001"
  name: string;
  manager: string;
  managerDelegate: string;
  itao: string;
  itaoDelegate: string;
  businessOwner: string;
  businessOwnerDelegate: string;
}
```

### Service

```typescript
interface Service {
  id: string;
  appId: string;
  serviceName: string;
  entries: ServiceEntry[];
}
```

### Service Entry (Time Window)

```typescript
interface ServiceEntry {
  id: string;
  operatingDays: Day[]; // ['Mon', 'Tue', ...]
  operatingStartTime: string; // "08:00"
  operatingEndTime: string; // "18:00"
  escalationTiers: EscalationTier[];
}
```

### Escalation Tier

```typescript
interface EscalationTier {
  priority: Criticality; // 'Pc' | 'P1' | 'P2' | 'P3' | 'P3c' | 'P4'
  minDowntimeMinutes: number;
  maxDowntimeMinutes: number | null;
}
```

## 🎨 Priority Levels

| Priority | Color     | Description                          |
| -------- | --------- | ------------------------------------ |
| Pc       | 🔴 Red    | Critical - Immediate action required |
| P1       | 🔴 Red    | High - Urgent response needed        |
| P2       | 🟠 Orange | Medium-High - Quick attention needed |
| P3       | 🟡 Yellow | Medium - Standard response           |
| P3c      | 🟡 Yellow | Medium-Low - Extended response time  |
| P4       | 🟢 Green  | Low - Scheduled maintenance window   |

## 🔧 Configuration

### Environment Variables

Currently, the application uses mock data. To connect to a backend:

```env
# .env.local
DATABASE_URL=your-database-url
API_BASE_URL=your-api-endpoint
```

## 🚀 Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔮 Future Features & Roadmap

### Planned Enhancements

- [ ] **User Authentication** - SSO integration (OAuth2, SAML)
- [ ] **Role-Based Access Control** - Admin, Editor, Viewer roles
- [ ] **Audit Logging** - Track all configuration changes
- [ ] **Version History** - Rollback to previous configurations
- [ ] **Bulk Import** - CSV/Excel import for mass updates
- [ ] **Notifications** - Email/Slack alerts for SLO breaches
- [ ] **API Integration** - REST API for external systems
- [ ] **Dashboard Widgets** - Customizable dashboard layouts
- [ ] **Dark/Light Theme Toggle** - User preference settings
- [ ] **Multi-Language Support** - i18n localization

### Advanced Features

- [ ] **Real-Time Monitoring Integration** - Connect to Prometheus, Datadog, etc.
- [ ] **SLO Budget Tracking** - Calculate error budgets and burn rates
- [ ] **Incident Correlation** - Link SLO breaches to incidents
- [ ] **Reporting & Analytics** - Historical trends and compliance reports
- [ ] **Calendar View** - Monthly/yearly schedule overview
- [ ] **Template Library** - Reusable service configurations
- [ ] **Dependency Mapping** - Service relationship visualization

## 🗄️ Backend Integration

The frontend is currently standalone with mock data. For production use, you'll need a backend API.

### Recommended Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   REST API      │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Database Schema

```sql
-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  manager VARCHAR(255),
  manager_delegate VARCHAR(255),
  itao VARCHAR(255),
  itao_delegate VARCHAR(255),
  business_owner VARCHAR(255),
  business_owner_delegate VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Service entries (time windows)
CREATE TABLE service_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  operating_days TEXT[] NOT NULL,
  operating_start_time TIME NOT NULL,
  operating_end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Escalation tiers
CREATE TABLE escalation_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES service_entries(id) ON DELETE CASCADE,
  priority VARCHAR(10) NOT NULL,
  min_downtime_minutes INTEGER NOT NULL,
  max_downtime_minutes INTEGER,
  tier_order INTEGER NOT NULL
);
```

### API Endpoints

| Method   | Endpoint                         | Description              |
| -------- | -------------------------------- | ------------------------ |
| `GET`    | `/api/applications`              | List all applications    |
| `POST`   | `/api/applications`              | Create application       |
| `GET`    | `/api/applications/:id`          | Get application details  |
| `PUT`    | `/api/applications/:id`          | Update application       |
| `DELETE` | `/api/applications/:id`          | Delete application       |
| `GET`    | `/api/applications/:id/services` | List services for app    |
| `GET`    | `/api/services`                  | List all services        |
| `POST`   | `/api/services`                  | Create service           |
| `GET`    | `/api/services/:id`              | Get service with entries |
| `PUT`    | `/api/services/:id`              | Update service           |
| `DELETE` | `/api/services/:id`              | Delete service           |
| `POST`   | `/api/services/:id/entries`      | Add time window          |
| `PUT`    | `/api/entries/:id`               | Update time window       |
| `DELETE` | `/api/entries/:id`               | Delete time window       |
| `GET`    | `/api/export/excel`              | Export all data as Excel |

### Backend Tech Stack Options

| Stack                             | Best For                    |
| --------------------------------- | --------------------------- |
| **Node.js + Express + Prisma**    | JavaScript/TypeScript teams |
| **Python + FastAPI + SQLAlchemy** | Data-heavy workloads        |
| **Go + Gin + GORM**               | High performance needs      |
| **Next.js API Routes**            | Simplest integration        |

### Environment Variables (with Backend)

```env
# .env.local
DATABASE_URL=postgresql://user:pass@localhost:5432/slo_matrix
API_BASE_URL=http://localhost:4000/api

# Authentication (optional)
AUTH_SECRET=your-secret-key
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret

# Feature Flags
ENABLE_AUDIT_LOG=true
ENABLE_NOTIFICATIONS=false
```

### Connecting Frontend to Backend

Update `src/lib/api.ts`:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchApplications() {
  const res = await fetch(`${API_BASE}/applications`);
  return res.json();
}

export async function fetchServices(appId?: string) {
  const url = appId
    ? `${API_BASE}/applications/${appId}/services`
    : `${API_BASE}/services`;
  const res = await fetch(url);
  return res.json();
}

// ... additional API functions
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by enterprise SLO management needs
- Built with modern React patterns and best practices
- Designed for clarity and usability

---

**Made with ❤️ for the DevOps and SRE community**
