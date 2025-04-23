/**
 * dataHelpers.js
 * 
 * Hjälpfunktioner för databearbetning och transformering.
 * Denna fil innehåller funktioner för att arbeta med data från API:et,
 * men gör inte själva API-anropen.
 */

import * as api from '../api';

/**
 * Filtrerar företag baserat på sökterm
 * 
 * @param {Array} companies - Lista med företag att filtrera
 * @param {string} searchTerm - Sökterm att filtrera efter
 * @returns {Array} - Filtrerade företag
 */
export function filterCompanies(companies, searchTerm) {
  if (!searchTerm) return companies;
  
  const lowercaseSearchTerm = searchTerm.toLowerCase();
  
  return companies.filter(company => 
    company.name.toLowerCase().includes(lowercaseSearchTerm) ||
    (company.description && company.description.toLowerCase().includes(lowercaseSearchTerm))
  );
}

/**
 * Sorterar företag baserat på kolumn och riktning
 * 
 * @param {Array} companies - Lista med företag att sortera
 * @param {string} column - Kolumn att sortera efter
 * @param {string} direction - Riktning att sortera (asc eller desc)
 * @returns {Array} - Sorterade företag
 */
export function sortCompanies(companies, column, direction) {
  if (!column) return companies;
  
  return [...companies].sort((a, b) => {
    let valueA = a[column];
    let valueB = b[column];
    
    // Hantera specialfall: latestEmissions
    if (column === 'latestEmissions') {
      // Försök hitta det senaste rapporteringsperiodvärdet
      valueA = a.reportingPeriods && a.reportingPeriods.length 
        ? a.reportingPeriods[0].emissions.calculatedTotalEmissions : null;
      valueB = b.reportingPeriods && b.reportingPeriods.length 
        ? b.reportingPeriods[0].emissions.calculatedTotalEmissions : null;
    }
    
    // Hantera numeriska värden
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    // Hantera textsträngar
    valueA = String(valueA || '').toLowerCase();
    valueB = String(valueB || '').toLowerCase();
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Beräknar trendprocent mellan det aktuella året och föregående år
 * 
 * @param {Object} company - Företagsdata
 * @returns {Object} - Objekt med trend och procentskillnad
 */
export function calculateEmissionsTrend(company) {
  if (!company.reportingPeriods || company.reportingPeriods.length < 2) {
    return { trend: 'neutral', percent: 0 };
  }
  
  const currentPeriod = company.reportingPeriods[0];
  const previousPeriod = company.reportingPeriods[1];
  
  const currentValue = currentPeriod.emissions.calculatedTotalEmissions;
  const previousValue = previousPeriod.emissions.calculatedTotalEmissions;
  
  if (!currentValue || !previousValue) {
    return { trend: 'neutral', percent: 0 };
  }
  
  const difference = currentValue - previousValue;
  const percent = (difference / previousValue) * 100;
  
  return {
    trend: percent < 0 ? 'decreasing' : percent > 0 ? 'increasing' : 'neutral',
    percent: Math.abs(percent).toFixed(1)
  };
}

/**
 * Formaterar utsläppsvärden till läsbar text
 * 
 * @param {number} value - Utsläppsvärde i ton CO2e
 * @returns {string} - Formaterad text
 */
export function formatEmissions(value) {
  if (value === undefined || value === null) return 'Ej tillgängligt';
  
  // För värden över 1 miljon, visa i miljoner
  if (value >= 1000000) {
    return `${(value / 1000000).toLocaleString('sv-SE', { maximumFractionDigits: 2 })} miljoner ton CO₂e`;
  }
  
  // För värden över 1000, visa i tusentals
  if (value >= 1000) {
    return `${(value / 1000).toLocaleString('sv-SE', { maximumFractionDigits: 1 })} tusen ton CO₂e`;
  }
  
  // För mindre värden, visa som de är
  return `${value.toLocaleString('sv-SE')} ton CO₂e`;
}

// Exportera även API-funktioner för bekvämlighet
export const { fetchCompanies, fetchCompanyDetails, searchCompanies } = api;