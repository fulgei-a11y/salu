// Aggiorna data.js con le notizie di salute da fonti istituzionali e testate affidabili.
// Nessuna intelligenza artificiale e nessuna dipendenza: legge i feed RSS, filtra e salva titoli e link.
// Uso: node scripts/aggiorna.mjs   (Node 20+)

import { writeFile } from "node:fs/promises";

const FILE = new URL("../data.js", import.meta.url);
const UA = "Mozilla/5.0 (compatible; QuieOra/1.0)";
const log = (...a) => console.log("[aggiorna]", ...a);

// Ricerche di Google News limitate ai siti istituzionali, più il canale salute dell'ANSA.
const gn = (q) => "https://news.google.com/rss/search?q=" + encodeURIComponent(q + " when:14d") + "&hl=it&gl=IT&ceid=IT:it";
const FEED = [
  ["Ministero della Salute", gn("site:salute.gov.it")],
  ["Istituto Superiore di Sanità", gn("site:iss.it")],
  ["ISS EpiCentro", gn("site:epicentro.iss.it")],
  ["OMS", gn("site:who.int Italia OR salute")],
  ["ANSA Salute", "https://www.ansa.it/canale_saluteebenessere/notizie/saluteebenessere_rss.xml"],
];

// Notizie utili a chi vuole prendersi cura di sé; esclusi temi di cronaca, politica e gare d'appalto.
const UTILE = /prevenzion|screening|vaccin|alimentaz|dieta|cibo|nutriz|attivit[aà] fisica|movimento|sport|sonno|stress|ansia|depress|salute mentale|benessere|fumo|alcol|cuore|pressione|diabete|tumor|cancro|colesterol|caldo|freddo|influenza|virus|allergi|polline|aria|obesit|peso|invecchi|anzian|memoria|demenz|campagna|giornata mondiale|stili di vita|sale|zucchero|acqua|pelle|sole/i;
const ESCLUDI = /bando|gara|concorso|appalto|nomina|decreto dirigenziale|delibera|graduatoria|sciopero|indagin|arrest|omicid|incidente stradale|calciomercato/i;

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
    return await r.text();
  } finally { clearTimeout(t); }
}

function voci(xml, fonte) {
  const out = [];
  for (const raw of xml.split(/<item[\s>]/i).slice(1, 30)) {
    const tag = (n) => { const m = raw.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i")); return m ? decode(m[1]) : ""; };
    let titolo = tag("title");
    const link = tag("link");
    const src = tag("source");
    // Google News aggiunge " - Nome sito" al titolo: lo togliamo e usiamo il nome come fonte
    if (src && titolo.endsWith(" - " + src)) titolo = titolo.slice(0, -(src.length + 3));
    const d = new Date(tag("pubDate"));
    if (!titolo || !/^https:\/\//.test(link)) continue;
    out.push({ titolo: breve(titolo, 150), url: link, fonte: src && fonte !== "ANSA Salute" ? src : fonte, data: isNaN(d) ? null : d.toISOString() });
  }
  return out;
}

async function main() {
  const tutte = [];
  for (const [fonte, url] of FEED) {
    try { const v = voci(await leggi(url), fonte); log(fonte, v.length); tutte.push(...v); }
    catch (e) { log("ATTENZIONE", fonte, e.message); }
  }
  const limite = Date.now() - 14 * 864e5, visti = new Set(), perFonte = {};
  const notizie = tutte
    .filter((n) => !n.data || Date.parse(n.data) >= limite)
    .filter((n) => UTILE.test(n.titolo) && !ESCLUDI.test(n.titolo))
    .sort((a, b) => (b.data || "").localeCompare(a.data || ""))
    .filter((n) => { const k = n.titolo.toLowerCase().replace(/[^a-zà-ù0-9 ]/g, "").slice(0, 60); if (visti.has(k)) return false; visti.add(k); return true; })
    .filter((n) => { perFonte[n.fonte] = (perFonte[n.fonte] || 0) + 1; return perFonte[n.fonte] <= 3; })
    .slice(0, 8);
  if (!notizie.length && tutte.length === 0) { log("nessun feed raggiungibile: data.js resta com'è"); return; }
  const out = { aggiornato: new Date().toISOString(), notizie };
  await writeFile(FILE, "/* Notizie del giorno, generate automaticamente dagli script. */\nwindow.QO_DATI = " + JSON.stringify(out, null, 2) + ";\n");
  log("salvate", notizie.length, "notizie");
}

main().catch((e) => { console.error(e); process.exit(1); });
