// Fil: TaskTab.jsx
// Komponent som visar uppgiften för tunnlingseffekten

const TaskTab = () => {
  return (
    <div className="task-container">
      <h2>Kvantfysik: Tunnlingseffekten</h2>
      
      <div className="task-description">
        <h3>Uppgift:</h3>
        <p>
          Ett elektron med rörelseenergi 4 eV träffar en potentialbarriär med höjden 5 eV 
          och bredden 0.1 nm. Beräkna transmissionskoefficienten för tunnling genom barriären.
        </p>
      </div>

      <div className="task-details">
        <h3>Givna värden:</h3>
        <ul>
          <li>Rörelseenergi (E) = 4 eV</li>
          <li>Barriärhöjd (V₀) = 5 eV</li>
          <li>Barriärbredd (a) = 0.1 nm</li>
        </ul>
      </div>

      <div className="task-requirements">
        <h3>Vad du behöver veta:</h3>
        <ul>
          <li>Formeln för transmissionskoefficienten vid tunnling</li>
          <li>Värdet på Plancks konstant (h)</li>
          <li>Elektronens massa (mₑ)</li>
          <li>Konvertering mellan eV och Joule</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskTab; 