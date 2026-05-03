import { useState, useEffect } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #080605; color: #ede8e0; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #2e2318; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0}to{opacity:1} }
  @keyframes float    { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
  @keyframes pulse    { 0%,100%{opacity:1}50%{opacity:.3} }
  @keyframes rippleOut{ from{transform:scale(1);opacity:.5}to{transform:scale(2.5);opacity:0} }
  .hover-lift { transition: transform .25s, box-shadow .25s; }
  .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 40px #00000060; }
  .btn-warm { transition: background .2s, transform .1s; }
  .btn-warm:hover { background: #c8834a !important; }
  .btn-warm:active { transform: scale(.97); }
  .btn-ghost { transition: background .2s, color .2s, border-color .2s; }
  .btn-ghost:hover { background: #b8733018 !important; border-color: #b87330 !important; color: #b87330 !important; }
  .card-hover { transition: border-color .2s, transform .2s; }
  .card-hover:hover { border-color: #b8733060 !important; transform: translateY(-2px); }
  input:focus, textarea:focus { outline: none !important; border-color: #b87330 !important; }
`;

const C = {
  bg:"#080605", bg2:"#100d09", bg3:"#181210",
  border:"#201810", border2:"#2e2318",
  warm:"#b87330", text:"#ede8e0", muted:"#8a7a68", faint:"#3a2e22",
};

const PROVIDERS = [
  { id:1, name:"Amara",   age:34, flag:"🇳🇬", city:"Lagos",     mood:"Calm",      available:true,  rating:4.9, sessions:142, price:9,  tags:["Night sessions","Grief","Anxiety"],    bio:"I just sit with you. No agenda. No advice. Just here.",         color:"#5c3a28", times:["09:00","14:00","21:00","23:00"] },
  { id:2, name:"Luca",    age:28, flag:"🇮🇹", city:"Milan",     mood:"Warm",      available:true,  rating:4.8, sessions:89,  price:9,  tags:["Work stress","Mornings","Expats"],      bio:"I know what it's like to be alone in a foreign city.",          color:"#28403c", times:["07:00","10:00","18:00","20:00"] },
  { id:3, name:"Soo-Jin", age:31, flag:"🇰🇷", city:"Seoul",     mood:"Gentle",    available:false, rating:5.0, sessions:203, price:12, tags:["Late night","Silence OK","Students"],   bio:"Sometimes you don't need words. Quiet is fine with me.",        color:"#38284a", times:[] },
  { id:4, name:"Marcus",  age:45, flag:"🇬🇭", city:"Accra",     mood:"Grounding", available:true,  rating:4.9, sessions:317, price:9,  tags:["Elders","Grief","Long sessions"],       bio:"I've been through loss. I understand without explaining.",      color:"#3c2e18", times:["08:00","11:00","16:00","22:00"] },
  { id:5, name:"Ines",    age:26, flag:"🇫🇷", city:"Lyon",      mood:"Bright",    available:true,  rating:4.7, sessions:67,  price:9,  tags:["Daytime","Remote workers","Anxiety"],   bio:"Working from home gets lonely. I get it. I'm here.",            color:"#1e3040", times:["09:00","13:00","15:00","17:00"] },
  { id:6, name:"Dayo",    age:38, flag:"🇿🇦", city:"Cape Town", mood:"Steady",    available:false, rating:4.8, sessions:156, price:12, tags:["Night","Depression","No pressure"],     bio:"No pressure to speak. No pressure to perform. Just be.",       color:"#1e3028", times:[] },
];

const MOODS = ["All","Calm","Warm","Gentle","Grounding","Bright","Steady"];
const TESTIMONIALS = [
  { text:"I was at 3am unable to sleep, spiraling. Amara just stayed on the call with me. Didn't say much. That was enough.", name:"Remote worker, Berlin" },
  { text:"As a caregiver I never have anyone to lean on. Having someone simply present with me once a week changed everything.", name:"Nurse, Toronto" },
  { text:"I was skeptical. But there's something about a real human face that no app can replace.", name:"Student, Paris" },
];

function Dot({ on }) {
  return <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:on?"#6abf8a":C.faint, marginRight:6 }} />;
}
function Tag({ children }) {
  return <span style={{ background:C.bg3, border:`1px solid ${C.border2}`, color:C.muted, borderRadius:4, padding:"3px 9px", fontSize:11 }}>{children}</span>;
}
function Spinner() {
  return <div style={{ display:"flex", gap:5 }}>{[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.warm, animation:`pulse 1.2s ease ${i*.2}s infinite` }} />)}</div>;
}
function BookingModal({ provider, onClose }) {
  const [step, setStep] = useState(1);
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const price = duration === 30 ? provider.price : Math.round(provider.price * 1.8);
  const canNext1 = time !== "";
  const canNext2 = name.trim() && email.trim();
  const pay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    setPaying(false);
    setStep(4);
  };
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20, animation:"fadeIn .2s ease" }}>
      <div style={{ background:C.bg2, border:`1px solid ${C.border2}`, borderRadius:20, width:"100%", maxWidth:460, animation:"fadeUp .3s ease", overflow:"hidden", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ padding:"22px 26px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.bg2 }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:20 }}>{step<4?`Book with ${provider.name}`:"You're all set"}</div>
            {step<4&&<div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{provider.flag} {provider.city}</div>}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:24, cursor:"pointer" }}>×</button>
        </div>
        {step<4&&(
          <div style={{ display:"flex", padding:"14px 26px", gap:8, borderBottom:`1px solid ${C.border}` }}>
            {["Time","Details","Payment"].map((s,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6, opacity:step===i+1?1:.4 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:step>i+1?C.warm:step===i+1?C.warm:"none", border:`1px solid ${C.warm}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:step>i+1||step===i+1?"#000":C.warm, fontWeight:700 }}>{step>i+1?"✓":i+1}</div>
                <span style={{ fontSize:12, color:C.muted }}>{s}</span>
                {i<2&&<span style={{ color:C.faint, fontSize:10 }}>›</span>}
              </div>
            ))}
          </div>
        )}
        <div style={{ padding:"24px 26px" }}>
          {step===1&&(
            <div style={{ animation:"fadeUp .3s ease" }}>
              <div style={{ fontSize:12, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Duration</div>
              <div style={{ display:"flex", gap:10, marginBottom:24 }}>
                {[30,60].map(d=>(
                  <button key={d} onClick={()=>setDuration(d)} style={{ flex:1, padding:"13px 0", borderRadius:10, border:`1px solid ${duration===d?C.warm:C.border2}`, background:duration===d?C.warm+"18":"none", color:duration===d?C.warm:C.muted, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:600 }}>
                    {d} min · €{d===30?provider.price:Math.round(provider.price*1.8)}
                  </button>
                ))}
              </div>
              <div style={{ fontSize:12, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Available slots</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
                {provider.times.map(t=>(
                  <button key={t} onClick={()=>setTime(t)} style={{ padding:"11px 0", borderRadius:9, border:`1px solid ${time===t?C.warm:C.border2}`, background:time===t?C.warm+"18":"none", color:time===t?C.warm:C.muted, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:14 }}>{t}</button>
                ))}
              </div>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="What's on your mind? (optional)" rows={3} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"11px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:13, resize:"none", lineHeight:1.65, marginBottom:22 }} />
              <button className="btn-warm" disabled={!canNext1} onClick={()=>setStep(2)} style={{ width:"100%", background:canNext1?C.warm:"#2a1e14", color:canNext1?"#000":C.faint, border:"none", borderRadius:10, padding:"14px 0", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:canNext1?"pointer":"default" }}>Continue →</button>
            </div>
          )}
          {step===2&&(
            <div style={{ animation:"fadeUp .3s ease" }}>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:1.2, marginBottom:8, textTransform:"uppercase" }}>Your name</div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="First name" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} />
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:1.2, marginBottom:8, textTransform:"uppercase" }}>Email</div>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" type="email" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} />
              </div>
              <div style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", marginBottom:22 }}>
                {[["Provider",provider.name],["Time",time],["Duration",`${duration} min`]].map(([k,v],i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}><span style={{ color:C.muted }}>{k}</span><span>{v}</span></div>
                ))}
                <div style={{ height:1, background:C.border, margin:"10px 0" }} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:600 }}><span>Total</span><span style={{ color:C.warm }}>€{price}</span></div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={()=>setStep(1)} style={{ flex:1, background:"none", color:C.muted, border:`1px solid ${C.border2}`, borderRadius:10, padding:"13px 0", fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>← Back</button>
                <button className="btn-warm" disabled={!canNext2} onClick={()=>setStep(3)} style={{ flex:2, background:canNext2?C.warm:"#2a1e14", color:canNext2?"#000":C.faint, border:"none", borderRadius:10, padding:"13px 0", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:canNext2?"pointer":"default" }}>Go to Payment →</button>
              </div>
            </div>
          )}
          {step===3&&(
            <div style={{ animation:"fadeUp .3s ease" }}>
              <div style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:10, padding:"16px 18px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontSize:13, color:C.muted }}>Booking with {provider.name}</div><div style={{ fontSize:13, marginTop:3 }}>{time} · {duration} min</div></div>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, color:C.warm }}>€{price}</div>
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:1.2, marginBottom:8, textTransform:"uppercase" }}>Card number</div>
                <input placeholder="4242 4242 4242 4242" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
                <div><div style={{ fontSize:12, color:C.muted, marginBottom:8, textTransform:"uppercase" }}>Expiry</div><input placeholder="MM / YY" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} /></div>
                <div><div style={{ fontSize:12, color:C.muted, marginBottom:8, textTransform:"uppercase" }}>CVC</div><input placeholder="···" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} /></div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={()=>setStep(2)} style={{ flex:1, background:"none", color:C.muted, border:`1px solid ${C.border2}`, borderRadius:10, padding:"13px 0", fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>← Back</button>
                <button className="btn-warm" onClick={pay} style={{ flex:2, background:C.warm, color:"#000", border:"none", borderRadius:10, padding:"13px 0", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>{paying?<Spinner/>:`Pay €${price} →`}</button>
              </div>
            </div>
          )}
          {step===4&&(
            <div style={{ textAlign:"center", padding:"20px 0 8px", animation:"fadeUp .4s ease" }}>
              <div style={{ fontSize:56, marginBottom:18, animation:"float 3s ease-in-out infinite" }}>🕯</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, marginBottom:12 }}>Session confirmed</div>
              <div style={{ color:C.muted, fontSize:14, lineHeight:1.75, marginBottom:24 }}>{provider.name} will be with you at <strong style={{ color:C.text }}>{time}</strong>.<br/>A link has been sent to <strong style={{ color:C.text }}>{email}</strong>.<br/><br/>You are not alone.</div>
              <button className="btn-warm" onClick={onClose} style={{ background:C.warm, color:"#000", border:"none", borderRadius:10, padding:"13px 28px", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function OnboardModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", country:"", age:"", why:"", hours:"", paypal:"" });
  const [done, setDone] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const submit = async () => {
    await new Promise(r=>setTimeout(r,1500));
    setDone(true);
  };
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20, animation:"fadeIn .2s ease" }}>
      <div style={{ background:C.bg2, border:`1px solid ${C.border2}`, borderRadius:20, width:"100%", maxWidth:480, animation:"fadeUp .3s ease", overflow:"hidden", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ padding:"22px 26px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.bg2 }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22 }}>Become a Presence Provider</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, fontSize:24, cursor:"pointer" }}>×</button>
        </div>
        {!done&&(
          <div style={{ padding:"12px 26px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:4 }}>
            {[1,2,3].map(i=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:step>=i?C.warm:C.faint, transition:"background .3s" }} />)}
          </div>
        )}
        <div style={{ padding:"24px 26px" }}>
          {done?(
            <div style={{ textAlign:"center", padding:"20px 0", animation:"fadeUp .4s ease" }}>
              <div style={{ fontSize:52, marginBottom:16 }}>✦</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, marginBottom:12 }}>Application received</div>
              <div style={{ color:C.muted, fontSize:14, lineHeight:1.8 }}>Thank you, {form.name}.<br/>We'll review within 48 hours.<br/>Welcome to Presently.</div>
              <button className="btn-warm" onClick={onClose} style={{ marginTop:24, background:C.warm, color:"#000", border:"none", borderRadius:10, padding:"13px 28px", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>Close</button>
            </div>
          ):step===1?(
            <div style={{ animation:"fadeUp .3s ease" }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, marginBottom:18, color:C.muted }}>Step 1 — About you</div>
              {[["name","Your name","First name"],["age","Your age","e.g. 28"],["country","Where are you based?","Country / City"]].map(([k,label,ph])=>(
                <div key={k} style={{ marginBottom:16 }}>
                  <div style={{ fontSize:12, color:C.muted, letterSpacing:1.2, marginBottom:8, textTransform:"uppercase" }}>{label}</div>
                  <input value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} />
                </div>
              ))}
              <button className="btn-warm" onClick={()=>setStep(2)} disabled={!form.name||!form.age||!form.country} style={{ width:"100%", marginTop:8, background:form.name&&form.age&&form.country?C.warm:"#2a1e14", color:form.name&&form.age&&form.country?"#000":C.faint, border:"none", borderRadius:10, padding:"14px 0", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>Continue →</button>
            </div>
          ):step===2?(
            <div style={{ animation:"fadeUp .3s ease" }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, marginBottom:18, color:C.muted }}>Step 2 — Your presence</div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:1.2, marginBottom:8, textTransform:"uppercase" }}>Why do you want to do this?</div>
                <textarea value={form.why} onChange={e=>set("why",e.target.value)} placeholder="Tell us in your own words." rows={4} style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14, resize:"none", lineHeight:1.65 }} />
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:1.2, marginBottom:8, textTransform:"uppercase" }}>When are you available?</div>
                <input value={form.hours} onChange={e=>set("hours",e.target.value)} placeholder="e.g. Evenings 8–11pm, weekends" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={()=>setStep(1)} style={{ flex:1, background:"none", color:C.muted, border:`1px solid ${C.border2}`, borderRadius:10, padding:"13px 0", fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>← Back</button>
                <button className="btn-warm" onClick={()=>setStep(3)} disabled={!form.why||!form.hours} style={{ flex:2, background:form.why&&form.hours?C.warm:"#2a1e14", color:form.why&&form.hours?"#000":C.faint, border:"none", borderRadius:10, padding:"13px 0", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>Continue →</button>
              </div>
            </div>
          ):(
            <div style={{ animation:"fadeUp .3s ease" }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, marginBottom:18, color:C.muted }}>Step 3 — Get paid</div>
              <div style={{ background:"#0d1a0d", border:"1px solid #1e3a1e", borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
                <div style={{ fontSize:13, color:"#6abf8a", lineHeight:1.7 }}>You earn €7–12 per 30-minute session. Paid weekly via PayPal or bank transfer.</div>
              </div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:1.2, marginBottom:8, textTransform:"uppercase" }}>PayPal email or IBAN</div>
                <input value={form.paypal} onChange={e=>set("paypal",e.target.value)} placeholder="your@paypal.com or IBAN" style={{ width:"100%", background:C.bg, border:`1px solid ${C.border2}`, borderRadius:9, padding:"12px 14px", color:C.text, fontFamily:"'DM Sans', sans-serif", fontSize:14 }} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={()=>setStep(2)} style={{ flex:1, background:"none", color:C.muted, border:`1px solid ${C.border2}`, borderRadius:10, padding:"13px 0", fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>← Back</button>
                <button className="btn-warm" onClick={submit} disabled={!form.paypal} style={{ flex:2, background:form.paypal?C.warm:"#2a1e14", color:form.paypal?"#000":C.faint, border:"none", borderRadius:10, padding:"13px 0", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:14, cursor:"pointer" }}>Submit Application ✦</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function App() {
  const [page, setPage] = useState("home");
  const [moodFilter, setMoodFilter] = useState("All");
  const [bookingProvider, setBookingProvider] = useState(null);
  const [showOnboard, setShowOnboard] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const filtered = moodFilter==="All" ? PROVIDERS : PROVIDERS.filter(p=>p.mood===moodFilter);

  return (
    <>
      <style>{G}</style>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:scrolled?"#080605ee":"transparent", borderBottom:scrolled?`1px solid ${C.border}`:"none", backdropFilter:scrolled?"blur(12px)":"none", transition:"all .3s", padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={()=>setPage("home")}>
            <span style={{ fontSize:22 }}>🕯</span>
            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:600 }}>Presently</span>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>setPage("browse")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:13, padding:"8px 14px" }}>Browse</button>
            <button className="btn-warm" onClick={()=>setShowOnboard(true)} style={{ background:C.warm, color:"#000", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:13, cursor:"pointer" }}>Earn with Us</button>
          </div>
        </div>
      </nav>

      {page==="home"&&(
        <div>
          <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"100px 24px 80px", background:`radial-gradient(ellipse 80% 60% at 50% 0%, #1e1008 0%, ${C.bg} 70%)` }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:32, animation:"float 4s ease-in-out infinite" }}>
              <div style={{ position:"relative" }}>
                <span style={{ fontSize:64 }}>🕯</span>
                <div style={{ position:"absolute", inset:-12, borderRadius:"50%", border:`1px solid ${C.warm}22`, animation:"rippleOut 3s ease-in-out infinite" }} />
              </div>
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(40px,8vw,80px)", lineHeight:1.1, marginBottom:24, maxWidth:800 }}>
              You don't have to sit<br/>with this <em style={{ color:C.warm }}>alone</em>
            </div>
            <div style={{ color:C.muted, fontSize:18, maxWidth:520, lineHeight:1.8, marginBottom:40 }}>
              Real humans. Available now.<br/>No therapy. No advice. Just presence.
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:52 }}>
              <button className="btn-warm" onClick={()=>setPage("browse")} style={{ background:C.warm, color:"#000", border:"none", borderRadius:12, padding:"16px 36px", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:16, cursor:"pointer" }}>Find a Presence</button>
              <button className="btn-ghost" onClick={()=>setShowOnboard(true)} style={{ background:"none", color:C.warm, border:`1px solid ${C.warm}44`, borderRadius:12, padding:"16px 36px", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:16, cursor:"pointer" }}>Earn by Being Present</button>
            </div>
            <div style={{ display:"flex", gap:32, justifyContent:"center", flexWrap:"wrap" }}>
              {[["4,200+","sessions held"],["94%","feel less alone"],["€7–12","earned per session"],["6","countries"]].map(([v,l],i)=>(
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:26, color:C.warm }}>{v}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ padding:"80px 24px", background:C.bg2, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ maxWidth:900, margin:"0 auto" }}>
              <div style={{ textAlign:"center", marginBottom:52 }}>
                <div style={{ fontSize:11, color:C.warm, letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>How it works</div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(28px,4vw,44px)" }}>Four steps to feeling less alone</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:20 }}>
                {[{n:"01",icon:"🔍",title:"Choose",desc:"Browse providers by mood and availability."},{n:"02",icon:"📅",title:"Book",desc:"Pick a time. 30 or 60 minutes. Pay via Stripe."},{n:"03",icon:"🕯",title:"Be present",desc:"Join the call. No script. No pressure."},{n:"04",icon:"✦",title:"Leave lighter",desc:"Rate anonymously. Provider gets paid."}].map((s,i)=>(
                  <div key={i} className="card-hover" style={{ background:C.bg3, border:`1px solid ${C.border}`, borderRadius:14, padding:24 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:32, opacity:.25, marginBottom:8 }}>{s.n}</div>
                    <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:19, marginBottom:8 }}>{s.title}</div>
                    <div style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding:"100px 24px" }}>
            <div style={{ maxWidth:900, margin:"0 auto" }}>
              <div style={{ textAlign:"center", marginBottom:48 }}>
                <div style={{ fontSize:11, color:C.warm, letterSpacing:3, textTransform:"uppercase", marginBottom:14 }}>Stories</div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(28px,4vw,44px)" }}>What people say</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:20 }}>
                {TESTIMONIALS.map((t,i)=>(
                  <div key={i} className="card-hover" style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:28 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:17, lineHeight:1.75, color:"#d8d0c4", marginBottom:18, fontStyle:"italic" }}>"{t.text}"</div>
                    <div style={{ fontSize:12, color:C.muted }}>— {t.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding:"100px 24px", textAlign:"center", background:`radial-gradient(ellipse 80% 50% at 50% 100%, #1e1008 0%, ${C.bg} 70%)` }}>
            <div style={{ fontSize:56, marginBottom:24, animation:"float 4s ease-in-out infinite" }}>🕯</div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(32px,6vw,60px)", marginBottom:16, maxWidth:600, margin:"0 auto 16px" }}>Someone is available for you <em style={{ color:C.warm }}>right now</em></div>
            <div style={{ color:C.muted, fontSize:16, marginBottom:32, marginTop:12 }}>No commitment. First session from €9.</div>
            <button className="btn-warm" onClick={()=>setPage("browse")} style={{ background:C.warm, color:"#000", border:"none", borderRadius:12, padding:"18px 42px", fontWeight:600, fontFamily:"'DM Sans', sans-serif", fontSize:17, cursor:"pointer" }}>Find Your Presence</button>
          </section>

          <footer style={{ borderTop:`1px solid ${C.border}`, padding:"24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span>🕯</span>
              <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18 }}>Presently</span>
            </div>
            <div style={{ fontSize:12, color:C.faint }}>Human presence, on demand. © 2026 · presently.app</div>
          </footer>
        </div>
      )}

      {page==="browse"&&(
        <div style={{ paddingTop:80 }}>
          <div style={{ maxWidth:1000, margin:"0 auto", padding:"48px 24px 80px" }}>
            <button onClick={()=>setPage("home")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", fontSize:13, marginBottom:20, padding:0 }}>← Back</button>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:36, marginBottom:6 }}>Find your presence</div>
            <div style={{ color:C.muted, fontSize:15, marginBottom:28 }}>Real humans. Available now.</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
              {MOODS.map(m=>(
                <button key={m} onClick={()=>setMoodFilter(m)} style={{ background:moodFilter===m?C.warm+"18":"none", border:`1px solid ${moodFilter===m?C.warm:C.border2}`, color:moodFilter===m?C.warm:C.muted, borderRadius:20, padding:"7px 18px", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", transition:"all .2s" }}>{m}</button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:18 }}>
              {filtered.map((p,i)=>(
                <div key={p.id} className="card-hover" style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:16, padding:24, position:"relative" }}>
                  <div style={{ position:"absolute", top:16, right:16, display:"flex", alignItems:"center", gap:5 }}>
                    <Dot on={p.available}/><span style={{ fontSize:11, color:C.muted }}>{p.available?"Available":"Offline"}</span>
                  </div>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:p.color+"55", border:`2px solid ${p.color}88`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:600, marginBottom:14 }}>{p.name[0]}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, marginBottom:3 }}>{p.name}, {p.age}</div>
                  <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>{p.flag} {p.city} · {p.mood}</div>
                  <div style={{ fontStyle:"italic", fontSize:13, color:"#c8bfb0", lineHeight:1.7, marginBottom:14 }}>"{p.bio}"</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>{p.tags.map((t,j)=><Tag key={j}>{t}</Tag>)}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:`1px solid ${C.border}` }}>
                    <div>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:C.warm }}>€{p.price}</span>
                      <span style={{ fontSize:11, color:C.muted }}> /30min</span>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>★ {p.rating} · {p.sessions} sessions</div>
                    </div>
                    <button className="btn-warm" onClick={()=>p.available&&setBookingProvider(p)} style={{ background:p.available?C.warm:"#1e1810", color:p.available?"#000":C.faint, border:"none", borderRadius:9, padding:"10px 18px", fontSize:13, fontWeight:600, cursor:p.available?"pointer":"default", fontFamily:"'DM Sans', sans-serif" }}>
                      {p.available?"Book Now":"Unavailable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {bookingProvider&&<BookingModal provider={bookingProvider} onClose={()=>setBookingProvider(null)}/>}
      {showOnboard&&<OnboardModal onClose={()=>setShowOnboard(false)}/>}
    </>
  );
}
