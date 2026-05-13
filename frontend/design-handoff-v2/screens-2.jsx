// screens-2.jsx — Map, Mission, Backpack, Profile screens
// Globals used: Avatar, RegionIcon, Artifact, MoonPhase, WorldMap, TabIcons, Sparkle, Cloud, REGIONS, TabBar

// ═══ 4. WORLD MAP ═══════════════════════════════════════════════
function ScreenMap({ go, t, name='Max' }){
  const [picked, setPicked] = React.useState('forest');

  // Journey order — bottom = start/current, top = far future.
  // Image asset is laid out castle→desert top-to-bottom (~y%).
  const pins = [
    { id:'castle',   x:46, y:7,  label:'Zamek Czasu',        step:5 },
    { id:'mountain', x:55, y:23, label:'Góry Liczb',         step:4 },
    { id:'sea',      x:64, y:64, label:'Morze Słów',         step:3 },
    { id:'desert',   x:48, y:88, label:'Pustynia Pomysłów',  step:2 },
    { id:'forest',   x:28, y:46, label:'Las Pytań',          step:1, current:true },
  ];
  const currentPin = pins.find(p=>p.current);
  const r = REGIONS[picked];

  // Spotlight mask — only the area around the current region stays in color.
  const spotlight = `radial-gradient(circle at ${currentPin.x}% ${currentPin.y}%, black 0%, black 18%, rgba(0,0,0,.30) 28%, transparent 38%)`;

  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark?'night':''}`}/>
      <div className="screen-inner">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={()=>go('home')}>‹</button>
          <div className="meta" style={{ textAlign:'center' }}>
            <div className="lbl">TWOJA PODRÓŻ</div>
            <div className="nm">Kraina Kroniki</div>
          </div>
          <div style={{ width:36 }}/>
        </div>

        <div style={{ flex:1, padding:'4px 14px 14px', display:'flex', flexDirection:'column', gap:12, overflowY:'auto', minHeight:0 }}>
          {/* tiny journey legend */}
          <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center', fontSize:11, fontWeight:800, letterSpacing:1, color:'var(--p-ink-soft)' }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:'#7A4DC2' }}/>
            <span>TU JESTEŚ</span>
            <span style={{ width:18, height:1, background:'rgba(43,42,74,.25)' }}/>
            <span style={{ opacity:.55 }}>↑ JESZCZE NIEDOSTĘPNE</span>
          </div>

          {/* Map illustration with greyed-out future regions + colorful current */}
          <div style={{ position:'relative', width:'100%', maxWidth:340, margin:'0 auto' }}>
            {/* base: greyscale, dim */}
            <img src="assets/mapa.png" alt="" style={{
              display:'block', width:'100%', height:'auto',
              filter:'grayscale(.95) brightness(1.05) opacity(.55)',
            }}/>
            {/* spotlight overlay: same map in full color, masked to current region only */}
            <img src="assets/mapa.png" alt="" aria-hidden="true" style={{
              position:'absolute', inset:0, width:'100%', height:'auto',
              pointerEvents:'none',
              WebkitMaskImage: spotlight, maskImage: spotlight,
              filter:'drop-shadow(0 8px 18px rgba(122,77,194,.25))',
            }}/>
            {/* halo behind current pin */}
            <div style={{
              position:'absolute', left:`${currentPin.x}%`, top:`${currentPin.y}%`,
              transform:'translate(-50%,-50%)',
              width:120, height:120, borderRadius:'50%',
              background:'radial-gradient(circle, rgba(255,210,105,.35), transparent 65%)',
              pointerEvents:'none',
              animation:'pulse-halo 2.6s ease-in-out infinite',
            }}/>
            <style>{`
              @keyframes pulse-halo{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.85}50%{transform:translate(-50%,-50%) scale(1.18);opacity:.45}}
              @keyframes pulse-dot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.5}}
            `}</style>

            {/* pins — render non-current first so current sits on top */}
            {pins.filter(p=>!p.current).map(p => {
              const active = picked === p.id;
              return (
                <button key={p.id}
                  onClick={()=>setPicked(p.id)}
                  style={{
                    position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
                    transform:`translate(-50%,-50%) ${active?'scale(1.05)':'scale(1)'}`,
                    border:'none', background:'transparent', padding:0, cursor:'pointer',
                    transition:'transform .18s ease', zIndex:2,
                  }}>
                  <div style={{
                    background: 'rgba(255,255,255,.92)',
                    color: 'rgba(43,42,74,.55)',
                    fontFamily:"var(--font-display,'Baloo 2'),sans-serif",
                    fontWeight: 700, fontSize: 12,
                    padding:'4px 10px',
                    borderRadius:999,
                    boxShadow: active
                      ? '0 0 0 3px rgba(184,134,232,.40), 0 2px 6px rgba(40,20,80,.25)'
                      : '0 2px 6px rgba(40,20,80,.20), inset 0 0 0 1.2px rgba(122,77,194,.18)',
                    whiteSpace:'nowrap',
                    display:'flex', alignItems:'center', gap:5,
                  }}>
                    <span style={{ fontSize:11, opacity:.7 }}>🔒</span>
                    <span style={{ filter:'grayscale(.4)' }}>{p.label}</span>
                    <span style={{ fontSize:9, fontWeight:800, background:'rgba(43,42,74,.10)', padding:'1px 6px', borderRadius:8 }}>#{p.step}</span>
                  </div>
                </button>
              );
            })}
            {/* current pin on top */}
            {(()=>{
              const p = currentPin;
              const active = picked === p.id;
              return (
                <button key={p.id}
                  onClick={()=>setPicked(p.id)}
                  style={{
                    position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
                    transform:`translate(-50%,-50%) ${active?'scale(1.05)':'scale(1)'}`,
                    border:'none', background:'transparent', padding:0, cursor:'pointer',
                    transition:'transform .18s ease', zIndex:3,
                  }}>
                  <div style={{
                    background: 'linear-gradient(180deg,#FFD269,#E89A3D)',
                    color: '#4A2A0E',
                    fontFamily:"var(--font-display,'Baloo 2'),sans-serif",
                    fontWeight: 800, fontSize: 14,
                    padding:'6px 14px',
                    borderRadius:999,
                    boxShadow: '0 0 0 5px rgba(255,210,105,.40), 0 6px 14px rgba(232,154,61,.55)',
                    whiteSpace:'nowrap',
                    display:'flex', alignItems:'center', gap:7,
                  }}>
                    <span style={{ width:9, height:9, borderRadius:'50%', background:'#7A4DC2', boxShadow:'0 0 0 3px rgba(122,77,194,.30)', animation:'pulse-dot 1.8s ease-in-out infinite' }}/>
                    {p.label}
                  </div>
                </button>
              );
            })()}
          </div>

          {/* selected region card */}
          <div className="card pop-in" key={picked}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ background: (r?.color || '#5FA76F')+'33', borderRadius:14, padding:8, filter: picked==='forest'?'none':'grayscale(.5)' }}>
                <RegionIcon kind={picked==='sea'?'sea':picked} size={44}/>
              </div>
              <div style={{ flex:1 }}>
                <div className="t-display" style={{ fontSize:22 }}>{r?.name || picked}</div>
                <div className="t-hand" style={{ fontSize:17, color:'var(--p-ink-soft)' }}>{r?.desc}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
              {picked==='forest' ? (
                <>
                  <span className="chip leaf">2 misje</span>
                  <span className="chip amber">1 artefakt</span>
                  <span className="chip magic">tu jesteś</span>
                </>
              ) : (
                <span className="chip" style={{ background:'rgba(43,42,74,.12)' }}>🔒 niedostępne</span>
              )}
            </div>
            <button className="btn btn-magic btn-sm" style={{ marginTop:10 }}
              onClick={()=> picked==='forest' ? go('mission') : null}
              disabled={picked!=='forest'}>
              {picked==='forest' ? 'Wejdź do krainy →' : '🔒 Odblokuj po ukończeniu Lasu Pytań'}
            </button>
          </div>
        </div>

        <TabBar current="map" go={go}/>
      </div>
    </div>
  );
}

// ═══ 5. MISSION (open + complete) ═══════════════════════════════
function ScreenMission({ go, t }){
  // step 0: closed scroll | 1: opening | 2: open | 3: solving (form) | 4: done
  const [step, setStep] = React.useState(0);
  const [answer, setAnswer] = React.useState('');

  React.useEffect(()=>{
    if (step===1){
      const id = setTimeout(()=>setStep(2), 2000);
      return ()=>clearTimeout(id);
    }
  }, [step]);

  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark?'night':''}`}/>
      <div className="screen-inner">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={()=>go('home')}>‹</button>
          <div className="meta" style={{ textAlign:'center' }}>
            <div className="lbl">LAS PYTAŃ — MISJA 1</div>
            <div className="nm">Tropienie Pytań</div>
          </div>
          <div style={{ width:36 }}/>
        </div>

        <div style={{ flex:1, padding:'4px 18px 18px', display:'flex', flexDirection:'column', gap:14, overflowY:'auto', minHeight:0 }}>

          {step===0 && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, padding:'12px 0' }}>
              {/* closed scroll image */}
              <div style={{ position:'relative', animation:'float-mid 3s ease-in-out infinite' }}>
                <img src="assets/zwoj-closed.png" alt="" style={{ width:170, height:'auto', display:'block', filter:'drop-shadow(0 18px 26px rgba(80,50,10,.40))' }}/>
                <div style={{ position:'absolute', top:-6, left:-22 }}><Sparkle size={20}/></div>
                <div style={{ position:'absolute', bottom:30, right:-26 }}><Sparkle size={16} delay={.4}/></div>
                <div style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', fontSize:34, color:'#7A4DC2', textShadow:'0 2px 6px rgba(255,255,255,.6)' }}>✦</div>
              </div>
              <h2 className="t-display" style={{ fontSize:26, textAlign:'center', margin:0 }}>Zwój czeka na Ciebie</h2>
              <p className="t-hand" style={{ fontSize:20, textAlign:'center', color:'var(--p-ink-soft)', margin:0, maxWidth:240 }}>
                Naciśnij, aby rozwinąć i poznać dzisiejsze tropienie.
              </p>
              <button className="btn btn-magic btn-block" onClick={()=>setStep(1)}>Rozwiń zwój ✦</button>
            </div>
          )}

          {step===1 && (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <div style={{ position:'relative', width:'100%', maxWidth:320, aspectRatio:'610 / 522' }}>
                {/* paper unrolling: scaleX with bounce, longer */}
                <img src="assets/zwoj-open.png" alt="" style={{
                  position:'absolute', inset:0, width:'100%', height:'100%',
                  filter:'drop-shadow(0 14px 26px rgba(80,50,10,.35))',
                  animation:'unroll 1.9s cubic-bezier(.33,.0,.30,1) forwards',
                  transformOrigin:'center', transform:'scaleX(.20)',
                  willChange:'transform',
                }}/>
                {/* particle burst layer */}
                <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'visible' }}>
                  {Array.from({length:18}).map((_,i)=>{
                    const ang = (i / 18) * Math.PI * 2 + (i%2?.18:-.12);
                    const dist = 70 + (i*7)%70;
                    const dx = Math.cos(ang)*dist;
                    const dy = Math.sin(ang)*dist*.7;
                    const delay = .25 + (i%6)*.07;
                    const dur = 1.0 + (i%5)*.12;
                    const size = 6 + (i%4)*3;
                    const colors = ['#FFD269','#FFEFA8','#C8A6FF','#FFFFFF','#FFB347'];
                    const c = colors[i%colors.length];
                    return (
                      <span key={i} style={{
                        position:'absolute', left:'50%', top:'50%',
                        width:size, height:size, marginLeft:-size/2, marginTop:-size/2,
                        background:c, borderRadius:'50%',
                        boxShadow:`0 0 ${size*1.6}px ${c}, 0 0 ${size*3}px rgba(255,220,140,.55)`,
                        opacity:0,
                        animation:`spark-${i} ${dur}s ${delay}s cubic-bezier(.16,.84,.32,1) forwards`,
                      }}/>
                    );
                  })}
                  {/* star particles (✦) bigger */}
                  {Array.from({length:8}).map((_,i)=>{
                    const ang = (i/8)*Math.PI*2 + .4;
                    const dist = 95 + (i*11)%50;
                    const dx = Math.cos(ang)*dist;
                    const dy = Math.sin(ang)*dist*.6 - 10;
                    const delay = .55 + i*.08;
                    return (
                      <span key={'s'+i} style={{
                        position:'absolute', left:'50%', top:'50%',
                        marginLeft:-9, marginTop:-9,
                        fontSize:18, color:'#FFE08A', textShadow:'0 0 10px #FFD269,0 0 20px rgba(255,200,100,.7)',
                        opacity:0, animation:`starp-${i} 1.2s ${delay}s cubic-bezier(.16,.84,.32,1) forwards`,
                      }}>✦</span>
                    );
                  })}
                </div>
                <style>{`
                  @keyframes unroll{
                    0%{transform:scaleX(.20)}
                    100%{transform:scaleX(1)}
                  }
                  ${Array.from({length:18}).map((_,i)=>{
                    const ang = (i / 18) * Math.PI * 2 + (i%2?.18:-.12);
                    const dist = 70 + (i*7)%70;
                    const dx = Math.cos(ang)*dist;
                    const dy = Math.sin(ang)*dist*.7;
                    return `@keyframes spark-${i}{0%{transform:translate(0,0) scale(.3);opacity:0}15%{opacity:1}55%{opacity:1;transform:translate(${dx*.6}px,${dy*.6}px) scale(1)}100%{transform:translate(${dx}px,${dy+22}px) scale(.2);opacity:0}}`;
                  }).join('\n')}
                  ${Array.from({length:8}).map((_,i)=>{
                    const ang = (i/8)*Math.PI*2 + .4;
                    const dist = 95 + (i*11)%50;
                    const dx = Math.cos(ang)*dist;
                    const dy = Math.sin(ang)*dist*.6 - 10;
                    return `@keyframes starp-${i}{0%{transform:translate(0,0) scale(.2) rotate(0);opacity:0}25%{opacity:1}60%{opacity:1;transform:translate(${dx*.7}px,${dy*.7}px) scale(1.1) rotate(160deg)}100%{transform:translate(${dx}px,${dy+18}px) scale(.4) rotate(280deg);opacity:0}}`;
                  }).join('\n')}
                `}</style>
              </div>
            </div>
          )}

          {step===2 && (
            <div className="pop-in" style={{ position:'relative', width:'100%', margin:'8px 0' }}>
              <div style={{ position:'relative', width:'100%', aspectRatio:'610 / 522' }}>
                <img src="assets/zwoj-open.png" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', filter:'drop-shadow(0 14px 26px rgba(80,50,10,.35))' }}/>
                <div style={{ position:'absolute', inset:'12% 17% 13% 17%', display:'flex', flexDirection:'column', justifyContent:'center', overflow:'hidden' }}>
                  <div style={{ display:'flex', gap:5, marginBottom:6, flexWrap:'wrap' }}>
                    <span className="chip magic" style={{ fontSize:10, padding:'3px 8px' }}>Las Pytań</span>
                    <span className="chip amber" style={{ fontSize:10, padding:'3px 8px' }}>+3 ✦ +Artefakt</span>
                  </div>
                  <h2 className="t-display" style={{ fontSize:18, lineHeight:1.15, margin:'2px 0', color:'#3B2A12' }}>Zadaj pytanie, którego jeszcze nikt nie zadał</h2>
                  <p className="t-hand" style={{ fontSize:15, lineHeight:1.25, margin:'4px 0 0', color:'#5C4220' }}>
                    Znajdź dorosłego — rodzica, dziadka, panią w sklepie. Zadaj pytanie, które nigdy wcześniej nie przyszło Ci do głowy. Może być dziwne. Może być proste. Najważniejsze, że jest <i>Twoje</i>.
                  </p>
                </div>
              </div>
              <div style={{ background:'rgba(122,77,194,.10)', borderRadius:14, padding:'10px 12px', marginTop:6 }}>
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-magic-dk)' }}>JAK WRACA ECHO</div>
                <div style={{ fontSize:13, marginTop:4 }}>Zapisz lub nagraj odpowiedź dorosłego — to ona stanie się Twoim artefaktem.</div>
              </div>
              <button className="btn btn-magic btn-block" style={{ marginTop:10 }} onClick={()=>setStep(3)}>Mam już pytanie — dalej</button>
            </div>
          )}

          {step===3 && (
            <div className="pop-in" style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="card">
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-ink-soft)' }}>TWOJE PYTANIE</div>
                <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Wpisz pytanie, które zadałeś…"
                  style={{
                    width:'100%', minHeight:90, marginTop:6, padding:12,
                    border:'2px solid rgba(122,77,194,.30)', borderRadius:14,
                    background:'rgba(255,255,255,.85)', fontFamily:'Caveat,cursive',
                    fontSize:20, color:'var(--p-ink)', resize:'none', outline:'none',
                  }}/>
              </div>
              <div className="card">
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-ink-soft)' }}>USŁYSZANA ODPOWIEDŹ</div>
                <div style={{ display:'flex', gap:8, marginTop:8 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>✎ Zapisz</button>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>🎙 Nagraj</button>
                  <button className="btn btn-ghost btn-sm" style={{ flex:1 }}>✏ Narysuj</button>
                </div>
              </div>
              <button className="btn btn-magic btn-block" disabled={!answer.trim()} onClick={()=>go('reward')}>
                Złóż tropienie ✦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ 6. BACKPACK / ARTIFACTS ════════════════════════════════════
function ScreenBackpack({ go, t }){
  const items = [
    { kind:'crystal', name:'Kryształ Echo',     region:'Las Pytań',   date:'PT, 24 maja',    rarity:'rzadki' },
    { kind:'leaf',    name:'Liść Pierwszego Tropu', region:'Las Pytań', date:'PN, 20 maja', rarity:'pospolity' },
    { kind:'feather', name:'Pióro Słuchacza',   region:'Niebo Marzeń',date:'WT, 21 maja',    rarity:'rzadki' },
  ];
  const empty = [
    { kind:'book', name:'Księga Czasu' },
    { kind:'key', name:'Klucz do Wieży' },
    { kind:'shell', name:'Muszla Morza' },
  ];
  const [open, setOpen] = React.useState(0);

  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark?'night':''}`}/>
      <div className="screen-inner">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={()=>go('home')}>‹</button>
          <div className="meta" style={{ textAlign:'center' }}>
            <div className="lbl">PLECAK ARTEFAKTÓW</div>
            <div className="nm">3 z 12 odnalezione</div>
          </div>
          <div style={{ width:36 }}/>
        </div>

        <div style={{ flex:1, overflowY:'auto', minHeight:0, padding:'4px 18px 18px', display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card card-paper" style={{ display:'flex', alignItems:'center', gap:14 }}>
            <Artifact kind={items[open].kind} size={72}/>
            <div style={{ flex:1 }}>
              <div className="t-display" style={{ fontSize:22 }}>{items[open].name}</div>
              <div style={{ fontSize:12, color:'var(--p-ink-soft)' }}>z krainy: <b>{items[open].region}</b></div>
              <div style={{ fontSize:11, color:'var(--p-ink-soft)', marginTop:2 }}>{items[open].date}</div>
              <div style={{ display:'flex', gap:4, marginTop:6 }}>
                <span className={`chip ${items[open].rarity==='rzadki'?'magic':'leaf'}`}>{items[open].rarity}</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-ink-soft)', margin:'6px 0 8px' }}>ZDOBYTE</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              {items.map((it,i)=>(
                <button key={i} className="card card-tight shimmer" onClick={()=>setOpen(i)}
                  style={{ border:'none', cursor:'pointer', background: open===i ? 'rgba(184,134,232,.20)':'rgba(255,255,255,.78)', boxShadow: open===i?'inset 0 0 0 2.5px var(--p-magic-dk)':'var(--shadow-sm)' }}>
                  <div style={{ display:'flex', justifyContent:'center' }}>
                    <Artifact kind={it.kind} size={50}/>
                  </div>
                  <div style={{ fontSize:11, textAlign:'center', fontWeight:800, marginTop:4 }}>{it.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-ink-soft)', margin:'6px 0 8px' }}>JESZCZE NIEODKRYTE</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              {empty.map((it,i)=>(
                <div key={i} className="card card-tight" style={{ filter:'grayscale(.8) opacity(.45)', textAlign:'center' }}>
                  <Artifact kind={it.kind} size={50}/>
                  <div style={{ fontSize:11, fontWeight:800, marginTop:4 }}>?</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <TabBar current="backpack" go={go}/>
      </div>
    </div>
  );
}

// ═══ 7. PROFILE / EVOLUTION ═════════════════════════════════════
function ScreenProfile({ go, t, name='Max' }){
  const stages = [
    { lvl:1, name:'Iskra', desc:'pierwszy trop' },
    { lvl:2, name:'Tropiciel', desc:'wytrwały szukający', current:true },
    { lvl:3, name:'Zwiadowca', desc:'odważny wędrowiec' },
    { lvl:4, name:'Mędrczyni', desc:'mistrz krainy' },
  ];
  return (
    <div className="screen">
      <div className={`sky-bg ${t.dark?'night':''}`}/>
      <div className="screen-inner">
        <div className="topbar">
          <button className="btn btn-ghost btn-sm" onClick={()=>go('home')}>‹</button>
          <div className="meta" style={{ textAlign:'center' }}>
            <div className="lbl">EWOLUCJA BOHATERA</div>
            <div className="nm">{name}</div>
          </div>
          <div style={{ width:36 }}/>
        </div>

        <div style={{ flex:1, overflowY:'auto', minHeight:0, padding:'4px 18px 18px', display:'flex', flexDirection:'column', gap:14 }}>

          <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'22px 16px', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 30%, rgba(255,210,105,.40), transparent 60%)' }}/>
            <Avatar kind={t.avatar} size={128} evolved={1}/>
            <div className="t-display" style={{ fontSize:28, marginTop:4 }}>Tropiciel · Poziom 2</div>
            <div className="t-hand" style={{ fontSize:18, color:'var(--p-ink-soft)' }}>„{name}, Twoje pytania zaczynają mieć moc."</div>
            <div style={{ width:'100%', marginTop:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:800, color:'var(--p-ink-soft)', marginBottom:4 }}>
                <span>do następnej ewolucji</span><span>12 / 20 ✦</span>
              </div>
              <div className="prog magic"><i style={{ width:'60%' }}/></div>
            </div>
          </div>

          {/* Evolution path */}
          <div className="card">
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-ink-soft)' }}>ŚCIEŻKA EWOLUCJI</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop:14, gap:6, position:'relative' }}>
              <div style={{ position:'absolute', left:'10%', right:'10%', top:'42%', height:3, background:'rgba(122,77,194,.18)', borderRadius:2, zIndex:0 }}/>
              <div style={{ position:'absolute', left:'10%', width:'30%', top:'42%', height:3, background:'linear-gradient(90deg,#C8A0F0,#7A4DC2)', borderRadius:2, zIndex:1 }}/>
              {stages.map(s=>(
                <div key={s.lvl} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:2, opacity: s.lvl<=2?1:.42 }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', background: s.current?'linear-gradient(180deg,#FFD269,#E89A3D)':'rgba(255,255,255,.85)', boxShadow: s.current?'0 0 0 6px rgba(255,210,105,.30), 0 4px 14px rgba(232,154,61,.4)':'var(--shadow-sm)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontFamily:'Cormorant Garamond,serif', fontSize:18, color: s.current?'#4A2A0E':'var(--p-ink-soft)' }}>
                    {s.lvl}
                  </div>
                  <div className="t-display" style={{ fontSize:13, marginTop:6, textAlign:'center' }}>{s.name}</div>
                  <div style={{ fontSize:10, color:'var(--p-ink-soft)', textAlign:'center' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* stats */}
          <div className="card">
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'var(--p-ink-soft)', marginBottom:8 }}>KRONIKA TROPÓW</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <Stat val="14" label="zadanych pytań" c="var(--p-magic-dk)"/>
              <Stat val="3" label="zdobytych artefaktów" c="var(--p-dusk)"/>
              <Stat val="2" label="ukończone cykle" c="var(--p-leaf-dk)"/>
              <Stat val="6" label="dni z rzędu" c="var(--p-rose)"/>
            </div>
          </div>

        </div>
        <TabBar current="profile" go={go}/>
      </div>
    </div>
  );
}

const Stat = ({ val, label, c })=>(
  <div style={{ background:'rgba(255,255,255,.6)', borderRadius:14, padding:'10px 12px' }}>
    <div className="t-display" style={{ fontSize:26, color:c, lineHeight:1 }}>{val}</div>
    <div style={{ fontSize:11, color:'var(--p-ink-soft)', fontWeight:700 }}>{label}</div>
  </div>
);

Object.assign(window, { ScreenMap, ScreenMission, ScreenBackpack, ScreenProfile });
