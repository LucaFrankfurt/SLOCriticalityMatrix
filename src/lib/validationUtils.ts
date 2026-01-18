import { Service, ServiceEntry, Day, DAYS } from "@/types";

export interface ValidationIssue {
  type: "overlap" | "gap" | "invalid";
  severity: "error" | "warning";
  message: string;
  entryIds: string[];
  affectedDays?: Day[];
  affectedHours?: string;
}

export interface GapInfo {
  day: Day;
  startHour: number;
  endHour: number;
}

// Parse time string to hour number
function parseHour(time: string): number {
  return parseInt(time.split(":")[0]);
}

// Check if two time ranges overlap on a specific day
function rangesOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): boolean {
  // Handle 24:00 as end time
  const effectiveEnd1 = end1 === 0 ? 24 : end1;
  const effectiveEnd2 = end2 === 0 ? 24 : end2;

  return start1 < effectiveEnd2 && start2 < effectiveEnd1;
}

// Validate all entries in a service for overlaps
export function validateServiceEntries(service: Service): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const entries = service.entries;

  // Check each pair of entries for overlaps
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const entry1 = entries[i];
      const entry2 = entries[j];

      // Find common days
      const commonDays = entry1.operatingDays.filter((day) =>
        entry2.operatingDays.includes(day),
      );

      if (commonDays.length === 0) continue;

      // Check time overlap
      const start1 = parseHour(entry1.operatingStartTime);
      const end1 = parseHour(entry1.operatingEndTime);
      const start2 = parseHour(entry2.operatingStartTime);
      const end2 = parseHour(entry2.operatingEndTime);

      if (rangesOverlap(start1, end1, start2, end2)) {
        issues.push({
          type: "overlap",
          severity: "error",
          message: `Time windows overlap on ${commonDays.join(", ")}: ${entry1.operatingStartTime}-${entry1.operatingEndTime} conflicts with ${entry2.operatingStartTime}-${entry2.operatingEndTime}`,
          entryIds: [entry1.id, entry2.id],
          affectedDays: commonDays,
          affectedHours: `${Math.max(start1, start2)}:00 - ${Math.min(end1 === 0 ? 24 : end1, end2 === 0 ? 24 : end2)}:00`,
        });
      }
    }
  }

  return issues;
}

// Find gaps in coverage (hours not covered by any entry)
export function findCoverageGaps(service: Service): GapInfo[] {
  const gaps: GapInfo[] = [];

  for (const day of DAYS) {
    // Create an array to track covered hours (0-23)
    const coveredHours = new Array(24).fill(false);

    // Mark covered hours for this day
    for (const entry of service.entries) {
      if (!entry.operatingDays.includes(day)) continue;

      const startHour = parseHour(entry.operatingStartTime);
      const endHour = parseHour(entry.operatingEndTime);
      const effectiveEndHour = endHour === 0 ? 24 : endHour;

      for (let h = startHour; h < effectiveEndHour; h++) {
        coveredHours[h] = true;
      }
    }

    // Find continuous gaps
    let gapStart: number | null = null;
    for (let h = 0; h <= 24; h++) {
      if (h < 24 && !coveredHours[h]) {
        if (gapStart === null) {
          gapStart = h;
        }
      } else {
        if (gapStart !== null) {
          gaps.push({
            day,
            startHour: gapStart,
            endHour: h,
          });
          gapStart = null;
        }
      }
    }
  }

  return gaps;
}

// Format gaps into human-readable strings
export function formatGaps(gaps: GapInfo[]): string[] {
  // Group gaps by time range
  const groupedGaps: Map<string, Day[]> = new Map();

  for (const gap of gaps) {
    const timeKey = `${gap.startHour.toString().padStart(2, "0")}:00-${gap.endHour.toString().padStart(2, "0")}:00`;
    if (!groupedGaps.has(timeKey)) {
      groupedGaps.set(timeKey, []);
    }
    groupedGaps.get(timeKey)!.push(gap.day);
  }

  const messages: string[] = [];
  for (const [timeRange, days] of groupedGaps) {
    if (days.length === 7) {
      messages.push(`${timeRange} (Every day)`);
    } else if (
      days.length === 5 &&
      !days.includes("Sat") &&
      !days.includes("Sun")
    ) {
      messages.push(`${timeRange} (Mon - Fri)`);
    } else if (
      days.length === 2 &&
      days.includes("Sat") &&
      days.includes("Sun")
    ) {
      messages.push(`${timeRange} (Weekends)`);
    } else {
      messages.push(`${timeRange} (${days.join(", ")})`);
    }
  }

  return messages;
}

// Check if an entry has valid time range
export function validateEntryTimeRange(
  entry: Omit<ServiceEntry, "id">,
): ValidationIssue | null {
  const start = parseHour(entry.operatingStartTime);
  const end = parseHour(entry.operatingEndTime);
  const effectiveEnd = end === 0 ? 24 : end;

  if (start >= effectiveEnd && end !== 0) {
    return {
      type: "invalid",
      severity: "error",
      message: `Invalid time range: start time (${entry.operatingStartTime}) must be before end time (${entry.operatingEndTime})`,
      entryIds: [],
    };
  }

  if (entry.operatingDays.length === 0) {
    return {
      type: "invalid",
      severity: "error",
      message: "At least one operating day must be selected",
      entryIds: [],
    };
  }

  return null;
}

// Get all issues for a service (for display in UI)
export function getServiceValidationSummary(service: Service): {
  hasErrors: boolean;
  hasWarnings: boolean;
  hasGaps: boolean;
  issues: ValidationIssue[];
  gaps: GapInfo[];
  gapMessages: string[];
} {
  const issues = validateServiceEntries(service);
  const gaps = findCoverageGaps(service);
  const gapMessages = formatGaps(gaps);

  return {
    hasErrors: issues.some((i) => i.severity === "error"),
    hasWarnings: issues.some((i) => i.severity === "warning"),
    hasGaps: gaps.length > 0,
    issues,
    gaps,
    gapMessages,
  };
}
