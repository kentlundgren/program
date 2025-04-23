/*
 * Filnamn: App.jsx
 * Beskrivning: Huvudkomponent för klimatscenarier-applikationen
 * Uppdaterad: 2024 - Förbättrad mobilanpassning av flikar
 */

import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Container,
  Link,
  Stack,
  Button,
  Tooltip,
  Fade
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import TabPanel from './components/TabPanel';
import Quiz from './components/Quiz';
import DataVisualization from './components/DataVisualization';
import ProgramDescription from './components/ProgramDescription';

// Importera logotyper
import viteLogo from '/vite.svg';
import reactLogo from './assets/react.svg';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const handleTabChange = (event, newValue) => {
    if (newValue === 4 && !quizCompleted) {
      return;
    }
    setCurrentTab(newValue);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  if (showDescription) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', mt: 4 }}>
          <Button
            variant="contained"
            onClick={toggleDescription}
            startIcon={<DescriptionIcon />}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            Tillbaka till programmet
          </Button>
          <ProgramDescription />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mt: 4 }}>
        {/* Uppdaterad: Responsiv rubrik och layout för mobil */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: 2,
          mb: 3 
        }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Klimatscenarier och Framtidsprojektioner
          </Typography>
          <Button
            variant="contained"
            onClick={toggleDescription}
            startIcon={<DescriptionIcon />}
            color="primary"
          >
            Programbeskrivning
          </Button>
        </Box>

        {/* Uppdaterad: Förbättrad mobilanpassning av flikar */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            aria-label="climate scenarios tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-flexContainer': {
                flexWrap: { xs: 'nowrap' }
              },
              '& .Mui-selected': {
                fontWeight: 'bold'
              }
            }}
          >
            <Tab label="Uppgift" />
            <Tab label="Tips" />
            <Tab label="Visualisering" />
            <Tab label="Quiz" />
            <Tab 
              label="Lösning" 
              disabled={!quizCompleted}
              sx={theme => ({
                ...((!quizCompleted) && {
                  opacity: 0.5,
                  '&::after': {
                    content: {
                      xs: '"(Lås upp)"', // Kortare text på mobil
                      sm: '"(Lås upp genom att klara quizet)"' // Full text på större skärmar
                    },
                    position: 'absolute',
                    fontSize: '0.7rem',
                    top: '100%',
                    left: 0,
                    whiteSpace: 'nowrap',
                    backgroundColor: 'background.paper',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    boxShadow: 1
                  }
                }),
                ...(quizCompleted && {
                  fontWeight: 'bold',
                  color: 'primary.main'
                })
              })}
            />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h5" gutterBottom>
            Analys av IPCC:s Klimatscenarier
          </Typography>
          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            Bakgrund
          </Typography>
          <Typography paragraph>
            IPCC (Intergovernmental Panel on Climate Change) är FN:s klimatpanel som sammanställer 
            den senaste forskningen om klimatförändringar. RCP-scenarierna (Representative Concentration Pathways) 
            är olika framtidsscenarier som visar möjliga utvecklingsvägar för vårt klimat, baserat på 
            olika nivåer av växthusgasutsläpp och klimatpolitiska beslut.
          </Typography>
          <Typography paragraph>
            Varje RCP-scenario representerar en möjlig framtid:
            • RCP 2.6: Kraftfulla åtgärder mot klimatförändringar
            • RCP 4.5: Vissa åtgärder implementeras
            • RCP 8.5: Inga särskilda klimatåtgärder vidtas
          </Typography>
          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            Uppgiftsbeskrivning
          </Typography>
          <Typography paragraph>
            För att lösa denna uppgift behöver du gå till fliken "Visualisering", där du hittar 
            interaktiva grafer som visar de olika klimatscenarierna. Använd dessa grafer som 
            underlag för din analys.
          </Typography>
          <Typography paragraph>
            Du ska:
          </Typography>
          <Typography component="div">
            <ol>
              <li>Analysera de tre huvudsakliga RCP-scenarierna (2.6, 4.5 och 8.5)</li>
              <li>Jämföra temperaturökningsprojektioner mellan scenarierna</li>
              <li>Utvärdera konsekvenserna av olika utsläppsbanor</li>
              <li>Beräkna skillnader i uppvärmning mellan scenarierna vid olika tidpunkter</li>
            </ol>
          </Typography>
          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            Analysvägledning
          </Typography>
          <Typography paragraph>
            När du analyserar scenarierna, tänk på följande aspekter:
          </Typography>
          <Typography component="div">
            <ul>
              <li>Vilka trender kan du identifiera i de olika scenarierna?</li>
              <li>Vid vilka tidpunkter sker de största förändringarna?</li>
              <li>Hur skiljer sig hastigheten i temperaturökningen mellan scenarierna?</li>
              <li>Vilka samhällsförändringar skulle krävas för att uppnå respektive scenario?</li>
              <li>Hur påverkar olika tidpunkter för utsläppsminskningar den långsiktiga utvecklingen?</li>
            </ul>
          </Typography>
          <Typography paragraph sx={{ mt: 2 }}>
            Efter att du genomfört analysen, testa dina kunskaper i Quiz-fliken. När du klarat 
            quizet låses lösningen upp, där du kan jämföra din analys med en detaljerad 
            expertanalys.
          </Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h5" gutterBottom>
            Tips för att lösa uppgiften
          </Typography>
          <Typography component="div">
            <ul>
              <li>Studera graferna noggrant och identifiera trender</li>
              <li>Använd formeln för procentuell förändring: ((slutvärde - startvärde) / startvärde) × 100</li>
              <li>Tänk på att scenarierna representerar olika socioekonomiska utvecklingsvägar</li>
              <li>RCP 2.6 kräver omfattande utsläppsminskningar</li>
              <li>RCP 4.5 representerar en medelhög utsläppsbana</li>
              <li>RCP 8.5 visar utvecklingen utan klimatåtgärder</li>
            </ul>
          </Typography>

          <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 2 }}>
            Referenser och fördjupning
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Vetenskapliga rapporter
          </Typography>
          <Typography component="div" sx={{ pl: 2, mb: 3 }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ mb: 1 }}>
                IPCC (2023) <i>Climate Change 2023: Synthesis Report</i>. [online] 
                Tillgänglig: <Link href="https://www.ipcc.ch/report/ar6/syr/" target="_blank" rel="noopener">
                https://www.ipcc.ch/report/ar6/syr/</Link> [Hämtad 2024-04-01]
              </li>
              <li style={{ mb: 1 }}>
                SMHI (2023) <i>Klimatscenarier</i>. [online] 
                Tillgänglig: <Link href="https://www.smhi.se/klimat/framtidens-klimat/klimatscenarier/" target="_blank" rel="noopener">
                https://www.smhi.se/klimat/framtidens-klimat/klimatscenarier/</Link> [Hämtad 2024-04-01]
              </li>
              <li style={{ mb: 1 }}>
                Naturvårdsverket (2024) <i>Parisavtalet</i>. [online] 
                Tillgänglig: <Link href="https://www.naturvardsverket.se/parisavtalet" target="_blank" rel="noopener">
                https://www.naturvardsverket.se/parisavtalet</Link> [Hämtad 2024-04-01]
              </li>
            </ul>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Vetenskapliga artiklar
          </Typography>
          <Typography component="div" sx={{ pl: 2, mb: 3 }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ mb: 1 }}>
                van Vuuren, D.P., et al. (2011) 'The representative concentration pathways: an overview', 
                <i>Climatic Change</i>, 109(1), ss. 5-31. 
                DOI: <Link href="https://doi.org/10.1007/s10584-011-0148-z" target="_blank" rel="noopener">
                10.1007/s10584-011-0148-z</Link>
              </li>
              <li style={{ mb: 1 }}>
                Hausfather, Z. och Peters, G.P. (2020) 'Emissions – the 'business as usual' story is misleading', 
                <i>Nature</i>, 577(7792), ss. 618-620. 
                DOI: <Link href="https://doi.org/10.1038/d41586-020-00177-3" target="_blank" rel="noopener">
                10.1038/d41586-020-00177-3</Link>
              </li>
            </ul>
          </Typography>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Pedagogiska resurser
          </Typography>
          <Typography component="div" sx={{ pl: 2, mb: 3 }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ mb: 1 }}>
                Climate Interactive (2024) <i>C-ROADS World Climate Simulator</i>. [online] 
                Tillgänglig: <Link href="https://www.climateinteractive.org/tools/c-roads/" target="_blank" rel="noopener">
                https://www.climateinteractive.org/tools/c-roads/</Link> [Hämtad 2024-04-01]
              </li>
              <li style={{ mb: 1 }}>
                NASA (2024) <i>Global Climate Change: Vital Signs of the Planet</i>. [online] 
                Tillgänglig: <Link href="https://climate.nasa.gov/" target="_blank" rel="noopener">
                https://climate.nasa.gov/</Link> [Hämtad 2024-04-01]
              </li>
            </ul>
          </Typography>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <DataVisualization />
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <Quiz onQuizComplete={setQuizCompleted} />
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <Typography variant="h5" gutterBottom>
            Lösning och Analys
          </Typography>
          <Typography paragraph>
            Här är en detaljerad analys av klimatscenarierna och deras implikationer:
          </Typography>
          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            Scenarioanalys
          </Typography>
          <Typography component="div">
            <ol>
              <li>
                <strong>RCP 2.6 (Låga utsläpp):</strong>
                <ul>
                  <li>Temperaturökning begränsas till cirka 1.6°C år 2100</li>
                  <li>Kräver negativa utsläpp efter 2050</li>
                  <li>Mest ambitiösa scenariot, i linje med Parisavtalet</li>
                  <li>Förutsätter omfattande teknologisk utveckling inom förnybar energi</li>
                  <li>Kräver globalt samarbete och starka politiska åtaganden</li>
                </ul>
              </li>
              <li>
                <strong>RCP 4.5 (Medelhöga utsläpp):</strong>
                <ul>
                  <li>Resulterar i cirka 3.2°C uppvärmning år 2100</li>
                  <li>Utsläppen stabiliseras kring 2050</li>
                  <li>Kräver omfattande klimatåtgärder men mindre drastiska än RCP 2.6</li>
                  <li>Förutsätter gradvis övergång till hållbara energikällor</li>
                  <li>Mer realistiskt scenario givet nuvarande politiska åtaganden</li>
                </ul>
              </li>
              <li>
                <strong>RCP 8.5 (Höga utsläpp):</strong>
                <ul>
                  <li>Leder till cirka 5.7°C uppvärmning år 2100</li>
                  <li>Fortsatt ökning av utsläpp genom hela århundradet</li>
                  <li>Representerar "business as usual" utan klimatåtgärder</li>
                  <li>Skulle medföra allvarliga konsekvenser för ekosystem och samhällen</li>
                  <li>Anses idag som mindre sannolikt på grund av pågående klimatåtgärder</li>
                </ul>
              </li>
            </ol>
          </Typography>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            Kvantitativ Analys
          </Typography>
          <Typography paragraph>
            <strong>Temperaturökningar relativt förindustriell tid:</strong>
          </Typography>
          <Typography component="div" sx={{ pl: 2 }}>
            • År 2050:<br/>
            - RCP 2.6: ~1.3°C<br/>
            - RCP 4.5: ~1.8°C<br/>
            - RCP 8.5: ~2.3°C<br/><br/>
            • År 2100:<br/>
            - RCP 2.6: ~1.6°C<br/>
            - RCP 4.5: ~3.2°C<br/>
            - RCP 8.5: ~5.7°C
          </Typography>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            Kritiska Observationer
          </Typography>
          <Typography paragraph>
            <strong>Tidskritiska aspekter:</strong>
          </Typography>
          <Typography component="div">
            <ul>
              <li>De närmaste 10-20 åren är avgörande för vilken utvecklingsväg vi hamnar på</li>
              <li>Ju längre vi väntar med åtgärder, desto mer drastiska åtgärder krävs senare</li>
              <li>Tröghet i klimatsystemet gör att vissa effekter är oundvikliga</li>
              <li>Återkopplingsmekanismer kan förstärka uppvärmningen över tid</li>
            </ul>
          </Typography>

          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
            Samhällsimplikationer
          </Typography>
          <Typography paragraph>
            För att uppnå de lägre utsläppsscenarierna krävs omfattande samhällsförändringar:
          </Typography>
          <Typography component="div">
            <ul>
              <li>Snabb utfasning av fossila bränslen</li>
              <li>Omfattande energieffektiviseringar</li>
              <li>Förändrade konsumtionsmönster</li>
              <li>Teknologisk innovation inom klimatneutrala lösningar</li>
              <li>Stärkt internationellt samarbete</li>
            </ul>
          </Typography>

          <Typography paragraph sx={{ mt: 3 }}>
            <strong>Slutsats:</strong> Analysen visar tydligt att valet av utvecklingsväg får 
            dramatiska konsekvenser för den globala uppvärmningen. Skillnaden mellan RCP 2.6 och 
            RCP 8.5 vid år 2100 är hela 4.1°C, vilket skulle innebära fundamentalt olika framtider 
            för mänskligheten och jordens ekosystem.
          </Typography>
        </TabPanel>

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
    </Container>
  );
}

export default App;
