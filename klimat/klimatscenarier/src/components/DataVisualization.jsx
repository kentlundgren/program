/*
 * Filnamn: DataVisualization.jsx
 * Beskrivning: Komponent för visualisering av klimatdata med grafer
 */

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Box, Typography } from '@mui/material';

// Simulerad data för olika klimatscenarier
const data = [
  { year: 2020, rcp26: 1.0, rcp45: 1.1, rcp85: 1.2 },
  { year: 2030, rcp26: 1.2, rcp45: 1.4, rcp85: 1.6 },
  { year: 2040, rcp26: 1.3, rcp45: 1.7, rcp85: 2.1 },
  { year: 2050, rcp26: 1.4, rcp45: 2.0, rcp85: 2.7 },
  { year: 2060, rcp26: 1.4, rcp45: 2.3, rcp85: 3.3 },
  { year: 2070, rcp26: 1.5, rcp45: 2.6, rcp85: 3.9 },
  { year: 2080, rcp26: 1.5, rcp45: 2.8, rcp85: 4.5 },
  { year: 2090, rcp26: 1.5, rcp45: 3.0, rcp85: 5.1 },
  { year: 2100, rcp26: 1.6, rcp45: 3.2, rcp85: 5.7 },
];

function DataVisualization() {
  return (
    <Box sx={{ width: '100%', height: 500, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Temperaturökning enligt olika RCP-scenarier
      </Typography>
      <Typography variant="body1" gutterBottom>
        Grafen visar projektioner för global temperaturökning under olika utsläppsscenarier (RCP).
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'År', position: 'bottom' }} 
          />
          <YAxis 
            label={{ 
              value: 'Temperaturökning (°C)', 
              angle: -90, 
              position: 'insideLeft' 
            }} 
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="rcp26" 
            name="RCP 2.6 (Låga utsläpp)" 
            stroke="#2196f3" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="rcp45" 
            name="RCP 4.5 (Medelhöga utsläpp)" 
            stroke="#ff9800" 
            strokeWidth={2} 
          />
          <Line 
            type="monotone" 
            dataKey="rcp85" 
            name="RCP 8.5 (Höga utsläpp)" 
            stroke="#f44336" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default DataVisualization; 