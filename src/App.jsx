import Battle from "./components/Battle";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Mini Battler — Prototype</h1>
        <p>
          Due cavalieri: blu (tu) vs verde (avversario). Premi
          <strong>Attack</strong> per vedere l'animazione.
        </p>
        <Battle />
      </header>
    </div>
  );
}
