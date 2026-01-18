"use client";

import { useState } from "react";
import { X, Clock } from "lucide-react";
import {
  Service,
  ServiceEntry,
  Day,
  DAYS,
  formatDowntime,
  Criticality,
  formatTimeRange,
} from "@/types";
import {
  getCriticalityColor,
  getCriticalityTextColor,
} from "@/lib/criticalityUtils";

interface ServiceTimelineViewProps {
  service: Service;
  onClose: () => void;
}

export function ServiceTimelineView({
  service,
  onClose,
}: ServiceTimelineViewProps) {
  const [degradationMinutes, setDegradationMinutes] = useState(0);

  // Get current priority for a specific entry based on degradation time
  const getEntryPriority = (entry: ServiceEntry): Criticality | null => {
    for (const tier of entry.escalationTiers) {
      const min = tier.minDowntimeMinutes;
      const max = tier.maxDowntimeMinutes;

      if (
        degradationMinutes >= min &&
        (max === null || degradationMinutes < max)
      ) {
        return tier.priority;
      }
    }
    const lastTier = entry.escalationTiers[entry.escalationTiers.length - 1];
    return lastTier?.priority || null;
  };

  // Parse time to hours
  const parseHour = (time: string): number => parseInt(time.split(":")[0]);

  // Generate hours array (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Find which entry covers a specific day/hour
  const findEntry = (day: Day, hour: number): ServiceEntry | null => {
    for (const entry of service.entries) {
      if (!entry.operatingDays.includes(day)) continue;

      const startHour = parseHour(entry.operatingStartTime);
      const endHour = parseHour(entry.operatingEndTime);

      // Handle 24:00 as end time
      const effectiveEndHour = endHour === 0 ? 24 : endHour;

      if (startHour <= effectiveEndHour) {
        if (hour >= startHour && hour < effectiveEndHour) {
          return entry;
        }
      } else {
        // Overnight: e.g., 22:00 - 06:00
        if (hour >= startHour || hour < effectiveEndHour) {
          return entry;
        }
      }
    }
    return null;
  };

  // Get cell color based on which entry covers it
  const getCellColor = (day: Day, hour: number): string => {
    const entry = findEntry(day, hour);
    if (!entry) {
      return "bg-slate-800/30"; // Non-operating hours
    }

    const priority = getEntryPriority(entry);
    if (priority) {
      return getCriticalityColor(priority);
    }

    return "bg-slate-600";
  };

  // Max slider value (4 hours)
  const maxSliderMinutes = 240;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {service.serviceName}
            </h2>
            <p className="text-sm text-slate-400">
              Weekly Schedule • {service.entries.length} time window
              {service.entries.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Degradation Time Slider */}
          <div className="bg-slate-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">
                  Service Degradation Time
                </span>
              </div>
              <span className="text-2xl font-bold text-white">
                {formatDowntime(degradationMinutes)}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={maxSliderMinutes}
              step="1"
              value={degradationMinutes}
              onChange={(e) => setDegradationMinutes(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />

            {/* Time markers */}
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>0 min</span>
              <span>1 hour</span>
              <span>2 hours</span>
              <span>3 hours</span>
              <span>4 hours</span>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Hours header */}
              <div className="flex">
                <div className="w-16 flex-shrink-0"></div>
                <div className="flex-1 flex">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="flex-1 text-center text-xs text-slate-500 pb-2"
                    >
                      {hour.toString().padStart(2, "0")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Days rows */}
              {DAYS.map((day) => {
                // Helper to check if this hour is the start of an operating window
                const isWindowStart = (hour: number): boolean => {
                  const entry = findEntry(day, hour);
                  if (!entry) return false;
                  const startHour = parseHour(entry.operatingStartTime);
                  return hour === startHour;
                };

                // Helper to check if this hour is the last hour of an operating window
                const isWindowEnd = (hour: number): boolean => {
                  const entry = findEntry(day, hour);
                  if (!entry) return false;
                  const endHour = parseHour(entry.operatingEndTime);
                  const effectiveEndHour = endHour === 0 ? 24 : endHour;
                  return hour === effectiveEndHour - 1;
                };

                return (
                  <div key={day} className="flex mb-1">
                    <div className="w-16 flex-shrink-0 flex items-center">
                      <span className="text-sm font-medium text-white">
                        {day}
                      </span>
                    </div>
                    <div className="flex-1 flex">
                      {hours.map((hour) => {
                        const entry = findEntry(day, hour);
                        const roundLeft = isWindowStart(hour)
                          ? "rounded-l-lg"
                          : "";
                        const roundRight = isWindowEnd(hour)
                          ? "rounded-r-lg"
                          : "";
                        return (
                          <div
                            key={hour}
                            className={`flex-1 h-8 transition-colors ${roundLeft} ${roundRight} ${getCellColor(day, hour)} ${
                              entry ? "opacity-100" : "opacity-40"
                            }`}
                            title={
                              entry
                                ? `${day} ${hour.toString().padStart(2, "0")}:00 • ${formatTimeRange(entry.operatingStartTime, entry.operatingEndTime)} • Priority: ${getEntryPriority(entry)}`
                                : `${day} ${hour.toString().padStart(2, "0")}:00 • Non-operating`
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Entry Legend */}
          <div className="bg-slate-900/30 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Time Windows & Current Priority
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {service.entries.map((entry) => {
                const priority = getEntryPriority(entry);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-2"
                  >
                    {priority && (
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${getCriticalityColor(priority)} ${getCriticalityTextColor(priority)}`}
                      >
                        {priority}
                      </span>
                    )}
                    <div className="text-sm">
                      <p className="text-white">
                        {formatTimeRange(
                          entry.operatingStartTime,
                          entry.operatingEndTime,
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        {entry.operatingDays.join(", ")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
