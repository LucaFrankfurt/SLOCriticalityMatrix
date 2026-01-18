"use client";

import { ChevronRight, User, Users, Briefcase } from "lucide-react";
import { AppMasterData } from "@/types";

interface ApplicationCardProps {
  app: AppMasterData;
  serviceCount: number;
  onSelect: (app: AppMasterData) => void;
}

export function ApplicationCard({
  app,
  serviceCount,
  onSelect,
}: ApplicationCardProps) {
  return (
    <div
      className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all cursor-pointer group"
      onClick={() => onSelect(app)}
    >
      <div className="flex items-center px-5 py-4">
        {/* App Info - Fixed width */}
        <div className="w-[250px] flex-shrink-0 border-r border-slate-700 pr-6">
          <span className="text-xs font-mono text-slate-500">{app.appId}</span>
          <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
            {app.name}
          </h3>
          <p className="text-xs text-slate-400">
            {serviceCount} service{serviceCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Manager - Equal flex */}
        <div className="flex-1 flex items-center gap-2 px-6">
          <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Manager
            </p>
            <p className="text-sm text-white">{app.manager}</p>
            <p className="text-xs text-slate-500">
              Delegate: {app.managerDelegate}
            </p>
          </div>
        </div>

        {/* ITAO - Equal flex */}
        <div className="flex-1 flex items-center gap-2 px-6">
          <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              ITAO
            </p>
            <p className="text-sm text-white">{app.itao}</p>
            <p className="text-xs text-slate-500">
              Delegate: {app.itaoDelegate}
            </p>
          </div>
        </div>

        {/* Business Owner - Equal flex */}
        <div className="flex-1 flex items-center gap-2 px-6">
          <Briefcase className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">
              Business Owner
            </p>
            <p className="text-sm text-white">{app.businessOwner}</p>
            <p className="text-xs text-slate-500">
              Delegate: {app.businessOwnerDelegate}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-4" />
      </div>
    </div>
  );
}
