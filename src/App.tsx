import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useDaten, zuruecksetzen } from './lib/db.ts'
import { ichSetzen, useIch } from './lib/ich.ts'
import { person } from './lib/finden.ts'
import Wer from './feld/Wer.tsx'
import Start from './feld/Start.tsx'
import NeueArbeit from './feld/NeueArbeit.tsx'
import Auftrag from './feld/Auftrag.tsx'
import Dashboard from './buero/Dashboard.tsx'
import SatzDetail from './buero/SatzDetail.tsx'
import Archiv from './buero/Archiv.tsx'
import Nachtrag from './buero/Nachtrag.tsx'
import Einstellungen from './buero/Einstellungen.tsx'
import { ZFeld, ZListe } from './teile/Zeichen.tsx'
import { nachzutragen } from './lib/rechnen.ts'

/**
 * Zwei Oberflaechen aus einem System.
 *  · Feld — eine Kopfzeile, sonst nichts. Wer draussen steht, soll nicht
 *    navigieren muessen.
 *  · Buero — Reiter fuer Dashboard, Archiv, Nachtrag, Einstellungen.
 */
export default function App() {
  const d = useDaten()
  const ich = useIch()
  const ort = useLocation()
  const imBuero = ort.pathname.startsWith('/buero')
  const offen = nachzutragen(d).length

  return (
    <div className="rahmen">
      <div className="demoband">
        <span><strong>Demo</strong> — erfundene Daten, nur in diesem Browser.</span>
        <button onClick={() => { zuruecksetzen(); ichSetzen(null) }}>zurücksetzen</button>
      </div>

      <header className="kopf">
        <div className="kopf-inhalt">
          <NavLink to={imBuero ? '/buero' : '/feld'} className="marke">
            Feld<i>stunden</i>
          </NavLink>

          <nav className="reiter wachsen">
            {imBuero ? (
              <>
                <NavLink to="/buero" end className={({ isActive }) => isActive ? 'aktiv' : ''}>Dashboard</NavLink>
                <NavLink to="/buero/archiv" className={({ isActive }) => isActive ? 'aktiv' : ''}>Archiv</NavLink>
                <NavLink to="/buero/nachtrag" className={({ isActive }) => isActive ? 'aktiv' : ''}>
                  Nachtragen{offen > 0 && <span className="zaehler">{offen}</span>}
                </NavLink>
                <NavLink to="/buero/einstellungen" className={({ isActive }) => isActive ? 'aktiv' : ''}>
                  Einstellungen
                </NavLink>
              </>
            ) : (
              ich && <span className="leise" style={{ paddingLeft: 2 }}>{person(d, ich)?.name}</span>
            )}
          </nav>

          <div className="schalter">
            <NavLink to="/feld" className={!imBuero ? 'aktiv' : ''}>
              <ZFeld width="15" height="15" /> Feld
            </NavLink>
            <NavLink to="/buero" className={imBuero ? 'aktiv' : ''}>
              <ZListe width="15" height="15" /> Büro
            </NavLink>
          </div>
        </div>
      </header>

      <main className="wachsen">
        <Routes>
          <Route path="/" element={<Navigate to="/feld" replace />} />
          <Route path="/feld" element={ich ? <Start /> : <Wer />} />
          <Route path="/feld/neu" element={ich ? <NeueArbeit /> : <Wer />} />
          <Route path="/feld/auftrag/:id" element={ich ? <Auftrag /> : <Wer />} />
          <Route path="/buero" element={<Dashboard />} />
          <Route path="/buero/satz/:id" element={<SatzDetail />} />
          <Route path="/buero/archiv" element={<Archiv />} />
          <Route path="/buero/nachtrag" element={<Nachtrag />} />
          <Route path="/buero/einstellungen" element={<Einstellungen />} />
          <Route path="*" element={<Navigate to="/feld" replace />} />
        </Routes>
      </main>
    </div>
  )
}
