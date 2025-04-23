/**
 * Utvecklad prompt för Röda Korsets utbildningsprogram
 * Version: 1.5.0
 * 
 * Här skedde en uppdatering för att specificera exakt de fem flikarna i huvudmenyn (Uppgift, 
 * Tips, Visualisering, Quiz och Lösning) samt förtydliga footerns layout och innehåll.
 */

export const developedPrompt = `
# Röda Korsets utbildningsprogram om internationell humanitär rätt

Skapa en interaktiv webbapplikation för Svenska Röda Korset som utbildar användare om grunderna i internationell humanitär rätt (IHR). Fokus ligger på att lära ut hur rättssystemet fungerar i krigszoner och konfliktsituationer, samt vilka skyldigheter och rättigheter som gäller för stridande och civila.

## Övergripande specifikationer
- Single-page application (SPA) med stöd för både router- och state-baserad navigering
- Responsiv design som fungerar på alla enheter
- Tillgänglighetsanpassad enligt WCAG 2.1 AA
- Språk: Svenska

## Teknisk stack
Använd modern React (18+) med följande:
- Vite som byggverktyg
- Funktionskomponenter och React Hooks
- Context API för tillståndshantering
- CSS Modules för stilar
- React Router (senaste versionen) för router-navigering
- Lokalt sparad data (localStorage) för användarens framsteg

## Design och användarupplevelse
- Minimalistisk och tydlig design med fokus på läsbarhet
- Färger baserade på Röda Korsets grafiska profil (rött, vitt, grått)
- Mjuka övergångar och animationer för en modern känsla
- Koncis och lättförståelig text med tydliga instruktioner
- Luftigt layout med balanserat whitespace

## Sidstruktur och innehåll

### Huvudnavigationsflikar
Applikationen ska ha exakt 5 flikar i huvudmenyn:
- **Uppgift**: Beskrivning av uppgiften/utbildningen
- **Tips**: Hjälpfull information och tips för användaren
- **Visualisering**: Statistik och visualisering av data
- **Quiz**: Kunskapstest med flervalsfrågor
- **Lösning**: Lösningsförslag (tillgängligt först efter godkänt quiz)

### Gemensamma komponenter
- **Header**: Responsiv navigationsbar med Röda Korsets logotyp och de fem huvudnavigeringsflikarna samt en responsiv hamburgermeny för mobila enheter.
- **Footer**: Kompakt layout på en rad som ska innehålla (från vänster till höger):
  * Organisationens logotyp med copyright-information länkad till Svenska Röda Korset
  * Programversion
  * Förklarande text "Byggd med:" följt av utvecklingsverktygens logotyper (Vite först, sedan React)
  * Knappar för Systeminformation/Programinformation, Ursprunglig prompt, Utvecklad prompt
  * Kontaktlänk
  * Längst ned centrerad: Växlingsknapp mellan router- och state-baserad navigering
- **Modaler**: För systeminformation, ursprunglig prompt och utvecklad prompt.

### Startsida
- Välkomstmeddelande som förklarar syftet med applikationen
- Kortfattad introduktion till IHR med punktform över vad användaren kommer att lära sig
- Tydlig "Kom igång"-knapp
- Visualisering av framsteg om användaren har påbörjat utbildningen

### Introduktion till IHR
- Tydlig förklaring av vad IHR är och varför det behövs
- Historisk kontext och utveckling
- Grundprinciperna inom IHR (distinktion, proportionalitet, försiktighet, etc.)
- Interaktiv grafik som visar relationerna mellan olika principer

### Lärmoduler
- 5-7 korta moduler som täcker olika aspekter av IHR
- Varje modul innehåller:
  * Informationstext med viktiga koncept
  * Illustrativa exempel
  * Interaktiva element (fallstudier, flervalsfrågor, etc.)
  * "Nästa" och "Föregående" navigering
- Framstegsindikator som visar hur mycket av utbildningen som är genomförd

### Quiz/Kunskapstest
- Ett test med 10-15 frågor som täcker innehållet från modulerna
- Blandade frågeformat (flerval, sant/falskt, matchning)
- Feedback för varje svar med förklaringar
- Sammanfattning av resultat med möjlighet att gå tillbaka och repetera moduler
- Certifikat eller bekräftelse på slutförande när användaren uppnår godkänt resultat

### Resurssida
- Fördjupningsmaterial för ytterligare läsning
- Länkar till officiella IHR-dokument
- PDF-resurser för nedladdning
- Video-resurser med korta förklarande videor

### Fallstudier
- Verkliga exempel där IHR har tillämpats eller brutits mot
- Analys av konsekvenser
- Interaktiva scenarier där användaren kan fatta beslut och se konsekvenserna

## Interaktiva element och funktioner

### Visualiseringar
- Interaktiva diagram och grafer som visar statistik
- Tidslinjer för IHR:s utveckling
- Kartor som visar konfliktområden där IHR är särskilt relevant

### Framstegsspårning
- Spara användarens framsteg i localStorage
- Visualisera framsteg genom modulerna
- Möjliggör fortsättning från senaste positionen

### Kunskapskontroller
- Korta quizfrågor i slutet av varje modul
- Större kunskapstest efter alla moduler
- Adaptiv svårighetsgrad baserad på användarens tidigare svar

### Tillgänglighet
- Högkontrast-läge
- Kompatibilitet med skärmläsare
- Tangentbordsnavigering
- Text-till-tal funktion för viktigt innehåll

## Tekniska detaljer

### Kodstruktur
- Välorganiserad mappstruktur med tydlig separation av komponenter, kontext, utils etc.
- Kommenterad kod för att underlätta förståelse
- Konsekvent namngivningskonvention
- Återanvändbara komponenter

### Prestanda
- Lazy-loading av komponenter för snabbare initial laddning
- Optimerade bilder och resurser
- Minimerad bundle-storlek
- Effektiv cachning av innehåll

### Säkerhet
- Sanering av användarinput
- Säker hantering av localStorage
- Content Security Policy
- Felhantering och validering

## Ytterligare specifikationer
- Information om cookies och dataintegritet
- Webbläsarkompatibilitet (moderna webbläsare)
- Versionshantering och dokumentation
- Metadataoptimering för delningar på sociala medier
`;

export default developedPrompt; 