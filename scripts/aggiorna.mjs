// Aggiorna data.js con le notizie di salute da fonti ufficiali e stampa affidabile.
// Nessuna intelligenza artificiale e nessuna dipendenza: legge i feed RSS, filtra e salva titoli e link.
// Uso: node scripts/aggiorna.mjs   (Node 20+)

import { readFile, writeFile } from "node:fs/promises";

const FILE = new URL("../data.js", import.meta.url);
const UA = "Mozilla/5.0 (compatible; QuieOra/1.1)";
const log = (...a) => console.log("[aggiorna]", ...a);
const avviso = (m) => console.log("::warning::" + m);
const GIORNO = 864e5;
const MOSTRATE = 6, MAX_UFFICIALI = 4;
const ETA_MAX = { ufficiale: 21, stampa: 7 }; // giorni

// I termini valgono dall'inizio di una parola: "aria" non deve scattare su "sanitaria".
const PREFISSI = "prevenzion|screening|vaccin|alimenta|alimenti|dieta|diete|nutriz|attivit[aà] fisica|sedentar|sonno|insonnia|stress|ansia|depress|salute mentale|benessere|fumo|fumator|tabacc|sigarett|alcol|cardio|ipertension|pressione arteriosa|diabet|tumor|cancro|oncolog|colesterol|ondat[ae] di calore|influenz|arbovirosi|west nile|dengue|morbillo|infezion|antibiotic|allergi|pollin|obesit|sovrappeso|invecchi|anzian|demenz|alzheimer|ictus|infarto|giornata mondiale|stili? di vita|zuccher|intossicaz|sicurezza degli alimenti|sicurezza alimentare";
const ESATTE = "cibo|cibi|movimento|sport|cuore|caldo|freddo|virus|aria|peso|memoria|sale|acqua|pelle|sole";
const UTILE = new RegExp(`(?<![\\p{L}])(?:(?:${PREFISSI})|(?:${ESATTE})(?![\\p{L}]))`, "iu");
const UTILE_EN = /vaccin|immunis|outbreak|influenza|\bRSV\b|ebola|measles|dengue|west nile|antimicrobial|infection/i;
const ESCLUDI = /bando|\bgara\b|concorso|appalto|\bnomin[ae]\b|decreto dirigenziale|delibera|graduatoria|sciopero|indagin|arrest|omicid|incidente stradale|calciomercato|misura compensativa|riconoscimento (della |del )?(qualifica|titolo)|elenchi|medici di bordo|infoday|programma di lavoro|eu4health|veterinar|avviso pubblico|manifestazione di interesse/i;

// Ministero, ISS ed EpiCentro passano da Google News: il Ministero blocca i programmi, ISS ed EpiCentro non hanno un feed proprio.
const gn = (q) => "https://news.google.com/rss/search?q=" + encodeURIComponent(q + " when:21d") + "&hl=it&gl=IT&ceid=IT:it";
const FEED = [
  { fonte: "Ministero della Salute", tipo: "ufficiale", url: gn("site:salute.gov.it"), filtro: UTILE, max: 2 },
  { fonte: "Istituto Superiore di Sanità", tipo: "ufficiale", url: gn("site:iss.it -site:epicentro.iss.it"), filtro: UTILE, max: 2 },
  { fonte: "ISS EpiCentro", tipo: "ufficiale", url: gn("site:epicentro.iss.it"), filtro: UTILE, max: 2 },
  { fonte: "ECDC (in inglese)", tipo: "ufficiale", url: "https://www.ecdc.europa.eu/en/taxonomy/term/1307/feed", filtro: UTILE_EN, max: 1 },
  { fonte: "ANSA Salute", tipo: "stampa", url: "https://www.ansa.it/canale_saluteebenessere/notizie/saluteebenessere_rss.xml", filtro: UTILE, max: 3 },
];

function decode(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;|&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"').replace(/&#(\d+);/g, (_, c) => String.fromCharCode(+c))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}
const breve = (s, max) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(" ", max)).replace(/[,;:.\s]+$/, "") + "…");

