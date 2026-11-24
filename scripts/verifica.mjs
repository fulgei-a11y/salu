// Controlla che i contenuti siano completi, che ogni voce abbia una fonte valida
// e che le regole di screening e vaccini diano i risultati attesi. Se qualcosa non torna, la pubblicazione si ferma.
import { readFileSync } from "node:fs";
globalThis.window = globalThis;
const carica = (f) => new Function(readFileSync(new URL("../" + f, import.meta.url), "utf8"))();
for (const f of ["fonti.js", "contenuti.js", "prevenzione.js", "data.js"]) carica(f);
const F = globalThis.QO_FONTI, Q = globalThis.QO, P = globalThis.QO_PREV;
let ko = 0;
const no = (m) => { console.error("NO  " + m); ko++; };

for (const [k, f] of Object.entries(F)) if (!f.n || !/^https:\/\//.test(f.u)) no(`fonte ${k} incompleta`);
const fonte = (k, dove) => { if (!F[k]) no(`${dove}: fonte «${k}» sconosciuta`); };

Q.ABITUDINI.forEach((a, i) => { if (a.length !== 4 || !a[1] || !a[2]) no(`abitudine ${i} incompleta`); fonte(a[3], `abitudine «${a[1]}»`); });
Q.PRESENZA.forEach((e) => { if (!e[0] || !(e[1] > 0) || !Array.isArray(e[2]) || !e[2].length || !e[3]) no(`esercizio «${e[0]}» incompleto`); });
Q.ALIMENTI.forEach((a) => {
  if (a.length !== 5 || !a[2] || !a[3]) no(`alimento «${a[0]}» incompleto`);
  if (a[4] && !a[4].every((m) => Number.isInteger(m) && m >= 1 && m <= 12)) no(`alimento «${a[0]}»: mesi non validi`);
});
for (let m = 1; m <= 12; m++) if (!Q.ALIMENTI.some((a) => a[4] && a[4].includes(m))) no(`nessun alimento di stagione nel mese ${m}`);
Q.ROUTINE.forEach((r) => { if (!r[1] || !(r[2] > 0) || !r[4].length) no(`routine «${r[1]}» incompleta`); });
Q.MENTE.forEach((s) => { if (!s[1] || !s[3].length) no(`scheda «${s[1]}» incompleta`); fonte(s[4], `scheda «${s[1]}»`); });
Q.GIORNATE.forEach((g) => { if (!(g[0] >= 1 && g[0] <= 12 && g[1] >= 1 && g[1] <= 31)) no(`giornata «${g[2]}»: data non valida`); });
if (Q.DOMANDE.length < 20) no("troppo poche domande");
// Guida: ogni routine ha la sua sessione, ogni esercizio ha figura e istruzioni
for (const [k, e] of Object.entries(Q.ESERCIZI)) {
  if (!e.nome || !Array.isArray(e.pose) || !e.pose.length || !Array.isArray(e.come) || !e.come.length) no(`esercizio guidato «${k}» incompleto`);
  if (!["rip", "ciclo", "tieni"].includes(e.modo)) no(`esercizio guidato «${k}»: modo non valido`);
}
Q.ROUTINE.forEach((r) => {
  const s = Q.SESSIONI[r[0]];
  if (!Array.isArray(s) || !s.length) return no(`routine «${r[1]}» senza sessione guidata`);
  s.forEach((b, i) => {
    if (b.e && !Q.ESERCIZI[b.e]) no(`routine «${r[1]}», blocco ${i + 1}: esercizio «${b.e}» sconosciuto`);
    if (b.e && !(b.rip > 0 && b.ritmo > 0) && !(b.sec > 0) && !(b.tocchi > 0)) no(`routine «${r[1]}», blocco ${i + 1}: manca durata o ripetizioni`);
    if (!b.e && !(b.rec > 0)) no(`routine «${r[1]}», blocco ${i + 1}: vuoto`);
  });
});
const codiceOk = (c) => c === "p" || /^c:\d+$/.test(c) || (/^r:/.test(c) && Q.SESSIONI[c.split(":")[1]] && (!c.split(":")[2] || c.split(":")[2] === "facile"));
if (Q.PRIMI_PASSI.reduce((n, s) => n + s[2].length, 0) !== 28) no("Primi passi: servono 28 giorni");
Q.PRIMI_PASSI.forEach((s) => s[2].forEach((g) => g.forEach((c) => { if (!codiceOk(c)) no(`Primi passi: attività «${c}» non valida`); })));
for (const [t, a] of Object.entries(Q.AZIONI)) {
  if (!Q.ABITUDINI.some((x) => x[1] === t)) no(`azione per «${t}»: abitudine inesistente`);
  if (typeof a === "string" ? !codiceOk(a) : !a.every((b) => b.sec > 0 && (!b.e || Q.ESERCIZI[b.e]))) no(`azione per «${t}» non valida`);
}
Q.PRESENZA.forEach((e) => { if (e[4] && !(e[4].length === 4 && e[4][0] > 0 && e[4][2] > 0)) no(`esercizio «${e[0]}»: ritmo del respiro non valido`); });

const ids = new Set();
for (const v of P.VOCI) {
  if (ids.has(v.id)) no(`voce ripetuta: ${v.id}`); ids.add(v.id);
  fonte(v.fonte, `prevenzione «${v.id}»`);
  for (const p of [{}, { eta: 30, sesso: "F" }, { eta: 70, sesso: "M", nascita: 1956, fumo: "si", forteFumatore: true }]) {
    const e = v.verifica(p, "2026-11-08");
    if (!Array.isArray(e) || !["si", "forse", "no"].includes(e[0]) || !e[1]) no(`${v.id}: esito non valido`);
    const o = v.ogni(p); if (o !== null && !(o > 0)) no(`${v.id}: intervallo non valido`);
  }
}
for (const [p, id, atteso] of P.PROVE) {
  const v = P.VOCI.find((x) => x.id === id);
  const e = v ? v.verifica(p, "2026-11-08")[0] : null;
  console.log(`${e === atteso ? "ok " : "NO "} ${id} per ${JSON.stringify(p)}: ${e} (atteso ${atteso})`);
  if (e !== atteso) ko++;
}
if (P.prossima("2025-03-10", 2) !== "2027-03-10") no("calcolo della prossima scadenza");
if (!Array.isArray(globalThis.QO_DATI?.notizie)) no("data.js non valido");

console.log(`abitudini ${Q.ABITUDINI.length}, esercizi ${Q.PRESENZA.length}, domande ${Q.DOMANDE.length}, alimenti ${Q.ALIMENTI.length}, routine ${Q.ROUTINE.length}, esercizi guidati ${Object.keys(Q.ESERCIZI).length}, voci di prevenzione ${P.VOCI.length} (verificate il ${P.verificate})`);
if (ko) { console.error(`${ko} verifiche non superate`); process.exit(1); }
