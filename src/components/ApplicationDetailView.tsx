'use client';

import { X, Plus, User, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { AppMasterData, Service } from '@/types';
import { ServiceOverviewCard } from '@/components/ServiceOverviewCard';

interface ApplicationDetailViewProps {
  app: AppMasterData;
  services: Service[];
  onClose: () => void;
  onSelectService: (service: Service) => void;
  onAddService: () => void;
  onDeleteService: (id: string) => void;
}

export function ApplicationDetailView({
  app,
  services,
  onClose,
  onSelectService,
  onAddService,
  onDeleteService,
}: ApplicationDetailViewProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded">
                  {app.appId}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-white">{app.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* App Metadata Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Manager</p>
                <p className="text-white">{app.manager}</p>
                <p className="text-slate-500 text-xs">Delegate: {app.managerDelegate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">ITAO</p>
                <p className="text-white">{app.itao}</p>
                <p className="text-slate-500 text-xs">Delegate: {app.itaoDelegate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Business Owner</p>
                <p className="text-white">{app.businessOwner}</p>
                <p className="text-slate-500 text-xs">Delegate: {app.businessOwnerDelegate}</p>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">
              Services ({services.length})
            </h3>
            <button
              onClick={onAddService}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <ServiceOverviewCard
                  key={service.id}
                  service={service}
                  appName={app.name}
                  onViewDetails={onSelectService}
                  onDelete={onDeleteService}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
              <p className="text-slate-400">No services defined for this application</p>
              <button
                onClick={onAddService}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Add your first service
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
