import React, { useState } from "react";

const T = {
  bg: "#F7F2F7",
  card: "#FFFFFF",
  ink: "#352B3D",
  muted: "#8F8497",
  line: "#EFE6EF",
  primary: "#8E6FB0",
  primarySoft: "#F0E8F7",
  mom: "#E07A9B",
  momSoft: "#FBE9F0",
  dad: "#5C9BC2",
  dadSoft: "#E4F0F7",
  accent: "#F2A65A",
  green: "#5DAE8B",
  red: "#D9697A",
};

const CATEGORIES = [
  { id: "Courses", emoji: "🛒" },
  { id: "Enfants", emoji: "👶" },
  { id: "Maison", emoji: "🏠" },
  { id: "Admin", emoji: "📄" },
  { id: "Santé", emoji: "🩺" },
  { id: "Loisirs", emoji: "🎉" },
];
const catEmoji = (c) => (CATEGORIES.find((x) => x.id === c) || {}).emoji || "📌";

const PRIORITIES = {
  haute: { label: "Haute", color: T.red, bg: "#FBEAEC" },
  moyenne: { label: "Moyenne", color: T.accent, bg: "#FCF1E3" },
  basse: { label: "Basse", color: T.green, bg: "#E7F3EE" },
};

const STRESS = {
  1: { e: "😌", t: "Zen" },
  2: { e: "🙂", t: "Ça va" },
  3: { e: "😐", t: "Moyen" },
  4: { e: "😟", t: "Tendu" },
  5: { e: "😫", t: "Épuisé·e" },
};

const PARENTS = { mom: { name: "Maman", color: T.mom, soft: T.momSoft }, dad: { name: "Papa", color: T.dad, soft: T.dadSoft } };

const uid = () => Math.random().toString(36).slice(2, 9);

async function callAI(system, prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": "PLACEHOLDER",
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error("La requête a échoué (" + res.status + ").");
  const data = await res.json();
  return (data.content && data.content[0] && data.content[0].text) || "Réponse vide.";
}
const AI_SYSTEM =
  "Tu es un assistant familial bienveillant. Tu aides les familles à mieux s'organiser avec des conseils pratiques et modernes. Tu prônes l'équité entre les deux parents. Réponds toujours en français, de façon concise et actionnable.";

function Bar({ value, color, h = 8 }) {
  return (
    <div style={{ background: T.line, borderRadius: 99, height: h, overflow: "hidden", width: "100%" }}>
      <div style={{ width: Math.min(100, Math.max(0, value)) + "%", height: "100%", background: color, borderRadius: 99, transition: "width .35s" }} />
    </div>
  );
}

