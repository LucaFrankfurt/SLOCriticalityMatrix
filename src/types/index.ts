export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type Criticality = 'Pc' | 'P1' | 'P2' | 'P3' | 'P3c' | 'P4';

export interface AppMasterData {
  id: string;
  name: string;
  appId: string; // e.g., "APP-001"
  manager: string;
  managerDelegate: string;
  itao: string; // IT Application Owner
  itaoDelegate: string;
  businessOwner: string;
  businessOwnerDelegate: string;
}

export interface EscalationTier {
  priority: Criticality;
  minDowntimeMinutes: number;
  maxDowntimeMinutes: number | null;
}

export interface ServiceEntry {
  id: string;
  operatingDays: Day[];
  operatingStartTime: string;
  operatingEndTime: string;
  escalationTiers: EscalationTier[];
}

export interface Service {
  id: string;
  serviceName: string;
  appId: string;
  entries: ServiceEntry[];
}

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const CRITICALITIES: Criticality[] = ['Pc', 'P1', 'P2', 'P3', 'P3c', 'P4'];

export function formatDowntime(minutes: number | null): string {
  if (minutes === null) return '∞';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60 * 10) / 10;
  if (hours === Math.floor(hours)) {
    return hours === 1 ? '1 hour' : `${Math.floor(hours)} hours`;
  }
  return `${hours} hours`;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`;
}

export function formatDays(days: Day[]): string {
  if (days.length === 7) return 'Every day';
  if (days.length === 5 && !days.includes('Sat') && !days.includes('Sun')) {
    return 'Mon - Fri';
  }
  if (days.length === 2 && days.includes('Sat') && days.includes('Sun')) {
    return 'Weekends';
  }
  return days.join(', ');
}
