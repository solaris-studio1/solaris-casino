// ═══════════════════════════════════════════════════════════════════
//  PÁGINAS RESTANTES DE SOLARIS CASINO
//  Cada export default es una página completa
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { T } from "../utils/theme";
import api from "../services/api";
import { Button, Card, Badge, EmptyState, SectionTitle, Spinner, Modal } from "../components/ui";

// ── Shared utils ─────────────────────────────────────────────────────────────
const fm  = n => `$${Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const pad = n => String(n).padStart(2,"0");
function useCountdown(t0){const[t,setT]=useState(t0);useEffect(()=>{const i=setInterval(()=>setT(p=>p>0?p-1:0),1000);return()=>clearInterval(i);},[]);return[pad(Math.floor(t/3600)),pad(Math.floor((t%3600)/60)),pad(t%60)];}
function usePulse(s){const[v,setV]=useState(s);useEffect(()=>{const i=setInterval(()=>setV(x=>x+Math.floor(Math.random()*40+5)),3000);return()=>clearInterval(i);},[]);return v.toLocaleString();}

// ── GAME DATA ────────────────────────────────────────────────────────────────
const GAMES = [
  {uuid:"pg-fortune-tiger", name:"Fortune Tiger",      provider:"PG Soft",   category:"slots",  rtp:96.81,hot:true, new:false,jackpot:null,      emoji:"🐯",players:12840,color:"#ffb400"},
  {uuid:"pg-dragon-hatch",  name:"Dragon Hatch",       provider:"PG Soft",   category:"slots",  rtp:96.71,hot:true, new:false,jackpot:null,      emoji:"🐉",players:9820, color:"#ff6a00"},
  {uuid:"pg-mahjong-ways",  name:"Mahjong Ways",       provider:"PG Soft",   category:"slots",  rtp:96.66,hot:true, new:false,jackpot:null,      emoji:"🀄",players:8920, color:"#9b5de5"},
  {uuid:"pg-ganesha-gold",  name:"Ganesha Gold",       provider:"PG Soft",   category:"slots",  rtp:98.76,hot:false,new:false,jackpot:null,      emoji:"🐘",players:7340, color:"#00d4aa"},
  {uuid:"pg-gem-saviour",   name:"Gem Saviour",        provider:"PG Soft",   category:"slots",  rtp:96.68,hot:false,new:true, jackpot:null,      emoji:"💎",players:2180, color:"#ffd700"},
  {uuid:"pp-gates-olympus", name:"Gates of Olympus",   provider:"Pragmatic", category:"slots",  rtp:96.50,hot:true, new:false,jackpot:null,      emoji:"⚡",players:21400,color:"#ffb400"},
  {uuid:"pp-sweet-bonanza", name:"Sweet Bonanza",      provider:"Pragmatic", category:"slots",  rtp:96.48,hot:true, new:false,jackpot:null,      emoji:"🍬",players:18900,color:"#e11d48"},
  {uuid:"pp-starlight",     name:"Starlight Princess", provider:"Pragmatic", category:"slots",  rtp:96.50,hot:true, new:true, jackpot:null,      emoji:"👸",players:16700,color:"#9b5de5"},
  {uuid:"ev-crazy-time",    name:"Crazy Time",         provider:"Evolution", category:"live",   rtp:95.50,hot:true, new:false,jackpot:null,      emoji:"🎪",players:8900, color:"#ffd700"},
  {uuid:"ev-bj-vip",        name:"Blackjack VIP",      provider:"Evolution", category:"live",   rtp:99.50,hot:true, new:false,jackpot:null,      emoji:"🃏",players:2840, color:"#00d4aa"},
  {uuid:"ev-ruleta-live",   name:"Ruleta en Vivo",     provider:"Evolution", category:"live",   rtp:97.30,hot:false,new:true, jackpot:null,      emoji:"🎡",players:4120, color:"#ffb400"},
  {uuid:"mg-mega-moolah",   name:"Mega Moolah",        provider:"Microgaming",category:"jackpot",rtp:88.12,hot:true,new:false,jackpot:8420000,  emoji:"🦁",players:14200,color:"#ffb400"},
  {uuid:"pb-divine-fortune",name:"Divine Fortune",     provider:"NetEnt",    category:"jackpot",rtp:96.59,hot:true,new:false, jackpot:142000,   emoji:"⚡",players:6800, color:"#9b5de5"},
  {uuid:"sp-aviator",       name:"Aviator",            provider:"Spribe",    category:"crash",  rtp:97.00,hot:true, new:false,jackpot:null,      emoji:"✈️",players:28400,color:"#e11d48"},
  {uuid:"sp-spaceman",      name:"Spaceman",           provider:"Pragmatic", category:"crash",  rtp:96.50,hot:true, new:true, jackpot:null,      emoji:"🚀",players:19200,color:"#00d4aa"},
];

const BONUSES_DATA = [
  {id:1,type:"welcome", badge:"BIENVENIDA",icon:"🎁",amount:"200%",detail:"hasta $500",  coins:"5,000 GC",wagering:35,minDep:20, expire:30,claimed:false,eligible:true, progress:0,  color:"#ffb400",glow:"#ffb40044",grad:"linear-gradient(135deg,#7a5500,#ffb400,#7a5500)",desc:"Duplica tu primer depósito.",tags:["Slots","Primer depósito"]},
  {id:2,type:"daily",   badge:"DIARIO",    icon:"☀️",amount:"100", detail:"GC gratis",   coins:"100 GC",  wagering:20,minDep:0,  expire:1, claimed:false,eligible:true, progress:0,  color:"#00d4aa",glow:"#00d4aa44",grad:"linear-gradient(135deg,#004d3e,#00d4aa,#004d3e)",desc:"Monedas gratis cada día.",tags:["Sin depósito"]},
  {id:3,type:"reload",  badge:"RECARGA",   icon:"⚡",amount:"50%", detail:"hasta $200",  coins:"2,500 GC",wagering:30,minDep:50, expire:14,claimed:true, eligible:true, progress:62, color:"#ff6a00",glow:"#ff6a0044",grad:"linear-gradient(135deg,#6a2800,#ff6a00,#6a2800)",desc:"50% extra en cada recarga.",tags:["Recarga"]},
  {id:4,type:"referral",badge:"REFERIDOS", icon:"👥",amount:"$25", detail:"por referido",coins:"1,000 GC",wagering:15,minDep:0,  expire:0, claimed:false,eligible:true, progress:0,  color:"#9b5de5",glow:"#9b5de544",grad:"linear-gradient(135deg,#3b006e,#9b5de5,#3b006e)",desc:"Ganan tú y tu amigo.",tags:["Sin límite"]},
  {id:5,type:"vip",     badge:"VIP",       icon:"👑",amount:"∞",   detail:"beneficios",  coins:"Ilimitado",wagering:10,minDep:500,expire:0, claimed:false,eligible:false,progress:0,  color:"#e11d48",glow:"#e11d4844",grad:"linear-gradient(135deg,#6e0020,#e11d48,#6e0020)",desc:"Acceso exclusivo VIP.",tags:["Invite only"]},
  {id:6,type:"freespin",badge:"FREE SPINS",icon:"🌀",amount:"50",  detail:"giros gratis",coins:"50 Spins",wagering:25,minDep:30, expire:7, claimed:false,eligible:true, progress:0,  color:"#ffd166",glow:"#ffd16644",grad:"linear-gradient(135deg,#5a4400,#ffd166,#5a4400)",desc:"50 giros en slots top.",tags:["Slots"]},
];

// ═══════════════════════════════════════════════════════════════════
//  GAMES PAGE
// ═══════════════════════════════════════════════════════════════════
export function GamesPage() {
  const { refreshWallet, balance } = useAuth();
  const toast = useToast();
  const [cat,    setCat]    = useState("all");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);
  const [launching, setLaunching] = useState(null);
  const jackpot = usePulse(8420000);
  const [h,m,s] = useCountdown(8*3600+34*60+22);

  const cats = [{k:"all",l:"Todos",i:"🎮"},{k:"slots",l:"Slots",i:"🎰"},{k:"live",l:"En Vivo",i:"📡"},{k:"jackpot",l:"Jackpot",i:"💰"},{k:"crash",l:"Crash",i:"🚀"}];
  const filtered = GAMES.filter(g => (cat==="all"||g.category===cat) && g.name.toLowerCase().includes(search.toLowerCase()));

  const launch = async (game, demo=false) => {
    setLaunching(game.uuid);
    const res = await api.games.init({ game_uuid: game.uuid, demo });
    setLaunching(null);
    if (!res.ok) { toast.error(res.error); return; }
    setActive({ game, url: res.data.game_url, demo });
    await refreshWallet();
  };

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0d0a00,#1a1200)", borderBottom: `1px solid ${T.border}`, padding: "16px 16px 14px" }}>
        <div style={{ background: "rgba(255,180,0,0.06)", border: "1px solid rgba(255,180,0,0.15)", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "9px", color: T.muted, letterSpacing: "0.12em" }}>🌟 JACKPOT ACUMULADO</div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: T.gold, fontFamily: "'Cormorant Garamond',serif", fontVariantNumeric: "tabular-nums" }}>${jackpot}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "9px", color: T.muted, letterSpacing: "0.1em" }}>OFERTA EXPIRA</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: T.red, fontVariantNumeric: "tabular-nums" }}>{h}:{m}:{s}</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: T.muted, fontSize: "14px" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar juego..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, color: T.white, fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}/>
        </div>
      </div>

      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "14px" }}>
          {cats.map(c => (
            <button key={c.k} onClick={() => setCat(c.k)}
              style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "30px", border: `1px solid ${cat===c.k?T.gold:"rgba(255,255,255,0.07)"}`, background: cat===c.k?"rgba(255,180,0,0.1)":"rgba(255,255,255,0.02)", color: cat===c.k?T.gold:T.muted, fontSize: "11px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
              <span>{c.i}</span>{c.l}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? <EmptyState icon="🎮" title="Sin resultados" desc="Intenta con otra búsqueda"/> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "10px" }}>
            {filtered.map(g => (
              <GameCard key={g.uuid} game={g} onPlay={() => launch(g,false)} onDemo={() => launch(g,true)} loading={launching===g.uuid}/>
            ))}
          </div>
        )}
      </div>

      {/* Launching overlay */}
      {launching && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
          <Spinner size={48}/><div style={{ color: T.white, fontSize: "15px" }}>Iniciando juego...</div>
        </div>
      )}

      {/* Game frame */}
      {active && <GameFrame {...active} onClose={() => { setActive(null); refreshWallet(); }} balance={balance}/>}
    </div>
  );
}

function GameCard({ game, onPlay, onDemo, loading }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: "12px", overflow: "hidden", background: "#101022", border: `1px solid ${hov?game.color+"44":"rgba(255,255,255,0.05)"}`, transform: hov?"translateY(-4px)":"none", boxShadow: hov?`0 16px 36px rgba(0,0,0,0.5),0 0 20px ${game.color}22`:"0 4px 14px rgba(0,0,0,0.3)", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", cursor: "pointer" }}>
      <div style={{ height: "110px", background: `linear-gradient(135deg,${game.color}22,${game.color}08)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px", position: "relative" }}>
        {game.emoji}
        <div style={{ position: "absolute", top: "6px", left: "6px", display: "flex", gap: "4px" }}>
          {game.hot && <span style={{ fontSize: "7px", fontWeight: 800, background: T.red, color: "#fff", padding: "2px 5px", borderRadius: "8px" }}>🔥</span>}
          {game.new && <span style={{ fontSize: "7px", fontWeight: 800, background: T.teal, color: "#000", padding: "2px 5px", borderRadius: "8px" }}>NEW</span>}
        </div>
        {game.jackpot && <div style={{ position: "absolute", bottom: "5px", left: 0, right: 0, textAlign: "center", fontSize: "9px", fontWeight: 800, color: T.gold }}>${(game.jackpot/1000000).toFixed(1)}M</div>}
        {hov && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <button onClick={onPlay} style={{ padding: "7px 18px", borderRadius: "20px", border: "none", background: `linear-gradient(135deg,${game.color},${game.color}bb)`, color: "#000", fontWeight: 900, fontSize: "10px", cursor: "pointer" }}>▶ JUGAR</button>
            <button onClick={onDemo} style={{ padding: "4px 12px", borderRadius: "20px", border: `1px solid ${game.color}66`, background: "transparent", color: game.color, fontSize: "9px", fontWeight: 700, cursor: "pointer" }}>Demo</button>
          </div>
        )}
      </div>
      <div style={{ padding: "9px 10px" }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: T.white, marginBottom: "3px", fontFamily: "'Cormorant Garamond',serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game.name}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
          <span style={{ color: T.teal, fontWeight: 700 }}>{game.rtp}%</span>
          <span style={{ color: T.muted }}>👤{game.players.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function GameFrame({ game, url, demo, onClose, balance }) {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 2000, display: "flex", flexDirection: "column" }}>
      <div style={{ height: "52px", background: "rgba(5,5,14,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>{game.emoji}</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: T.white }}>{game.name}</div>
            <div style={{ fontSize: "10px", color: T.muted }}>{game.provider}{demo?" · Demo":""}</div>
          </div>
          {demo && <span style={{ fontSize: "9px", fontWeight: 800, background: "rgba(155,93,229,0.2)", color: T.purple, border: "1px solid rgba(155,93,229,0.3)", padding: "2px 8px", borderRadius: "8px" }}>DEMO</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!demo && <div style={{ background: "rgba(255,180,0,0.08)", border: "1px solid rgba(255,180,0,0.2)", borderRadius: "8px", padding: "4px 12px" }}>
            <div style={{ fontSize: "8px", color: T.muted }}>SALDO</div>
            <div style={{ fontSize: "14px", fontWeight: 900, color: T.gold }}>${balance.toFixed(2)}</div>
          </div>}
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: T.muted, fontSize: "16px", cursor: "pointer" }}>✕</button>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        {loading && <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.bg, gap: "16px" }}>
          <span style={{ fontSize: "56px" }}>{game.emoji}</span><Spinner/><div style={{ color: T.muted, fontSize: "13px" }}>Cargando {game.name}...</div>
        </div>}
        {url ? <iframe src={url} style={{ width: "100%", height: "100%", border: "none" }} allow="fullscreen" onLoad={() => setLoading(false)} title={game.name}/>
          : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.bg, gap: "16px" }} ref={el => el && setLoading(false)}>
              <div style={{ fontSize: "80px" }}>{game.emoji}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", color: T.white }}>{game.name}</h2>
              <p style={{ color: T.muted, fontSize: "13px", textAlign: "center", maxWidth: "320px", lineHeight: 1.6 }}>Conecta Slotegrator APIgrator para activar juegos reales.</p>
            </div>
        }
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  BONUSES PAGE
// ═══════════════════════════════════════════════════════════════════
export function BonusesPage() {
  const toast = useToast();
  const [bonuses, setBonuses] = useState(BONUSES_DATA);
  const [filter,  setFilter]  = useState("all");
  const [h,m,s] = useCountdown(18*3600+34*60+22);

  const filtered = bonuses.filter(b => {
    if (filter==="all") return true;
    if (filter==="available") return b.eligible && !b.claimed;
    if (filter==="claimed") return b.claimed;
    return b.type === filter;
  });

  const claim = async (bonus) => {
    if (!bonus.eligible || bonus.claimed) return;
    const res = await api.bonuses.claim(bonus.type);
    if (res.ok) {
      setBonuses(p => p.map(b => b.id===bonus.id ? {...b, claimed:true} : b));
      toast.success("🎉 ¡Bono reclamado exitosamente!");
    } else {
      // Demo mode
      setBonuses(p => p.map(b => b.id===bonus.id ? {...b, claimed:true} : b));
      toast.success("🎉 ¡Bono reclamado!");
    }
  };

  const filters = [{k:"all",l:"Todos"},{k:"available",l:"Disponibles"},{k:"claimed",l:"Reclamados"},{k:"daily",l:"Diarios"},{k:"vip",l:"VIP"}];

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,180,0,0.07)", border: "1px solid rgba(255,180,0,0.2)", borderRadius: "30px", padding: "4px 14px", marginBottom: "12px" }}>
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: T.gold, animation: "pulse 1.5s infinite" }}/>
          <span style={{ fontSize: "10px", color: T.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{bonuses.filter(b=>b.eligible&&!b.claimed).length} BONOS ACTIVOS</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, background: "linear-gradient(135deg,#fff 20%,#ffb400 55%,#fff 85%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>Tus Bonos</h1>
        <div style={{ fontSize: "13px", color: T.muted }}>Bono diario expira: <span style={{ color: T.red, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{h}:{m}:{s}</span></div>
      </div>

      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "20px" }}>
        {filters.map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)}
            style={{ flex: "0 0 auto", padding: "7px 16px", borderRadius: "30px", border: `1px solid ${filter===f.k?T.gold:"rgba(255,255,255,0.07)"}`, background: filter===f.k?"rgba(255,180,0,0.1)":"rgba(255,255,255,0.02)", color: filter===f.k?T.gold:T.muted, fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            {f.l}
          </button>
        ))}
      </div>

      {filtered.length===0 ? <EmptyState icon="🎁" title="Sin bonos aquí" desc="Prueba otro filtro"/> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filtered.map(b => <BonusCard key={b.id} bonus={b} onClaim={() => claim(b)}/>)}
        </div>
      )}
    </div>
  );
}

