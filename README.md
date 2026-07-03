# Distributed System Simulator — React SPA

🇺🇸 **English** | [🇹🇭 ภาษาไทย](README_TH.md)

---

A production-inspired, interactive visualization of distributed backend infrastructure built with React. This project simulates the runtime behavior of **Apache Kafka**, **Kubernetes (K8s)**, and **containerized microservices** — without requiring any backend, cloud account, or DevOps toolchain.

Designed as an educational tool for developers who want to build an intuition for how high-concurrency systems behave under load, failure, and recovery conditions.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React SPA (Client)                    │
│                                                             │
│   User Action                                               │
│       │                                                     │
│       ▼                                                     │
│  [ Kafka Queue ]  ──────────────►  [ Kubernetes Cluster ]  │
│  (Message Broker)                  (Pod Orchestration)      │
│  • Async ingestion                 • HPA auto-scaling       │
│  • 202 Accepted                    • Self-healing           │
│  • Consumer loop                   • Load distribution      │
│                                                             │
│   Booking Counter tracks total tickets booked               │
└─────────────────────────────────────────────────────────────┘
```

All simulation state is managed in a custom `useSimulation` hook. No external APIs or backend services are required.

---

## Features

### 🎟️ Ticket Booking with Live Counter
Each click on **"จองตั๋วคอนเสิร์ต"** enqueues an async booking request into the Kafka topic and increments a persistent booking counter, reflecting the total tickets booked across the session.

### ⚡ Horizontal Pod Autoscaling (HPA)
When queue depth exceeds the configurable HPA threshold, Kubernetes automatically provisions additional backend pods (`Pending → Running`) to absorb the surge. Pods scale back down once the queue drains.

### 💥 Crash & Self-Healing
Triggering a server crash sets a pod to `Terminating`, removes it, and re-provisions a replacement automatically — demonstrating Kubernetes liveness probe and restart behavior within 1.5 seconds.

### 📊 Configurable Simulation Parameters
- **Consumer speed** — adjust Kafka consumer processing interval (0.5s – 5s)
- **HPA threshold** — set the queue depth that triggers scale-up (2 – 5 items)

### 📝 Persistent Activity Log
All system events (bookings, scale-up/down, crashes, recoveries) are logged with Thai-locale timestamps and persisted to `localStorage` across page refreshes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Hooks-based, no class components) |
| Routing | React Router v6 (client-side SPA) |
| Build Tool | Vite 6 (HMR, file polling for WSL/Windows) |
| Styling | Vanilla CSS (design tokens, dark theme, BEM) |
| State | `useState`, `useRef`, `useCallback`, `useEffect` |
| Persistence | `localStorage` (log history) |

---

## Project Structure

```
src/
├── hooks/
│   └── useSimulation.js      # Core simulation engine (pods, queue, HPA, healing)
├── components/
│   ├── Navbar.jsx             # Top navigation bar
│   ├── KubernetesCluster.jsx  # Pod grid visualization
│   ├── KafkaQueue.jsx         # Queue depth visualization
│   ├── PodCard.jsx            # Individual pod status card
│   ├── LogPanel.jsx           # Event log with clear action
│   └── SimControls.jsx        # Consumer speed & HPA threshold sliders
├── pages/
│   ├── SimulationPage.jsx     # Main simulator orchestrator
│   ├── AboutPage.jsx          # Concept reference page
│   └── NotFound.jsx           # 404 fallback
├── constants/
│   └── simulation.js          # Timing constants, initial state, mock users
└── index.css                  # Design system (tokens, dark theme, animations)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (localhost:5173)
npm run dev

# Production build
npm run build
```

---

## Simulation Guide

| Action | What to observe |
|---|---|
| Click **"จองตั๋วคอนเสิร์ต"** once | Request enters Kafka queue → consumed by a pod → booking counter increments |
| Click **4–5 times rapidly** | Queue depth exceeds HPA threshold → 2 new pods spin up (Pending → Running) |
| Wait ~10 seconds | Queue drains → HPA scales down to baseline pod count |
| Click **"ทำให้เซิร์ฟเวอร์ล่ม"** | Pod crashes → Kubernetes removes it → new pod self-heals within 1.5s |
| Drag **Consumer Speed** slider | Observe queue backlog build or drain faster |
| Drag **HPA Threshold** slider | Lower = scale-up triggers sooner under load |

---

## Concepts Demonstrated

- **Asynchronous messaging** — fire-and-forget with `202 Accepted`, decoupled processing
- **Event-driven architecture** — producer/consumer separation via a message queue
- **Horizontal scaling** — stateless pods added dynamically based on observed load
- **Fault tolerance & self-healing** — automated failure detection and pod replacement
- **Single-Page Application routing** — client-side navigation without full page reloads

---

*Built as a conceptual learning tool. No real Kafka brokers, Kubernetes clusters, or backend servers are used.*
