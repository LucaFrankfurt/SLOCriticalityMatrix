'use client';

import { useMemo } from 'react';
import { Clock, Calendar, ChevronRight, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Service, formatDays, formatTimeRange, CRITICALITIES } from '@/types';
import { getCriticalityColor } from '@/lib/criticalityUtils';
import { getServiceValidationSummary } from '@/lib/validationUtils';

interface ServiceOverviewCardProps {
  service: Service;
  appName: string;
  onViewDetails: (service: Service) => void;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
}

export function ServiceOverviewCard({
  service,
  appName,
  onViewDetails,
  onEdit,
  onDelete,
}: ServiceOverviewCardProps) {
  // Run validation
  const validation = useMemo(() => getServiceValidationSummary(service), [service]);

  // Get the highest priority across all entries
  const getHighestPriority = () => {
    for (const priority of CRITICALITIES) {
      for (const entry of service.entries) {
        if (entry.escalationTiers.some(t => t.priority === priority)) {
          return priority;
        }
      }
    }
    return null;
  };

  const highestPriority = getHighestPriority();

  return (
    <div
      className={`bg-slate-800 border rounded-xl overflow-hidden hover:border-slate-500 transition-all cursor-pointer group ${validation.hasErrors
          ? 'border-red-500/50'
          : 'border-slate-700'
        }`}
      onClick={() => onViewDetails(service)}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-slate-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {validation.hasErrors && (
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {service.serviceName}
            </h3>
            {highestPriority && (
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${getCriticalityColor(highestPriority)} text-white`}>
                {highestPriority}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">{appName}</p>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button
              onClick={() => onEdit(service)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Edit Service"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              title="Delete Service"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors ml-1" />
        </div>
      </div>

      {/* Validation Warning */}
      {validation.hasErrors && (
        <div className="px-4 py-2 bg-red-900/20 border-b border-red-700/30">
          <p className="text-xs text-red-400">
            ⚠ {validation.issues.length} overlapping time window{validation.issues.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Gap Warning */}
      {validation.hasGaps && !validation.hasErrors && (
        <div className="px-4 py-2 bg-amber-900/20 border-b border-amber-700/30">
          <p className="text-xs text-amber-400">
            ⏰ Missing coverage in {validation.gaps.length} timeframe{validation.gaps.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Entry Summary */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{service.entries.length} time window{service.entries.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Preview of entries */}
        <div className="space-y-2">
          {service.entries.slice(0, 3).map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 text-slate-300 min-w-[100px]">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatTimeRange(entry.operatingStartTime, entry.operatingEndTime)}</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 text-xs">{formatDays(entry.operatingDays)}</span>
              <div className="flex gap-1 ml-auto">
                {entry.escalationTiers.slice(0, 2).map((tier, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${getCriticalityColor(tier.priority)} text-white`}
                  >
                    {tier.priority}
                  </span>
                ))}
                {entry.escalationTiers.length > 2 && (
                  <span className="text-xs text-slate-500">+{entry.escalationTiers.length - 2}</span>
                )}
              </div>
            </div>
          ))}
          {service.entries.length > 3 && (
            <p className="text-xs text-slate-500 pt-1">
              +{service.entries.length - 3} more entries
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
