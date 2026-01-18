'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { AppMasterData, ServiceEntry, Day, Criticality, DAYS, CRITICALITIES, EscalationTier } from '@/types';
import { getCriticalityColor, getCriticalityTextColor } from '@/lib/criticalityUtils';

interface ServiceEntryFormProps {
  apps: AppMasterData[];
  // For new service entry
  initialEntry?: ServiceEntry;
  // For new service (name + app)
  initialServiceName?: string;
  initialAppId?: string;
  mode: 'service' | 'entry'; // 'service' = create new service, 'entry' = add/edit entry
  onSubmitService?: (data: { serviceName: string; appId: string; entry: Omit<ServiceEntry, 'id'> }) => void;
  onSubmitEntry?: (entry: Omit<ServiceEntry, 'id'>) => void;
  onClose: () => void;
}

export function ServiceEntryForm({ 
  apps, 
  initialEntry, 
  initialServiceName,
  initialAppId,
  mode,
  onSubmitService, 
  onSubmitEntry,
  onClose 
}: ServiceEntryFormProps) {
  const [serviceName, setServiceName] = useState(initialServiceName || '');
  const [appId, setAppId] = useState(initialAppId || apps[0]?.id || '');
  
  const [entryData, setEntryData] = useState({
    operatingDays: initialEntry?.operatingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as Day[],
    operatingStartTime: initialEntry?.operatingStartTime || '09:00',
    operatingEndTime: initialEntry?.operatingEndTime || '17:00',
    escalationTiers: initialEntry?.escalationTiers || [
      { priority: 'P3c' as Criticality, minDowntimeMinutes: 0, maxDowntimeMinutes: 30 },
      { priority: 'P2' as Criticality, minDowntimeMinutes: 30, maxDowntimeMinutes: 120 },
      { priority: 'P1' as Criticality, minDowntimeMinutes: 120, maxDowntimeMinutes: null },
    ] as EscalationTier[],
  });

  const toggleDay = (day: Day) => {
    setEntryData((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(day)
        ? prev.operatingDays.filter((d) => d !== day)
        : [...prev.operatingDays, day],
    }));
  };

  const updateTier = (index: number, updates: Partial<EscalationTier>) => {
    setEntryData((prev) => ({
      ...prev,
      escalationTiers: prev.escalationTiers.map((tier, i) =>
        i === index ? { ...tier, ...updates } : tier
      ),
    }));
  };

  const addTier = () => {
    const lastTier = entryData.escalationTiers[entryData.escalationTiers.length - 1];
    const newMin = lastTier?.maxDowntimeMinutes || 60;
    setEntryData((prev) => ({
      ...prev,
      escalationTiers: [
        ...prev.escalationTiers,
        { priority: 'P1' as Criticality, minDowntimeMinutes: newMin, maxDowntimeMinutes: null },
      ],
    }));
  };

  const removeTier = (index: number) => {
    if (entryData.escalationTiers.length > 1) {
      setEntryData((prev) => ({
        ...prev,
        escalationTiers: prev.escalationTiers.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'service' && onSubmitService) {
      onSubmitService({
        serviceName,
        appId,
        entry: entryData,
      });
    } else if (mode === 'entry' && onSubmitEntry) {
      onSubmitEntry(entryData);
    }
    
    onClose();
  };

  const hours = Array.from({ length: 25 }, (_, i) => i.toString().padStart(2, '0')); // 00-24

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {mode === 'service' ? 'Add New Service' : (initialEntry ? 'Edit Entry' : 'Add Entry')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Name & App (only for new service) */}
          {mode === 'service' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Payment Gateway"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Application
                </label>
                <select
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {apps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Operating Days */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Operating Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    entryData.operatingDays.includes(day)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Time
              </label>
              <select
                value={entryData.operatingStartTime}
                onChange={(e) => setEntryData({ ...entryData, operatingStartTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {hours.slice(0, 24).map((h) => (
                  <option key={h} value={`${h}:00`}>{h}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Time
              </label>
              <select
                value={entryData.operatingEndTime}
                onChange={(e) => setEntryData({ ...entryData, operatingEndTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {hours.map((h) => (
                  <option key={h} value={`${h}:00`}>{h}:00</option>
                ))}
              </select>
            </div>
          </div>

          {/* Escalation Tiers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-300">
                Escalation Tiers (by downtime duration)
              </label>
              <button
                type="button"
                onClick={addTier}
                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
              >
                <Plus className="w-4 h-4" />
                Add Tier
              </button>
            </div>
            <div className="space-y-3">
              {entryData.escalationTiers.map((tier, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg">
                  <select
                    value={tier.priority}
                    onChange={(e) => updateTier(index, { priority: e.target.value as Criticality })}
                    className={`w-24 rounded-lg px-3 py-2 font-bold text-center border-0 focus:ring-2 focus:ring-blue-500 ${getCriticalityColor(tier.priority)} ${getCriticalityTextColor(tier.priority)}`}
                  >
                    {CRITICALITIES.map((crit) => (
                      <option key={crit} value={crit} className="bg-slate-800 text-white">
                        {crit}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={tier.minDowntimeMinutes}
                      onChange={(e) => updateTier(index, { minDowntimeMinutes: parseInt(e.target.value) || 0 })}
                      className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-center"
                    />
                    <span className="text-slate-500 text-sm">min</span>
                  </div>

                  <span className="text-slate-500">—</span>

                  <div className="flex items-center gap-2">
                    {tier.maxDowntimeMinutes !== null ? (
                      <>
                        <input
                          type="number"
                          min={tier.minDowntimeMinutes + 1}
                          value={tier.maxDowntimeMinutes}
                          onChange={(e) => updateTier(index, { maxDowntimeMinutes: parseInt(e.target.value) || null })}
                          className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-center"
                        />
                        <span className="text-slate-500 text-sm">min</span>
                      </>
                    ) : (
                      <span className="text-2xl text-slate-400 px-2">∞</span>
                    )}
                    <button
                      type="button"
                      onClick={() => updateTier(index, { 
                        maxDowntimeMinutes: tier.maxDowntimeMinutes === null 
                          ? tier.minDowntimeMinutes + 60 
                          : null 
                      })}
                      className="text-xs text-slate-500 hover:text-slate-300"
                    >
                      {tier.maxDowntimeMinutes === null ? 'Set limit' : 'Open-end'}
                    </button>
                  </div>

                  {entryData.escalationTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTier(index)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              {mode === 'service' ? 'Create Service' : (initialEntry ? 'Save Changes' : 'Add Entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
