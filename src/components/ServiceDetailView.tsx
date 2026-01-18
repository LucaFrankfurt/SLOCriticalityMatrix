'use client';

import { useState, useMemo } from 'react';
import { X, Plus, Clock, Calendar, ChevronDown, ChevronUp, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import { Service, ServiceEntry, formatDowntime, formatDays, formatTimeRange } from '@/types';
import { getCriticalityColor, getCriticalityTextColor } from '@/lib/criticalityUtils';
import { getServiceValidationSummary, ValidationIssue } from '@/lib/validationUtils';

interface ServiceDetailViewProps {
  service: Service;
  appName: string;
  onClose: () => void;
  onAddEntry: (serviceId: string) => void;
  onEditEntry: (serviceId: string, entry: ServiceEntry) => void;
  onDeleteEntry: (serviceId: string, entryId: string) => void;
  onViewTimeline: (service: Service) => void;
}

export function ServiceDetailView({
  service,
  appName,
  onClose,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onViewTimeline,
}: ServiceDetailViewProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Run validation
  const validation = useMemo(() => getServiceValidationSummary(service), [service]);

  // Check if an entry is involved in any issue
  const entryHasIssue = (entryId: string): ValidationIssue | undefined => {
    return validation.issues.find(issue => issue.entryIds.includes(entryId));
  };

  const toggleEntry = (entryId: string) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-white">{service.serviceName}</h2>
            <p className="text-sm text-slate-400">{appName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewTimeline(service)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors text-sm"
            >
              View Timeline
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Validation Issues Banner */}
          {validation.hasErrors && (
            <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-400 mb-2">
                    Time Window Configuration Issues
                  </p>
                  <ul className="space-y-1">
                    {validation.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-300/80">
                        • {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Coverage Gaps Warning */}
          {validation.hasGaps && (
            <div className="mb-4 p-4 bg-amber-900/30 border border-amber-700/50 rounded-xl">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-400 mb-2">
                    Missing Coverage - Uncovered Timeframes
                  </p>
                  <ul className="space-y-1">
                    {validation.gapMessages.map((msg, index) => (
                      <li key={index} className="text-sm text-amber-300/80">
                        • {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-300">
              {service.entries.length} Time Window{service.entries.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => onAddEntry(service.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>

          {/* Entries List */}
          <div className="space-y-3">
            {service.entries.map((entry) => {
              const isExpanded = expandedEntry === entry.id;
              const issue = entryHasIssue(entry.id);

              return (
                <div
                  key={entry.id}
                  className={`bg-slate-900/50 rounded-xl border overflow-hidden ${issue ? 'border-red-500/50' : 'border-slate-700/50'
                    }`}
                >
                  {/* Entry Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/70 transition-colors"
                    onClick={() => toggleEntry(entry.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-white font-medium">
                          {formatTimeRange(entry.operatingStartTime, entry.operatingEndTime)}
                        </span>
                        {issue && (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-400 text-sm">
                          {formatDays(entry.operatingDays)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Priority badges */}
                      <div className="flex gap-1">
                        {entry.escalationTiers.slice(0, 3).map((tier, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-xs font-bold ${getCriticalityColor(tier.priority)} ${getCriticalityTextColor(tier.priority)}`}
                          >
                            {tier.priority}
                          </span>
                        ))}
                        {entry.escalationTiers.length > 3 && (
                          <span className="text-xs text-slate-500">+{entry.escalationTiers.length - 3}</span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-700/50">
                      {issue && (
                        <div className="mt-3 p-2 bg-red-900/20 rounded-lg">
                          <p className="text-xs text-red-400">{issue.message}</p>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 uppercase tracking-wide mt-4 mb-2">
                        Escalation Tiers
                      </p>
                      <div className="space-y-2">
                        {entry.escalationTiers.map((tier, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold ${getCriticalityColor(tier.priority)} ${getCriticalityTextColor(tier.priority)}`}
                              >
                                {tier.priority}
                              </span>
                              <span className="text-sm text-slate-300">
                                {formatDowntime(tier.minDowntimeMinutes)} - {tier.maxDowntimeMinutes !== null ? formatDowntime(tier.maxDowntimeMinutes) : '∞'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Entry Actions */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEntry(service.id, entry);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEntry(service.id, entry.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {service.entries.length === 0 && (
            <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
              <p className="text-slate-400">No time windows defined</p>
              <button
                onClick={() => onAddEntry(service.id)}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Add your first time window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
