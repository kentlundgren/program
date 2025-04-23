// Fil: SolutionTab.jsx
// Komponent som visar steg-för-steg lösningen på uppgiften

const SolutionTab = () => {
  return (
    <div className="solution-container">
      <h2>Steg-för-steg lösning</h2>

      <div className="solution-step">
        <h3>Steg 1: Samla givna värden</h3>
        <ul>
          <li>Rörelseenergi (E) = 4 eV</li>
          <li>Barriärhöjd (V0) = 5 eV</li>
          <li>Barriärbredd (a) = 0.1 nm = 0.1 &times; 10⁻⁹ m</li>
        </ul>
      </div>

      <div className="solution-step">
        <h3>Steg 2: Konvertera enheter</h3>
        <p>1 eV = 1.602 &times; 10⁻¹⁹ J</p>
        <ul>
          <li>E = 4 eV = 4 &times; 1.602 &times; 10⁻¹⁹ J = 6.408 &times; 10⁻¹⁹ J</li>
          <li>V0 = 5 eV = 5 &times; 1.602 &times; 10⁻¹⁹ J = 8.010 &times; 10⁻¹⁹ J</li>
        </ul>
      </div>

      <div className="solution-step">
        <h3>Steg 3: Beräkna κ</h3>
        <p>κ = √(2m(V0-E)) / ℏ</p>
        <p>där:</p>
        <ul>
          <li>m = 9.109 &times; 10⁻³¹ kg (elektronens massa)</li>
          <li>ℏ = 1.055 &times; 10⁻³⁴ J⋅s (reducerad Plancks konstant)</li>
        </ul>
        <p>κ = √(2 &times; 9.109 &times; 10⁻³¹ &times; (8.010 - 6.408) &times; 10⁻¹⁹) / 1.055 &times; 10⁻³⁴</p>
        <p>κ ≈ 5.12 &times; 10⁹ m⁻¹</p>
      </div>

      <div className="solution-step">
        <h3>Steg 4: Beräkna sinh(κa)</h3>
        <p>κa = 5.12 &times; 10⁹ &times; 0.1 &times; 10⁻⁹ = 0.512</p>
        <p>sinh(0.512) ≈ 0.534</p>
      </div>

      <div className="solution-step">
        <h3>Steg 5: Beräkna transmissionskoefficienten T</h3>
        <p>T = 1 / (1 + (V0²sinh²(κa)) / (4E(V0-E)))</p>
        <p>T = 1 / (1 + (5² &times; 0.534²) / (4 &times; 4 &times; (5-4)))</p>
        <p>T = 1 / (1 + (25 &times; 0.285) / (4 &times; 4 &times; 1))</p>
        <p>T = 1 / (1 + 7.125 / 16)</p>
        <p>T = 1 / 1.445</p>
        <p>T ≈ 0.692</p>
      </div>

      <div className="solution-step">
        <h3>Steg 6: Tolka resultatet</h3>
        <p>Transmissionskoefficienten T ≈ 0.692 betyder att:</p>
        <ul>
          <li>69.2% av elektronerna kommer att tunnla genom barriären</li>
          <li>30.8% av elektronerna kommer att reflekteras</li>
        </ul>
      </div>

      <div className="solution-summary">
        <h3>Sammanfattning</h3>
        <p>
          Trots att elektronen har mindre energi än barriärhöjden (4 eV &lt; 5 eV) 
          finns det en betydande sannolikhet för att elektronen ska tunnla genom barriären. 
          Detta är ett tydligt exempel på kvantmekanikens våg-partikel-dualitet och 
          tunnlingseffekten.
        </p>
      </div>
    </div>
  );
};

export default SolutionTab; 