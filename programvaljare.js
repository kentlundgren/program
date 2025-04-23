/**
 * PROGRAMVÄLJARE JAVASCRIPT
 * 
 * Detta skript hanterar funktionaliteten för programväljaren:
 * - Initierar Swiper för swipe-navigation mellan program
 * - Synkroniserar dropdown-väljaren med aktuellt program
 * - Hanterar navigationsknapparna för att byta program
 * - Uppdaterar paginering och programnamn
 * - Hanterar laddning av iframes
 */

// Global variabel för att hålla koll på laddningsstatus för varje slide
const slidesLoaded = [false, false, false, false, false];

// Funktion för att dölja laddningsindikator när en iframe laddats
function hideLoading(iframe) {
    // Hitta den närmaste swiper-slide föräldern
    const slide = iframe.closest('.swiper-slide');
    if (slide) {
        // Hitta index för den aktuella sliden
        const slideIndex = Array.from(slide.parentNode.children).indexOf(slide);
        // Markera slide som laddad
        slidesLoaded[slideIndex] = true;
        
        // Dölj laddningsindikator om den aktiva sliden är laddad
        if (slideIndex === swiper.activeIndex) {
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
        }
    }
}

// Vänta tills dokumentet är helt laddat
document.addEventListener('DOMContentLoaded', function() {
    // Hämta DOM-element
    const programSelect = document.getElementById('program-select');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const bullets = document.querySelectorAll('.bullet');
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    // Programtitlar
    const programTitles = [
        "Biodiversitet och resiliens",
        "Kvantfysik",
        "Fysik",
        "Matematikuppgift (kurvor)",
        "Klimatscenarier"
    ];
    
    // Initiera Swiper med konfiguration
    const swiper = new Swiper('.swiper', {
        // Grundläggande inställningar
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 0,
        
        // Aktivera swipe-funktion
        grabCursor: true,
        
        // Förhindra att sidor laddas i förväg (för att spara bandbredd)
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
        },
        
        // Förbättra prestanda
        watchSlidesProgress: true,
        
        // Effekter vid byte av sida
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        
        // Förhindra automatisk swipe
        allowTouchMove: true,
        
        // Fördröjning för bättre prestanda
        speed: 300,
        
        // Events
        on: {
            slideChange: function() {
                updateInterface(this.activeIndex);
                
                // Visa laddningsindikator om sliden inte är laddad
                if (!slidesLoaded[this.activeIndex]) {
                    loadingIndicator.classList.remove('hidden');
                } else {
                    loadingIndicator.classList.add('hidden');
                }
            }
        }
    });
    
    // Gör swiper tillgänglig globalt
    window.swiper = swiper;
    
    // Uppdatera gränssnittet baserat på aktivt program
    function updateInterface(index) {
        // Uppdatera dropdown
        programSelect.value = index;
        
        // Uppdatera bullets
        bullets.forEach((bullet, i) => {
            if (i === index) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });
        
        // Uppdatera sidrubriken
        document.title = programTitles[index] + " - Programväljare";
    }
    
    // Lyssna på ändringar i dropdown-väljaren
    programSelect.addEventListener('change', function() {
        // Hoppa till vald slide
        swiper.slideTo(parseInt(this.value));
    });
    
    // Konfigurera navigationsknapparna
    prevButton.addEventListener('click', function() {
        swiper.slidePrev();
    });
    
    nextButton.addEventListener('click', function() {
        swiper.slideNext();
    });
    
    // Lägg till tangentbordsnavigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            swiper.slidePrev();
        } else if (e.key === 'ArrowRight') {
            swiper.slideNext();
        }
    });
    
    // Lyssna på klick på bullets
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
            swiper.slideTo(index);
        });
    });
    
    // Funktion för att hantera responsivitet och anpassa swiper vid fönsterändring
    function handleResize() {
        swiper.update();
    }
    
    // Lyssna på ändringar i fönsterstorlek
    window.addEventListener('resize', handleResize);
    
    // Initiera gränssnittet
    updateInterface(0);
}); 