function BonusCard({ bonus, onClaim }) {
  const [hov, setHov] = useState(false);
  const [loading, setLoading] = useState(false);
  const handle = async () => { setLoading(true); await onClaim(); setLoading(false); };
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderRadius: "18px", padding: "2px", background: hov?bonus.grad:"linear-gradient(135deg,#1a1a2e,#0f0f1e)", boxShadow: hov?`0 0 30px ${bonus.glow},0 16px 50px rgba(0,0,0,0.5)`:"0 6px 24px rgba(0,0,0,0.4)", transform: hov?"translateY(-3px)":"none", transition: "all 0.3s", opacity: bonus.eligible?1:0.6 }}>
      <div style={{ borderRadius: "16px", background: "linear-gradient(160deg,#0e0e1e,#18182e)", overflow: "hidden" }}>
        <div style={{ background: bonus.grad, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.15em", color: "#000", background: "rgba(0,0,0,0.15)", padding: "2px 8px", borderRadius: "20px" }}>{bonus.badge}</span>
          <span style={{ fontSize: "24px" }}>{bonus.icon}</span>
        </div>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "36px", fontWeight: 900, fontFamily: "'Cormorant Garamond',serif", background: bonus.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{bonus.amount}</span>
                <span style={{ fontSize: "12px", color: T.muted }}>{bonus.detail}</span>
              </div>
              <div style={{ fontSize: "11px", color: bonus.color, fontWeight: 700 }}>+ {bonus.coins}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", textAlign: "center" }}>
              {[["x"+bonus.wagering,"Wager"],[bonus.minDep===0?"Free":"$"+bonus.minDep,"Mín"],[(bonus.expire===0?"∞":bonus.expire+"d"),"Expira"]].map(([v,l])=>(
                <div key={l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "5px 6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: T.white }}>{v}</div>
                  <div style={{ fontSize: "8px", color: T.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {bonus.claimed && bonus.progress>0 && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "9px", color: T.muted }}>PROGRESO WAGERING</span>
                <span style={{ fontSize: "9px", color: bonus.color, fontWeight: 700 }}>{bonus.progress}%</span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                <div style={{ height: "100%", width: `${bonus.progress}%`, background: bonus.grad, borderRadius: "10px" }}/>
              </div>
            </div>
          )}
          <button onClick={handle} disabled={bonus.claimed||!bonus.eligible||loading}
            style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "none", background: bonus.claimed?"rgba(255,255,255,0.05)":bonus.eligible?bonus.grad:"rgba(255,255,255,0.03)", color: bonus.claimed?"#444":bonus.eligible?"#000":"#444", fontWeight: 900, fontSize: "13px", cursor: bonus.claimed||!bonus.eligible?"not-allowed":"pointer", letterSpacing: "0.06em", boxShadow: bonus.eligible&&!bonus.claimed?`0 4px 16px ${bonus.glow}`:"none", fontFamily: "inherit" }}>
            {loading?"⏳ Reclamando...":bonus.claimed?"✓ Reclamado":!bonus.eligible?"🔒 No disponible":"Reclamar Bono"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  WALLET PAGE
// ═══════════════════════════════════════════════════════════════════
export function WalletPage() {
  const { wallet, refreshWallet } = useAuth();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdraw, setWithdraw] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await api.wallet.transactions("?limit=30");
      if (res.ok) setTxs(res.data.transactions || []);
      else setTxs(DEMO_TXS);
      setLoading(false);
    };
    load();
    refreshWallet();
  }, []);

  const DEMO_TXS = [
    {id:"SLR001",type:"deposit",method:"cashapp",amount:99.99,status:"completed",created_at:"2026-05-01 14:32"},
    {id:"SLR002",type:"deposit",method:"card",amount:49.99,status:"completed",created_at:"2026-04-28 10:15"},
    {id:"SLR003",type:"withdrawal",method:"cashapp",amount:80.00,status:"completed",created_at:"2026-04-20 18:30"},
  ];

  const methodIcon = m => m==="cashapp"?"💚":m==="card"||m==="stripe"?"💳":m==="crypto"?"₿":m==="applepay"?"🍎":"💰";

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <SectionTitle>Mi Wallet</SectionTitle>

      {/* Balance */}
      <div style={{ background: "linear-gradient(135deg,#1a1000,#2a1800)", border: "1px solid rgba(255,180,0,0.2)", borderRadius: "18px", padding: "22px", marginBottom: "14px", textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: T.muted, letterSpacing: "0.15em", marginBottom: "6px" }}>SALDO DISPONIBLE</div>
        <div style={{ fontSize: "44px", fontWeight: 900, color: T.gold, fontFamily: "'Cormorant Garamond',serif" }}>{fm(wallet?.balance_usd)}</div>
        {wallet?.balance_bonus>0 && <div style={{ fontSize: "13px", color: T.teal, marginTop: "4px" }}>+ {fm(wallet.balance_bonus)} en bonos</div>}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px" }}>
          <button onClick={() => document.getElementById("deposit-trigger")?.click()} style={{ flex: 1, maxWidth: "160px", padding: "12px", borderRadius: "12px", border: "none", background: `linear-gradient(135deg,${T.orange},${T.gold})`, color: "#000", fontWeight: 900, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>📥 Depositar</button>
          <button onClick={() => setWithdraw(true)} style={{ flex: 1, maxWidth: "160px", padding: "12px", borderRadius: "12px", border: "1px solid rgba(0,212,170,0.25)", background: "rgba(0,212,170,0.06)", color: T.teal, fontWeight: 900, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>📤 Retirar</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {[
          {l:"Total depositado",v:fm(wallet?.total_deposited),i:"📥",c:T.teal},
          {l:"Total retirado",v:fm(wallet?.total_withdrawn),i:"📤",c:T.purple},
          {l:"Bonos activos",v:fm(wallet?.balance_bonus),i:"🎁",c:T.gold},
          {l:"Total apostado",v:fm(wallet?.total_wagered),i:"🎰",c:"#f7931a"},
        ].map(s=>(
          <div key={s.l} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "14px" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>{s.i}</div>
            <div style={{ fontSize: "18px", fontWeight: 900, color: s.c, fontFamily: "'Cormorant Garamond',serif" }}>{s.v}</div>
            <div style={{ fontSize: "10px", color: T.muted, marginTop: "2px" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Historial */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: T.white }}>Historial</span>
          {loading && <Spinner size={16}/>}
        </div>
        {txs.length===0 && !loading ? <EmptyState icon="📋" title="Sin transacciones" desc="Haz tu primer depósito para empezar"/> : (
          txs.map((tx,i)=>(
            <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i<txs.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,180,0,0.08)", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>{methodIcon(tx.method)}</div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: T.white, textTransform: "capitalize" }}>{tx.method}</div>
                  <div style={{ fontSize: "10px", color: T.muted, fontFamily: "monospace" }}>{tx.id?.slice(0,12)}...</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: tx.type==="withdrawal"?T.red:T.gold }}>{tx.type==="withdrawal"?"-":"+"}${Number(tx.amount).toFixed(2)}</div>
                <div style={{ fontSize: "10px", color: tx.status==="completed"?T.teal:"#f7931a", fontWeight: 600 }}>{tx.status==="completed"?"✓ Completado":"⏳ Procesando"}</div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  VIP PAGE
// ═══════════════════════════════════════════════════════════════════
export function VIPPage() {
  const { wallet } = useAuth();
  const dep = wallet?.total_deposited || 0;
  const level = dep>=500?"gold":dep>=200?"silver":"bronze";
  const next  = level==="bronze"?200:level==="silver"?500:1000;
  const pct   = Math.min((dep/next)*100,100);

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "60px", marginBottom: "12px" }}>{level==="gold"?"👑":level==="silver"?"🥈":"🥉"}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", fontWeight: 700, color: T.white, marginBottom: "4px" }}>Club VIP Solaris</h1>
        <p style={{ color: T.muted, fontSize: "14px" }}>Nivel: <span style={{ color: level==="gold"?T.gold:level==="silver"?"#c0c0c0":"#cd7f32", fontWeight: 800, textTransform: "capitalize" }}>{level}</span></p>
      </div>

      <Card style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "12px", color: T.muted }}>Progreso al siguiente nivel</span>
          <span style={{ fontSize: "12px", color: T.gold, fontWeight: 700 }}>${dep.toFixed(0)} / ${next}</span>
        </div>
        <div style={{ height: "7px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(135deg,${T.orange},${T.gold})`, borderRadius: "10px", boxShadow: `0 0 10px ${T.gold}66` }}/>
        </div>
        <p style={{ fontSize: "11px", color: T.muted, marginTop: "8px" }}>Deposita ${Math.max(0,next-dep).toFixed(0)} más para subir de nivel</p>
      </Card>

      {[
        {l:"bronze",e:"🥉",c:"#cd7f32",min:"$0",perks:["5% cashback semanal","Soporte prioritario","Bonos exclusivos"]},
        {l:"silver",e:"🥈",c:"#c0c0c0",min:"$200",perks:["10% cashback semanal","Manager personal","Torneos mensuales","Retiros rápidos"]},
        {l:"gold",  e:"👑",c:T.gold,  min:"$500",perks:["15% cashback semanal","Manager VIP dedicado","Torneos privados","Retiros instantáneos"]},
      ].map(lv=>(
        <Card key={lv.l} style={{ marginBottom: "10px", border: `1px solid ${level===lv.l?lv.c+"44":T.border}`, background: level===lv.l?"rgba(255,180,0,0.04)":T.card }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <span style={{ fontSize: "28px" }}>{lv.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: lv.c, textTransform: "capitalize" }}>{lv.l}</div>
              <div style={{ fontSize: "11px", color: T.muted }}>desde {lv.min} depositado</div>
            </div>
            {level===lv.l && <Badge label="Tu nivel" color={lv.c}/>}
          </div>
          {lv.perks.map(p => <div key={p} style={{ fontSize: "12px", color: level===lv.l?T.white:T.muted, marginBottom: "4px" }}>✦ {p}</div>)}
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════
export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <SectionTitle>Mi Perfil</SectionTitle>

      {/* Avatar */}
      <Card style={{ textAlign: "center", marginBottom: "14px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg,#9b5de5,#e11d48)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, margin: "0 auto 12px" }}>
          {user?.full_name?.[0]?.toUpperCase() || "U"}
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: T.white, marginBottom: "4px" }}>{user?.full_name || user?.username}</div>
        <div style={{ fontSize: "12px", color: T.muted }}>{user?.email}</div>
        <div style={{ marginTop: "10px" }}><Badge label={user?.vip_level?.toUpperCase() || "BRONZE"} color={user?.vip_level==="gold"?T.gold:user?.vip_level==="silver"?"#c0c0c0":"#cd7f32"}/></div>
      </Card>

      {/* Info */}
      <Card style={{ marginBottom: "14px" }}>
        {[["Username",user?.username||"—"],["Email",user?.email||"—"],["KYC",user?.kyc_status||"pending"],["VIP",user?.vip_level||"bronze"]].map(([k,v])=>(
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "13px" }}>
            <span style={{ color: T.muted }}>{k}</span>
            <span style={{ color: T.white, fontWeight: 600, textTransform: "capitalize" }}>{v}</span>
          </div>
        ))}
      </Card>

      {/* Acciones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Button fullWidth variant="secondary" onClick={() => navigate("/kyc")}>
          🛡️ Verificar identidad (KYC)
        </Button>
        <Button fullWidth variant="danger" onClick={() => { logout(); navigate("/login"); }}>
          ⏻ Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  KYC PAGE (referencia al componente completo)
// ═══════════════════════════════════════════════════════════════════
export function KYCPage() {
  const { user } = useAuth();

  if (user?.kyc_status === "verified") {
    return (
      <div style={{ padding: "40px 20px 80px", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#00c853,#00d4aa)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "36px", boxShadow: "0 0 40px rgba(0,200,83,0.5)" }}>✓</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", color: T.white, marginBottom: "10px" }}>¡Identidad verificada!</h2>
        <p style={{ color: T.muted, fontSize: "14px", lineHeight: 1.7 }}>Tu cuenta tiene acceso completo a todos los beneficios.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 80px" }}>
      <SectionTitle sub="Verifica tu identidad para desbloquear retiros ilimitados">
        Verificación KYC
      </SectionTitle>
      <Card>
        <p style={{ color: T.muted, fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
          Para cumplir con regulaciones AML/KYC necesitamos verificar tu identidad. Este proceso tarda 24-48 horas.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          {[{i:"🔓",t:"Sin límites",d:"Retiros ilimitados"},{i:"⚡",t:"Más rápido",d:"Retiros en 24h"},{i:"👑",t:"VIP",d:"Beneficios premium"}].map(b=>(
            <div key={b.t} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`, borderRadius: "12px", padding: "12px", textAlign: "center" }}>
              <div style={{ fontSize: "20px", marginBottom: "5px" }}>{b.i}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: T.white }}>{b.t}</div>
              <div style={{ fontSize: "10px", color: T.muted, marginTop: "2px" }}>{b.d}</div>
            </div>
          ))}
        </div>
        <Button fullWidth>Comenzar verificación →</Button>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  NOT FOUND PAGE
// ═══════════════════════════════════════════════════════════════════
export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ fontSize: "80px", marginBottom: "16px" }}>☀</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "48px", color: T.gold, marginBottom: "8px" }}>404</h1>
      <p style={{ color: T.muted, fontSize: "16px", marginBottom: "28px" }}>Esta página no existe</p>
      <Button onClick={() => navigate("/games")}>Volver al casino</Button>
    </div>
  );
}
export default GamesPage;
