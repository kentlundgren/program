/*
 * Filnamn: ProgramDescription.jsx
 * Beskrivning: Komponent för att visa programbeskrivning och teknisk information
 */

import { Box, Typography, Link, Paper, List, ListItem, ListItemText, Stack, Container } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import viteLogo from '/vite.svg';
import reactLogo from '../assets/react.svg';

function ProgramDescription() {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2, pb: 10 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Programbeskrivning och Struktur
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Översikt och Arkitektur
        </Typography>
        <Typography paragraph>
          Detta program är byggt med moderna webbteknologier och följer en komponentbaserad arkitektur. 
          Programmet använder React som huvudramverk, vilket möjliggör en modulär och underhållbar kodstruktur.
        </Typography>
        <Typography paragraph>
          <strong>Startsekvens och Initiering:</strong>
        </Typography>
        <Typography component="div" sx={{ pl: 2, mb: 2 }}>
          1. När programmet startar, läser webbläsaren först in <code>index.html</code>, som är applikationens startpunkt.<br/>
          2. <code>main.jsx</code> initieras och sätter upp React-miljön samt grundläggande konfiguration.<br/>
          3. <code>App.jsx</code> laddas som rotkomponent och orchestrerar hela applikationens flöde.<br/>
          4. Komponenter laddas dynamiskt efter behov för att optimera prestanda.
        </Typography>
        <Typography paragraph>
          <strong>Komponenthierarki och Dataflöde:</strong>
        </Typography>
        <Typography component="div" sx={{ pl: 2, mb: 2 }}>
          • App.jsx är huvudcontainern som hanterar övergripande tillstånd<br/>
          • TabContainer styr navigering mellan olika vyer<br/>
          • Varje flik (Task, Tips, etc.) är en separat komponent för bättre underhållbarhet<br/>
          • Utils-funktioner tillhandahåller gemensam funktionalitet för databeräkningar
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Detaljerad Mappstruktur
        </Typography>
        
        {/* Färgförklaring */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Färgkodning:
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
              <Typography variant="caption">Mappar</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
              <Typography variant="caption">React-komponenter (.jsx)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="caption">Stilfiler (.css)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'info.light' }} />
              <Typography variant="caption">HTML & Resursfiler (.html, .svg)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="caption">JavaScript-konfiguration (.js)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'brown' }} />
              <Typography variant="caption">Projektfiler (.json, .md, .gitignore)</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ pl: 2, fontFamily: 'monospace', fontSize: '0.9rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
            klimatscenarier/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Projektets rotmapp</Typography>
          </Box>
          <Box sx={{ pl: 4 }}>
            {/* Huvudmappar i ordning enligt Cursor */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
              dist/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Byggd version av appen redo för publicering</Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
                assets/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Kompilerade resurser</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'info.light' }} />
                .htaccess <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Apache-konfiguration för routing</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'info.light' }} />
                index.html <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Byggd HTML-fil</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'info.light' }} />
                vite.svg <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Vite logotyp</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
              node_modules/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Installerade npm-paket och beroenden</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
              public/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Statiska filer som kopieras direkt till build</Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'info.light' }} />
                .htaccess <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Apache-konfiguration för routing</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'info.light' }} />
                vite.svg <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Vite logotyp</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
              src/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Källkodsmapp med alla React-komponenter</Typography>
            </Box>
            <Box sx={{ pl: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
                assets/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Statiska resurser som bilder och ikoner</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
                  react.svg <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>React logotyp</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <FolderIcon sx={{ mr: 1, color: 'primary.dark' }} />
                components/ <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>React-komponenter för olika delar av appen</Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
                  DataVisualization.jsx <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Komponent för visualisering av klimatdata</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
                  ProgramDescription.jsx <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Denna komponent - visar programbeskrivning</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
                  Quiz.jsx <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Kunskapstest för användaren</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
                  TabPanel.jsx <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Hanterar flikbaserad navigation</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'success.main' }} />
                App.css <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Stilar för App-komponenten</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
                App.jsx <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Huvudkomponent som styr applikationen</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'success.main' }} />
                index.css <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Globala stilar för hela appen</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <InsertDriveFileIcon sx={{ mr: 1, color: 'purple' }} />
                main.jsx <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Startpunkt som renderar React-appen</Typography>
              </Box>
            </Box>

            {/* Konfigurationsfiler i roten i ordning enligt Cursor */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'brown' }} />
              .gitignore <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Filer som ska ignoreras av Git</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'warning.main' }} />
              eslint.config.js <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Konfiguration för kodkvalitet</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'info.light' }} />
              index.html <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>HTML-mall för appen</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'brown' }} />
              package-lock.json <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Låsta versioner av beroenden</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'brown' }} />
              package.json <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Projektets beroenden och skript</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'brown' }} />
              README.md <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Projektdokumentation</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <InsertDriveFileIcon sx={{ mr: 1, color: 'warning.main' }} />
              vite.config.js <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>Konfiguration för Vite byggverktyg</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Tekniska Komponenter och Integration
        </Typography>
        <Typography paragraph>
          <strong>Utvecklingsmiljö och Verktyg:</strong>
        </Typography>
        <Typography paragraph>
          Vite fungerar som utvecklingsserver och byggverktyg, vilket ger snabb utveckling genom:
          • Blixtsnabb HMR (Hot Module Replacement)
          • Effektiv kodkompilering
          • Optimerad produktionsbygge
        </Typography>
        <Typography paragraph>
          <strong>Pakethantering och Beroenden:</strong>
        </Typography>
        <Typography paragraph>
          Node.js och npm hanterar projektets beroenden och möjliggör:
          • Automatisk installation av paket
          • Versionshantering av beroenden
          • Körning av utvecklings- och byggskript
        </Typography>
        <Typography paragraph>
          <strong>Komponentbibliotek och UI:</strong>
        </Typography>
        <Typography paragraph>
          Material-UI (MUI) tillhandahåller:
          • Färdiga UI-komponenter
          • Konsekvent styling
          • Responsiv design
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Programflöde och Interaktion
        </Typography>
        <Typography paragraph>
          1. <strong>Användarinteraktion:</strong><br/>
          • Användaren navigerar via flikbaserat gränssnitt<br/>
          • Varje flik representerar en logisk del av lärandeprocessen<br/>
          • Quiz-komponenten kontrollerar användarens förståelse
        </Typography>
        <Typography paragraph>
          2. <strong>Datapresentation:</strong><br/>
          • Klimatdata visualiseras genom Recharts-biblioteket<br/>
          • Realtidsuppdateringar av grafer och diagram<br/>
          • Interaktiva element för datautforskning
        </Typography>
        <Typography paragraph>
          3. <strong>Tillståndshantering:</strong><br/>
          • React Hooks hanterar komponenttillstånd<br/>
          • Props används för kommunikation mellan komponenter<br/>
          • Användarframsteg sparas i lokalt tillstånd
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Teknisk Stack
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary={<Link href="https://react.dev" target="_blank" rel="noopener">React</Link>}
              secondary="JavaScript-bibliotek för att bygga användargränssnitt"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary={<Link href="https://vite.dev" target="_blank" rel="noopener">Vite</Link>}
              secondary="Modernt byggverktyg för webbutveckling"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary={<Link href="https://nodejs.org/en" target="_blank" rel="noopener">Node.js</Link>}
              secondary="JavaScript-runtime för servermiljö"
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary={<Link href="https://www.npmjs.com" target="_blank" rel="noopener">npm</Link>}
              secondary="Pakethanterare för Node.js"
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Programflöde
        </Typography>
        <Typography paragraph>
          1. Användaren navigerar mellan fem flikar:
          - Uppgift (introduktion och mål)
          - Tips (hjälp för att lösa uppgiften)
          - Visualisering (interaktiva grafer)
          - Quiz (kunskapstest)
          - Lösning (låst tills quizet är klarat)
        </Typography>
        <Typography paragraph>
          2. Dataflöde:
          - Klimatdata visualiseras i realtid
          - Quiz-svar valideras direkt
          - Lösningsfliken låses upp vid godkänt quiz
        </Typography>
      </Paper>

      {/* Footer med logotyper */}
      <Box 
        sx={{ 
          mt: 4, 
          pt: 2,
          borderTop: 1, 
          borderColor: 'divider',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          boxShadow: '0px -2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}
      >
        <Container maxWidth="lg">
          <Stack 
            direction="row" 
            spacing={4} 
            justifyContent="center" 
            alignItems="center"
            sx={{ pb: 2 }}
          >
            <Link 
              href="https://vitejs.dev" 
              target="_blank" 
              rel="noopener"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <img 
                src={viteLogo} 
                alt="Vite logo" 
                style={{ 
                  height: '2em',
                  filter: 'drop-shadow(0 0 0.5rem rgba(100, 108, 255, 0.4))'
                }} 
              />
            </Link>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ opacity: 0.7 }}
            >
              Powered by
            </Typography>
            <Link 
              href="https://react.dev" 
              target="_blank" 
              rel="noopener"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <img 
                src={reactLogo} 
                alt="React logo" 
                style={{ 
                  height: '2em',
                  filter: 'drop-shadow(0 0 0.5rem rgba(97, 218, 251, 0.4))'
                }} 
              />
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default ProgramDescription; 