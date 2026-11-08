/* Prevenzione: screening, vaccini e controlli per età e sesso, secondo i programmi del Servizio sanitario nazionale.
   Le Regioni possono allargare le fasce d'età: per questo alcune voci risultano «forse».
   Ogni voce ha: id, gruppo, nome, esame, ogni (anni tra un controllo e l'altro, null se non periodico),
   gratuito, fonte e una funzione che dato il profilo restituisce [esito, spiegazione]; esito è "si", "forse" o "no".
   Profilo: { eta: numero, sesso: "F" | "M" | null, nascita: anno, fumo: "mai" | "ex" | "si", forteFumatore: bool }. */
(function (root) {
  "use strict";
  var VERIFICATE = "8 novembre 2026";
  var HCV_FINE = "2026-12-31"; // proroga dello screening gratuito per i nati 1969-1989

  function tra(e, a, b) { return e != null && e >= a && e <= b; }

  var VOCI = [
    {
      id: "cervice", gruppo: "Screening oncologici", nome: "Tumore del collo dell'utero",
      esame: "Pap test ogni 3 anni dai 25 ai 29 anni; test HPV ogni 5 anni dai 30 ai 64",
      gratuito: true, fonte: "epi_screen",
      ogni: function (p) { return p.eta != null && p.eta < 30 ? 3 : 5; },
      verifica: function (p) {
        if (p.sesso === "M") return ["no", "Riguarda le donne."];
        if (tra(p.eta, 25, 29)) return ["si", "Ti spetta il Pap test gratuito ogni 3 anni. Arriva una lettera dell'ASL; se non l'hai ricevuta, chiama il centro screening."];
        if (tra(p.eta, 30, 64)) return ["si", "Ti spetta il test HPV gratuito ogni 5 anni. Se sei vaccinata contro l'HPV entro i 15 anni, il primo test arriva a 30 anni."];
        if (p.sesso == null && tra(p.eta, 25, 64)) return ["forse", "Per le donne dai 25 ai 64 anni."];
        return ["no", "Il programma riguarda le donne dai 25 ai 64 anni."];
      }
    },
    {
      id: "mammella", gruppo: "Screening oncologici", nome: "Tumore del seno",
      esame: "Mammografia ogni 2 anni dai 50 ai 69 anni; molte Regioni la offrono dai 45 ai 74",
      gratuito: true, fonte: "epi_screen",
      ogni: function (p) { return p.eta != null && p.eta < 50 ? 1 : 2; },
      verifica: function (p) {
        if (p.sesso === "M") return ["no", "Il programma riguarda le donne."];
        if (tra(p.eta, 50, 69)) return ["si", "Ti spetta la mammografia gratuita ogni 2 anni."];
        if (tra(p.eta, 45, 49)) return ["forse", "In diverse Regioni la mammografia è offerta ogni anno già dai 45 anni: chiedi al centro screening della tua ASL."];
        if (tra(p.eta, 70, 74)) return ["forse", "In diverse Regioni lo screening continua fino a 74 anni: chiedi al centro screening della tua ASL."];
        return ["no", "Il programma riguarda le donne dai 50 ai 69 anni (in alcune Regioni dai 45 ai 74)."];
      }
    },
    {
      id: "colon", gruppo: "Screening oncologici", nome: "Tumore del colon-retto",
      esame: "Test del sangue occulto nelle feci ogni 2 anni dai 50 ai 69 anni, da fare a casa",
      gratuito: true, fonte: "epi_screen",
      ogni: function () { return 2; },
      verifica: function (p) {
        if (tra(p.eta, 50, 69)) return ["si", "Ti spetta il test del sangue occulto gratuito ogni 2 anni: si ritira in farmacia o al centro screening e si fa a casa."];
        if (tra(p.eta, 70, 74)) return ["forse", "Alcune Regioni estendono lo screening fino a 74 anni: chiedi alla tua ASL."];
        return ["no", "Il programma riguarda donne e uomini dai 50 ai 69 anni (in alcune Regioni fino a 74). Con familiarità per questo tumore, chiedi al medico se anticipare."];
      }
    },
    {
      id: "polmone", gruppo: "Screening oncologici", nome: "Tumore del polmone (forti fumatori)",
      esame: "TAC del torace a basso dosaggio nel programma RISP, con percorso per smettere di fumare",
      gratuito: true, fonte: "risp",
      ogni: function () { return null; },
      verifica: function (p) {
        if (p.fumo === "mai") return ["no", "Riguarda fumatori ed ex fumatori forti."];
        if (tra(p.eta, 55, 75) && p.forteFumatore && p.fumo !== "mai") return ["forse", "Hai i requisiti di base del programma pilota RISP: posti limitati in circa 18 centri. Informati sul sito del programma o con il medico."];
        if (tra(p.eta, 55, 75) && p.fumo) return ["forse", "Il programma RISP è per chi ha fumato molto (in genere un pacchetto al giorno per 30 anni) e ha smesso da meno di 15 anni o fuma ancora."];
        return ["no", "Il programma pilota RISP riguarda forti fumatori ed ex fumatori dai 55 ai 75 anni."];
      }
    },
    {
      id: "hcv", gruppo: "Altri screening", nome: "Epatite C",
      esame: "Un prelievo di sangue, una volta nella vita, senza ricetta",
      gratuito: true, fonte: "hcv", unaVolta: true,
      ogni: function () { return null; },
      verifica: function (p, oggi) {
        if (p.nascita == null) return ["forse", "Gratuito per i nati dal 1969 al 1989."];
        if (p.nascita >= 1969 && p.nascita <= 1989) {
          if (oggi && oggi > HCV_FINE) return ["forse", "Lo screening gratuito era previsto fino al 31 dicembre 2026: verifica con la tua ASL se è stato prorogato."];
          return ["si", "Sei nato tra il 1969 e il 1989: il test è gratuito e senza ricetta fino al 31 dicembre 2026. L'epatite C spesso non dà sintomi e oggi si cura."];
        }
        return ["no", "Lo screening gratuito riguarda i nati dal 1969 al 1989. Se pensi di essere stato esposto, chiedi il test al medico."];
      }
    },
    {
      id: "influenza", gruppo: "Vaccinazioni", nome: "Influenza",
      esame: "Vaccino ogni autunno, da ottobre",
      gratuito: true, fonte: "vacc",
      ogni: function () { return 1; },
      verifica: function (p) {
        if (p.eta != null && p.eta >= 60) return ["si", "Dai 60 anni il vaccino antinfluenzale è gratuito ogni anno: dal medico di famiglia, in farmacia o all'ASL."];
        return ["forse", "Gratuito anche sotto i 60 anni per chi ha malattie croniche, in gravidanza o per alcuni lavori: chiedi al medico."];
      }
    },
    {
      id: "tetano", gruppo: "Vaccinazioni", nome: "Tetano, difterite e pertosse",
      esame: "Richiamo ogni 10 anni",
      gratuito: true, fonte: "vacc",
      ogni: function () { return 10; },
      verifica: function () { return ["si", "Il richiamo è raccomandato a tutti gli adulti ogni 10 anni ed è gratuito."]; }
    },
    {
      id: "pneumo", gruppo: "Vaccinazioni", nome: "Pneumococco",
      esame: "Vaccino contro la principale causa batterica di polmonite",
      gratuito: true, fonte: "vacc", unaVolta: true,
      ogni: function () { return null; },
      verifica: function (p) {
        if (p.eta != null && p.eta >= 65) return ["si", "Offerto gratuitamente dai 65 anni (in alcune Regioni prima)."];
        if (p.eta != null && p.eta >= 60) return ["forse", "Alcune Regioni lo offrono già dai 60 anni; prima, per chi ha malattie croniche."];
        return ["forse", "Gratuito per chi ha alcune malattie croniche: chiedi al medico."];
      }
    },
    {
      id: "zoster", gruppo: "Vaccinazioni", nome: "Herpes zoster (fuoco di Sant'Antonio)",
      esame: "Vaccino che riduce il rischio di zoster e del dolore che può lasciare",
      gratuito: true, fonte: "vacc", unaVolta: true,
      ogni: function () { return null; },
      verifica: function (p) {
        if (p.eta != null && p.eta >= 65) return ["si", "Offerto gratuitamente dai 65 anni."];
        return ["forse", "Gratuito prima dei 65 anni per alcune condizioni di rischio: chiedi al medico."];
      }
    },
    {
      id: "pressione", gruppo: "Controlli", nome: "Pressione arteriosa",
      esame: "Misurazione dal medico, in farmacia o a casa con un apparecchio validato",
      gratuito: false, fonte: "issalute",
      ogni: function (p) { return p.eta != null && p.eta >= 40 ? 1 : 3; },
      verifica: function (p) {
        if (p.eta != null && p.eta >= 40) return ["si", "Dopo i 40 anni almeno una volta l'anno. La pressione alta di solito non dà sintomi."];
        return ["si", "Prima dei 40 anni almeno ogni 3 anni, più spesso se è al limite o hai familiarità."];
      }
    },
    {
      id: "sangue", gruppo: "Controlli", nome: "Colesterolo e glicemia",
      esame: "Esami del sangue su richiesta del medico di famiglia",
      gratuito: false, fonte: "issalute",
      ogni: function () { return null; },
      verifica: function (p) {
        if (p.eta != null && p.eta >= 40) return ["si", "Chiedi al medico ogni quanto controllarli: dipende dai tuoi valori e dal rischio cardiovascolare."];
        return ["forse", "Prima dei 40 anni, se hai familiarità, sovrappeso o altri fattori di rischio."];
      }
    },
    {
      id: "occhi", gruppo: "Controlli", nome: "Vista e glaucoma",
      esame: "Visita oculistica con misura della pressione dell'occhio",
      gratuito: false, fonte: "issalute",
      ogni: function () { return 2; },
      verifica: function (p) {
        if (p.eta != null && p.eta >= 40) return ["si", "Dopo i 40 anni una visita ogni 1-2 anni: il glaucoma all'inizio non dà sintomi."];
        return ["forse", "Se hai disturbi della vista o familiarità per il glaucoma."];
      }
    },
    {
      id: "denti", gruppo: "Controlli", nome: "Dentista e igiene orale",
      esame: "Visita e pulizia professionale",
      gratuito: false, fonte: "issalute",
      ogni: function () { return 1; },
      verifica: function () { return ["si", "Una visita all'anno aiuta a prevenire carie e malattie delle gengive."]; }
    },
    {
      id: "pelle", gruppo: "Controlli", nome: "Nei e pelle",
      esame: "Autoesame una volta al mese; visita dermatologica se hai molti nei o familiarità",
      gratuito: false, fonte: "codice_ue",
      ogni: function () { return null; },
      verifica: function () { return ["si", "Guarda la pelle una volta al mese. Mostra al medico i nei che cambiano o le macchie nuove."]; }
    },
    {
      id: "prostata", gruppo: "Controlli", nome: "Prostata",
      esame: "In Italia non c'è uno screening nazionale: il PSA si decide con il medico",
      gratuito: false, fonte: "issalute",
      ogni: function () { return null; },
      verifica: function (p) {
        if (p.sesso === "F") return ["no", "Riguarda gli uomini."];
        if (tra(p.eta, 50, 70) && p.sesso === "M") return ["forse", "Parla con il medico dei vantaggi e dei limiti del PSA. Alcune Regioni stanno sperimentando programmi organizzati."];
        return ["no", "Se hai disturbi urinari o familiarità, parlane con il medico."];
      }
    }
  ];

  // Prossima scadenza: data dell'ultimo controllo + anni dell'intervallo (formato AAAA-MM-GG)
  function prossima(ultimo, anni) {
    if (!ultimo || !anni) return null;
    var d = new Date(ultimo + "T12:00:00");
    if (isNaN(d)) return null;
    d.setFullYear(d.getFullYear() + anni);
    return d.toISOString().slice(0, 10);
  }

  // Casi di prova controllati da scripts/verifica.mjs
  var PROVE = [
    [{ eta: 27, sesso: "F" }, "cervice", "si"],
    [{ eta: 35, sesso: "F" }, "cervice", "si"],
    [{ eta: 35, sesso: "M" }, "cervice", "no"],
    [{ eta: 55, sesso: "F" }, "mammella", "si"],
    [{ eta: 46, sesso: "F" }, "mammella", "forse"],
    [{ eta: 80, sesso: "F" }, "mammella", "no"],
    [{ eta: 60, sesso: "M" }, "colon", "si"],
    [{ eta: 40, sesso: "M" }, "colon", "no"],
    [{ eta: 60, sesso: "M", fumo: "si", forteFumatore: true }, "polmone", "forse"],
    [{ eta: 60, sesso: "M", fumo: "mai" }, "polmone", "no"],
    [{ eta: 50, nascita: 1976 }, "hcv", "si"],
    [{ eta: 70, nascita: 1956 }, "hcv", "no"],
    [{ eta: 66 }, "influenza", "si"],
    [{ eta: 66 }, "zoster", "si"],
    [{ eta: 30, sesso: "M" }, "prostata", "no"]
  ];

  root.QO_PREV = { VOCI: VOCI, PROVE: PROVE, prossima: prossima, verificate: VERIFICATE, hcvFine: HCV_FINE };
})(typeof window !== "undefined" ? window : globalThis);
