// screens-3.jsx — Reward, Mentor panel, Invite code

// ═══ 8. REWARD / LEVEL UP ═══════════════════════════════════════
function ScreenReward({ go, t }){
  const [phase, setPhase] = React.useState(0); // 0 burst, 1 artifact, 2 evolved
  React.useEffect(()=>{
    const a = setTimeout(()=>setPhase(1), 700);
    const b = setTimeout(()=>setPhase(2), 1800);
    return ()=>{ clearTimeout(a); clearTimeout(b); };
  }, []);
  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark?'night':''}`} style={{ filter:'saturate(1.1)' }}/>
      <div className="screen-inner">
        {/* burst petals */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          {Array.from({length:14}).map((_,i)=>{
            const a = (i/14)*Math.PI*2;
            const cx = 50+Math.cos(a)*30, cy = 38+Math.sin(a)*20;
            const colors = ['#FFD269','#B886E8','#7BC0E8','#F08C8C','#5FA76F'];
            return <div key={i} style={{
              position:'absolute', left:`${cx}%`, top:`${cy}%`,
              width:14, height:14, borderRadius:'60% 0 60% 0',
              background: colors[i%colors.length],
              transform:`rotate(${i*32}deg)`,
              animation:`petal-fly 1.5s cubic-bezier(.34,1.56,.64,1) ${i*0.04}s both`,
            }}/>;
          })}
        </div>
        <style>{`
          @keyframes petal-fly{ 0%{transform: rotate(0) scale(0); opacity:0} 60%{opacity:1} 100%{transform: rotate(720deg) scale(1) translateY(40px); opacity:0} }
          @keyframes glow-ring{ 0%{transform: scale(.6); opacity:.7} 100%{transform: scale(2); opacity:0} }
          @keyframes float-art{ 0%,100%{ transform: translateY(0) rotate(0)} 50%{ transform: translateY(-12px) rotate(4deg)} }
        `}</style>

        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px 24px', gap:14, textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:2, color:'var(--p-magic-dk)' }}>TROP UKOŃCZONY</div>
          <h1 className="t-display" style={{ fontSize:42, margin:0, color:'var(--p-magic-dk)' }}>Echo wraca!</h1>

          {/* artifact appearing */}
          <div style={{ position:'relative', width:160, height:160, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,210,105,.55), transparent 60%)', animation:'glow-ring 1.6s ease-out infinite' }}/>
            {phase>=1 && <div style={{ animation:'float-art 3s ease-in-out infinite' }} className="pop-in">
              <Artifact kind="crystal" size={140}/>
            </div>}
            {phase===0 && <Sparkle size={60}/>}
          </div>

          <div className="card pop-in" style={{ width:'100%', textAlign:'left' }}>
            <div className="t-display" style={{ fontSize:22 }}>Kryształ Echo</div>
            <div style={{ fontSize:13, color:'var(--p-ink-soft)' }}>Zdobyty w Lesie Pytań · rzadki</div>
            <div className="t-hand" style={{ fontSize:18, color:'var(--p-ink-soft)', marginTop:6 }}>„Każda odpowiedź dorosłego, którą zapiszesz, dodaje światła temu kryształowi."</div>
          </div>

          <div style={{ display:'flex', gap:8, fontSize:14 }}>
            <span className="chip amber">+3 ✦ doświadczenia</span>
            {phase>=2 && <span className="chip magic pop-in">awatar dojrzewa!</span>}
          </div>

          <button className="btn btn-magic btn-block" onClick={()=>go('home')}>Wróć do domu ✦</button>
        </div>
      </div>
    </div>
  );
}

// ═══ 9. MENTOR PANEL ════════════════════════════════════════════
function ScreenMentor({ go, t }){
  const [tab, setTab] = React.useState('children');
  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark?'night':''}`} style={{ background: t.dark?undefined:'linear-gradient(180deg,#FFE3B8,#FBE2C0)' }}/>
      <div className="screen-inner">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={()=>go('start')}>‹</button>
          <div className="meta" style={{ textAlign:'center' }}>
            <div className="lbl">PANEL MENTORA</div>
            <div className="nm">Witaj, Anno</div>
          </div>
          <div style={{ width:36, fontSize:24, textAlign:'right' }}>🦉</div>
        </div>

        <div style={{ flex:1, overflowY:'auto', minHeight:0, padding:'4px 18px 18px', display:'flex', flexDirection:'column', gap:14 }}>

          {/* segmented */}
          <div style={{ display:'flex', background:'rgba(255,255,255,.7)', borderRadius:14, padding:4 }}>
            {[['children','Tropiciele'],['week','Ten cykl'],['settings','Ton i tempo']].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{
                flex:1, border:'none', cursor:'pointer', padding:'8px 6px',
                fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:12,
                borderRadius:10,
                background: tab===k?'linear-gradient(180deg,#FFD269,#E89A3D)':'transparent',
                color: tab===k?'#4A2A0E':'var(--p-ink-soft)',
                boxShadow: tab===k?'0 2px 0 #B47322':'none',
              }}>{l}</button>
            ))}
          </div>

          {tab==='children' && <>
            <ChildCard name="Max" kind={t.avatar||'fox'} cycle="Cykl #1" progress={60} mood="ciekawy"
              last="zadał: „Skąd wiesz, że śpisz?"/>
            <ChildCard name="Zuzia" kind="rabbit" cycle="Cykl #3" progress={20} mood="zamyślona"
              last="zdobyła: Pióro Słuchacza"/>
            <button className="btn btn-ghost btn-block" onClick={()=>go('invite')}>+ Dodaj kolejnego tropiciela</button>
          </>}

          {tab==='week' && <>
            <div className="card">
              <div className="t-display" style={{ fontSize:22 }}>Cykl Maxa — dzień 4 z 5</div>
              <div className="prog magic" style={{ marginTop:10 }}><i style={{ width:'60%' }}/></div>
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <Pillar phase={1} label="Pytanie" status="✓"/>
                <Pillar phase={2} label="Słuchanie" status="✓"/>
                <Pillar phase={3} label="Tropienie" status="…" active/>
                <Pillar phase={0} label="Echo" status="—"/>
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-ink-soft)' }}>WGLĄD</div>
              <div className="t-hand" style={{ fontSize:19, marginTop:4 }}>„Max chętnie zadaje pytania, ale rzadko zapisuje odpowiedzi. W tym cyklu warto razem ćwiczyć słuchanie."</div>
              <button className="btn btn-leaf btn-sm" style={{ marginTop:10 }}>Otwórz raport tygodnia</button>
            </div>
          </>}

          {tab==='settings' && <>
            <div className="card">
              <div className="t-display" style={{ fontSize:20 }}>Ton wiadomości</div>
              <div style={{ fontSize:12, color:'var(--p-ink-soft)', marginBottom:10 }}>Jak ma się zwracać do dziecka jego mentor-przewodnik?</div>
              {[
                ['ciepło','Ciepły bajarz'],
                ['energia','Energiczny przewodnik (wybrane)'],
                ['tajemnica','Tajemniczy mentor'],
              ].map(([k,l],i)=>(
                <label key={k} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, cursor:'pointer', background: i===1?'rgba(184,134,232,.16)':'transparent', marginTop:6 }}>
                  <input type="radio" name="ton" defaultChecked={i===1} style={{ accentColor:'var(--p-magic-dk)' }}/>
                  <span style={{ fontWeight:700, fontSize:14 }}>{l}</span>
                </label>
              ))}
            </div>
            <div className="card">
              <div className="t-display" style={{ fontSize:20 }}>Tempo cykli</div>
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                {['7 dni','5 dni','3 dni'].map((d,i)=>(
                  <button key={d} className={i===0?'btn btn-magic btn-sm':'btn btn-ghost btn-sm'} style={{ flex:1 }}>{d}</button>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="t-display" style={{ fontSize:20 }}>Powiadomienia</div>
              {['Gdy Max ukończy misję','Codzienne podsumowanie','Tygodniowa kronika'].map((l,i)=>(
                <label key={l} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderTop:i?'1px solid rgba(43,42,74,.08)':'none' }}>
                  <span style={{ fontSize:14, fontWeight:600 }}>{l}</span>
                  <input type="checkbox" defaultChecked={i!==1} style={{ width:36, height:20, accentColor:'var(--p-magic-dk)' }}/>
                </label>
              ))}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

const Pillar = ({ phase, label, status, active })=>(
  <div style={{ flex:1, textAlign:'center', padding:'10px 4px', borderRadius:14, background: active?'rgba(184,134,232,.18)':'rgba(255,255,255,.5)', boxShadow: active?'inset 0 0 0 2px var(--p-magic-dk)':'none' }}>
    <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
      <MoonPhase phase={phase} size={28} glow={active}/>
    </div>
    <div style={{ fontSize:10, fontWeight:800, color:'var(--p-ink-soft)' }}>{label}</div>
    <div style={{ fontSize:14, fontWeight:800, color: status==='✓'?'var(--p-leaf-dk)':'var(--p-magic-dk)' }}>{status}</div>
  </div>
);

const ChildCard = ({ name, kind, cycle, progress, mood, last })=>(
  <div className="card" style={{ display:'flex', gap:12, alignItems:'center' }}>
    <div style={{ position:'relative' }}>
      <Avatar kind={kind} size={56} evolved={1}/>
    </div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
        <div className="t-display" style={{ fontSize:20 }}>{name}</div>
        <span className="chip magic" style={{ fontSize:10, padding:'2px 7px' }}>{mood}</span>
      </div>
      <div style={{ fontSize:11, color:'var(--p-ink-soft)' }}>{cycle}</div>
      <div className="prog magic" style={{ marginTop:6 }}><i style={{ width:`${progress}%` }}/></div>
      <div className="t-hand" style={{ fontSize:16, marginTop:4, color:'var(--p-ink-soft)' }}>{last}</div>
    </div>
  </div>
);

// ═══ 10. KOMNATA REFLEKSJI ═══════════════════════════════════════
function ScreenInvite({ go, t }){
  const wisdoms = [
    { kw:'O CIEKAWOŚCI', body:'Pytanie, na które nikt nie zna odpowiedzi, jest jak nasienie. Posadź je w sobie — kiedyś wykiełkuje.', sign:'— Stary Mędrzec' },
    { kw:'O ODWADZE',    body:'Najmocniejsza tarcza nie jest ze stali. Jest z pierwszego kroku, którego się boisz.', sign:'— Stary Mędrzec' },
    { kw:'O BŁĘDACH',    body:'Każdy błąd to mapa. Pokazuje drogę, której już nie musisz iść — i otwiera trzy nowe.', sign:'— Stary Mędrzec' },
    { kw:'O SŁUCHANIU',  body:'Świat szepcze do tego, kto się zatrzyma. Posłuchaj wiatru w drzewach. Posłuchaj babci.', sign:'— Stary Mędrzec' },
    { kw:'O CIERPLIWOŚCI',body:'Zwoje rozwijają się powoli. Tak samo Ty. Nie spiesz się — magia mieszka w tym, co dojrzewa.', sign:'— Stary Mędrzec' },
    { kw:'O PRZYJAŹNI',  body:'Drzewo nie rośnie samo. Ma korzenie w ziemi i koronę pełną ptaków. Kim są Twoje korzenie? A kto siada na Twoich gałęziach?', sign:'— Stary Mędrzec' },
    { kw:'O ZŁOŚCI',     body:'Złość to smok, który mieszka w piersi. Nie wypędzaj go — naucz go oddychać razem z Tobą.', sign:'— Stary Mędrzec' },
    { kw:'O WYBORZE',    body:'Każdy mały wybór maluje pióro w Twoim awatarze. Tysiąc piór później — to już Ty.', sign:'— Stary Mędrzec' },
  ];

  const [idx, setIdx] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [tappedSign, setTappedSign] = React.useState(false);
  const [animKey, setAnimKey] = React.useState(0);

  const next = ()=>{
    setIdx(i => (i+1) % wisdoms.length);
    setAnimKey(k => k+1);
  };
  const prev = ()=>{
    setIdx(i => (i - 1 + wisdoms.length) % wisdoms.length);
    setAnimKey(k => k+1);
  };

  const askWizard = async ()=>{
    if (loading) return;
    setLoading(true);
    try {
      const txt = await window.claude.complete(`Jesteś dobrotliwym, ciepłym mędrcem-czarodziejem w aplikacji edukacyjnej dla dzieci w wieku 6-15 lat (Polska, fantasy). Powiedz JEDNĄ krótką, mądrą myśl (max 2 zdania, do 200 znaków) w formie opowieści-metafory o ciekawości, odwadze, błędach, słuchaniu, cierpliwości, przyjaźni, złości albo wyborze. Nie używaj cudzysłowów. Nie zaczynaj od "Słuchaj" ani "Wiesz co". Tylko sama myśl, po polsku, w spokojnym tonie.`);
      const clean = String(txt||'').trim().replace(/^["„"']|["""']$/g,'').slice(0,260);
      if (clean) {
        wisdoms.unshift({ kw:'NOWA MYŚL', body: clean, sign:'— Stary Mędrzec' });
        setIdx(0);
        setAnimKey(k=>k+1);
      }
    } catch(e){}
    setLoading(false);
  };

  const w = wisdoms[idx];

  return (
    <div className="screen">
      {/* ambient chamber bg */}
      <div className={`sky-bg night`}/>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(184,134,232,.32), transparent 70%), radial-gradient(ellipse 50% 40% at 30% 80%, rgba(255,210,105,.18), transparent 70%)' }}/>
      {/* drifting motes */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
        {Array.from({length:14}).map((_,i)=>{
          const left = (i*73)%100, top = (i*41+11)%100;
          const dur = 4 + (i%5)*1.2, delay = (i*0.4)%5;
          const sz = 3 + (i%4);
          return <span key={i} style={{ position:'absolute', left:`${left}%`, top:`${top}%`, width:sz, height:sz, borderRadius:'50%', background:'#FFE08A', boxShadow:'0 0 8px #FFD269,0 0 16px rgba(255,210,105,.6)', opacity:.65, animation:`mote ${dur}s ${delay}s ease-in-out infinite` }}/>;
        })}
        <style>{`@keyframes mote{0%,100%{transform:translateY(0) translateX(0);opacity:.45}50%{transform:translateY(-18px) translateX(8px);opacity:.95}}`}</style>
      </div>

      <div className="screen-inner">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={()=>go('home')}>‹</button>
          <div className="meta" style={{ textAlign:'center' }}>
            <div className="lbl">KOMNATA REFLEKSJI</div>
            <div className="nm">Rada Mędrca</div>
          </div>
          <div style={{ width:36 }}/>
        </div>

        <div style={{ flex:1, padding:'4px 18px 18px', display:'flex', flexDirection:'column', alignItems:'center', gap:14, overflowY:'auto', minHeight:0 }}>

          {/* wizard portrait */}
          <div style={{ position:'relative', marginTop:6 }}>
            <div style={{ position:'absolute', inset:'-8% -10%', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,210,105,.42), transparent 65%)', filter:'blur(4px)', animation:'glow-ring 3.4s ease-in-out infinite' }}/>
            <img src="assets/wiz.png" alt="" style={{ position:'relative', width:170, height:'auto', display:'block', filter:'drop-shadow(0 10px 22px rgba(80,40,140,.55))', animation:'float-mid 4s ease-in-out infinite' }}/>
            {/* tiny floating sparkles */}
            <div style={{ position:'absolute', top:6, right:-10 }}><Sparkle size={18}/></div>
            <div style={{ position:'absolute', top:60, left:-14 }}><Sparkle size={14} delay={.5}/></div>
            <div style={{ position:'absolute', bottom:30, right:-8 }}><Sparkle size={12} delay={1.2}/></div>
          </div>

          {/* wisdom scroll */}
          <div key={animKey} className="card card-paper pop-in" style={{ width:'100%', position:'relative', padding:'22px 20px', minHeight:200 }}>
            <div className="scroll-rod" style={{ top:-4 }}/>
            <div className="scroll-rod" style={{ bottom:-4 }}/>
            <div style={{ padding:'10px 0' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span className="chip magic" style={{ fontSize:10 }}>✦ {w.kw}</span>
                <span style={{ fontSize:11, color:'var(--p-ink-soft)' }}>myśl {idx+1} z {wisdoms.length}</span>
              </div>
              <div className="t-hand" style={{ fontSize:21, lineHeight:1.35, color:'#3B2A12' }}>
                „{w.body}"
              </div>
              <div className="t-display" style={{ fontSize:14, marginTop:14, textAlign:'right', color:'#7A4D10', opacity:.85 }}>
                {w.sign}
              </div>
            </div>
          </div>

          {/* nav row */}
          <div style={{ display:'flex', gap:10, width:'100%' }}>
            <button className="btn btn-ghost btn-sm" style={{ flex:1 }} onClick={prev}>‹ Poprzednia</button>
            <button className="btn btn-magic btn-sm" style={{ flex:1.6 }} onClick={next}>Następna myśl ✦</button>
          </div>

          {/* Claude-powered fresh wisdom */}
          <button className="btn btn-block" disabled={loading} onClick={askWizard} style={{
            background:'linear-gradient(135deg, rgba(255,210,105,.30), rgba(184,134,232,.30))',
            border:'1.5px dashed rgba(255,255,255,.45)',
            color:'#fff', fontWeight:700,
          }}>
            {loading ? '⌛ Mędrzec myśli…' : '✨ Zapytaj mędrca o nową myśl'}
          </button>

          {/* save to journal */}
          <button className="btn btn-ghost btn-block" onClick={()=>setTappedSign(true)}>
            {tappedSign ? '✓ Zapisane w dzienniku' : '✎ Zapisz tę myśl w dzienniku'}
          </button>

          <p style={{ fontSize:11, textAlign:'center', color:'rgba(255,255,255,.55)', margin:'4px 12px', lineHeight:1.5 }}>
            Komnata Refleksji jest cicha. Wracaj tu zawsze, gdy potrzebujesz spokoju, nowego pytania albo chwili dla siebie.
          </p>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenReward, ScreenMentor, ScreenInvite });