async function leggi(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 25000);
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, */*" }, signal: ctl.signal, redirect: "follow" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const xml = await r.text();
    if (!/<rss[\s>]/i.test(xml)) throw new Error("la risposta non è un feed");
    return xml;
  } finally { clearTimeout(t); }
}

function voci(xml) {
  const out = [];
  for (const raw of xml.split(/<item[\s>]/i).slice(1, 80)) {
    const tag = (n) => { const m = raw.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i")); return m ? decode(m[1]) : ""; };
    let titolo = tag("title");
    const link = tag("link");
    const src = tag("source");
    // Google News aggiunge " - Nome sito" al titolo: lo togliamo
    if (src && titolo.endsWith(" - " + src)) titolo = titolo.slice(0, -(src.length + 3)).trim();
    titolo = titolo.replace(/^[\s:;,.\-–]+/, "").replace(/\s+[-–]\s+Ministero della Salute$/i, "");
    const d = new Date(tag("pubDate"));
    // Scarta titoli vuoti, pagine che hanno per titolo il nome del sito e voci senza data
    if (titolo.length < 15 || titolo === src || !/^https:\/\//.test(link) || isNaN(d)) continue;
    out.push({ titolo: breve(titolo, 150), url: link, data: d.toISOString() });
  }
  return out;
}

const recente = (n, tipo, ora) => { const t = Date.parse(n.data); return t <= ora + GIORNO && t >= ora - ETA_MAX[tipo] * GIORNO; };

async function precedente() {
  try { return JSON.parse((await readFile(FILE, "utf8")).match(/window\.QO_DATI = ([\s\S]*);\s*$/)[1]); }
  catch { return { notizie: [] }; }
}

async function main() {
  const ora = Date.now(), prima = await precedente(), stato = {}, tutte = [];
  for (const f of FEED) {
    try {
      const v = voci(await leggi(f.url));
      const buone = v.filter((n) => recente(n, f.tipo, ora) && !ESCLUDI.test(n.titolo) && f.filtro.test(n.titolo));
      log(f.fonte, "ricevute", v.length, "valide", buone.length);
      stato[f.fonte] = buone.length;
      tutte.push(...buone.map((n) => ({ ...n, fonte: f.fonte, tipo: f.tipo })));
    } catch (e) {
      avviso(`${f.fonte}: ${e.message}`);
      stato[f.fonte] = "errore";
      // Se una fonte cade, le sue notizie ancora recenti restano al loro posto
      tutte.push(...(prima.notizie || []).filter((n) => n.fonte === f.fonte && recente(n, f.tipo, ora)));
    }
  }
  if (FEED.every((f) => stato[f.fonte] === "errore")) {
    console.error("[aggiorna] nessun feed raggiungibile: data.js resta com'è");
    process.exit(1);
  }

  // Le cifre non contano: i bollettini successivi cambiano solo i numeri e sono la stessa notizia.
  const visti = new Set(), perFonte = {};
  const scelte = tutte
    .sort((a, b) => b.data.localeCompare(a.data))
    .filter((n) => { const k = n.titolo.toLowerCase().replace(/[^a-zà-ù ]/g, "").replace(/\s+/g, " ").slice(0, 50); if (visti.has(k)) return false; visti.add(k); return true; })
    .filter((n) => { perFonte[n.fonte] = (perFonte[n.fonte] || 0) + 1; return perFonte[n.fonte] <= FEED.find((f) => f.fonte === n.fonte).max; });
  const ufficiali = scelte.filter((n) => n.tipo === "ufficiale").slice(0, MAX_UFFICIALI);
  const notizie = [...ufficiali, ...scelte.filter((n) => n.tipo === "stampa")].slice(0, MOSTRATE);

  if (!notizie.length && (prima.notizie || []).length) { avviso("Nessuna notizia valida: tengo la lista precedente"); return; }
  const out = { aggiornato: new Date(ora).toISOString(), notizie, stato };
  await writeFile(FILE, "/* Notizie del giorno, generate automaticamente dagli script. */\nwindow.QO_DATI = " + JSON.stringify(out, null, 2) + ";\n");
  log("salvate", notizie.length, "notizie");
}

main().catch((e) => { console.error(e); process.exit(1); });
