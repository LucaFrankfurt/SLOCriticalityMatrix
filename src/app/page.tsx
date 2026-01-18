"use client";

import { useState, useMemo } from "react";
import { Plus, Shield, Search, Download } from "lucide-react";
import { AppMasterData, Service, ServiceEntry, CRITICALITIES } from "@/types";
import { mockApps, mockServices } from "@/data/mockData";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ApplicationDetailView } from "@/components/ApplicationDetailView";
import { ServiceDetailView } from "@/components/ServiceDetailView";
import { ServiceTimelineView } from "@/components/ServiceTimelineView";
import { ServiceEntryForm } from "@/components/ServiceEntryForm";
import { getCriticalityColor } from "@/lib/criticalityUtils";
import { exportToExcel } from "@/lib/exportUtils";

export default function Home() {
  const [apps] = useState<AppMasterData[]>(mockApps);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation states
  const [selectedApp, setSelectedApp] = useState<AppMasterData | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [viewingTimeline, setViewingTimeline] = useState<Service | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"service" | "entry">("service");
  const [formAppId, setFormAppId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<ServiceEntry | null>(null);

  // Filter apps by search
  const filteredApps = useMemo(() => {
    if (!searchQuery) return apps;
    const q = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.appId.toLowerCase().includes(q) ||
        app.manager.toLowerCase().includes(q) ||
        app.itao.toLowerCase().includes(q) ||
        app.businessOwner.toLowerCase().includes(q)
    );
  }, [apps, searchQuery]);

  // Get services for an app
  const getAppServices = (appId: string) => {
    return services.filter((s) => s.appId === appId);
  };

  // Open form for new service
  const openNewServiceForm = (appId?: string) => {
    setFormMode("service");
    setFormAppId(appId || apps[0]?.id || null);
    setEditingServiceId(null);
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  // Open form to add entry to existing service
  const openAddEntryForm = (serviceId: string) => {
    setFormMode("entry");
    setEditingServiceId(serviceId);
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  // Open form to edit entry
  const openEditEntryForm = (serviceId: string, entry: ServiceEntry) => {
    setFormMode("entry");
    setEditingServiceId(serviceId);
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = (data: {
    serviceName?: string;
    appId?: string;
    entry: ServiceEntry;
  }) => {
    if (formMode === "service" && data.serviceName && data.appId) {
      // Create new service with the entry
      const newService: Service = {
        id: `svc-${Date.now()}`,
        appId: data.appId,
        serviceName: data.serviceName,
        entries: [data.entry],
      };
      setServices((prev) => [...prev, newService]);
    } else if (formMode === "entry" && editingServiceId) {
      // Add or update entry in existing service
      setServices((prev) =>
        prev.map((svc) => {
          if (svc.id !== editingServiceId) return svc;

          if (editingEntry) {
            // Update existing entry
            const updatedSvc = {
              ...svc,
              entries: svc.entries.map((e) =>
                e.id === editingEntry.id ? data.entry : e
              ),
            };
            // Also update selectedService if this is the one we're viewing
            if (selectedService?.id === svc.id) {
              setSelectedService(updatedSvc);
            }
            return updatedSvc;
          } else {
            // Add new entry
            const updatedSvc = {
              ...svc,
              entries: [...svc.entries, data.entry],
            };
            // Also update selectedService if this is the one we're viewing
            if (selectedService?.id === svc.id) {
              setSelectedService(updatedSvc);
            }
            return updatedSvc;
          }
        })
      );
    }

    setIsFormOpen(false);
    setEditingEntry(null);
    setEditingServiceId(null);
  };

  // Handle delete entry
  const handleDeleteEntry = (serviceId: string, entryId: string) => {
    setServices((prev) =>
      prev.map((svc) => {
        if (svc.id !== serviceId) return svc;

        const updatedSvc = {
          ...svc,
          entries: svc.entries.filter((e) => e.id !== entryId),
        };

        // Also update selectedService if this is the one we're viewing
        if (selectedService?.id === svc.id) {
          setSelectedService(updatedSvc);
        }

        return updatedSvc;
      })
    );
  };

  // Handle delete service
  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  // Navigate to app detail
  const handleSelectApp = (app: AppMasterData) => {
    setSelectedApp(app);
  };

  // Navigate to service detail
  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  // Navigate to timeline from service detail
  const handleViewTimeline = (service: Service) => {
    // Keep selectedService so we can return to it
    setViewingTimeline(service);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  SLO Criticality Matrix
                </h1>
                <p className="text-sm text-slate-400">
                  Application & Service Overview
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => exportToExcel({ apps, services })}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
              <button
                onClick={() => openNewServiceForm()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Service
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400">Applications</p>
            <p className="text-2xl font-bold text-white">{apps.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400">Services</p>
            <p className="text-2xl font-bold text-white">{services.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-sm text-slate-400">Priority Levels</p>
            <div className="flex gap-1 mt-1">
              {CRITICALITIES.map((p) => (
                <span
                  key={p}
                  className={`px-2 py-0.5 rounded text-xs font-bold ${getCriticalityColor(p)} text-white`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <h2 className="text-lg font-semibold text-white mb-4">Applications</h2>
        {filteredApps.length > 0 ? (
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                serviceCount={getAppServices(app.id).length}
                onSelect={handleSelectApp}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800 rounded-xl border border-dashed border-slate-700">
            <p className="text-slate-400">No applications found</p>
          </div>
        )}
      </main>

      {/* Application Detail Modal */}
      {selectedApp && (
        <ApplicationDetailView
          app={selectedApp}
          services={getAppServices(selectedApp.id)}
          onClose={() => setSelectedApp(null)}
          onSelectService={handleSelectService}
          onAddService={() => openNewServiceForm(selectedApp.id)}
          onDeleteService={handleDeleteService}
        />
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailView
          service={selectedService}
          appName={
            apps.find((a) => a.id === selectedService.appId)?.name || ""
          }
          onClose={() => setSelectedService(null)}
          onAddEntry={openAddEntryForm}
          onEditEntry={openEditEntryForm}
          onDeleteEntry={handleDeleteEntry}
          onViewTimeline={handleViewTimeline}
        />
      )}

      {/* Timeline View Modal */}
      {viewingTimeline && (
        <ServiceTimelineView
          service={viewingTimeline}
          onClose={() => setViewingTimeline(null)}
        />
      )}

      {/* Service Entry Form Modal */}
      {isFormOpen && (
        <ServiceEntryForm
          mode={formMode}
          apps={apps}
          defaultAppId={formAppId || undefined}
          editingEntry={editingEntry}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEntry(null);
            setEditingServiceId(null);
          }}
        />
      )}
    </div>
  );
}
