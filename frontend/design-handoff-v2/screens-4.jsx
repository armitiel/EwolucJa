// screens-4.jsx — Typography (no serifs, round kid-friendly fonts)

const FONT_PAIRS = [
{ id: 'fredoka', display: 'Fredoka', body: 'Nunito', tag: 'okrągły bohater',
  desc: 'Bardzo bąblasta, bardzo cieplna. Idealna do tytułów i przycisków.' },
{ id: 'baloo', display: 'Baloo 2', body: 'Quicksand', tag: 'pulchny i wesoły',
  desc: 'Pucułowate krzywe — czyta się ją jak balonik.' },
{ id: 'bricolage', display: 'Bricolage Grotesque', body: 'Lexend', tag: 'nowoczesny przyjaciel',
  desc: 'Czytelność klasy szkolnej, ale z charakterem.' },
{ id: 'sniglet', display: 'Sniglet', body: 'Comfortaa', tag: 'miękkie kreski',
  desc: 'Domowa i miękka. Najlepiej z dużymi ilustracjami.' },
{ id: 'mali', display: 'Mali', body: 'Nunito', tag: 'pisana dłonią',
  desc: 'Prawie ręczna, ale wciąż czytelna. Daje magicznego sznytu.' }];


function ScreenType({ go, t, setTweak }) {
  const setPair = (p) => {
    setTweak({ fontDisplay: p.display, fontBody: p.body });
    document.documentElement.style.setProperty('--font-display', p.display);
    document.documentElement.style.setProperty('--font-body', p.body);
  };
  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark ? 'night' : ''}`} />
      <div className="screen-inner">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={() => go('start')}>‹</button>
          <div className="meta" style={{ textAlign: 'center' }}>
            <div className="lbl">SYSTEM TYPOGRAFII</div>
            <div className="nm">Pisownia Krainy</div>
          </div>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '4px 18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className="card">
            <p className="t-hand" style={{ fontSize: 18, color: 'var(--p-ink-soft)', margin: 0 }}>
              Bez szeryfów. Tylko okrągłe, ciepłe, łatwe do czytania dla dzieci. Dotknij parę, żeby ją wybrać dla całej aplikacji.
            </p>
          </div>

          {FONT_PAIRS.map((p) => {
            const active = t.fontDisplay === p.display;
            return (
              <button key={p.id} onClick={() => setPair(p)} style={{
                border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
                background: 'transparent', width: '100%'
              }}>
                <div className="card" style={{
                  background: active ? 'rgba(184,134,232,.20)' : 'rgba(255,255,255,.78)',
                  boxShadow: active ? 'inset 0 0 0 2.5px var(--p-magic-dk), 0 6px 18px rgba(122,77,194,.20)' : 'var(--shadow-md)',
                  transition: 'all .2s ease', padding: '16px 18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontFamily: `'${p.display}',sans-serif`, fontSize: 36, fontWeight: 700, lineHeight: 1.05, color: "rgb(88, 86, 149)" }}>
                      Tropiciel
                    </div>
                    <span className="chip magic" style={{ fontSize: 10 }}>{p.tag}</span>
                  </div>
                  <div style={{ fontFamily: `'${p.body}',sans-serif`, fontSize: 14, fontWeight: 600, color: 'var(--p-ink-soft)', marginTop: 4, lineHeight: 1.4 }}>
                    {p.desc}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', fontFamily: `'${p.body}',sans-serif` }}>
                    <span style={{ background: 'rgba(122,77,194,.12)', color: 'var(--p-magic-dk)', fontWeight: 800, padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>{p.display}</span>
                    <span style={{ fontSize: 11, color: 'var(--p-ink-soft)' }}>+</span>
                    <span style={{ background: 'rgba(232,154,61,.18)', color: '#7A4D10', fontWeight: 800, padding: '4px 10px', borderRadius: 999, fontSize: 12 }}>{p.body}</span>
                    {active && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: 'var(--p-magic-dk)' }}>✓ wybrane</span>}
                  </div>

                  {/* mini sample of UI rendered in the pair */}
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: 'rgba(255,255,255,.55)', border: '1.5px dashed rgba(43,42,74,.10)' }}>
                    <div style={{ fontFamily: `'${p.display}',sans-serif`, fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>Tropienie Pytań</div>
                    <div style={{ fontFamily: `'${p.body}',sans-serif`, fontSize: 12, color: 'var(--p-ink-soft)', marginTop: 2 }}>
                      Zadaj komuś dorosłemu jedno pytanie, którego nigdy mu nie zadałeś.
                    </div>
                  </div>
                </div>
              </button>);

          })}

          <div className="card">
            <div style={{ fontFamily: 'var(--font-display),sans-serif', fontWeight: 700, fontSize: 18 }}>Aktualnie używane</div>
            <div style={{ fontSize: 12, color: 'var(--p-ink-soft)', marginTop: 4 }}>
              Tytuły: <b>{t.fontDisplay}</b> · Treść: <b>{t.fontBody || 'Nunito'}</b>
            </div>
          </div>

        </div>
      </div>
    </div>);

}

Object.assign(window, { ScreenType, FONT_PAIRS });