import { INITIAL_REPORTS } from '../data/mockReports';

const STORAGE_KEY = 'civicpulse_reports_v1';

export function getStoredReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load reports from localStorage:', error);
    return INITIAL_REPORTS;
  }
}

export function saveStoredReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('Failed to save reports to localStorage:', error);
  }
}

export function generateTicketId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `LP-2026-${randomNum}`;
}
