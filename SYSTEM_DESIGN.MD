# System Design: PROA SENSOR MONITOR

## Overview

This system simulates a Modbus temperature sensor, enables real-time data read, stores sensor data in PostgreSQL, and provides a React.js frontend for visualization and interaction. All backend services are implemented in Node.js/TypeScript.


## Architecture Diagram (Mermaid)

Here is the diagram which use Mermaid
```mermaid
graph TD
  A["PROA monitor dashboard - React"]
  B["Sensor Management API - Node.js"]
  C["Sensor data collector - Node.js"]
  D["Modbus Sensor Simulator- Node.js"]
  E["PostgreSQL Database"]

  A -- "REST API (GET: fetch temperature)" --> B
  B -- "PostgreSQL (read temperature)" --> E
  B -- "HTTP" --> C
  C -- "Modbus TCP (read/write registers)" --> D
  C -- "PostgreSQL (store temperature)" --> E
  A -- "POST: control (period, amplitude, start/stop)" ---> B

```


Here is the screenshot for architecture diagram
![](./Architecture-Diagram.png)