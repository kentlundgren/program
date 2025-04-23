// Fil: TipsTab.jsx
// Komponent som visar tips för att lösa uppgiften

const TipsTab = () => {
  return (
    <div className="tips-container">
      <h2>Tips för att lösa uppgiften</h2>
      
      <div className="tips-section">
        <h3>1. Börja med att samla formler</h3>
        <p>
          Du behöver formeln för transmissionskoefficienten T vid tunnling genom en 
          rektangulär potentialbarriär:
        </p>
        <div className="formula">
          T = 1 / (1 + (V0²sinh²(κa)) / (4E(V0-E)))
        </div>
        <p>där κ = √(2m(V0-E)) / ℏ</p>
      </div>

      <div className="tips-section">
        <h3>2. Konvertera enheter</h3>
        <ul>
          <li>Konvertera eV till Joule (1 eV = 1.602 &times; 10⁻¹⁹ J)</li>
          <li>Konvertera nm till meter (1 nm = 10⁻⁹ m)</li>
          <li>Notera att ℏ = h/2π</li>
        </ul>
      </div>

      <div className="tips-section">
        <h3>3. Kontrollera förhållandet mellan E och V0</h3>
        <p>
          I detta fall är E &lt; V0, vilket betyder att tunnling är möjligt. 
          Om E &gt; V0 skulle det vara en annan formel som gäller.
        </p>
      </div>

      <div className="tips-section">
        <h3>4. Använd räknaren effektivt</h3>
        <ul>
          <li>Beräkna κ först</li>
          <li>Beräkna sinh(κa)</li>
          <li>Kvadrera resultatet</li>
          <li>Slutligen beräkna T</li>
        </ul>
      </div>

      <div className="tips-section">
        <h3>5. Kontrollera resultatet</h3>
        <ul>
          <li>Transmissionskoefficienten måste vara mellan 0 och 1</li>
          <li>Om du får ett negativt värde eller ett värde större än 1, har du gjort ett fel</li>
          <li>Kontrollera att alla enheter stämmer i slutfördelningen</li>
        </ul>
      </div>
    </div>
  );
};

export default TipsTab; 