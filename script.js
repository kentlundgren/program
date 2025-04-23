/**
 * Huvudskript för Kent Lundgrens hemsida
 * 
 * Detta skript hanterar:
 * - Service worker-registrering för PWA-funktionalitet
 * - Menynamik för mobilanpassad navigation
 * - Uppdatering av senast ändrad-datum
 * - PWA-installationshantering
 */

// Funktion som exekveras när DOM är fullständigt laddad
document.addEventListener('DOMContentLoaded', function() {
    // ========== SERVICE WORKER-REGISTRERING ==========
    registerServiceWorker();
    
    // ========== SIDOPANEL-FUNKTIONALITET ==========
    setupSidebar();
    
    // ========== UPPDATERA SENAST ÄNDRAD-DATUM ==========
    updateLastModified();
    
    // ========== PWA-INSTALLATIONS-HANTERING ==========
    setupPwaInstall();
});

/**
 * Registrerar service worker för PWA-funktionalitet
 */
function registerServiceWorker() {
    // Kontrollera om service workers stöds i webbläsaren
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Service Worker registrerad med scope:', registration.scope);
                })
                .catch(function(error) {
                    console.error('Service Worker-registrering misslyckades:', error);
                });
        });
    } else {
        console.log('Service Workers stöds inte i denna webbläsare');
    }
}

/**
 * Konfigurerar sidopanelens funktionalitet
 */
function setupSidebar() {
    // Hämta DOM-element
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    
    // Lyssna på klick på menyknappen
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // Växla mellan att visa och dölja sidopanelen
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Stäng menyn när man klickar på överlagringen
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    }
}

/**
 * Uppdaterar "senast ändrad"-informationen i sidfoten
 */
function updateLastModified() {
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // Använd dokumentets senast ändrat-datum eller aktuellt datum
        const lastModified = document.lastModified 
            ? new Date(document.lastModified) 
            : new Date();
        
        lastModifiedElement.textContent = lastModified.toLocaleDateString('sv-SE', options);
    }
}

/**
 * Hanterar PWA-installationsfunktionalitet
 */
function setupPwaInstall() {
    // Variabler för installation
    let deferredPrompt;
    const pwaButton = document.querySelector('.pwa-button');
    
    // Göm installationsknappen initialt
    if (pwaButton) {
        pwaButton.style.display = 'none';
    }
    
    // Lyssna på 'beforeinstallprompt'-händelsen
    window.addEventListener('beforeinstallprompt', (e) => {
        // Förhindra Chrome från att automatiskt visa installationsprompten
        e.preventDefault();
        
        // Spara händelsen för att kunna använda den senare
        deferredPrompt = e;
        
        // Visa installationsknappen
        if (pwaButton) {
            pwaButton.style.display = 'flex';
            
            // Lyssna på klick på installationsknappen
            pwaButton.addEventListener('click', () => {
                // Visa installationsprompten
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    
                    // Vänta på att användaren ska svara på prompten
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('Användaren installerade PWA');
                        } else {
                            console.log('Användaren avvisade PWA-installation');
                        }
                        
                        // Nollställ den sparade prompten
                        deferredPrompt = null;
                        
                        // Dölj installationsknappen
                        pwaButton.style.display = 'none';
                    });
                }
            });
        }
    });
    
    // Lyssna på 'appinstalled'-händelsen
    window.addEventListener('appinstalled', () => {
        // Dölj installationsknappen när appen är installerad
        if (pwaButton) {
            pwaButton.style.display = 'none';
        }
        console.log('PWA installerades framgångsrikt');
    });
} 