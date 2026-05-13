// app.jsx — root App with router for EwolucJA prototype

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "basniowa",
  "fontDisplay": "Baloo 2",
  "fontBody": "Nunito",
  "animLevel": "medium",
  "ageGroup": "mid",
  "dark": false,
  "avatar": "fox",
  "cycleDays": 5,
  "cycleDay": 2,
  "coins": 142,
  "weekDone": 4,
  "weekCoins": 65,
  "streak": 6
}/*EDITMODE-END*/;

const PALETTES = {
  basniowa: {
    label:'Baśniowa', colors:['#5FA76F','#FFD269','#B886E8'],
    sky:['#C9E9FF','#FFE0B5','#FFC9A0'],
  },
  mroczna: {
    label:'Mroczna', colors:['#7A4DC2','#1B1338','#FFD269'],
    sky:['#1B1338','#382066','#5B3A8A'],
  },
  runiczna: {
    label:'Runiczna', colors:['#5D7B5C','#E9D497','#B85B47'],
    sky:['#A8B89C','#D5C695','#E5BB7E'],
  },
};

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState('start');
  const [hero, setHero] = React.useState({ name:'Max' });

  // Preload + decode scroll assets as soon as the app mounts so step 2 has them ready
  React.useEffect(()=>{
    ['assets/zwoj-closed.png','assets/zwoj-open.png','assets/krysztal.png','assets/book.png','assets/wizard.png','assets/mapa.png'].forEach(src=>{
      const img = new Image();
      img.src = src;
      if (img.decode) img.decode().catch(()=>{});
    });
  }, []);

  const go = (where, payload)=>{
    if (payload?.name) setHero(h=>({ ...h, name: payload.name }));
    setRoute(where);
  };

  // build tweak-driven sky vars
  const palette = PALETTES[t.palette] || PALETTES.basniowa;
  const sky = t.dark ? ['#1B1338','#382066','#5B3A8A'] : palette.sky;

  React.useEffect(()=>{
    document.documentElement.style.setProperty('--font-display', t.fontDisplay);
    document.documentElement.style.setProperty('--font-body', t.fontBody || 'Nunito');
    document.documentElement.style.setProperty('--sky-top', sky[0]);
    document.documentElement.style.setProperty('--sky-mid', sky[1]);
    document.documentElement.style.setProperty('--sky-bot', sky[2]);
    document.body.classList.toggle('night-mode', !!t.dark);
  }, [t.fontDisplay, t.fontBody, t.palette, t.dark]);

  const screens = [
    { id:'start',      title:'Start',         lbl:'Wybór roli' },
    { id:'onboarding', title:'Onboarding',    lbl:'Imię + awatar' },
    { id:'home',       title:'Dom',           lbl:'Tygodniowy cykl' },
    { id:'map',        title:'Mapa',          lbl:'Kraina Kroniki' },
    { id:'mission',    title:'Misja',         lbl:'Otwieranie zwoju' },
    { id:'reward',     title:'Nagroda',       lbl:'Echo + ewolucja' },
    { id:'backpack',   title:'Plecak',        lbl:'Artefakty' },
    { id:'profile',    title:'Profil',        lbl:'Ewolucja postaci' },
    { id:'mentor',     title:'Mentor',        lbl:'Panel rodzica' },
    { id:'invite',     title:'Komnata',       lbl:'Refleksja' },
    { id:'type',       title:'Typografia',    lbl:'Wybór fontów' },
  ];

  const currentScreen = (()=>{
    const props = { go, t, setTweak, name: hero.name };
    switch(route){
      case 'start':      return <ScreenStart {...props}/>;
      case 'onboarding': return <ScreenOnboarding {...props}/>;
      case 'home':       return <ScreenHome {...props}/>;
      case 'map':        return <ScreenMap {...props}/>;
      case 'mission':    return <ScreenMission {...props}/>;
      case 'reward':     return <ScreenReward {...props}/>;
      case 'backpack':   return <ScreenBackpack {...props}/>;
      case 'profile':    return <ScreenProfile {...props}/>;
      case 'mentor':     return <ScreenMentor {...props}/>;
      case 'invite':     return <ScreenInvite {...props}/>;
      case 'type':       return <ScreenType {...props}/>;
      default:           return <ScreenStart {...props}/>;
    }
  })();

  return (
    <>
      <div className={`page-bg ${t.dark?'night':''}`}/>

      {/* drifting clouds in the page background */}
      {!t.dark && (
        <div className="clouds">
          <div style={{ position:'absolute', top:'12%', left:0, animation:'drift 60s linear infinite' }}><Cloud size={140} opacity={.55}/></div>
          <div style={{ position:'absolute', top:'30%', left:0, animation:'drift 90s linear infinite', animationDelay:'-30s' }}><Cloud size={100} opacity={.45}/></div>
          <div style={{ position:'absolute', top:'58%', left:0, animation:'drift 80s linear infinite', animationDelay:'-15s' }}><Cloud size={120} opacity={.40}/></div>
        </div>
      )}

      {/* Title + screen rail (left side) */}
      <Rail screens={screens} route={route} go={setRoute}/>

      {/* Stage with phone */}
      <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
        <div data-screen-label={`${screens.findIndex(s=>s.id===route)+1} ${route}`}
             style={{ filter:`drop-shadow(0 30px 60px rgba(40,20,80,.45))` }}>
          <IOSDevice width={390} height={844} dark={t.dark}>
            <div key={route} style={{ width:'100%', height:'100%' }}>
              {currentScreen}
            </div>
          </IOSDevice>
        </div>
      </main>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Wygląd"/>
        <TweakColor label="Paleta" value={t.palette}
          options={[
            ['#5FA76F','#FFD269','#B886E8','#FFE0B5'],
            ['#7A4DC2','#1B1338','#FFD269','#382066'],
            ['#5D7B5C','#E9D497','#B85B47','#D5C695'],
          ]}
          onChange={(v)=>{
            // TweakColor with palette options stores arrays — map back to id
            const idx = [PALETTES.basniowa, PALETTES.mroczna, PALETTES.runiczna]
              .findIndex(p => p.colors[0] === (Array.isArray(v)?v[0]:v));
            const id = ['basniowa','mroczna','runiczna'][idx>=0?idx:0];
            setTweak('palette', id);
          }}/>
        <TweakToggle label="Tryb nocny" value={t.dark} onChange={(v)=>setTweak('dark', v)}/>
        <TweakSelect label="Font tytułowy" value={t.fontDisplay}
          options={['Fredoka','Baloo 2','Bricolage Grotesque','Sniglet','Mali']}
          onChange={(v)=>setTweak('fontDisplay', v)}/>
        <TweakSelect label="Font tekstu" value={t.fontBody||'Nunito'}
          options={['Nunito','Quicksand','Lexend','Comfortaa']}
          onChange={(v)=>setTweak('fontBody', v)}/>

        <TweakSection label="Cykl"/>
        <TweakRadio label="Tempo" value={t.cycleDays}
          options={[{label:'3 dni',value:3},{label:'5 dni',value:5},{label:'7 dni',value:7}]}
          onChange={(v)=>setTweak('cycleDays', v)}/>
        <TweakSlider label="Dzień" value={t.cycleDay} min={0} max={t.cycleDays} step={1}
          onChange={(v)=>setTweak('cycleDay', v)}/>

        <TweakSection label="Skarbiec"/>
        <TweakSlider label="Złote Monety" value={t.coins} min={0} max={9999} step={1}
          onChange={(v)=>setTweak('coins', v)}/>
        <TweakSlider label="Zadań w tygodniu" value={t.weekDone} min={0} max={7} step={1}
          onChange={(v)=>setTweak('weekDone', v)}/>
        <TweakSlider label="Monet w tygodniu" value={t.weekCoins} min={0} max={500} step={5}
          onChange={(v)=>setTweak('weekCoins', v)}/>
        <TweakSlider label="Dni z rzędu (streak)" value={t.streak} min={0} max={60} step={1}
          onChange={(v)=>setTweak('streak', v)}/>

        <TweakSection label="Bohater"/>
        <TweakSelect label="Awatar" value={t.avatar}
          options={['fox','owl','rabbit','dragon','cat']}
          onChange={(v)=>setTweak('avatar', v)}/>
        <TweakRadio label="Wiek" value={t.ageGroup}
          options={[{ label:'1-3', value:'young' },{ label:'4-6', value:'mid' },{ label:'7-8', value:'older' }]}
          onChange={(v)=>setTweak('ageGroup', v)}/>

        <TweakSection label="Animacje"/>
        <TweakRadio label="Stopień" value={t.animLevel}
          options={[{label:'cicho',value:'low'},{label:'średnio',value:'medium'},{label:'żywio',value:'high'}]}
          onChange={(v)=>setTweak('animLevel', v)}/>

        <TweakSection label="Nawigacja"/>
        {screens.map(s => (
          <TweakButton key={s.id} label={s.title} onClick={()=>setRoute(s.id)}/>
        ))}
      </TweaksPanel>
    </>
  );
}

function Rail({ screens, route, go }){
  return (
    <aside className="rail">
      <h4>Ekrany</h4>
      {screens.map((s,i)=>(
        <button key={s.id} className={`ritem ${route===s.id?'active':''}`} onClick={()=>go(s.id)}>
          <span className="num">{String(i+1).padStart(2,'0')}</span>
          <span style={{ flex:1, minWidth:0 }}>
            <span style={{ display:'block', fontSize:13 }}>{s.title}</span>
            <span style={{ display:'block', fontSize:10, opacity:.65 }}>{s.lbl}</span>
          </span>
        </button>
      ))}
    </aside>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
