// screens.jsx — all 10 screens for EwolucJA prototype.
// Components rely on globals: Avatar, RegionIcon, Artifact, MoonPhase, WorldMap, TabIcons, Sparkle, Cloud

const AVATARS = [
{ id: 'fox', name: 'Lis-Tropiciel', desc: 'Sprytny i ciekawy świata' },
{ id: 'owl', name: 'Sowa-Mędrczyni', desc: 'Mądra i czujna w nocy' },
{ id: 'rabbit', name: 'Zając-Skoczek', desc: 'Szybki i energiczny' },
{ id: 'dragon', name: 'Smok-Iskierka', desc: 'Odważny i ognisty' },
{ id: 'cat', name: 'Kot-Cień', desc: 'Tajemniczy i miękki' }];


const REGIONS = {
  forest: { name: 'Las Pytań', color: '#5FA76F', desc: 'Tu rosną pytania jak grzyby po deszczu.' },
  sea: { name: 'Morze Słów', color: '#7BC0E8', desc: 'Fale niosą historie z dalekich brzegów.' },
  mountain: { name: 'Góry Liczb', color: '#7A8FB8', desc: 'Strome szczyty mierzone krokami.' },
  castle: { name: 'Zamek Czasu', color: '#7A4DC2', desc: 'W komnatach drzemią zapomniane chwile.' },
  desert: { name: 'Pustynia Pomysłów', color: '#E1C68A', desc: 'Ziarna nowych myśli przesypują się w wietrze.' },
  sky: { name: 'Niebo Marzeń', color: '#B886E8', desc: 'Chmury, na których można usiąść z łokciami w gwiazdach.' }
};

