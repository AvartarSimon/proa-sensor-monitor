# Proa Sensor Monitor System

This project simulates a Modbus temperature sensor, collects and stores data in PostgreSQL, and provides a React frontend for visualization and control. All backend services are implemented in Node.js/TypeScript.

---

## Local Development Setup Instructions

### 1. Clone the Repository
If you haven’t already:
```bash
git clone https://github.com/AvartarSimon/proa-sensor-monitor
cd proa-sensor-monitor
```

---

### 2. Install Dependencies for Each Service

#### Sensor Data Collector
```bash
cd sensor-data-collector
npm install
```
#### Modbus Sensor Simulator
```bash
cd ../modbus-sensor-simulator
npm install
```

#### Frontend Client
```bash
cd ../proa-monitor-dashboard
npm install
```

---

### 3. Start PostgreSQL Database and All Services (Recommended)

If you have Docker installed, use Docker Compose:

```bash
cd ..
docker-compose up --build
```

This will:
- Start PostgreSQL
- Build and start all Node.js services
- Build and start the React frontend

---

### 4. Manual Start (Alternative, for development/debugging)

In separate terminal windows/tabs:

- **Start PostgreSQL** (if not using Docker, ensure it’s running and matches your connection string)
- **Start Modbus Sensor Simulator:**
  ```bash
  cd modbus-sensor-simulator
  npm run start
  ```

  ```
- **Start Sensor Data Collector:**
  ```bash
  cd sensor-data-collector
  npm run start
  ```
- **Start Frontend Client:**
  ```bash
  cd proa-monitor-dashboard
  npm run dev
  ```
  (or `npm run start` depending on your frontend setup)

---

### 5. Access the App

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Sensor Management API:** [http://localhost:4000](http://localhost:4000)
- **Modbus Sensor Simulator:** Port 5020 (internal, for Modbus TCP)
- **PostgreSQL:** Port 5432

---

### 6. (Optional) Database Initialization

The schema should be automatically loaded via Docker Compose. If not, run the SQL in `sensor-management-api/db/schema.sql` manually in your PostgreSQL instance.

---

## Summary Table

| Service                   | How to Start (Docker) | How to Start (Manual)         | Port   |
|---------------------------|----------------------|-------------------------------|--------|
| PostgreSQL                | docker-compose up    | (install & run locally)       | 5432   |
| Modbus Sensor Simulator   | docker-compose up    | npm run start                 | 5020   |
| Sensor Data Collector     | docker-compose up    | npm run start                 | 4001   |
| Sensor Management API     | docker-compose up    | npm run start                 | 4000   |
| sensor-management-api     | docker-compose up    | npm run dev                   | 3000   |

---

Let me know if you have any issues running the stack or need further help! 

```sh

docker-compose exec sensor-management-api npx prisma generate

docker-compose exec sensor-management-api npx prisma migrate dev --name init

docker-compose build --no-cache proa-monitor-dashboard

docker-compose up proa-monitor-dashboard

docker-compose down  --remove-orphans
```