import { AppMasterData, Service } from "@/types";

/**
 * ============================================================================
 * MOCK DATA - How to Add Applications and Services
 * ============================================================================
 *
 * This file contains sample data for the SLO Criticality Matrix.
 * In production, this data would come from a backend API/database.
 *
 * DATA RELATIONSHIPS:
 * ┌─────────────────┐
 * │   Application   │  One application can have many services
 * │   (AppMasterData) │
 * └────────┬────────┘
 *          │ 1:N (via appId)
 *          ▼
 * ┌─────────────────┐
 * │    Service      │  One service can have many time window entries
 * └────────┬────────┘
 *          │ 1:N
 *          ▼
 * ┌─────────────────┐
 * │  ServiceEntry   │  One entry defines operating hours for specific days
 * │  (Time Window)  │  with escalation tiers
 * └────────┬────────┘
 *          │ 1:N
 *          ▼
 * ┌─────────────────┐
 * │ EscalationTier  │  Priority level based on downtime duration
 * └─────────────────┘
 *
 * ============================================================================
 * HOW TO ADD A NEW APPLICATION:
 * ============================================================================
 *
 * Add an object to the `mockApps` array with these fields:
 *
 * {
 *   id: "app-X",           // Internal unique ID (any string)
 *   appId: "APP-XXX",      // External ID from your system (e.g., CMDB)
 *   name: "App Name",      // Display name
 *   manager: "Name",       // Application manager
 *   managerDelegate: "Name",
 *   itao: "Name",          // IT Application Owner
 *   itaoDelegate: "Name",
 *   businessOwner: "Name",
 *   businessOwnerDelegate: "Name",
 * }
 *
 * ============================================================================
 * HOW TO ADD A NEW SERVICE:
 * ============================================================================
 *
 * Add an object to the `mockServices` array:
 *
 * {
 *   id: "svc-X",           // Unique service ID
 *   serviceName: "Name",   // Display name
 *   appId: "APP-XXX",      // Must match an application's appId field!
 *   entries: [...]         // Array of time window entries (see below)
 * }
 *
 * ============================================================================
 * HOW TO ADD A TIME WINDOW ENTRY:
 * ============================================================================
 *
 * Each entry defines operating hours for specific days:
 *
 * {
 *   id: "entry-X",                           // Unique entry ID
 *   operatingDays: ["Mon", "Tue", ...],      // Days: Mon|Tue|Wed|Thu|Fri|Sat|Sun
 *   operatingStartTime: "09:00",             // Start time (24h format)
 *   operatingEndTime: "17:00",               // End time (use "24:00" for midnight)
 *   escalationTiers: [                       // Priority escalation rules
 *     { priority: "P4", minDowntimeMinutes: 0, maxDowntimeMinutes: 60 },
 *     { priority: "P3", minDowntimeMinutes: 60, maxDowntimeMinutes: 180 },
 *     { priority: "P2", minDowntimeMinutes: 180, maxDowntimeMinutes: null }, // null = no limit
 *   ]
 * }
 *
 * PRIORITY LEVELS: Pc (Critical) > P1 > P2 > P3 > P3c > P4 (Low)
 *
 * ============================================================================
 */

export const mockApps: AppMasterData[] = [
  {
    id: "app-1",
    name: "E-Commerce Shop",
    appId: "APP-001",
    manager: "John Smith",
    managerDelegate: "Sarah Johnson",
    itao: "Mike Wilson",
    itaoDelegate: "Emily Brown",
    businessOwner: "David Lee",
    businessOwnerDelegate: "Lisa Chen",
  },
  {
    id: "app-2",
    name: "Internal HR Portal",
    appId: "APP-002",
    manager: "Sarah Johnson",
    managerDelegate: "Robert Davis",
    itao: "James Taylor",
    itaoDelegate: "Jennifer White",
    businessOwner: "Michael Anderson",
    businessOwnerDelegate: "Patricia Thomas",
  },
  {
    id: "app-3",
    name: "Customer Support Portal",
    appId: "APP-003",
    manager: "Chris Miller",
    managerDelegate: "Rachel Green",
    itao: "Kevin Brown",
    itaoDelegate: "Amanda Clark",
    businessOwner: "Steven Harris",
    businessOwnerDelegate: "Nicole Martin",
  },
  {
    id: "app-4",
    name: "Customer Support Portal",
    appId: "APP-004",
    manager: "Chris Miller",
    managerDelegate: "Rachel Green",
    itao: "Kevin Brown",
    itaoDelegate: "Amanda Clark",
    businessOwner: "Steven Harris",
    businessOwnerDelegate: "Nicole Martin",
  },
];