// ═══ 1. START / ROLE PICKER ════════════════════════════════════
function ScreenStart({ go, t }) {
  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark ? 'night' : ''}`} />
      <div className="screen-inner">
        {/* clouds */}
        <div style={{ position: 'absolute', top: 90, left: -20, animation: 'float-slow 5s ease-in-out infinite' }}><Cloud size={120} opacity={.85} /></div>
        <div style={{ position: 'absolute', top: 160, right: -30, animation: 'float-mid 4s ease-in-out infinite' }}><Cloud size={90} opacity={.7} /></div>

        <div style={{ flex: 1, padding: '110px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, position: 'relative', zIndex: 1 }}>
          <div style={{ marginTop: 4, animation:'float-mid 4s ease-in-out infinite', position:'relative' }}>
            <div style={{ position:'absolute', inset:'-12% -8% 4%', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,210,105,.45), transparent 65%)', filter:'blur(4px)' }}/>
            <img src="assets/book.png" alt="" style={{ position:'relative', width:160, height:'auto', display:'block', filter:'drop-shadow(0 14px 22px rgba(80,40,140,.35))' }}/>
          </div>
          <h1 style={{ fontFamily:"'Lilita One', 'Baloo 2', sans-serif", fontSize: 72, fontWeight: 400, margin: '8px 0 0', textAlign: 'center', letterSpacing:'-1px', color:'var(--p-ink)', textShadow: '0 3px 0 rgba(255,255,255,.55), 0 6px 0 rgba(43,42,74,.06)' }}>
            Ewoluc<span className="aurora-text">JA</span>
          </h1>
          <p className="t-hand" style={{ fontSize: 22, margin: 0, color: 'var(--p-ink-soft)', textAlign: 'center', maxWidth: 300, lineHeight:1.25 }}>
            Baw się, odkrywaj i zdobywaj nowe moce z każdym krokiem.
          </p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            <button className="btn btn-magic btn-block" onClick={() => go('onboarding')}>
              <span style={{ fontSize: 20 }}>✦</span> Rozpocznij przygodę
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: 'var(--p-ink-soft)', textAlign: 'center' }}>
            Jesteś dorosłym? — <a href="#" onClick={(e)=>{ e.preventDefault(); go('mentor'); }} style={{ color: 'var(--p-magic-dk)', fontWeight: 700, textDecoration:'underline', textUnderlineOffset:3 }}>zaloguj się jako Mentor</a>
          </p>
        </div>
      </div>
    </div>);

}

// ═══ 2. ONBOARDING (name + avatar) ═════════════════════════════
function ScreenOnboarding({ go, t, setTweak }) {
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('Max');

  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark ? 'night' : ''}`} />
      <div className="screen-inner">
        <div className="topbar" style={{ position: 'relative', zIndex: 1, paddingTop: 56 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => go('start')}>‹ Wróć</button>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1].map((i) => <div key={i} style={{ width: step === i ? 28 : 8, height: 8, borderRadius: 4, background: step >= i ? 'var(--p-magic-dk)' : 'rgba(43,42,74,.20)', transition: 'all .25s' }} />)}
          </div>
        </div>

        <div className="screen-scroll" style={{ display: 'flex', flexDirection: 'column' }}>
          {step === 0 &&
          <div className="pop-in" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '10px 4px' }}>
              <h1 className="t-display" style={{ fontSize: 34, fontFamily: "Nunito", fontWeight: "800", color: "rgb(63, 61, 109)" }}>Witaj w Krainie&nbsp;Kroniki</h1>
              <p className="t-hand" style={{ margin: 0, color: 'var(--p-ink-soft)', fontFamily: "Nunito", fontSize: "18px" }}>Zanim wyruszymy — powiedz, jak się nazywasz?</p>

              <div style={{ position: 'relative', marginTop: 6 }}>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={16}
              style={{
                width: '100%', fontSize: 24, fontFamily: "var(--font-display,'Baloo 2'),sans-serif", fontWeight: 700,
                padding: '18px 20px', border: '2.5px solid var(--p-magic-dk)', borderRadius: 18,
                background: 'rgba(255,255,255,.85)', outline: 'none'
              }} />
                <span style={{ position: 'absolute', top: -10, left: 18, background: 'var(--p-magic-dk)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 6, letterSpacing: 1 }}>TWOJE IMIĘ</span>
              </div>

              <button className="btn btn-magic btn-block" disabled={!name.trim()} onClick={() => setStep(1)}>
                Dalej →
              </button>
            </div>
          }
          {step === 1 &&
          <div className="pop-in" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 4px' }}>
              <h1 className="t-display" style={{ fontSize: 32, fontWeight: "500", color: "rgb(58, 57, 107)" }}>Wybierz towarzysza</h1>
              <p className="t-hand" style={{ fontSize: 20, margin: 0, color: 'var(--p-ink-soft)' }}>{name}, kto pójdzie z Tobą w przygodę?</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {AVATARS.map((a) => {
                const active = t.avatar === a.id;
                return (
                  <button key={a.id} onClick={() => setTweak('avatar', a.id)}
                  style={{
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    padding: '14px 12px 12px', borderRadius: 18,
                    background: active ? 'rgba(184,134,232,.22)' : 'rgba(255,255,255,.65)',
                    boxShadow: active ? 'inset 0 0 0 2.5px var(--p-magic-dk), 0 4px 14px rgba(122,77,194,.20)' : 'var(--shadow-sm)',
                    transition: 'all .18s ease'
                  }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar kind={a.id} size={64} evolved={active ? 1 : 0} />
                      </div>
                      <div style={{ fontFamily: "var(--font-display,'Baloo 2'),sans-serif", fontWeight: 700, fontSize: 15, marginTop: 4 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--p-ink-soft)', lineHeight: 1.25 }}>{a.desc}</div>
                    </button>);

              })}
              </div>

              <button className="btn btn-magic btn-block" onClick={() => go('home', { name })}>
                Wyrusz w drogę ✦
              </button>
            </div>
          }
        </div>
      </div>
    </div>);

}

// ═══ 3. HOME / WEEKLY DASHBOARD — minimal for kids ═════════════
function ScreenHome({ go, t, setTweak, name = 'Max' }) {
  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark ? 'night' : ''}`} />
      <div className="screen-inner">

        {/* floating coin pill */}
        <div style={{ position:'absolute', top:54, right:16, zIndex:3 }}>
          <CoinPill value={t.coins||0} onClick={()=>go('treasure')}/>
        </div>

        <div style={{ position: 'absolute', top: 60, right: -10, animation: 'float-slow 5s ease-in-out infinite', zIndex: 0 }}><Cloud size={120} opacity={.75} /></div>
        <div style={{ position: 'absolute', top: 180, left: -20, animation: 'float-mid 6s ease-in-out infinite', zIndex: 0 }}><Cloud size={90} opacity={.55} /></div>

        <div className="screen-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 64, position:'relative', zIndex:1 }}>

          {/* Hero — big wizard mascot + greeting */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, marginTop:4 }}>
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', inset:'-12% -8% 6%', borderRadius:'50%', background:'radial-gradient(circle, rgba(184,134,232,.45), transparent 65%)', filter:'blur(4px)' }}/>
              <div style={{ position:'relative', animation:'float-mid 4s ease-in-out infinite' }}>
                <img src="assets/wizard.png" alt="" style={{ width:160, height:'auto', display:'block', filter:'drop-shadow(0 12px 22px rgba(80,40,140,.45))' }}/>
              </div>
              {/* sparkles around staff */}
              <div style={{ position:'absolute', top:24, left:-6 }}><Sparkle size={16}/></div>
              <div style={{ position:'absolute', top:60, left:-14 }}><Sparkle size={12} delay={.5}/></div>
            </div>
            <h2 className="t-display" style={{ fontSize: 30, margin:'4px 0 0', textAlign:'center' }}>Cześć, {name}!</h2>
            <p className="t-hand" style={{ fontSize: 18, margin:0, color:'var(--p-ink-soft)' }}>Zwój już na Ciebie czeka ✦</p>
          </div>

          {/* Cycle clock — different paces 3 / 5 / 7 days */}
          <CycleClock days={t.cycleDays || 5} dayIndex={t.cycleDay || 1} />

          {/* WEEK PROGRESS — 7-day strip with coins + streak */}
          <WeekProgress done={t.weekDone||0} coins={t.weekCoins||0} streak={t.streak||0} go={go}/>

          {/* ONE big mission card with scroll image */}
          <button onClick={() => go('mission')} style={{ border:'none', background:'transparent', padding:0, cursor:'pointer', textAlign:'left', position:'relative' }}>
            <div className="card" style={{ padding: '14px 16px', display:'flex', alignItems:'center', gap:14, background:'linear-gradient(135deg, rgba(255,224,181,.55), rgba(255,210,105,.40))' }}>
              <img src="assets/zwoj-closed.png" alt="" style={{ width:64, height:'auto', flex:'none', filter:'drop-shadow(0 6px 12px rgba(80,50,10,.35))', animation:'float-mid 3s ease-in-out infinite' }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing:1.5, color: 'var(--p-magic-dk)' }}>DZISIEJSZY ZWÓJ</div>
                <h2 className="t-display" style={{ fontSize: 22, margin: '2px 0 0' }}>Tropienie Pytań</h2>
                <div style={{ display:'flex', gap:6, marginTop:6, alignItems:'center' }}>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:4,
                    background:'rgba(255,255,255,.85)', color:'#7A4D10',
                    fontWeight:800, fontSize:11, padding:'2px 8px 2px 4px',
                    borderRadius:999, boxShadow:'inset 0 0 0 1.2px #E1B66A',
                  }}><Coin size={16}/> +12</span>
                  <span className="chip magic" style={{ fontSize:11, padding:'2px 8px' }}>+3 ✦</span>
                </div>
              </div>
              <span style={{ fontSize:32, color:'var(--p-magic-dk)', fontWeight:700 }}>›</span>
            </div>
            <div style={{ position: 'absolute', top: -8, left: 50 }}><Sparkle size={20} /></div>
            <div style={{ position: 'absolute', bottom: -4, left: 30 }}><Sparkle size={14} delay={.6} /></div>
          </button>

          {/* Komnata refleksji — single secondary action */}
          <button onClick={() => go('invite')} style={{ border:'none', padding:0, background:'transparent', cursor:'pointer', textAlign:'left' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(184,134,232,.22), rgba(255,210,105,.20))', position:'relative', display:'flex', alignItems:'center', gap:14, padding:'16px 18px' }}>
              <img src="assets/wiz.png" alt="" aria-hidden="true" style={{
                width:80, height:'auto', flex:'none',
                transform:'scaleX(-1)',
                filter:'drop-shadow(0 4px 8px rgba(80,40,140,.35))',
              }}/>
              <div style={{ flex:1 }}>
                <div className="t-display" style={{ fontSize: 20 }}>Komnata Refleksji</div>
                <div style={{ fontSize: 13, color: 'var(--p-ink-soft)', marginTop:2 }}>Mędrzec ma dla Ciebie myśl</div>
              </div>
              <span style={{ fontSize:28, color:'var(--p-magic-dk)', fontWeight:700 }}>›</span>
            </div>
          </button>
        </div>

        {/* Tab bar */}
        <TabBar current="home" go={go} />
      </div>
    </div>);

}

function TabBar({ current, go }) {
  const tabs = [
  { id: 'home', label: 'Dom', icon: TabIcons.home, target: 'home' },
  { id: 'map', label: 'Mapa', icon: TabIcons.map, target: 'map' },
  { id: 'backpack', label: 'Plecak', icon: TabIcons.bag, target: 'backpack' },
  { id: 'profile', label: 'Profil', icon: TabIcons.hero, target: 'profile' }];

  return (
    <div className="tabbar">
      {tabs.map((tb) =>
      <button key={tb.id} className={`tab ${current === tb.id ? 'active' : ''}`} onClick={() => go(tb.target)}>
          {tb.icon}
          <span>{tb.label}</span>
        </button>
      )}
    </div>);

}

// ─── Cycle clock — radial countdown with 3/5/7 day pace ────────
function CycleClock({ days=5, dayIndex=1 }){
  const r = 38;
  const C = 2 * Math.PI * r;
  const progress = Math.min(dayIndex / days, 1);
  const dash = `${C*progress} ${C}`;
  return (
    <div className="card" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px' }}>
      <div style={{ position:'relative', width:96, height:96, flex:'none' }}>
        <svg viewBox="0 0 100 100" width="96" height="96" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="rgba(255,255,255,.65)" stroke="rgba(122,77,194,.18)" strokeWidth="6"/>
          <circle cx="50" cy="50" r={r} fill="none" stroke="url(#cg)" strokeWidth="6" strokeLinecap="round" strokeDasharray={dash}/>
          {Array.from({length:days}).map((_,i)=>{
            const a = (i/days)*Math.PI*2;
            const x = 50 + Math.cos(a)*r;
            const y = 50 + Math.sin(a)*r;
            return <circle key={i} cx={x} cy={y} r={i<dayIndex?4:3} fill={i<dayIndex?'#7A4DC2':'#fff'} stroke="#7A4DC2" strokeWidth="1.5"/>;
          })}
          <defs>
            <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFD269"/>
              <stop offset="1" stopColor="#B886E8"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div className="t-display" style={{ fontSize:24, lineHeight:1 }}>{dayIndex}<span style={{ fontSize:14, color:'var(--p-ink-soft)' }}>/{days}</span></div>
          <div style={{ fontSize:9, fontWeight:800, letterSpacing:1, color:'var(--p-ink-soft)' }}>DZIEŃ</div>
        </div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-magic-dk)' }}>CYKL · {days===3?'KRÓTKI':days===5?'ŚREDNI':'DŁUGI'}</div>
        <div className="t-display" style={{ fontSize:18, marginTop:2 }}>Wieża Pytań</div>
        <div style={{ fontSize:12, color:'var(--p-ink-soft)', marginTop:2 }}>Zostało <b>{Math.max(days-dayIndex,0)}</b> {days-dayIndex===1?'dzień':'dni'} do nagrody ✦</div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenStart, ScreenOnboarding, ScreenHome, CycleClock, WeekProgress, TabBar, AVATARS, REGIONS });

// ─── Week progress — 7-day strip with daily completion + summary ────
function WeekProgress({ done=0, coins=0, streak=0, go }){
  const days = ['PN','WT','ŚR','CZ','PT','SO','ND'];
  const goal = 7;
  const pct = Math.round((done/goal)*100);

  return (
    <div className="card" style={{ padding:'14px 16px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-magic-dk)' }}>POSTĘP TYGODNIA</div>
          <div className="t-display" style={{ fontSize:18, marginTop:2 }}>{done} z {goal} zadań</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4, color:'#C2851E', fontWeight:800, fontSize:13 }}>
          <Coin size={18}/> <span>+{coins} w tym tyg.</span>
        </div>
      </div>

      {/* 7-day dots */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6, marginTop:2 }}>
        {days.map((d,i)=>{
          const isDone  = i < done;
          const isToday = i === done && done < goal;
          return (
            <div key={d} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{
                width:32, height:32, borderRadius:'50%', position:'relative',
                background: isDone
                  ? 'linear-gradient(180deg,#FFD269,#E89A3D)'
                  : isToday ? 'rgba(184,134,232,.20)' : 'rgba(255,255,255,.55)',
                boxShadow: isDone
                  ? '0 2px 0 #B47322, 0 3px 8px rgba(232,154,61,.45)'
                  : isToday ? 'inset 0 0 0 2.2px var(--p-magic-dk)' : 'inset 0 0 0 1.4px rgba(43,42,74,.10)',
                display:'flex', alignItems:'center', justifyContent:'center',
                animation: isDone ? `wk-bump .5s ${i*.06}s cubic-bezier(.34,1.56,.64,1) both` : 'none',
              }}>
                {isDone  && <Coin size={20}/>}
                {isToday && <span style={{ width:10, height:10, borderRadius:'50%', background:'var(--p-magic-dk)' }}/>}
              </div>
              <div style={{
                fontSize:10, fontWeight:800, letterSpacing:.5,
                color: isToday ? 'var(--p-magic-dk)' : 'var(--p-ink-soft)',
                opacity: isDone?1:.7,
              }}>{d}</div>
            </div>
          );
        })}
      </div>

      {/* progress bar + streak */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12 }}>
        <div style={{ flex:1 }}>
          <div className="prog magic"><i style={{ width:`${pct}%` }}/></div>
          <div style={{ fontSize:10, fontWeight:800, color:'var(--p-ink-soft)', marginTop:4, letterSpacing:.5 }}>
            {done>=goal
              ? 'TYDZIEŃ UKOŃCZONY ✦'
              : `JESZCZE ${goal-done} ${goal-done===1?'ZADANIE':(goal-done<5?'ZADANIA':'ZADAŃ')} DO SKARBU`}
          </div>
        </div>
        <div style={{
          display:'flex', alignItems:'center', gap:5,
          background:'linear-gradient(180deg,#FFC178,#E8632D)', color:'#fff',
          padding:'5px 11px', borderRadius:999, fontSize:13, fontWeight:800,
          boxShadow:'0 2px 0 #A03A12, 0 3px 8px rgba(232,99,45,.45)',
        }} title="seria dni z rzędu">
          <span style={{ display:'inline-block', animation:'streak-flame 1.4s ease-in-out infinite', transformOrigin:'50% 80%' }}>🔥</span>
          <span>{streak} dni</span>
        </div>
      </div>

      {/* week reward preview */}
      <div style={{
        marginTop:10, padding:'8px 10px', borderRadius:14,
        background: done>=goal ? 'linear-gradient(135deg,#FFE7B0,#FFD269)' : 'rgba(122,77,194,.10)',
        display:'flex', alignItems:'center', gap:10,
      }}>
        <div style={{ fontSize:22, animation: done>=goal?'wiggle .8s ease-in-out infinite':'none', flex:'none' }}>
          {done>=goal ? '🎁' : '📜'}
        </div>
        <div style={{ flex:1, fontSize:12, color:'var(--p-ink-soft)', fontWeight:600, lineHeight:1.3 }}>
          {done>=goal
            ? <><b style={{ color:'#7A4D10' }}>Skarb tygodnia odblokowany!</b> Odbierz +50 monet i artefakt cykli.</>
            : <><b style={{ color:'var(--p-magic-dk)' }}>Skarb tygodnia:</b> +50 monet · rzadki artefakt · ewolucja</>}
        </div>
      </div>
    </div>
  );
}
