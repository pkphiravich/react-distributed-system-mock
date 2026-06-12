# 🎫 Simulated Distributed System (React Router SPA)

🇺🇸 **English** | [🇹🇭 อ่านภาษาไทยที่นี่](README_TH.md)
---

A lightweight yet conceptual project designed to visualize high-level distributed systems and infrastructure concepts—such as **Apache Kafka**, **Kubernetes (K8s)**, and **Docker Containers**—all within a single-page React application (SPA).

---

## Concept Overview
Understanding server-side concepts like **High Concurrency**, **Message Queues**, or **Infrastructure Scaling** can be challenging in theory. This project leverages React state management and React Router v6 to mock these complex distributed system architectures into interactive visual logs and real-time structural graphs—understandable **at first glance!**

---

## Interactive Features (How to Play)
Once the project is running locally, you can trigger and observe key architectural behaviors:

1. **🎟️ Book Concert Ticket (High Concurrency Simulation):** Clicking this initiates an asynchronous task. The request is immediately dispatched into the **Apache Kafka queue (Orange Box)**, which responds with an instant mock `202 Accepted` status to prevent UI freezing. The consumer later processes the orders background sequentially.
2. **⚡ Stress Test (Clicking "Book Ticket" Repetitively):** When the Kafka topic accumulates a backlog, the simulated **Kubernetes cluster triggers Horizontal Pod Autoscaling (HPA)**, spinning up additional mock backend server instances (Blue Containers) to balance the high workload.
3. **💥 Simulate Server Crash (Self-Healing Mechanisms):** Clicking the red button forces the main server node to crash (mocking an internal `500 Server Error`). Within 1.5 seconds, the simulated **Kubernetes orchestrator automatically detects the failure and self-heals**, restarting a brand new container instance to restore high availability.

---

## Core Concepts Covered
* **Front-end Client-Side Routing:** React Router v6 (SPA State Preservation)
* **Message Brokering & Event Streaming:** Apache Kafka (Publish-Subscribe Pattern)
* **Container Orchestration:** Kubernetes (Auto-scaling, Self-healing, Fault Tolerance)
* **Development Workflow:** Vite Hot Module Replacement (HMR) with File Polling

---

## 📦 Getting Started

To spin up this laboratory setup in your local environment, run the following commands:

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server with HMR enabled
npm run dev