export const mockServices: Service[] = [
  // Payment Gateway
  {
    id: "svc-1",
    serviceName: "Payment Gateway",
    appId: "APP-001",
    entries: [
      {
        id: "entry-1a",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        operatingStartTime: "00:00",
        operatingEndTime: "08:00",
        escalationTiers: [
          { priority: "P4", minDowntimeMinutes: 0, maxDowntimeMinutes: 60 },
          { priority: "P3", minDowntimeMinutes: 60, maxDowntimeMinutes: 180 },
          { priority: "P2", minDowntimeMinutes: 180, maxDowntimeMinutes: null },
        ],
      },
      {
        id: "entry-1b",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        operatingStartTime: "08:00",
        operatingEndTime: "17:00",
        escalationTiers: [
          { priority: "P3c", minDowntimeMinutes: 0, maxDowntimeMinutes: 30 },
          { priority: "P2", minDowntimeMinutes: 30, maxDowntimeMinutes: 120 },
          { priority: "P1", minDowntimeMinutes: 120, maxDowntimeMinutes: null },
        ],
      },
      {
        id: "entry-1c",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        operatingStartTime: "17:00",
        operatingEndTime: "24:00",
        escalationTiers: [
          { priority: "P4", minDowntimeMinutes: 0, maxDowntimeMinutes: 60 },
          { priority: "P3", minDowntimeMinutes: 60, maxDowntimeMinutes: 180 },
          { priority: "P2", minDowntimeMinutes: 180, maxDowntimeMinutes: null },
        ],
      },
    ],
  },
  // Product Catalog API
  {
    id: "svc-2",
    serviceName: "Product Catalog API",
    appId: "APP-001",
    entries: [
      {
        id: "entry-2a",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        operatingStartTime: "00:00",
        operatingEndTime: "24:00",
        escalationTiers: [
          { priority: "P4", minDowntimeMinutes: 0, maxDowntimeMinutes: 60 },
          { priority: "P3", minDowntimeMinutes: 60, maxDowntimeMinutes: 240 },
          { priority: "P2", minDowntimeMinutes: 240, maxDowntimeMinutes: null },
        ],
      },
    ],
  },
  // Checkout Service
  {
    id: "svc-3",
    serviceName: "Checkout Service",
    appId: "APP-001",
    entries: [
      {
        id: "entry-3a",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        operatingStartTime: "08:00",
        operatingEndTime: "22:00",
        escalationTiers: [
          { priority: "P2", minDowntimeMinutes: 0, maxDowntimeMinutes: 15 },
          { priority: "P1", minDowntimeMinutes: 15, maxDowntimeMinutes: 60 },
          { priority: "Pc", minDowntimeMinutes: 60, maxDowntimeMinutes: null },
        ],
      },
      {
        id: "entry-3b",
        operatingDays: ["Sat", "Sun"],
        operatingStartTime: "10:00",
        operatingEndTime: "20:00",
        escalationTiers: [
          { priority: "P3", minDowntimeMinutes: 0, maxDowntimeMinutes: 30 },
          { priority: "P2", minDowntimeMinutes: 30, maxDowntimeMinutes: 120 },
          { priority: "P1", minDowntimeMinutes: 120, maxDowntimeMinutes: null },
        ],
      },
    ],
  },
  // Employee Database
  {
    id: "svc-4",
    serviceName: "Employee Database",
    appId: "APP-002",
    entries: [
      {
        id: "entry-4a",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        operatingStartTime: "09:00",
        operatingEndTime: "18:00",
        escalationTiers: [
          { priority: "P3c", minDowntimeMinutes: 0, maxDowntimeMinutes: 30 },
          { priority: "P3", minDowntimeMinutes: 30, maxDowntimeMinutes: 120 },
          { priority: "P2", minDowntimeMinutes: 120, maxDowntimeMinutes: null },
        ],
      },
    ],
  },
  // Payroll System
  {
    id: "svc-5",
    serviceName: "Payroll System",
    appId: "APP-002",
    entries: [
      {
        id: "entry-5a",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        operatingStartTime: "09:00",
        operatingEndTime: "17:00",
        escalationTiers: [
          { priority: "P3", minDowntimeMinutes: 0, maxDowntimeMinutes: 60 },
          { priority: "P2", minDowntimeMinutes: 60, maxDowntimeMinutes: 180 },
          { priority: "P1", minDowntimeMinutes: 180, maxDowntimeMinutes: null },
        ],
      },
    ],
  },
  // Customer Ticket System
  {
    id: "svc-6",
    serviceName: "Ticket System",
    appId: "APP-003",
    entries: [
      {
        id: "entry-6a",
        operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        operatingStartTime: "00:00",
        operatingEndTime: "24:00",
        escalationTiers: [
          { priority: "P3", minDowntimeMinutes: 0, maxDowntimeMinutes: 30 },
          { priority: "P2", minDowntimeMinutes: 30, maxDowntimeMinutes: 60 },
          { priority: "P1", minDowntimeMinutes: 60, maxDowntimeMinutes: null },
        ],
      },
    ],
  },
];
