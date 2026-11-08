// Imposta la password del sito al momento della pubblicazione.
// Se nei segreti di GitHub c'è SITO_PASSWORD, nel file indicato (di solito _site/index.html)
// l'impronta della password predefinita viene sostituita con quella della nuova.
// La password vera non finisce mai nel codice, nei commit o sul sito: solo la sua impronta.
import { readFileSync, writeFileSync } from "node:fs";
import { pbkdf2Sync } from "node:crypto";

const file = process.argv[2] || "_site/index.html";
const pw = (process.env.SITO_PASSWORD || "").trim();
if (!pw) { console.log("Password: nessun segreto SITO_PASSWORD, resta quella predefinita."); process.exit(0); }
const giri = 200000;
// Sale fisso: l'impronta resta uguale a ogni pubblicazione e chi è già entrato non deve riscrivere la password.
const sale = "029d3d7df9772170179134c2194cbbc3";
const impronta = pbkdf2Sync(pw, Buffer.from(sale, "hex"), giri, 32, "sha256").toString("hex");
const html = readFileSync(file, "utf8");
const re = /var QO_ACCESSO = \{[^}]*\};/;
if (!re.test(html)) { console.error("Password: impostazione QO_ACCESSO non trovata in " + file); process.exit(1); }
writeFileSync(file, html.replace(re, `var QO_ACCESSO = { sale: "${sale}", impronta: "${impronta}", giri: ${giri} };`));
console.log("Password: impostata quella del segreto SITO_PASSWORD.");