function Badge({ children, color = T.muted, bg = T.line }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

const styles = {
  input: { width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 14, border: "1px solid " + T.line, background: "#FAF7FB", fontSize: 15, color: T.ink, outline: "none", fontFamily: "inherit" },
  label: { fontSize: 12, fontWeight: 700, color: T.muted, margin: "0 0 6px 2px", display: "block", textTransform: "uppercase", letterSpacing: ".04em" },
  btn: { border: "none", borderRadius: 14, padding: "14px 16px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  card: { background: T.card, borderRadius: 20, padding: 16, boxShadow: "0 4px 18px rgba(120,90,140,.06)" },
  iconBtn: { border: "none", background: "transparent", cursor: "pointer", fontSize: 17, padding: 6, borderRadius: 10, lineHeight: 1 },
  chip: (active, color) => ({
    border: "none", cursor: "pointer", fontFamily: "inherit", padding: "8px 14px", borderRadius: 99, fontSize: 13, fontWeight: 700,
    background: active ? color : "#fff", color: active ? "#fff" : T.muted, boxShadow: active ? "none" : "0 1px 6px rgba(120,90,140,.08)", whiteSpace: "nowrap",
  }),
};

function Sheet({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(40,28,48,.45)", zIndex: 50, display: "flex", alignItems: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.bg, width: "100%", maxHeight: "88vh", borderRadius: "26px 26px 0 0", boxShadow: "0 -8px 30px rgba(0,0,0,.18)", display: "flex", flexDirection: "column", animation: "slideUp .28s ease" }}>
        <div style={{ padding: "10px 0 4px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 44, height: 5, borderRadius: 99, background: T.line }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 20px 12px" }}>
          <h2 style={{ margin: 0, fontSize: 19, color: T.ink }}>{title}</h2>
          <button onClick={onClose} style={{ ...styles.iconBtn, fontSize: 20, color: T.muted, background: "#fff" }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", padding: "0 20px 28px" }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState(null); // {type, data}
  const [draft, setDraft] = useState({});
  const [taskFa, setTaskFa] = useState("all");
  const [taskFc, setTaskFc] = useState("all");
  const [kidSub, setKidSub] = useState("fiches");
  const [budSub, setBudSub] = useState("depenses");

  const [stress, setStress] = useState({ mom: 3, dad: 2 });
  const [thanks, setThanks] = useState({ mom: "Merci pour le dîner d'hier, c'était parfait 💛", dad: "Merci de gérer les rendez-vous médicaux 🙏" });

  const [tasks, setTasks] = useState([
    { id: uid(), title: "Courses de la semaine", assignee: "mom", category: "Courses", priority: "haute", date: "2026-06-17", done: false },
    { id: uid(), title: "RDV pédiatre Léa", assignee: "dad", category: "Santé", priority: "haute", date: "2026-06-18", done: false },
    { id: uid(), title: "Lessive + repassage", assignee: "mom", category: "Maison", priority: "moyenne", date: "2026-06-16", done: true },
    { id: uid(), title: "Déclaration impôts", assignee: "dad", category: "Admin", priority: "moyenne", date: "2026-06-22", done: false },
    { id: uid(), title: "Préparer goûter d'anniv", assignee: "mom", category: "Enfants", priority: "basse", date: "2026-06-20", done: false },
    { id: uid(), title: "Réserver resto samedi", assignee: "dad", category: "Loisirs", priority: "basse", date: "2026-06-19", done: true },
  ]);

  const [events, setEvents] = useState([
    { id: uid(), title: "Réunion parents d'élèves", date: "2026-06-17" },
    { id: uid(), title: "Pédiatre — Léa", date: "2026-06-18" },
    { id: uid(), title: "Anniversaire Tom (5 ans)", date: "2026-06-20" },
    { id: uid(), title: "Dîner en amoureux", date: "2026-06-21" },
    { id: uid(), title: "Sortie piscine", date: "2026-06-24" },
  ]);

  const [kids, setKids] = useState([
    { id: uid(), name: "Léa", age: "7 ans", allergies: "Arachides", doctor: "Dr. Moreau", notes: "Adore dessiner, peur du noir", vaccins: "À jour" },
    { id: uid(), name: "Tom", age: "4 ans", allergies: "Aucune", doctor: "Dr. Moreau", notes: "Sieste 13h-15h", vaccins: "Rappel ROR à prévoir" },
  ]);

  const [missions, setMissions] = useState([
    { id: uid(), title: "Ranger sa chambre", points: 10, done: true },
    { id: uid(), title: "Mettre la table", points: 5, done: false },
    { id: uid(), title: "Lire 10 minutes", points: 8, done: true },
    { id: uid(), title: "Arroser les plantes", points: 5, done: false },
  ]);
  const [reward, setReward] = useState({ label: "Sortie au parc 🎠", goal: 40 });

  const [contacts, setContacts] = useState([
    { id: uid(), name: "Dr. Moreau", role: "Pédiatre", phone: "0145678910" },
    { id: uid(), name: "Sophie", role: "Baby-sitter", phone: "0612345678" },
    { id: uid(), name: "École des Lilas", role: "École", phone: "0148901234" },
    { id: uid(), name: "Mamie Claire", role: "Grand-mère", phone: "0698765432" },
  ]);

  const [dateIdea, setDateIdea] = useState("Cinéma + restaurant italien samedi soir 🍝");

  const [expenses, setExpenses] = useState([
    { id: uid(), label: "Courses Carrefour", amount: 87.5, category: "Courses", payer: "mom" },
    { id: uid(), label: "Essence", amount: 60, category: "Loisirs", payer: "dad" },
    { id: uid(), label: "Pharmacie", amount: 24.3, category: "Santé", payer: "mom" },
    { id: uid(), label: "Cantine Léa", amount: 45, category: "Enfants", payer: "dad" },
  ]);

  const [savings, setSavings] = useState([
    { id: uid(), title: "Vacances été ☀️", goal: 2000, current: 750 },
    { id: uid(), title: "Vélo de Tom 🚲", goal: 200, current: 120 },
  ]);

  // ---- AI sheet state ----
  const [aiMode, setAiMode] = useState("anticiper");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");

  const open = (type, data = {}) => { setDraft(data); setSheet({ type }); };
  const close = () => setSheet(null);

  const load = (p) => {
    const my = tasks.filter((t) => t.assignee === p);
    return { done: my.filter((t) => t.done).length, total: my.length };
  };
  const totalDone = tasks.filter((t) => t.done).length;
  const totalOpen = tasks.length - totalDone;
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const futureEvents = upcoming.filter((e) => e.date >= "2026-06-16");
  const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  // ---------- AI actions ----------
  const runAI = async (prompt) => {
    setAiError(""); setAiResult(""); setAiLoading(true);
    try { setAiResult(await callAI(AI_SYSTEM, prompt)); }
    catch (e) { setAiError(e.message || "Erreur inconnue."); }
    finally { setAiLoading(false); }
  };

  const anticiper = () => {
    const ctx = `Contexte de la famille :
- Charge ${PARENTS.mom.name} : ${load("mom").done}/${load("mom").total} tâches faites. Stress : ${stress.mom}/5 (${STRESS[stress.mom].t}).
- Charge ${PARENTS.dad.name} : ${load("dad").done}/${load("dad").total} tâches faites. Stress : ${stress.dad}/5 (${STRESS[stress.dad].t}).
- Événements à venir : ${futureEvents.map((e) => e.title + " (" + fmtDate(e.date) + ")").join(", ") || "aucun"}.
Donne, de façon structurée et concise :
1) Les besoins à anticiper cette semaine
2) Un risque de tension à surveiller
3) Une action concrète à faire aujourd'hui
4) Un moment à planifier en couple`;
    runAI(ctx);
  };

  // ---------- RENDER HELPERS ----------
  const Header = () => (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(247,242,247,.92)", backdropFilter: "blur(8px)", padding: "16px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid " + T.line }}>
      <div>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 700, letterSpacing: ".06em" }}>NOTRE FAMILLE</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, lineHeight: 1.1 }}>{tabTitle[tab]}</div>
      </div>
      <button onClick={() => { setAiMode("anticiper"); setAiResult(""); setAiError(""); setSheet({ type: "ai" }); }}
        style={{ ...styles.btn, background: T.primary, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 6px 16px rgba(142,111,176,.4)" }}>
        ✨ <span style={{ fontSize: 14 }}>Assistant</span>
      </button>
    </div>
  );

  // ============ TABS ============
  const Home = () => (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {["mom", "dad"].map((p) => {
          const l = load(p); const pct = l.total ? (l.done / l.total) * 100 : 0;
          return (
            <div key={p} style={{ ...styles.card, padding: 14, borderTop: "4px solid " + PARENTS[p].color }}>
              <div style={{ fontWeight: 800, color: PARENTS[p].color, marginBottom: 8 }}>{PARENTS[p].name}</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>{l.done}/{l.total} tâches</div>
              <Bar value={pct} color={PARENTS[p].color} />
            </div>
          );
        })}
      </div>

      <div style={styles.card}>
        <div style={{ fontWeight: 800, color: T.ink, marginBottom: 12 }}>Niveau de stress</div>
        {["mom", "dad"].map((p) => (
          <div key={p} style={{ marginBottom: p === "mom" ? 18 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: PARENTS[p].color, fontSize: 14 }}>{PARENTS[p].name}</span>
              <span style={{ fontSize: 22 }}>{STRESS[stress[p]].e} <span style={{ fontSize: 13, color: T.muted, fontWeight: 700 }}>{STRESS[stress[p]].t}</span></span>
            </div>
            <input type="range" min="1" max="5" value={stress[p]} onChange={(e) => setStress({ ...stress, [p]: +e.target.value })}
              style={{ width: "100%", accentColor: PARENTS[p].color }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[{ n: totalOpen, l: "En cours", c: T.accent }, { n: totalDone, l: "Terminées", c: T.green }, { n: futureEvents.length, l: "Événements", c: T.primary }].map((s, i) => (
          <div key={i} style={{ ...styles.card, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.n}</div>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={{ fontWeight: 800, color: T.ink, marginBottom: 12 }}>💛 Merci du jour</div>
        {["mom", "dad"].map((p) => (
          <div key={p} style={{ marginBottom: p === "mom" ? 12 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PARENTS[p].color, marginBottom: 4 }}>{PARENTS[p].name} dit :</div>
            <textarea value={thanks[p]} onChange={(e) => setThanks({ ...thanks, [p]: e.target.value })} rows={2}
              style={{ ...styles.input, background: PARENTS[p].soft, resize: "none" }} />
          </div>
        ))}
      </div>

      <div style={styles.card}>
        <div style={{ fontWeight: 800, color: T.ink, marginBottom: 12 }}>📅 Prochains événements</div>
        {futureEvents.slice(0, 3).map((e) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid " + T.line }}>
            <div style={{ background: T.primarySoft, color: T.primary, borderRadius: 12, padding: "6px 10px", fontWeight: 800, fontSize: 13, minWidth: 52, textAlign: "center" }}>{fmtDate(e.date)}</div>
            <div style={{ color: T.ink, fontWeight: 600 }}>{e.title}</div>
          </div>
        ))}
      </div>

      <button onClick={() => { setAiMode("anticiper"); setAiResult(""); setAiError(""); setSheet({ type: "ai" }); }}
        style={{ ...styles.card, textAlign: "left", cursor: "pointer", border: "none", background: "linear-gradient(135deg,#8E6FB0,#B98BD9)", color: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>✨ Besoin d'un coup de main ?</div>
        <div style={{ fontSize: 13, opacity: .92 }}>L'assistant anticipe votre semaine et propose des idées sur-mesure.</div>
      </button>
    </div>
  );

  const Tasks = () => {
    const fa = taskFa, setFa = setTaskFa, fc = taskFc, setFc = setTaskFc;
    const list = tasks.filter((t) => (fa === "all" || t.assignee === fa) && (fc === "all" || t.category === fc));
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <button onClick={() => { setAiMode("sos"); setAiResult(""); setAiError(""); setSheet({ type: "ai" }); }}
          style={{ ...styles.btn, background: "#FBEAEC", color: T.red, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1.5px solid #F2C9CF" }}>
          😮‍💨 Je suis épuisé·e — m'aider à replanifier
        </button>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {[["all", "Tous"], ["mom", "Maman"], ["dad", "Papa"]].map(([v, l]) => (
            <button key={v} onClick={() => setFa(v)} style={styles.chip(fa === v, v === "all" ? T.primary : PARENTS[v]?.color || T.primary)}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          <button onClick={() => setFc("all")} style={styles.chip(fc === "all", T.primary)}>Toutes</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setFc(c.id)} style={styles.chip(fc === c.id, T.primary)}>{c.emoji} {c.id}</button>
          ))}
        </div>

        {list.length === 0 && <div style={{ ...styles.card, textAlign: "center", color: T.muted }}>Aucune tâche ici 🎉</div>}
        {list.map((t) => (
          <div key={t.id} style={{ ...styles.card, padding: 14, display: "flex", gap: 12, alignItems: "flex-start", opacity: t.done ? .6 : 1 }}>
            <button onClick={() => setTasks(tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
              style={{ width: 26, height: 26, borderRadius: 9, border: "2px solid " + (t.done ? T.green : T.line), background: t.done ? T.green : "#fff", color: "#fff", cursor: "pointer", flexShrink: 0, fontSize: 14, marginTop: 2 }}>{t.done ? "✓" : ""}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: T.ink, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7 }}>
                <Badge color={PRIORITIES[t.priority].color} bg={PRIORITIES[t.priority].bg}>{PRIORITIES[t.priority].label}</Badge>
                <Badge color={PARENTS[t.assignee].color} bg={PARENTS[t.assignee].soft}>{PARENTS[t.assignee].name}</Badge>
                <Badge>{catEmoji(t.category)} {t.category}</Badge>
                {t.date && <Badge>📅 {fmtDate(t.date)}</Badge>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button style={styles.iconBtn} onClick={() => open("task", t)}>✏️</button>
              <button style={{ ...styles.iconBtn, color: T.red }} onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))}>✕</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const Kids = () => {
    const sub = kidSub, setSub = setKidSub;
    const points = missions.filter((m) => m.done).reduce((s, m) => s + m.points, 0);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, background: "#fff", padding: 5, borderRadius: 14, boxShadow: "0 2px 10px rgba(120,90,140,.06)" }}>
          {[["fiches", "Fiches"], ["missions", "Missions"], ["contacts", "Contacts"]].map(([v, l]) => (
            <button key={v} onClick={() => setSub(v)} style={{ ...styles.btn, flex: 1, padding: "10px 0", fontSize: 14, background: sub === v ? T.primary : "transparent", color: sub === v ? "#fff" : T.muted }}>{l}</button>
          ))}
        </div>

        {sub === "fiches" && kids.map((k) => (
          <div key={k.id} style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.ink }}>👧 {k.name} <span style={{ fontSize: 13, color: T.muted, fontWeight: 600 }}>· {k.age}</span></div>
              <button style={styles.iconBtn} onClick={() => open("kid", k)}>✏️</button>
            </div>
            {[["Allergies", k.allergies], ["Médecin", k.doctor], ["Vaccins", k.vaccins], ["Notes", k.notes]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid " + T.line, fontSize: 14 }}>
                <span style={{ color: T.muted, fontWeight: 700, minWidth: 80 }}>{l}</span>
                <span style={{ color: T.ink }}>{v || "—"}</span>
              </div>
            ))}
          </div>
        ))}

        {sub === "missions" && (
          <>
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 800, color: T.ink }}>🎁 {reward.label}</span>
                <span style={{ fontWeight: 800, color: T.accent }}>{points}/{reward.goal} pts</span>
              </div>
              <Bar value={(points / reward.goal) * 100} color={T.accent} h={10} />
            </div>
            {missions.map((m) => (
              <div key={m.id} style={{ ...styles.card, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setMissions(missions.map((x) => x.id === m.id ? { ...x, done: !x.done } : x))}
                  style={{ width: 26, height: 26, borderRadius: 9, border: "2px solid " + (m.done ? T.green : T.line), background: m.done ? T.green : "#fff", color: "#fff", cursor: "pointer", flexShrink: 0 }}>{m.done ? "✓" : ""}</button>
                <div style={{ flex: 1, fontWeight: 700, color: T.ink, textDecoration: m.done ? "line-through" : "none", opacity: m.done ? .6 : 1 }}>{m.title}</div>
                <Badge color={T.accent} bg="#FCF1E3">+{m.points} pts</Badge>
                <button style={styles.iconBtn} onClick={() => open("mission", m)}>✏️</button>
                <button style={{ ...styles.iconBtn, color: T.red }} onClick={() => setMissions(missions.filter((x) => x.id !== m.id))}>✕</button>
              </div>
            ))}
            <button onClick={() => open("mission", { title: "", points: 5, done: false })} style={{ ...styles.btn, background: T.primarySoft, color: T.primary }}>+ Ajouter une mission</button>
          </>
        )}

        {sub === "contacts" && (
          <>
            {contacts.map((c) => (
              <div key={c.id} style={{ ...styles.card, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: T.primarySoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📇</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: T.ink }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: T.muted }}>{c.role}</div>
                  <a href={"tel:" + c.phone} style={{ fontSize: 13, color: T.primary, fontWeight: 700, textDecoration: "none" }}>📞 {c.phone}</a>
                </div>
                <button style={styles.iconBtn} onClick={() => open("contact", c)}>✏️</button>
                <button style={{ ...styles.iconBtn, color: T.red }} onClick={() => setContacts(contacts.filter((x) => x.id !== c.id))}>✕</button>
              </div>
            ))}
            <button onClick={() => open("contact", { name: "", role: "", phone: "" })} style={{ ...styles.btn, background: T.primarySoft, color: T.primary }}>+ Ajouter un contact</button>
          </>
        )}
      </div>
    );
  };

  const Wellbeing = () => (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={styles.card}>
        <div style={{ fontWeight: 800, color: T.ink, marginBottom: 10 }}>💑 Idée de soirée en couple</div>
        <textarea value={dateIdea} onChange={(e) => setDateIdea(e.target.value)} rows={2} style={{ ...styles.input, resize: "none", marginBottom: 10 }} />
        <button disabled={aiLoading} onClick={() => { setAiMode("date"); setAiResult(""); setAiError(""); setSheet({ type: "ai" }); }}
          style={{ ...styles.btn, width: "100%", background: T.primary, color: "#fff", opacity: aiLoading ? .6 : 1 }}>
          ✨ Proposer des idées de date night
        </button>
      </div>

      <div style={styles.card}>
        <div style={{ fontWeight: 800, color: T.ink, marginBottom: 12 }}>💛 Messages de gratitude</div>
        {["mom", "dad"].map((p) => (
          <div key={p} style={{ background: PARENTS[p].soft, borderRadius: 14, padding: 14, marginBottom: p === "mom" ? 10 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: PARENTS[p].color, marginBottom: 6 }}>{PARENTS[p].name}</div>
            <textarea value={thanks[p]} onChange={(e) => setThanks({ ...thanks, [p]: e.target.value })} rows={2}
              style={{ ...styles.input, background: "#fff", resize: "none" }} />
          </div>
        ))}
      </div>

      <div style={{ ...styles.card, background: "linear-gradient(135deg,#E07A9B,#F2A65A)", color: "#fff" }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>🌿 Petit rappel</div>
        <div style={{ fontSize: 14, opacity: .95, marginTop: 4 }}>Prendre soin de votre couple, c'est aussi prendre soin de votre famille. Planifiez un moment rien qu'à vous cette semaine.</div>
      </div>
    </div>
  );

  const Budget = () => {
    const sub = budSub, setSub = setBudSub;
    const byCat = {}; const byPayer = { mom: 0, dad: 0 };
    expenses.forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; byPayer[e.payer] += e.amount; });
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, background: "#fff", padding: 5, borderRadius: 14, boxShadow: "0 2px 10px rgba(120,90,140,.06)" }}>
          {[["depenses", "Dépenses"], ["cagnottes", "Cagnottes"]].map(([v, l]) => (
            <button key={v} onClick={() => setSub(v)} style={{ ...styles.btn, flex: 1, padding: "10px 0", fontSize: 14, background: sub === v ? T.primary : "transparent", color: sub === v ? "#fff" : T.muted }}>{l}</button>
          ))}
        </div>

        {sub === "depenses" && (
          <>
            <div style={{ ...styles.card, background: "linear-gradient(135deg,#8E6FB0,#B98BD9)", color: "#fff" }}>
              <div style={{ fontSize: 12, opacity: .9 }}>Total dépenses</div>
              <div style={{ fontSize: 30, fontWeight: 800 }}>{total.toFixed(2)} €</div>
              <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 13 }}>
                <span>👩 Maman {byPayer.mom.toFixed(0)} €</span>
                <span>👨 Papa {byPayer.dad.toFixed(0)} €</span>
              </div>
            </div>
            <div style={styles.card}>
              <div style={{ fontWeight: 800, color: T.ink, marginBottom: 8 }}>Par catégorie</div>
              {Object.entries(byCat).map(([c, v]) => (
                <div key={c} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 14 }}>
                  <span style={{ color: T.muted }}>{catEmoji(c)} {c}</span><span style={{ fontWeight: 700, color: T.ink }}>{v.toFixed(2)} €</span>
                </div>
              ))}
            </div>
            {expenses.map((e) => (
              <div key={e.id} style={{ ...styles.card, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: T.ink }}>{e.label}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                    <Badge>{catEmoji(e.category)} {e.category}</Badge>
                    <Badge color={PARENTS[e.payer].color} bg={PARENTS[e.payer].soft}>{PARENTS[e.payer].name}</Badge>
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: T.ink }}>{e.amount.toFixed(2)} €</div>
                <button style={styles.iconBtn} onClick={() => open("expense", e)}>✏️</button>
                <button style={{ ...styles.iconBtn, color: T.red }} onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}>✕</button>
              </div>
            ))}
            <button onClick={() => open("expense", { label: "", amount: "", category: "Courses", payer: "mom" })} style={{ ...styles.btn, background: T.primarySoft, color: T.primary }}>+ Ajouter une dépense</button>
          </>
        )}

        {sub === "cagnottes" && (
          <>
            {savings.map((s) => (
              <div key={s.id} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, color: T.ink }}>{s.title}</span>
                  <div>
                    <button style={styles.iconBtn} onClick={() => open("saving", s)}>✏️</button>
                    <button style={{ ...styles.iconBtn, color: T.red }} onClick={() => setSavings(savings.filter((x) => x.id !== s.id))}>✕</button>
                  </div>
                </div>
                <Bar value={(s.current / s.goal) * 100} color={T.green} h={10} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: T.muted, fontWeight: 700 }}>{s.current} € / {s.goal} €</span>
                  <AddAmount onAdd={(v) => setSavings(savings.map((x) => x.id === s.id ? { ...x, current: x.current + v } : x))} />
                </div>
              </div>
            ))}
            <button onClick={() => open("saving", { title: "", goal: "", current: 0 })} style={{ ...styles.btn, background: T.primarySoft, color: T.primary }}>+ Nouvelle cagnotte</button>
          </>
        )}
      </div>
    );
  };

  const tabTitle = { home: "Accueil", tasks: "Tâches", kids: "Enfants", wellbeing: "Bien-être", budget: "Budget" };
  const tabs = [["home", "🏠"], ["tasks", "✅"], ["kids", "👶"], ["wellbeing", "💛"], ["budget", "💰"]];

  // ---------- SHEET CONTENT ----------
  const saveDraft = (commit) => { commit(); close(); };

  function renderSheet() {
    if (!sheet) return null;
    const ty = sheet.type;

    if (ty === "ai") return <AISheet />;

    if (ty === "task") {
      const isNew = !draft.id;
      return (
        <Sheet title={isNew ? "Nouvelle tâche" : "Modifier la tâche"} onClose={close}>
          <Field label="Titre"><input style={styles.input} value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Ex : Acheter du pain" /></Field>
          <Field label="Assigné à">
            <div style={{ display: "flex", gap: 8 }}>
              {["mom", "dad"].map((p) => (
                <button key={p} onClick={() => setDraft({ ...draft, assignee: p })} style={{ ...styles.btn, flex: 1, background: draft.assignee === p ? PARENTS[p].color : "#fff", color: draft.assignee === p ? "#fff" : T.muted, boxShadow: "0 1px 6px rgba(120,90,140,.08)" }}>{PARENTS[p].name}</button>
              ))}
            </div>
          </Field>
          <Field label="Catégorie">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setDraft({ ...draft, category: c.id })} style={styles.chip(draft.category === c.id, T.primary)}>{c.emoji} {c.id}</button>
              ))}
            </div>
          </Field>
          <Field label="Priorité">
            <div style={{ display: "flex", gap: 8 }}>
              {Object.keys(PRIORITIES).map((p) => (
                <button key={p} onClick={() => setDraft({ ...draft, priority: p })} style={{ ...styles.btn, flex: 1, fontSize: 13, background: draft.priority === p ? PRIORITIES[p].color : "#fff", color: draft.priority === p ? "#fff" : T.muted, boxShadow: "0 1px 6px rgba(120,90,140,.08)" }}>{PRIORITIES[p].label}</button>
              ))}
            </div>
          </Field>
          <Field label="Date"><input type="date" style={styles.input} value={draft.date || ""} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></Field>
          <SaveBtn disabled={!draft.title} onClick={() => saveDraft(() => {
            if (isNew) setTasks([...tasks, { ...draft, id: uid(), done: false, assignee: draft.assignee || "mom", category: draft.category || "Maison", priority: draft.priority || "moyenne" }]);
            else setTasks(tasks.map((x) => x.id === draft.id ? draft : x));
          })} />
        </Sheet>
      );
    }

    if (ty === "kid") return (
      <Sheet title={"Fiche de " + draft.name} onClose={close}>
        <Field label="Prénom"><input style={styles.input} value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
        <Field label="Âge"><input style={styles.input} value={draft.age || ""} onChange={(e) => setDraft({ ...draft, age: e.target.value })} /></Field>
        <Field label="Allergies"><input style={styles.input} value={draft.allergies || ""} onChange={(e) => setDraft({ ...draft, allergies: e.target.value })} /></Field>
        <Field label="Médecin"><input style={styles.input} value={draft.doctor || ""} onChange={(e) => setDraft({ ...draft, doctor: e.target.value })} /></Field>
        <Field label="Vaccins"><input style={styles.input} value={draft.vaccins || ""} onChange={(e) => setDraft({ ...draft, vaccins: e.target.value })} /></Field>
        <Field label="Notes"><textarea rows={3} style={{ ...styles.input, resize: "none" }} value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></Field>
        <SaveBtn onClick={() => saveDraft(() => setKids(kids.map((x) => x.id === draft.id ? draft : x)))} />
      </Sheet>
    );

    if (ty === "mission") {
      const isNew = !draft.id;
      return (
        <Sheet title={isNew ? "Nouvelle mission" : "Modifier la mission"} onClose={close}>
          <Field label="Mission"><input style={styles.input} value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Ex : Faire son lit" /></Field>
          <Field label="Points"><input type="number" style={styles.input} value={draft.points} onChange={(e) => setDraft({ ...draft, points: +e.target.value })} /></Field>
          <SaveBtn disabled={!draft.title} onClick={() => saveDraft(() => {
            if (isNew) setMissions([...missions, { ...draft, id: uid(), points: draft.points || 5 }]);
            else setMissions(missions.map((x) => x.id === draft.id ? draft : x));
          })} />
        </Sheet>
      );
    }

    if (ty === "contact") {
      const isNew = !draft.id;
      return (
        <Sheet title={isNew ? "Nouveau contact" : "Modifier le contact"} onClose={close}>
          <Field label="Nom"><input style={styles.input} value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Rôle"><input style={styles.input} value={draft.role || ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} placeholder="Ex : Pédiatre" /></Field>
          <Field label="Téléphone"><input style={styles.input} value={draft.phone || ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
          <SaveBtn disabled={!draft.name} onClick={() => saveDraft(() => {
            if (isNew) setContacts([...contacts, { ...draft, id: uid() }]);
            else setContacts(contacts.map((x) => x.id === draft.id ? draft : x));
          })} />
        </Sheet>
      );
    }

    if (ty === "expense") {
      const isNew = !draft.id;
      return (
        <Sheet title={isNew ? "Nouvelle dépense" : "Modifier la dépense"} onClose={close}>
          <Field label="Libellé"><input style={styles.input} value={draft.label || ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
          <Field label="Montant (€)"><input type="number" style={styles.input} value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} /></Field>
          <Field label="Catégorie">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setDraft({ ...draft, category: c.id })} style={styles.chip(draft.category === c.id, T.primary)}>{c.emoji} {c.id}</button>
              ))}
            </div>
          </Field>
          <Field label="Payé par">
            <div style={{ display: "flex", gap: 8 }}>
              {["mom", "dad"].map((p) => (
                <button key={p} onClick={() => setDraft({ ...draft, payer: p })} style={{ ...styles.btn, flex: 1, background: draft.payer === p ? PARENTS[p].color : "#fff", color: draft.payer === p ? "#fff" : T.muted, boxShadow: "0 1px 6px rgba(120,90,140,.08)" }}>{PARENTS[p].name}</button>
              ))}
            </div>
          </Field>
          <SaveBtn disabled={!draft.label || !draft.amount} onClick={() => saveDraft(() => {
            const e = { ...draft, amount: parseFloat(draft.amount) || 0 };
            if (isNew) setExpenses([...expenses, { ...e, id: uid() }]);
            else setExpenses(expenses.map((x) => x.id === draft.id ? e : x));
          })} />
        </Sheet>
      );
    }

    if (ty === "saving") {
      const isNew = !draft.id;
      return (
        <Sheet title={isNew ? "Nouvelle cagnotte" : "Modifier la cagnotte"} onClose={close}>
          <Field label="Nom du projet"><input style={styles.input} value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Objectif (€)"><input type="number" style={styles.input} value={draft.goal} onChange={(e) => setDraft({ ...draft, goal: e.target.value })} /></Field>
          <Field label="Déjà épargné (€)"><input type="number" style={styles.input} value={draft.current} onChange={(e) => setDraft({ ...draft, current: e.target.value })} /></Field>
          <SaveBtn disabled={!draft.title || !draft.goal} onClick={() => saveDraft(() => {
            const s = { ...draft, goal: parseFloat(draft.goal) || 0, current: parseFloat(draft.current) || 0 };
            if (isNew) setSavings([...savings, { ...s, id: uid() }]);
            else setSavings(savings.map((x) => x.id === draft.id ? s : x));
          })} />
        </Sheet>
      );
    }
    return null;
  }

  function AISheet() {
    const shortcuts = [
      ["🏖️ Idées vacances", "Propose-nous 3 idées de vacances en famille adaptées à un couple avec deux enfants de 4 et 7 ans."],
      ["🍽️ Menu de la semaine", "Propose un menu équilibré pour la semaine (dîners) pour une famille de 4, simple à cuisiner."],
      ["⚖️ Répartition équitable", "Propose une répartition équitable des tâches ménagères et parentales entre les deux parents."],
      ["🌅 Routine du matin", "Propose une routine du matin fluide et sans stress pour une famille avec 2 enfants scolarisés."],
    ];
    return (
      <Sheet title="✨ Assistant familial" onClose={close}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["anticiper", "Anticiper"], ["demander", "Demander"]].map(([v, l]) => (
            <button key={v} onClick={() => { setAiMode(v); setAiResult(""); setAiError(""); }} style={{ ...styles.btn, flex: 1, background: aiMode === v ? T.primary : "#fff", color: aiMode === v ? "#fff" : T.muted, boxShadow: "0 1px 6px rgba(120,90,140,.08)" }}>{l}</button>
          ))}
        </div>

        {(aiMode === "anticiper") && (
          <div style={{ ...styles.card, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: T.ink, marginBottom: 6 }}>Analyse de votre semaine</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>L'assistant lit votre charge de tâches, vos niveaux de stress et vos événements pour anticiper les besoins de la famille.</div>
            <button disabled={aiLoading} onClick={anticiper} style={{ ...styles.btn, width: "100%", background: T.primary, color: "#fff", opacity: aiLoading ? .6 : 1 }}>
              {aiLoading ? "Analyse en cours…" : "Anticiper ma semaine"}
            </button>
          </div>
        )}

        {aiMode === "sos" && (
          <div style={{ ...styles.card, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: T.ink, marginBottom: 6 }}>😮‍💨 On souffle un coup</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>L'assistant propose de replanifier les tâches non urgentes de la semaine pour alléger votre charge.</div>
            <button disabled={aiLoading} onClick={() => {
              const np = tasks.filter((t) => !t.done && t.priority !== "haute").map((t) => t.title + " (" + PARENTS[t.assignee].name + ")");
              runAI(`Un parent se sent épuisé. Voici les tâches non urgentes encore à faire cette semaine : ${np.join(", ") || "aucune"}. Propose une replanification réaliste : ce qui peut être reporté, délégué ou simplifié, et un mot bienveillant. Sois concret.`);
            }} style={{ ...styles.btn, width: "100%", background: T.red, color: "#fff", opacity: aiLoading ? .6 : 1 }}>
              {aiLoading ? "Replanification…" : "M'aider à replanifier"}
            </button>
          </div>
        )}

        {aiMode === "date" && (
          <div style={{ ...styles.card, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, color: T.ink, marginBottom: 12 }}>💑 Idées de soirée en couple</div>
            <button disabled={aiLoading} onClick={() => runAI("Propose 3 idées originales et réalisables de soirée en amoureux (date night) pour un couple avec enfants, dont au moins une à la maison. Sois concis.")} style={{ ...styles.btn, width: "100%", background: T.primary, color: "#fff", opacity: aiLoading ? .6 : 1 }}>
              {aiLoading ? "Inspiration…" : "Proposer des idées"}
            </button>
          </div>
        )}

        {aiMode === "demander" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {shortcuts.map(([l, p]) => (
                <button key={l} disabled={aiLoading} onClick={() => runAI(p)} style={{ ...styles.card, padding: 14, cursor: "pointer", border: "none", textAlign: "left", fontWeight: 700, color: T.ink, fontSize: 14, opacity: aiLoading ? .6 : 1 }}>{l}</button>
              ))}
            </div>
            <Field label="Votre question">
              <textarea rows={3} value={aiQuestion} onChange={(e) => setAiQuestion(e.target.value)} placeholder="Posez votre question à l'assistant…" style={{ ...styles.input, resize: "none" }} />
            </Field>
            <button disabled={aiLoading || !aiQuestion.trim()} onClick={() => runAI(aiQuestion)} style={{ ...styles.btn, width: "100%", background: T.primary, color: "#fff", opacity: (aiLoading || !aiQuestion.trim()) ? .6 : 1, marginBottom: 14 }}>
              {aiLoading ? "Réflexion…" : "Demander"}
            </button>
          </>
        )}

        {aiLoading && <div style={{ textAlign: "center", color: T.primary, fontWeight: 700, padding: 10 }}>⏳ L'assistant réfléchit…</div>}
        {aiError && <div style={{ ...styles.card, background: "#FBEAEC", color: T.red, fontWeight: 600 }}>⚠️ {aiError}</div>}
        {aiResult && <div style={{ ...styles.card, whiteSpace: "pre-wrap", lineHeight: 1.55, color: T.ink, fontSize: 15 }}>{aiResult}</div>}
      </Sheet>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color: T.ink, maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}*{-webkit-tap-highlight-color:transparent}textarea,input{font-family:inherit}`}</style>
      <Header />
      <div style={{ padding: "16px 16px 110px" }}>
        {tab === "home" && <Home />}
        {tab === "tasks" && <Tasks />}
        {tab === "kids" && <Kids />}
        {tab === "wellbeing" && <Wellbeing />}
        {tab === "budget" && <Budget />}
      </div>

      {tab === "tasks" && (
        <button onClick={() => open("task", { title: "", assignee: "mom", category: "Maison", priority: "moyenne", date: "" })}
          style={{ position: "fixed", bottom: 88, right: "max(20px, calc(50% - 240px + 20px))", width: 60, height: 60, borderRadius: 20, background: T.primary, color: "#fff", border: "none", fontSize: 30, boxShadow: "0 8px 22px rgba(142,111,176,.5)", cursor: "pointer", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      )}

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid " + T.line, display: "flex", padding: "8px 4px calc(8px + env(safe-area-inset-bottom))", zIndex: 40, boxShadow: "0 -4px 20px rgba(120,90,140,.08)" }}>
        {tabs.map(([id, ic]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", padding: "6px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 22, filter: tab === id ? "none" : "grayscale(.5) opacity(.55)" }}>{ic}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: tab === id ? T.primary : T.muted }}>{tabTitle[id]}</span>
          </button>
        ))}
      </div>

      {renderSheet()}
    </div>
  );
}

function AddAmount({ onAdd }) {
  const [v, setV] = useState("");
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <input type="number" value={v} onChange={(e) => setV(e.target.value)} placeholder="+€" style={{ width: 64, padding: "6px 8px", borderRadius: 10, border: "1px solid " + T.line, fontSize: 13, outline: "none" }} />
      <button onClick={() => { const n = parseFloat(v); if (n > 0) { onAdd(n); setV(""); } }} style={{ border: "none", background: T.green, color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>OK</button>
    </div>
  );
}

function SaveBtn({ onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...styles.btn, width: "100%", background: disabled ? T.line : T.primary, color: disabled ? T.muted : "#fff", marginTop: 6, cursor: disabled ? "not-allowed" : "pointer" }}>
      Enregistrer
    </button>
  );
}
