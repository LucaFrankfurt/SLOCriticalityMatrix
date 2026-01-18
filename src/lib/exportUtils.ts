import * as XLSX from "xlsx";
import {
  AppMasterData,
  Service,
  formatDowntime,
  formatDays,
  formatTimeRange,
} from "@/types";

interface ExportData {
  apps: AppMasterData[];
  services: Service[];
}

// Export all data to Excel file
export function exportToExcel(data: ExportData): void {
  const workbook = XLSX.utils.book_new();

  // Create Applications sheet
  const appsData = data.apps.map((app) => ({
    "App ID": app.appId,
    "Application Name": app.name,
    Manager: app.manager,
    "Manager Delegate": app.managerDelegate,
    ITAO: app.itao,
    "ITAO Delegate": app.itaoDelegate,
    "Business Owner": app.businessOwner,
    "Business Owner Delegate": app.businessOwnerDelegate,
    "Service Count": data.services.filter((s) => s.appId === app.id).length,
  }));

  const appsSheet = XLSX.utils.json_to_sheet(appsData);
  XLSX.utils.book_append_sheet(workbook, appsSheet, "Applications");

  // Create Services sheet
  const servicesData = data.services.map((svc) => {
    const app = data.apps.find((a) => a.id === svc.appId);
    return {
      "App ID": app?.appId || "",
      Application: app?.name || "",
      "Service Name": svc.serviceName,
      "Time Windows": svc.entries.length,
    };
  });

  const servicesSheet = XLSX.utils.json_to_sheet(servicesData);
  XLSX.utils.book_append_sheet(workbook, servicesSheet, "Services");

  // Create Time Windows sheet with all entries
  const entriesData: Record<string, unknown>[] = [];

  for (const svc of data.services) {
    const app = data.apps.find((a) => a.id === svc.appId);

    for (const entry of svc.entries) {
      // Create a row for each escalation tier
      for (const tier of entry.escalationTiers) {
        entriesData.push({
          "App ID": app?.appId || "",
          Application: app?.name || "",
          "Service Name": svc.serviceName,
          "Operating Days": formatDays(entry.operatingDays),
          "Time Range": formatTimeRange(
            entry.operatingStartTime,
            entry.operatingEndTime,
          ),
          "Start Time": entry.operatingStartTime,
          "End Time": entry.operatingEndTime,
          Priority: tier.priority,
          "Min Downtime": formatDowntime(tier.minDowntimeMinutes),
          "Max Downtime": formatDowntime(tier.maxDowntimeMinutes),
          "Min Downtime (min)": tier.minDowntimeMinutes,
          "Max Downtime (min)": tier.maxDowntimeMinutes ?? "",
        });
      }
    }
  }

  const entriesSheet = XLSX.utils.json_to_sheet(entriesData);
  XLSX.utils.book_append_sheet(workbook, entriesSheet, "Time Windows");

  // Create Weekly Coverage Matrix sheet
  const coverageData: Record<string, unknown>[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (const svc of data.services) {
    const app = data.apps.find((a) => a.id === svc.appId);
    const row: Record<string, unknown> = {
      Application: app?.name || "",
      Service: svc.serviceName,
    };

    // For each day, show covered hours
    for (const day of days) {
      const dayEntries = svc.entries.filter((e) =>
        e.operatingDays.includes(day as any),
      );
      if (dayEntries.length > 0) {
        row[day] = dayEntries
          .map((e) => `${e.operatingStartTime}-${e.operatingEndTime}`)
          .join(", ");
      } else {
        row[day] = "No coverage";
      }
    }

    coverageData.push(row);
  }

  const coverageSheet = XLSX.utils.json_to_sheet(coverageData);
  XLSX.utils.book_append_sheet(workbook, coverageSheet, "Weekly Coverage");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `SLO_Criticality_Matrix_${timestamp}.xlsx`;

  // Download the file
  XLSX.writeFile(workbook, filename);
}
