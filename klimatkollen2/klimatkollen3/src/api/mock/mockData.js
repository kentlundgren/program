/**
 * mockData.js
 * 
 * Denna fil innehåller exempeldata som används under utveckling
 * när vi inte har tillgång till Klimatkollens riktiga API.
 * 
 * Datan följer samma struktur som det riktiga API:et skulle returnera,
 * baserat på API-dokumentationen, men anpassad för vår UI.
 */

// Exempeldata för företag med utsläppsinformation
export const mockCompanies = [
    {
      // Företag 1
      wikidataId: "Q123456",
      name: "Volvo AB",
      description: "Svensk fordonstillverkare med fokus på hållbar mobilitet",
      url: "https://www.volvo.com",
      website: "https://www.volvo.com",
      sector: "Fordonsindustri",
      latestEmissions: 3250000,
      emissionReduction: 12.5,
      targetYear: 2040,
      reportingPeriods: [
        {
          id: "rp1",
          startDate: "2023-01-01T00:00:00.000Z",
          endDate: "2023-12-31T00:00:00.000Z",
          reportURL: "https://www.volvo.com/sustainability/report2023.pdf",
          emissions: {
            id: "em1",
            calculatedTotalEmissions: 3250000,
            scope1: {
              id: "s1-1",
              total: 450000,
            },
            scope2: {
              id: "s2-1",
              total: 800000,
            },
            scope3: {
              id: "s3-1",
              total: 2000000,
            }
          }
        },
        {
          id: "rp2",
          startDate: "2022-01-01T00:00:00.000Z",
          endDate: "2022-12-31T00:00:00.000Z",
          reportURL: "https://www.volvo.com/sustainability/report2022.pdf",
          emissions: {
            id: "em2",
            calculatedTotalEmissions: 3500000,
            scope1: { id: "s1-2", total: 480000 },
            scope2: { id: "s2-2", total: 850000 },
            scope3: { id: "s3-2", total: 2170000 }
          }
        }
      ],
      emissionsHistory: [
        { year: 2023, emissions: 3250000 },
        { year: 2022, emissions: 3500000 },
        { year: 2021, emissions: 3650000 },
        { year: 2020, emissions: 3800000 }
      ]
    },
    
    // Företag 2
    {
      wikidataId: "Q789012",
      name: "IKEA Sverige",
      description: "Möbelföretag med fokus på hållbara heminredningslösningar",
      url: "https://www.ikea.se",
      website: "https://www.ikea.se",
      sector: "Detaljhandel - Möbler",
      latestEmissions: 1800000,
      emissionReduction: 8.3,
      targetYear: 2030,
      reportingPeriods: [
        {
          id: "rp3",
          startDate: "2023-01-01T00:00:00.000Z",
          endDate: "2023-12-31T00:00:00.000Z",
          reportURL: "https://www.ikea.com/se/sv/this-is-ikea/sustainability/report2023.pdf",
          emissions: {
            id: "em3",
            calculatedTotalEmissions: 1800000,
            scope1: { id: "s1-3", total: 120000 },
            scope2: { id: "s2-3", total: 580000 },
            scope3: { id: "s3-3", total: 1100000 }
          }
        },
        {
          id: "rp4",
          startDate: "2022-01-01T00:00:00.000Z",
          endDate: "2022-12-31T00:00:00.000Z",
          reportURL: "https://www.ikea.com/se/sv/this-is-ikea/sustainability/report2022.pdf",
          emissions: {
            id: "em4",
            calculatedTotalEmissions: 1950000,
            scope1: { id: "s1-4", total: 135000 },
            scope2: { id: "s2-4", total: 615000 },
            scope3: { id: "s3-4", total: 1200000 }
          }
        }
      ],
      emissionsHistory: [
        { year: 2023, emissions: 1800000 },
        { year: 2022, emissions: 1950000 },
        { year: 2021, emissions: 2100000 },
        { year: 2020, emissions: 2200000 }
      ]
    },
    
    // Företag 3
    {
      wikidataId: "Q345678",
      name: "H&M Group",
      description: "Globalt modeföretag med flera varumärken",
      url: "https://www.hm.com",
      website: "https://www.hm.com",
      sector: "Detaljhandel - Kläder",
      latestEmissions: 1600000,
      emissionReduction: 5.2,
      targetYear: 2035,
      reportingPeriods: [
        {
          id: "rp5",
          startDate: "2023-01-01T00:00:00.000Z",
          endDate: "2023-12-31T00:00:00.000Z",
          reportURL: "https://hmgroup.com/sustainability/report2023.pdf",
          emissions: {
            id: "em5",
            calculatedTotalEmissions: 1600000,
            scope1: { id: "s1-5", total: 20000 },
            scope2: { id: "s2-5", total: 250000 },
            scope3: { id: "s3-5", total: 1330000 }
          }
        },
        {
          id: "rp6",
          startDate: "2022-01-01T00:00:00.000Z",
          endDate: "2022-12-31T00:00:00.000Z",
          reportURL: "https://hmgroup.com/sustainability/report2022.pdf",
          emissions: {
            id: "em6",
            calculatedTotalEmissions: 1680000,
            scope1: { id: "s1-6", total: 22000 },
            scope2: { id: "s2-6", total: 260000 },
            scope3: { id: "s3-6", total: 1398000 }
          }
        }
      ],
      emissionsHistory: [
        { year: 2023, emissions: 1600000 },
        { year: 2022, emissions: 1680000 },
        { year: 2021, emissions: 1750000 },
        { year: 2020, emissions: 1900000 }
      ]
    }
  ];
  
  /**
   * Denna funktion simulerar en fördröjning som skulle uppstå vid ett riktigt API-anrop.
   * Den hjälper oss att testa laddningstillstånd (loading states) i vår applikation.
   * 
   * @param {number} ms - Fördröjning i millisekunder
   * @returns {Promise} En Promise som resolvas efter angiven tid
   */
  export const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));