/* Contenuti di "Qui e Ora". Ogni giorno l'app ne sceglie alcuni a rotazione.
   Testi scritti per persone senza formazione sanitaria; ogni voce indica la fonte (chiavi di fonti.js).
   Non sostituiscono il medico: servono a ricordare, capire e fare un passo in più. */
(function () {
  "use strict";

  // Abitudini del giorno: [area, titolo, testo, fonte]
  var ABITUDINI = [
    ["movimento", "Spezza la sedia", "Stare seduti a lungo pesa sulla salute anche se fai sport. Ogni 30-60 minuti alzati, cammina per la stanza, sali una rampa di scale: bastano due minuti.", "oms_att"],
    ["movimento", "150 minuti alla settimana", "L'OMS raccomanda agli adulti almeno 150-300 minuti a settimana di attività moderata, come la camminata veloce. Sono circa 30 minuti per cinque giorni, anche spezzati in tratti da 10.", "oms_att"],
    ["movimento", "Due giorni di forza", "Almeno due volte a settimana fai esercizi che impegnano i muscoli: alzarsi dalla sedia senza mani, piegamenti al muro, salire gradini. I muscoli forti proteggono ossa, articolazioni e autonomia.", "oms_att"],
    ["movimento", "Ogni passo conta", "Non serve una palestra: la scala al posto dell'ascensore, una fermata a piedi, la telefonata camminando. Qualsiasi movimento è meglio di nessuno, e se ne fai poco i benefici arrivano presto.", "oms_att"],
    ["movimento", "L'equilibrio si allena", "Dopo i 65 anni l'OMS consiglia esercizi di equilibrio almeno tre giorni a settimana. Stare su un piede vicino a un appoggio mentre lavi i denti è già un buon inizio.", "oms_att"],
    ["movimento", "Il fiato giusto", "Attività moderata vuol dire che puoi parlare ma non cantare. Se riesci a dire solo poche parole senza fermarti, stai facendo attività intensa: vale circa il doppio.", "epi_att"],
    ["movimento", "All'aperto quando puoi", "Camminare nel verde unisce movimento, luce naturale e calma. La luce del mattino aiuta anche l'orologio interno e il sonno della sera.", "issalute"],
    ["cibo", "Metà piatto di verdura", "Riempi metà piatto di verdura e frutta, un quarto di cereali possibilmente integrali, un quarto di proteine come legumi, pesce, uova. Il condimento è l'olio extravergine.", "crea"],
    ["cibo", "Cinque porzioni", "L'OMS indica almeno 400 grammi al giorno di frutta e verdura, circa cinque porzioni. Variare i colori vuol dire variare vitamine, minerali e fibre.", "oms_dieta"],
    ["cibo", "Meno di un cucchiaino di sale", "L'OMS consiglia meno di 5 grammi di sale al giorno, un cucchiaino raso, contando anche quello nascosto in pane, formaggi, salumi e piatti pronti. Erbe, spezie e limone danno sapore al posto suo.", "oms_sale"],
    ["cibo", "Gli zuccheri nascosti", "Bibite, succhi, merendine e yogurt zuccherati sono le fonti principali di zuccheri liberi. L'OMS raccomanda di stare sotto il 10% delle calorie, meglio sotto il 5%: l'acqua resta la bevanda migliore.", "oms_dieta"],
    ["cibo", "Legumi più volte a settimana", "Ceci, lenticchie, fagioli e piselli danno proteine, fibre e ferro con pochi grassi. Insieme a pasta o pane fanno un piatto unico completo, come nella tradizione mediterranea.", "crea"],
    ["cibo", "Integrale è meglio", "Pane, pasta e riso integrali saziano di più e danno più fibra, che aiuta l'intestino e il controllo della glicemia. Puoi iniziare alternandoli a quelli raffinati.", "crea"],
    ["cibo", "L'olio buono, a crudo", "L'olio extravergine d'oliva è il grasso di riferimento della dieta mediterranea. Burro, panna e grassi delle carni lavorate vanno tenuti al minimo.", "crea"],
    ["cibo", "Pesce, anche quello azzurro", "Alici, sardine e sgombri sono economici e ricchi di grassi omega-3. Portare il pesce in tavola almeno due volte a settimana è una buona abitudine.", "crea"],
    ["cibo", "Carni lavorate, il meno possibile", "Salumi, würstel e carni conservate sono legati a un rischio più alto di tumore del colon. Il Codice europeo contro il cancro consiglia di limitare la carne rossa ed evitare quella lavorata.", "codice_ue"],
    ["cibo", "Una manciata di frutta secca", "Noci, mandorle e nocciole al naturale, circa 30 grammi, sono uno spuntino sano. Meglio senza sale e senza zucchero aggiunto.", "crea"],
    ["cibo", "Bere senza aspettare la sete", "Molti adulti hanno bisogno di circa 1,5-2 litri di liquidi al giorno, di più quando fa caldo o ci si muove. Tieni una bottiglia a vista: aiuta a ricordarsene, soprattutto da anziani, quando la sete si sente meno.", "crea"],
    ["cibo", "Alcol: meno è meglio", "Per l'OMS non esiste una quantità di alcol sicura per la salute: anche poco aumenta il rischio di alcuni tumori. Se bevi, riduci; se non bevi, non iniziare.", "oms_alcol"],
    ["cibo", "La colazione che regge", "Una colazione con un cereale integrale, un frutto e una fonte di proteine (yogurt bianco, latte, uova) aiuta ad arrivare a pranzo senza attacchi di fame.", "crea"],
    ["cibo", "Mangiare lentamente", "Il senso di sazietà arriva dopo circa venti minuti. Posare la forchetta tra un boccone e l'altro aiuta a mangiare il giusto e a godersi il cibo.", "issalute"],
    ["cibo", "Leggi l'etichetta", "Gli ingredienti sono elencati dal più abbondante al meno abbondante. Se lo zucchero o il sale compaiono tra i primi, quel prodotto è da occasionale.", "min"],
    ["sonno", "Ore che contano", "La maggior parte degli adulti ha bisogno di 7-9 ore di sonno. Dormire poco in modo abituale pesa su umore, memoria, pressione e appetito.", "issalute"],
    ["sonno", "Stessi orari, anche nel weekend", "Andare a letto e alzarsi più o meno alla stessa ora regola l'orologio biologico. È il consiglio più semplice e uno dei più efficaci per dormire meglio.", "issalute"],
    ["sonno", "Schermi lontani dal cuscino", "Luce e stimoli dello smartphone tengono la mente sveglia. Prova a spegnere gli schermi mezz'ora prima di dormire e a lasciare il telefono fuori dalla camera.", "issalute"],
    ["sonno", "Caffè entro il primo pomeriggio", "La caffeina resta in circolo per ore. Se dormi male, sposta l'ultimo caffè o tè prima delle 15 e osserva la differenza.", "issalute"],
    ["sonno", "La camera fresca e buia", "Una stanza fresca, buia e silenziosa favorisce il sonno profondo. Il letto è per dormire: se non prendi sonno dopo 20 minuti, alzati e torna quando hai sonno.", "issalute"],
    ["mente", "Nominare quello che senti", "Dire a te stesso «sto provando preoccupazione» invece di lasciarti trascinare aiuta a prendere distanza. È una delle abilità proposte dalla guida OMS sullo stress.", "oms_stress"],
    ["mente", "Torna a ciò che conta", "Nei momenti difficili chiediti: che persona voglio essere oggi, in questa situazione? Un piccolo gesto coerente con i tuoi valori dà direzione anche quando non puoi cambiare le cose.", "oms_stress"],
    ["mente", "Gentilezza verso te", "Parlati come parleresti a un amico in difficoltà. L'autocritica dura non motiva, stanca. Riconoscere la fatica è il primo passo per prendersene cura.", "oms_stress"],
    ["mente", "Una cosa piacevole al giorno", "Quando l'umore è basso si tende a rinunciare a tutto, e l'umore scende ancora. Programma una piccola attività piacevole o utile ogni giorno, anche se non ne hai voglia.", "nhs_emm"],
    ["mente", "Le persone sono salute", "Le relazioni proteggono il benessere quanto molte abitudini fisiche. Una telefonata, un caffè insieme, un messaggio sincero: coltivale come coltivi il corpo.", "oms_mente"],
    ["mente", "Notizie a piccole dosi", "Restare informati è giusto, ma scorrere notizie per ore alimenta ansia. Scegli uno o due momenti al giorno e fonti affidabili.", "oms_stress"],
    ["mente", "Chiedere aiuto è forza", "Se tristezza, ansia o insonnia durano più di due settimane e ti impediscono di vivere come vorresti, parlane con il medico di famiglia. Si curano, e prima si interviene meglio è.", "oms_mente"],
    ["mente", "Tre cose belle", "La sera scrivi tre cose andate bene, anche piccole, e perché. È un esercizio semplice che, fatto con costanza, sposta l'attenzione su ciò che nutre.", "nhs_emm"],
    ["mente", "Una cosa per volta", "Fare tante cose insieme dà l'impressione di essere efficienti ma aumenta errori e stanchezza. Scegli un compito, chiudi le altre finestre, e torna al successivo dopo.", "nhs_emm"],
    ["prevenzione", "La lettera dell'ASL", "Se ricevi l'invito per uno screening, non metterlo da parte: è gratuito, già prenotato e pensato per la tua età. Se l'orario non va bene, chiama e cambialo.", "epi_screen"],
    ["prevenzione", "La pressione non si sente", "La pressione alta spesso non dà sintomi ma affatica cuore, cervello e reni. Fattela misurare dal medico o in farmacia: dopo i 40 anni almeno una volta l'anno.", "issalute"],
    ["prevenzione", "Conosci i tuoi nei", "Una volta al mese guarda la pelle, anche con uno specchio. Un neo che cambia forma, colore o dimensione, o che sanguina, va mostrato al medico.", "codice_ue"],
    ["prevenzione", "Sole: UV dal 3 in su", "Quando l'indice UV è 3 o più servono cappello, occhiali, crema e ombra nelle ore centrali. Le scottature, soprattutto da giovani, aumentano il rischio di tumori della pelle.", "codice_ue"],
    ["prevenzione", "Smettere di fumare conviene sempre", "Smettere a qualsiasi età porta benefici: dopo pochi mesi respiri meglio, dopo un anno il rischio di infarto scende molto. Il medico e i centri antifumo dell'ASL aiutano gratis.", "oms_fumo"],
    ["prevenzione", "I vaccini anche da adulti", "Antitetanica ogni 10 anni, antinfluenzale ogni autunno dai 60 anni, pneumococco e Herpes zoster intorno ai 65: chiedi al medico quali ti spettano gratis.", "vacc"],
    ["prevenzione", "Il girovita racconta", "La circonferenza della vita misura il grasso sull'addome, il più legato a diabete e malattie del cuore. Misurala all'altezza dell'ombelico, una volta al mese.", "issalute"],
    ["prevenzione", "Denti, due volte al giorno", "Lava i denti almeno due volte al giorno per due minuti e usa filo o scovolino. Una visita dal dentista all'anno previene problemi che poi costano molto di più.", "issalute"],
    ["prevenzione", "Le mani, il primo vaccino", "Lavare le mani con acqua e sapone per circa 40 secondi, prima di mangiare e dopo i mezzi pubblici, riduce molte infezioni.", "min"],
    ["prevenzione", "Il medico di famiglia è il tuo alleato", "Prepara le domande prima della visita, porta la lista dei farmaci che prendi e chiedi quali controlli sono adatti a te. È il punto di partenza di ogni percorso di prevenzione.", "min"],
    ["corpo", "Respira con la pancia", "Lo stress fa respirare corto e alto. Qualche respiro lento in cui si muove la pancia, con l'espirazione più lunga dell'inspirazione, calma il corpo in pochi minuti.", "oms_stress"],
    ["corpo", "Gli occhi hanno bisogno di lontano", "Davanti allo schermo, ogni 20 minuti guarda per 20 secondi qualcosa di lontano. Gli occhi si rilassano e si riduce la secchezza.", "issalute"],
    ["corpo", "Postura: cambia spesso", "Non esiste una postura perfetta da tenere per ore: la migliore è la prossima. Cambia posizione, sgranchisci spalle e collo, alzati.", "epi_att"],
    ["corpo", "Ascolta i segnali", "Stanchezza che non passa, perdita di peso senza motivo, sangue nelle feci, tosse che dura settimane: non sono cose da rimandare. Parlane con il medico.", "issalute"],
    ["relazioni", "Un grazie in più", "Ringraziare qualcuno in modo concreto, dicendo cosa ha fatto e cosa ha significato per te, fa bene a chi lo riceve e a chi lo dice.", "nhs_emm"],
    ["relazioni", "Ascoltare davvero", "Oggi, in una conversazione, prova ad ascoltare senza preparare la risposta. Lascia il telefono in tasca e guarda la persona.", "oms_mente"],
    ["relazioni", "Fare qualcosa per gli altri", "Aiutare, fare volontariato o anche un piccolo favore dà senso e allontana l'isolamento. È uno dei «cinque passi per il benessere» proposti dal servizio sanitario inglese.", "nhs_emm"]
  ];

  // Esercizi di presenza, da 1 a 5 minuti: [titolo, minuti, passi[], perché, ritmo del respiro facoltativo [inspira, pausa, espira, pausa]]
  var PRESENZA = [
    ["Cinque, quattro, tre, due, uno", 2, ["Nota 5 cose che vedi.", "Nota 4 cose che puoi toccare: senti la loro consistenza.", "Nota 3 suoni.", "Nota 2 odori.", "Nota 1 sapore, o semplicemente com'è la tua bocca adesso."], "Usare i sensi riporta l'attenzione al presente quando la mente corre avanti o indietro."],
    ["Il respiro lungo", 2, ["Siediti comodo, piedi a terra.", "Inspira dal naso contando fino a 4.", "Espira piano dalla bocca contando fino a 6.", "Ripeti per dieci respiri, senza forzare."], "Un'espirazione più lunga dell'inspirazione aiuta il corpo a passare dalla modalità allarme a quella di recupero.", [4, 0, 6, 0]],
    ["Gettare l'àncora", 3, ["Nota i pensieri e le emozioni che ci sono, senza cacciarli.", "Ora senti i piedi che premono a terra e la schiena sulla sedia.", "Allunga le braccia, muovi le dita, raddrizza la schiena.", "Guarda intorno: dove sei, cosa stai facendo, chi c'è con te?"], "È l'esercizio di «radicamento» della guida OMS sullo stress: non elimina la tempesta, ma ti tiene saldo mentre passa."],
    ["Fermati (STOP)", 1, ["Smetti per un attimo quello che stai facendo.", "Fai un respiro consapevole.", "Osserva: cosa provi nel corpo, cosa pensi, cosa senti?", "Riprendi l'attività scegliendo come farla."], "Un minuto di pausa tra stimolo e reazione restituisce libertà di scelta."],
    ["La scansione del corpo", 5, ["Chiudi gli occhi o abbassa lo sguardo.", "Porta l'attenzione ai piedi, poi alle gambe, al bacino, alla pancia.", "Sali a petto, schiena, spalle, braccia e mani.", "Arriva a collo, viso e testa.", "Dove trovi tensione, respira lì e lascia andare un poco."], "Ascoltare il corpo zona per zona aiuta a riconoscere dove si accumula lo stress."],
    ["Un sorso consapevole", 1, ["Prendi un bicchiere d'acqua o una tazza di tè.", "Guarda il colore e senti la temperatura nelle mani.", "Bevi un sorso lentamente, sentendolo scendere.", "Nota cosa cambia dopo."], "Anche un gesto quotidiano può diventare un momento di presenza."],
    ["Il primo boccone", 2, ["Prima di mangiare, guarda il piatto: colori, forme, profumo.", "Prendi il primo boccone e posa la forchetta.", "Mastica con calma e senti il sapore cambiare.", "Ripeti per i primi tre bocconi."], "Mangiare con attenzione aiuta a riconoscere la sazietà e a godersi il cibo."],
    ["Camminare sapendo di camminare", 5, ["Cammina un po' più lentamente del solito.", "Senti il tallone che appoggia, il piede che rulla, la spinta delle dita.", "Coordina, se ti viene naturale, i passi con il respiro.", "Quando la mente scappa, torna ai piedi."], "Trasforma un tragitto qualsiasi in una pausa per la mente."],
    ["Ascoltare i suoni", 2, ["Chiudi gli occhi.", "Ascolta i suoni più lontani.", "Poi quelli vicini, nella stanza.", "Infine i suoni del tuo corpo, il respiro."], "I suoni arrivano sempre nel presente: sono un'àncora facile da usare ovunque."],
    ["Le mani calde", 1, ["Strofina le mani per qualche secondo.", "Appoggiale sul petto o sulla pancia.", "Senti il calore e il movimento del respiro.", "Di' a te stesso: «adesso ci sono io per me»."], "Il contatto gentile attiva una risposta di calma e sicurezza."],
    ["Tre respiri prima di rispondere", 1, ["Prima di aprire una email o un messaggio difficile, fermati.", "Fai tre respiri lenti.", "Chiediti: cosa voglio ottenere con la mia risposta?", "Poi scrivi."], "Un piccolo spazio prima di reagire evita parole di cui pentirsi."],
    ["Notare e nominare", 2, ["Quando arriva un pensiero difficile, nota che è un pensiero.", "Dagli un nome: «ecco la preoccupazione», «ecco il giudizio».", "Lascialo stare senza discuterci.", "Torna a ciò che stavi facendo."], "È l'abilità di «sganciarsi» proposta dall'OMS: i pensieri restano, ma ti trascinano di meno."],
    ["La finestra", 2, ["Guarda fuori da una finestra.", "Osserva il cielo, la luce, le forme.", "Nota qualcosa che non avevi mai notato.", "Respira lentamente mentre guardi."], "Lo sguardo lontano riposa occhi e mente."],
    ["Lo spazio di tre minuti", 3, ["Primo minuto: chiediti cosa c'è adesso (pensieri, emozioni, sensazioni).", "Secondo minuto: porta tutta l'attenzione al respiro.", "Terzo minuto: allarga l'attenzione a tutto il corpo, come se respirasse intero."], "È una pratica breve dei programmi di mindfulness studiati in ambito clinico."],
    ["Gratitudine adesso", 1, ["Pensa a una cosa di questo momento che va bene.", "Può essere minima: una sedia comoda, la luce, un respiro facile.", "Restaci per qualche secondo."], "Allenare l'attenzione a ciò che funziona bilancia la tendenza a vedere solo i problemi."],
    ["Il corpo che si allunga", 2, ["In piedi, alza le braccia sopra la testa inspirando.", "Espirando lasciale scendere lentamente.", "Ruota piano le spalle avanti e indietro.", "Inclina la testa a destra e a sinistra, senza fretta."], "Muovere il corpo con attenzione scioglie tensioni e risveglia l'energia."],
    ["Il gesto lento", 1, ["Scegli un gesto che fai di solito in fretta: aprire una porta, lavarti le mani.", "Fallo a metà velocità.", "Senti ogni parte del gesto."], "Rallentare un gesto ricorda alla mente che non deve correre sempre."],
    ["Fare spazio all'emozione", 3, ["Nota dove senti l'emozione nel corpo.", "Respira come se il respiro andasse proprio lì, attorno a quella sensazione.", "Lasciale spazio, senza volerla cambiare.", "Osserva se nel tempo cambia da sola."], "Lottare contro un'emozione spesso la rinforza; farle spazio la rende più sopportabile."],
    ["Il saluto alla giornata", 2, ["Appena sveglio, prima del telefono, siediti sul letto.", "Fai tre respiri lenti.", "Chiediti: come sto stamattina?", "Scegli un'intenzione per oggi, in una parola."], "Iniziare la giornata da te, e non dalle notifiche, cambia il tono di tutto il resto."],
    ["Chiudere la giornata", 3, ["Prima di dormire, siediti o sdraiati.", "Ripassa la giornata come un film, senza giudicare.", "Nota un momento bello e uno difficile.", "Lascia andare entrambi con un'espirazione lunga."], "Chiudere consapevolmente la giornata aiuta la mente a non portarsi il carico nel sonno."],
    ["Contare i respiri", 2, ["Conta ogni espirazione: uno, due, tre... fino a dieci.", "Poi ricomincia da uno.", "Se perdi il conto, sorridi e riparti da uno."], "Perdere il conto non è un errore: accorgersene è l'esercizio."],
    ["I piedi a terra", 1, ["Togli le scarpe se puoi.", "Premi piano i piedi a terra.", "Senti il pavimento che ti sostiene.", "Respira e rimani lì qualche secondo."], "Una sensazione fisica stabile dà stabilità anche alla mente."],
    ["Guardare con occhi nuovi", 2, ["Prendi un oggetto che usi ogni giorno: una tazza, una penna.", "Osservalo come se fosse la prima volta.", "Nota peso, colore, imperfezioni, temperatura."], "Esercita la curiosità, l'opposto del pilota automatico."],
    ["La pausa del semaforo", 1, ["A ogni attesa (semaforo, fila, ascensore) non prendere il telefono.", "Fai un respiro e guarda intorno.", "Nota com'è il tuo corpo in questo momento."], "Le attese diventano occasioni di presenza invece che di distrazione."],
    ["Il suono che finisce", 2, ["Ascolta un suono che sta finendo: una campana, un'eco, una nota.", "Segui il suono finché sparisce.", "Rimani nel silenzio che resta per qualche secondo."], "Allena l'attenzione fine e la capacità di stare nel silenzio."],
    ["Un messaggio gentile", 2, ["Pensa a una persona cara.", "Scrivile un messaggio breve e sincero, senza motivo.", "Nota come ti senti dopo averlo inviato."], "La connessione con gli altri è una delle basi del benessere mentale."],
    ["Respiro quadrato", 2, ["Inspira contando fino a 4.", "Trattieni contando fino a 4.", "Espira contando fino a 4.", "Resta senza aria contando fino a 4, poi ricomincia. Se trattenere ti mette a disagio, salta le pause."], "Il ritmo regolare dà alla mente un compito semplice e calma il respiro.", [4, 4, 4, 4]],
    ["Il corpo prima di decidere", 1, ["Davanti a una decisione, chiudi un attimo gli occhi.", "Immagina una scelta e nota come reagisce il corpo.", "Poi immagina l'altra.", "Usa queste sensazioni come informazione in più, non come verdetto."], "Corpo e mente parlano insieme: ascoltarli entrambi aiuta a scegliere."]
  ];

  // Domande per fermarsi e riflettere
  var DOMANDE = [
    "Di cosa ha bisogno il mio corpo oggi?",
    "Cosa mi ha fatto stare bene questa settimana?",
    "Quale piccola cosa posso fare oggi per la mia salute?",
    "Con chi vorrei passare più tempo?",
    "Cosa sto rimandando che mi farebbe sentire meglio fatto?",
    "Quando è stata l'ultima volta che mi sono riposato davvero?",
    "Cosa posso lasciare andare oggi?",
    "Quale controllo medico sto trascurando?",
    "Cosa direi a un amico che si trova nella mia situazione?",
    "Che cosa mi dà energia, e cosa me la toglie?",
    "Quale gesto gentile posso fare per qualcuno oggi?",
    "Come sto respirando in questo momento?",
    "In quale momento di oggi mi sono sentito presente?",
    "Cosa mi preoccupa che non dipende da me?",
    "Cosa dipende da me, e posso fare adesso?",
    "Quale abitudine vorrei coltivare questo mese?",
    "Per cosa sono grato oggi?",
    "Ho mangiato con fame vera o per altri motivi?",
    "Quanto tempo ho passato all'aperto oggi?",
    "Che persona voglio essere nelle difficoltà?",
    "Cosa mi farebbe dormire meglio stanotte?",
    "C'è qualcuno a cui devo un grazie?",
    "Cosa sto imparando su di me in questo periodo?",
    "Quale pensiero torna spesso? È utile o solo rumoroso?",
    "Se oggi avessi dieci minuti solo per me, come li userei?",
    "Mi sto muovendo abbastanza per il mio corpo?",
    "Cosa mi fa ridere? Quando l'ho fatto l'ultima volta?",
    "Sto chiedendo aiuto quando ne ho bisogno?",
    "Quale piccolo successo di oggi merita di essere notato?",
    "Cosa sto facendo per il me stesso di fra dieci anni?",
    "In quali momenti uso il telefono per non sentire qualcosa?",
    "Qual è la cosa più importante di domani?",
    "Dove sento tensione nel corpo adesso?",
    "Che cosa posso semplificare?",
    "Cosa mi rende orgoglioso di come mi prendo cura di me?"
  ];

  // Alimenti: [nome, gruppo, perché fa bene, come usarlo, mesi di stagione (null = tutto l'anno)]
  var ALIMENTI = [
    ["Arance", "frutta", "Ricche di vitamina C e di fibre se mangiate a spicchi invece che spremute.", "Uno spicchio d'arancia nell'insalata di finocchi è un classico mediterraneo.", [11, 12, 1, 2, 3, 4]],
    ["Mandarini", "frutta", "Pratici da portare con sé, danno vitamina C e pochi zuccheri per porzione.", "Uno o due a metà mattina al posto della merendina.", [11, 12, 1, 2]],
    ["Kiwi", "frutta", "Uno solo copre gran parte del bisogno giornaliero di vitamina C e aiuta l'intestino.", "A colazione con lo yogurt bianco.", [11, 12, 1, 2, 3, 4]],
    ["Mele", "frutta", "Danno fibra solubile (pectina) che sazia e aiuta il colesterolo, soprattutto con la buccia ben lavata.", "Cotte al forno con cannella, senza zucchero, sono un dolce leggero.", [9, 10, 11, 12, 1, 2, 3]],
    ["Pere", "frutta", "Ricche di acqua e fibre, delicate per lo stomaco.", "A fette con qualche scaglia di formaggio e noci, come piatto unico leggero.", [8, 9, 10, 11, 12]],
    ["Cachi", "frutta", "Danno carotenoidi e potassio; sono dolci, quindi una porzione basta.", "Al cucchiaio, al posto del dessert.", [10, 11, 12]],
    ["Melograno", "frutta", "I chicchi sono ricchi di polifenoli antiossidanti e colorano qualsiasi piatto.", "Sui contorni di verdura o nell'insalata.", [10, 11, 12]],
    ["Castagne", "frutta", "Un frutto amidaceo, più simile a un cereale: fibre, potassio, niente glutine.", "Lesse o arrosto come spuntino autunnale, contando che sostituiscono una porzione di pane.", [10, 11, 12]],
    ["Uva", "frutta", "Contiene polifenoli soprattutto nella buccia e nei semi.", "Un grappolo piccolo come porzione di frutta.", [8, 9, 10]],
    ["Fichi", "frutta", "Danno fibre, calcio e potassio.", "Freschi con un velo di ricotta per una merenda saziante.", [7, 8, 9]],
    ["Pesche", "frutta", "Ricche di acqua, vitamina C e carotenoidi.", "Anche grigliate come contorno estivo.", [6, 7, 8, 9]],
    ["Albicocche", "frutta", "Tra le più ricche di betacarotene, il precursore della vitamina A.", "Tre o quattro fanno una porzione.", [6, 7]],
    ["Ciliegie", "frutta", "Colorate dagli antociani, sono dolci ma con poche calorie.", "Una ciotola piccola dopo pranzo.", [5, 6, 7]],
    ["Fragole", "frutta", "Molta vitamina C e poche calorie.", "Al naturale con succo di limone, senza zucchero.", [4, 5, 6]],
    ["Anguria", "frutta", "Per oltre il 90% acqua: idrata nei giorni caldi.", "Fresca a fette o a cubetti con menta.", [6, 7, 8]],
    ["Melone", "frutta", "Idratante e ricco di carotenoidi.", "Da solo come frutta; con il prosciutto diventa un secondo, non un contorno.", [6, 7, 8]],
    ["Finocchi", "verdura", "Croccanti, digeribili, ricchi di acqua e fibre.", "Crudi a fette sottili con olio e arancia.", [10, 11, 12, 1, 2, 3, 4]],
    ["Carciofi", "verdura", "Ricchi di fibre e di sostanze che aiutano la digestione dei grassi.", "Crudi a fettine sottili con limone e olio, o in umido.", [11, 12, 1, 2, 3, 4]],
    ["Cavolo nero", "verdura", "Uno dei più ricchi di vitamina K, calcio e antiossidanti.", "Nella ribollita, o saltato con aglio e olio.", [10, 11, 12, 1, 2]],
    ["Broccoli", "verdura", "Come tutte le crucifere, danno vitamina C, folati e composti studiati per la prevenzione.", "Cotti al vapore pochi minuti, così restano verdi e croccanti.", [10, 11, 12, 1, 2, 3]],
    ["Cavolfiore", "verdura", "Versatile e saziante, con vitamina C e fibre.", "Al forno con spezie, oppure frullato in una vellutata.", [10, 11, 12, 1, 2, 3]],
    ["Verza", "verdura", "Economica e ricca di fibre e vitamina C.", "Negli involtini o nella minestra con i legumi.", [10, 11, 12, 1, 2, 3]],
    ["Radicchio", "verdura", "Il gusto amaro viene da sostanze utili; ha pochissime calorie.", "Ai ferri o crudo con mele e noci.", [10, 11, 12, 1, 2, 3]],
    ["Spinaci", "verdura", "Danno folati, vitamina K e magnesio.", "Crudi in insalata o appena saltati.", [10, 11, 12, 1, 2, 3, 4]],
    ["Asparagi", "verdura", "Ricchi di folati e fibra prebiotica che nutre i batteri buoni dell'intestino.", "Al vapore con un uovo in camicia.", [3, 4, 5]],
    ["Piselli", "legumi", "Un legume fresco: proteine vegetali e fibre.", "Con la pasta o nelle frittate.", [4, 5, 6]],
    ["Fave", "legumi", "Proteine e ferro vegetale; chi ha il favismo deve evitarle.", "Fresche con un filo d'olio, o in purea.", [4, 5, 6]],
    ["Zucchine", "verdura", "Leggere e versatili, ricche di acqua e potassio.", "Grigliate, crude a nastri o nella pasta.", [5, 6, 7, 8, 9]],
    ["Pomodori", "verdura", "Il licopene si assorbe meglio con un filo d'olio e dopo la cottura.", "Una salsa semplice fatta in casa vale più di tante pronte.", [6, 7, 8, 9]],
    ["Peperoni", "verdura", "Tra le verdure più ricche di vitamina C, soprattutto quelli rossi.", "Crudi a listarelle come spuntino.", [6, 7, 8, 9]],
    ["Melanzane", "verdura", "Poche calorie e molte fibre; assorbono olio se fritte, meglio al forno.", "Al forno a fette con pomodoro e basilico.", [6, 7, 8, 9]],
    ["Zucca", "verdura", "Ricca di betacarotene, dolce e saziante.", "Al forno a cubetti o in vellutata.", [9, 10, 11, 12]],
    ["Cicoria e cime di rapa", "verdura", "Verdure amare ricche di calcio, ferro e fibre.", "Ripassate in padella con aglio e peperoncino.", [10, 11, 12, 1, 2, 3]],
    ["Lenticchie", "legumi", "Cuociono in fretta senza ammollo; danno proteine, ferro e fibre.", "In zuppa o in insalata fredda con verdure.", null],
    ["Ceci", "legumi", "Proteine vegetali e fibre che saziano a lungo.", "Pasta e ceci, o hummus con verdure crude.", null],
    ["Fagioli", "legumi", "Una delle fonti più economiche di proteine e fibra.", "Nella minestra con verdure di stagione.", null],
    ["Avena", "cereali", "La fibra beta-glucano aiuta a tenere sotto controllo il colesterolo.", "Fiocchi con latte o yogurt e frutta a colazione.", null],
    ["Orzo e farro", "cereali", "Cereali antichi integrali, ricchi di fibre.", "In insalata d'estate e in minestra d'inverno.", null],
    ["Pane integrale", "cereali", "Più fibre e sazietà rispetto al pane bianco.", "Controlla che la farina integrale sia il primo ingrediente.", null],
    ["Olio extravergine d'oliva", "grassi", "Grassi monoinsaturi e polifenoli: il condimento di riferimento della dieta mediterranea.", "A crudo, misurandolo col cucchiaio: è sano ma calorico.", null],
    ["Noci", "frutta secca", "Contengono omega-3 vegetali.", "Tre o quattro noci come spuntino.", null],
    ["Mandorle", "frutta secca", "Danno vitamina E, magnesio e calcio.", "Una manciata, al naturale.", null],
    ["Semi di lino e di zucca", "semi", "Fibre e grassi buoni in poco spazio.", "Un cucchiaio sull'insalata o nello yogurt; i semi di lino vanno macinati.", null],
    ["Alici e sardine", "pesce", "Pesce azzurro economico, ricco di omega-3 e povero di contaminanti.", "Al forno con pangrattato, limone e prezzemolo.", null],
    ["Sgombro", "pesce", "Uno dei più ricchi di omega-3.", "Anche al naturale in scatola, scolato, con insalata.", null],
    ["Uova", "proteine", "Proteine complete a basso costo.", "Una frittata con molte verdure è un secondo completo.", null],
    ["Yogurt bianco", "latticini", "Proteine, calcio e fermenti; scegli quello senza zuccheri aggiunti.", "Con frutta fresca e qualche noce.", null],
    ["Erbe aromatiche", "condimenti", "Danno sapore senza sale: rosmarino, salvia, origano, basilico, prezzemolo.", "Un mazzetto sul davanzale ti aiuta a usarne di più.", null],
    ["Aglio e cipolla", "verdura", "Insaporiscono e contengono composti solforati studiati per la salute.", "Lasciali riposare qualche minuto dopo averli tagliati, prima di cuocerli.", null],
    ["Acqua", "bevande", "È la bevanda di riferimento: zero zuccheri, zero calorie.", "Aromatizzala con limone, menta o cetriolo se la trovi monotona.", null]
  ];

  // Routine di movimento: [id, titolo, minuti, per chi, esercizi[], nota]
  var ROUTINE = [
    ["risveglio", "Risveglio dolce", 5, "Tutti, appena alzati", ["Respiri profondi alzando le braccia (5 volte)", "Rotazioni delle spalle avanti e indietro (10 volte)", "Torsioni del busto da seduto, lente (5 per lato)", "Marcia sul posto alzando le ginocchia (1 minuto)", "Allungamento dei polpacci contro il muro (30 secondi per gamba)"], "Muoversi al mattino sveglia il corpo con calma."],
    ["scrivania", "Pausa dalla scrivania", 3, "Chi lavora seduto", ["Alzati e cammina per un minuto", "Apri il petto: mani dietro la schiena, spalle indietro (30 secondi)", "Inclina il collo a destra e a sinistra (20 secondi per lato)", "Alzati sulle punte e torna giù (15 volte)", "Guarda lontano dalla finestra (20 secondi)"], "Ogni 30-60 minuti seduti, una pausa così riduce rigidità e stanchezza."],
    ["forza", "Forza a corpo libero", 15, "Adulti, due volte a settimana", ["Alzarsi e sedersi dalla sedia senza mani (3 serie da 10)", "Piegamenti con le mani al muro o sul tavolo (3 serie da 10)", "Ponte per i glutei, sdraiato a terra (3 serie da 12)", "Affondi alternati tenendosi a una sedia (2 serie da 8 per gamba)", "Plank sulle ginocchia (3 volte da 20 secondi)"], "Recupera un minuto tra le serie. Il giusto sforzo è quando le ultime ripetizioni costano, ma la tecnica resta pulita."],
    ["camminata", "Camminata veloce", 30, "Tutti", ["5 minuti a passo tranquillo per scaldarti", "20 minuti a passo svelto: puoi parlare, ma non cantare", "5 minuti rallentando", "Allungamento di polpacci e cosce alla fine"], "Se 30 minuti sono troppi, fai tre tratti da 10: per la salute contano allo stesso modo."],
    ["equilibrio", "Equilibrio e stabilità", 10, "Soprattutto dopo i 65 anni, tre volte a settimana", ["In piedi su un piede, vicino a un appoggio (30 secondi per lato, 2 volte)", "Camminata tallone-punta lungo una linea (10 passi, 3 volte)", "Alzarsi sulle punte e sui talloni (10 volte)", "Passaggio del peso da un piede all'altro, lento (1 minuto)", "Alzarsi dalla sedia senza mani (10 volte)"], "Allenare l'equilibrio riduce il rischio di cadute. Tieni sempre vicino un appoggio sicuro."],
    ["mobilita", "Mobilità della sera", 8, "Tutti, prima di dormire", ["Gatto e mucca a quattro zampe (8 volte, lente)", "Ginocchia al petto da sdraiato (30 secondi)", "Torsione da sdraiato, ginocchia da un lato (30 secondi per lato)", "Posizione del bambino (1 minuto)", "Respiro con le mani sulla pancia (1 minuto)"], "Movimenti lenti e respiro calmo preparano il corpo al sonno."],
    ["scale", "Scale come palestra", 10, "Chi non ha problemi a ginocchia e cuore", ["Sali una rampa a passo normale e scendi con calma", "Ripeti 5 volte", "Sali due rampe a passo svelto tenendo il corrimano", "Scendi lentamente e recupera", "Ripeti 3 volte"], "Le scale sono un esercizio intenso: inizia piano e aumenta nel tempo."],
    ["intervalli", "Cammina e accelera", 20, "Chi cammina già con regolarità", ["5 minuti di camminata tranquilla", "1 minuto molto svelto, 2 minuti normale: ripeti 4 volte", "3 minuti a passo tranquillo per finire"], "Alternare ritmi diversi migliora il fiato più della sola camminata costante."]
  ];

  // Schede sulla mente: [id, titolo, sottotitolo, paragrafi[], fonte]
  var MENTE = [
    ["stress", "Stress: cinque abilità", "Dalla guida OMS «Fare ciò che conta nei momenti di stress»", [
      "Radicarsi. Quando pensieri ed emozioni ti travolgono, nota cosa provi, poi senti il corpo (i piedi a terra, la schiena) e torna a guardare dove sei e cosa stai facendo.",
      "Sganciarsi. Nota i pensieri difficili e dagli un nome («ecco la preoccupazione»). Non devi credere a tutto quello che pensi, né litigarci.",
      "Agire secondo i valori. Chiediti che persona vuoi essere in questa situazione e fai un piccolo passo in quella direzione.",
      "Essere gentili. Con te stesso e con gli altri: la gentilezza è una risorsa concreta nei momenti duri.",
      "Fare spazio. Le emozioni dolorose vengono e vanno come il meteo. Lasciale passare invece di combatterle."
    ], "oms_stress"],
    ["sonno", "Dormire meglio", "Le regole d'igiene del sonno", [
      "Orari regolari: alzati alla stessa ora anche nel fine settimana.",
      "Luce di giorno, buio di sera: esci al mattino, abbassa le luci e gli schermi la sera.",
      "Caffeina entro il primo pomeriggio, alcol non come sonnifero: fa addormentare ma peggiora il sonno.",
      "Cena non troppo abbondante, almeno due ore prima di coricarti.",
      "Se non dormi dopo 20 minuti, alzati, fai qualcosa di tranquillo e torna quando hai sonno.",
      "Se l'insonnia dura da più di tre mesi, parlane con il medico: esistono cure efficaci anche senza farmaci."
    ], "issalute"],
    ["ansia", "Quando sale l'ansia", "Cosa fare subito e quando chiedere aiuto", [
      "L'ansia è una reazione normale del corpo a un pericolo, anche immaginato: cuore veloce, respiro corto, tensione.",
      "Nel momento, rallenta l'espirazione: inspira contando fino a 4, espira fino a 6, per qualche minuto.",
      "Usa i sensi: nomina cose che vedi, tocchi e senti intorno a te.",
      "Riduci caffeina e alcol, muoviti ogni giorno: aiutano più di quanto sembri.",
      "Se l'ansia è frequente, ti fa evitare situazioni o non ti lascia dormire, parlane con il medico di famiglia: la psicoterapia funziona."
    ], "oms_mente"],
    ["umore", "Quando l'umore è basso", "Piccole azioni che aiutano", [
      "La tristezza ogni tanto fa parte della vita. Quando diventa costante, toglie energia e voglia di fare.",
      "Funziona agire prima di averne voglia: programma ogni giorno una cosa piccola che ti piaceva o che ti dà soddisfazione.",
      "Muoviti all'aperto, anche poco: luce e movimento sostengono l'umore.",
      "Resta in contatto con almeno una persona al giorno.",
      "Se da più di due settimane ti senti giù quasi tutti i giorni, hai perso interesse per le cose, dormi o mangi molto diversamente, parlane con il medico. Se pensi di farti del male, chiedi aiuto subito."
    ], "oms_mente"],
    ["relazioni", "Relazioni e solitudine", "Il legame con gli altri è salute", [
      "L'isolamento sociale pesa sulla salute fisica e mentale quanto altri fattori di rischio noti.",
      "Non serve avere tante persone intorno: conta avere qualcuno con cui parlare davvero.",
      "Scegli un gesto alla settimana: una telefonata a qualcuno che non senti da tempo, un'attività di gruppo, il volontariato.",
      "Anche i piccoli scambi quotidiani (il saluto al vicino, due parole al bar) contano."
    ], "oms_mente"],
    ["digitale", "Il telefono e la testa", "Usarlo invece di esserne usati", [
      "Togli le notifiche non necessarie: decidi tu quando guardare.",
      "Tieni il telefono fuori dalla camera la notte e lontano dalla tavola.",
      "Fai caso a quando lo prendi in mano senza un motivo: spesso è per non sentire noia o disagio.",
      "Sostituisci un momento di scorrimento al giorno con una pausa di presenza o una camminata."
    ], "nhs_emm"],
    ["cinque", "I cinque passi per il benessere", "Dal servizio sanitario inglese (NHS)", [
      "Connettiti con gli altri.",
      "Sii attivo fisicamente.",
      "Impara qualcosa di nuovo.",
      "Dai qualcosa agli altri.",
      "Presta attenzione al momento presente."
    ], "nhs_emm"],
    ["qui", "Vivere qui e ora", "Cos'è la consapevolezza e perché allenarla", [
      "La mente passa gran parte del tempo tra ricordi e progetti. Non è un difetto, ma ci fa vivere spesso in automatico.",
      "La consapevolezza (mindfulness) è la capacità di accorgersi di ciò che accade adesso, dentro e fuori di noi, con curiosità e senza giudizio.",
      "Si allena come un muscolo: pochi minuti al giorno, con costanza, contano più di una lunga sessione ogni tanto.",
      "Programmi strutturati di mindfulness sono stati studiati per stress, ansia e prevenzione delle ricadute depressive.",
      "Non serve svuotare la mente: ogni volta che ti accorgi di esserti distratto e torni al presente, stai facendo l'esercizio."
    ], "oms_stress"]
  ];

  // Quando non aspettare
  var URGENZE = [
    ["Ictus", "Viso storto da un lato, braccio o gamba deboli, difficoltà a parlare o capire, perdita improvvisa della vista: chiama subito il 112. Ogni minuto conta.", "112"],
    ["Infarto", "Dolore o peso al petto che dura più di qualche minuto, che può andare a braccio, collo o mascella, con sudore freddo, nausea o fiato corto: chiama il 112, non guidare.", "112"],
    ["Pensieri di farsi del male", "Se pensi di toglierti la vita o di farti del male, chiama il 112 o vai al pronto soccorso. Per parlare con qualcuno: Telefono Amico 02 2327 2327 (tutti i giorni, 10-24) o WhatsApp 324 011 7252.", "112"]
  ];
  var DAL_MEDICO = [
    "Sangue nelle feci, nelle urine o nella tosse",
    "Un neo che cambia forma, colore o dimensione, o una ferita che non guarisce",
    "Un nodulo nuovo al seno, ai testicoli o in un'altra parte del corpo",
    "Perdita di peso senza motivo, stanchezza o febbre che non passano",
    "Tosse o raucedine che durano più di tre settimane",
    "Difficoltà a deglutire o bruciore di stomaco persistente",
    "Tristezza, ansia o insonnia che durano più di due settimane"
  ];

  // Giornate mondiali e nazionali della salute: [mese, giorno, nome, collegamento interno]
  var GIORNATE = [
    [2, 4, "Giornata mondiale contro il cancro", "prevenzione"],
    [3, 24, "Giornata mondiale della tubercolosi", "prevenzione"],
    [4, 6, "Giornata mondiale dell'attività fisica", "movimento"],
    [4, 7, "Giornata mondiale della salute (OMS)", "oggi"],
    [5, 17, "Giornata mondiale dell'ipertensione", "prevenzione"],
    [5, 31, "Giornata mondiale senza tabacco", "prevenzione"],
    [6, 14, "Giornata mondiale del donatore di sangue", "oggi"],
    [7, 28, "Giornata mondiale contro le epatiti", "prevenzione"],
    [9, 10, "Giornata mondiale per la prevenzione del suicidio", "mente"],
    [9, 21, "Giornata mondiale dell'Alzheimer", "mente"],
    [9, 29, "Giornata mondiale del cuore", "prevenzione"],
    [10, 10, "Giornata mondiale della salute mentale", "mente"],
    [10, 16, "Giornata mondiale dell'alimentazione", "cibo"],
    [10, 20, "Giornata mondiale dell'osteoporosi", "movimento"],
    [11, 14, "Giornata mondiale del diabete", "cibo"],
    [12, 1, "Giornata mondiale contro l'AIDS", "prevenzione"]
  ];

  // Voci del diario quotidiano: [id, etichetta, aiuto]
  var DIARIO = [
    ["sonno", "Ho dormito almeno 7 ore", "La maggior parte degli adulti ha bisogno di 7-9 ore."],
    ["moto", "Mi sono mosso almeno 30 minuti", "Anche in più volte: camminare, scale, giardino."],
    ["verdura", "Ho mangiato 5 porzioni di frutta e verdura", "Una porzione è un frutto, una ciotola di insalata, un piatto di verdura cotta."],
    ["acqua", "Ho bevuto abbastanza acqua", "Circa 1,5-2 litri di liquidi, di più se fa caldo."],
    ["presenza", "Ho fatto un momento di presenza", "Anche un minuto: un esercizio, tre respiri, una pausa consapevole."],
    ["fuori", "Sono stato all'aperto", "Luce naturale e aria aperta, anche per poco."],
    ["persone", "Ho avuto un contatto che mi ha fatto bene", "Una telefonata, una chiacchierata, un abbraccio."]
  ];

  // Esercizi delle routine, con figura animata e istruzioni.
  // vista: "lato" o "fronte"; pose: posizioni chiave della figura (vedi il motore FIG in index.html);
  // modo: "rip" (una ripetizione percorre le pose e torna), "ciclo" (movimento continuo), "tieni" (si va nella posa e si resta).
  // come: istruzioni passo passo; facile: versione per chi inizia; attenzione: sicurezza.
  var ESERCIZI = {
    braccia_respiro: {
      nome: "Respiro con le braccia", vista: "fronte", modo: "rip", respiro: true,
      pose: [{ a: [6, 6], b: [6, 6] }, { a: [172, 178], b: [172, 178], c: 180 }],
      come: ["In piedi, piedi alla larghezza delle anche, spalle morbide.", "Inspira dal naso mentre alzi le braccia di lato fin sopra la testa.", "Espira piano dalla bocca mentre le riporti giù."],
      facile: "Puoi farlo da seduto e alzare le braccia solo fino all'altezza delle spalle.",
      attenzione: "Se ti gira la testa, respira più piano o fermati."
    },
    spalle_cerchi: {
      nome: "Cerchi con le spalle", vista: "lato", modo: "rip", inverti: true,
      pose: [{ a: [90, 255], b: [90, 255] }, { a: [180, 345], b: [180, 345] }, { a: [270, 75], b: [270, 75] }, { a: [360, 165], b: [360, 165] }],
      chiudi: true,
      come: ["Appoggia la punta delle dita sulle spalle.", "Disegna con i gomiti cerchi grandi e lenti: avanti, su, indietro, giù.", "A metà delle ripetizioni cambia verso."],
      facile: "Senza mani sulle spalle: solleva le spalle verso le orecchie e lasciale scendere indietro.",
      attenzione: "Non deve fare male: se senti fastidio, fai cerchi più piccoli."
    },
    torsione_seduto: {
      nome: "Torsione da seduto", vista: "fronte", modo: "rip", icona: 1,
      oggetti: [["sediaf", 100], ["rotazione", 100, 34]],
      pose: [
        { cf: .3, g: [14, 2], k: [14, 2], ma: "sb", mb: "sa", gb: true },
        { cf: .3, g: [14, 2], k: [14, 2], ma: "sb", mb: "sa", w: .45, hx: 6 },
        { cf: .3, g: [14, 2], k: [14, 2], ma: "sb", mb: "sa" },
        { cf: .3, g: [14, 2], k: [14, 2], ma: "sb", mb: "sa", w: .45, hx: -6 }
      ], chiudi: true,
      come: ["Siediti sul bordo della sedia, schiena dritta e piedi a terra.", "Incrocia le braccia sul petto.", "Ruota piano busto e testa verso destra, torna al centro, poi verso sinistra: è una ripetizione."],
      facile: "Ruota di poco: conta il movimento, non quanto arrivi lontano.",
      attenzione: "Niente strappi. Se hai problemi alla schiena, chiedi al medico."
    },
    marcia: {
      nome: "Marcia sul posto", vista: "lato", modo: "ciclo", periodo: 1.4,
      pose: [
        { g: [78, -4, 95], k: [0, 0, 90], a: [-28, -12], b: [30, 70] },
        { g: [0, 0, 90], k: [0, 0, 90], a: [0, 10], b: [0, 10] },
        { k: [78, -4, 95], g: [0, 0, 90], b: [-28, -12], a: [30, 70] },
        { g: [0, 0, 90], k: [0, 0, 90], a: [0, 10], b: [0, 10] }
      ], chiudi: true,
      come: ["Solleva un ginocchio alla volta, come se marciassi.", "Muovi le braccia come quando cammini.", "Tieni un ritmo che ti lasci respirare e parlare."],
      facile: "Alza poco le ginocchia, oppure marcia da seduto.",
      attenzione: "Stai vicino a un appoggio se hai poco equilibrio."
    },
    polpaccio: {
      nome: "Allungamento del polpaccio", vista: "lato", modo: "tieni", lati: true,
      oggetti: [["muro", 158]],
      pose: [{ pi: 112, ma: [157, 92], mb: [157, 92] }, { t: 160, g: [28, -6, 90], k: [-24, -24, 90], pi: 118, ma: [157, 92], mb: [157, 92] }],
      come: ["Mani al muro, una gamba avanti piegata e l'altra indietro tesa.", "Il tallone della gamba dietro resta a terra: senti tirare il polpaccio.", "Resta fermo e respira, senza molleggiare."],
      facile: "Avvicina il piede dietro al muro: l'allungamento diventa più leggero.",
      attenzione: "Deve tirare, non fare male."
    },
    camminare: {
      nome: "Camminare", vista: "lato", modo: "ciclo", periodo: 1.1,
      pose: [
        { g: [24, 4, 92], k: [-20, -16, 75], a: [-22, -12], b: [22, 42], t: 178 },
        { k: [24, 4, 92], g: [-20, -16, 75], b: [-22, -12], a: [22, 42], t: 178 }
      ], chiudi: true,
      come: ["Testa alta, sguardo avanti, spalle rilassate.", "Appoggia il tallone e spingi con la punta del piede.", "Lascia oscillare le braccia."],
      facile: "Cammina anche in casa o in un corridoio: conta il tempo, non il posto.",
      attenzione: "Scarpe comode. Con il caldo, cammina nelle ore fresche."
    },
    petto: {
      nome: "Apri il petto", vista: "lato", modo: "tieni",
      pose: [{}, { a: [-38, -18], b: [-38, -18], t: 184, s: -3, c: 183 }],
      come: ["Intreccia le mani dietro la schiena.", "Porta le spalle indietro e apri il petto, con il mento parallelo al pavimento.", "Respira lentamente."],
      facile: "Se le mani non si raggiungono, tieni un asciugamano tra le due mani.",
      attenzione: "Non inarcare troppo la parte bassa della schiena."
    },
    collo: {
      nome: "Allungamento del collo", vista: "fronte", modo: "tieni", lati: true,
      pose: [{}, { c: 140, a: [4, 4], b: [8, 8], sy: -2 }],
      come: ["Seduto o in piedi, spalle basse e rilassate.", "Inclina la testa portando l'orecchio verso la spalla, senza alzare la spalla.", "Resta e respira, poi cambia lato."],
      facile: "Inclina meno: basta sentire un leggero allungamento.",
      attenzione: "Niente rotazioni rapide del collo."
    },
    punte: {
      nome: "Sulle punte", vista: "lato", modo: "rip",
      oggetti: [["sedia", 118]],
      pose: [{ ma: [119, 112], mb: [119, 112] }, { g: [0, 0, 42], k: [0, 0, 42], ma: [119, 112], mb: [119, 112] }],
      come: ["In piedi, piedi paralleli. Se vuoi, appoggia le mani allo schienale di una sedia.", "Sali piano sulle punte.", "Scendi controllando, senza lasciarti cadere."],
      facile: "Sali di poco, oppure fallo da seduto alzando i talloni.",
      attenzione: "Tieniti a un appoggio se perdi l'equilibrio."
    },
    lontano: {
      nome: "Guarda lontano", vista: "lato", modo: "tieni",
      oggetti: [["finestra", 146]],
      pose: [{ x: 90 }, { x: 90, c: 168 }],
      come: ["Guarda fuori da una finestra, verso il punto più lontano che vedi.", "Lascia rilassare gli occhi e sbatti le palpebre ogni tanto."],
      facile: null,
      attenzione: null
    },
    sedia_alzati: {
      nome: "Alzarsi dalla sedia", vista: "lato", modo: "rip", icona: 1,
      oggetti: [["sedia", 58]],
      pose: [
        { x: 80, t: 172, g: [88, 2, 90], k: [88, 2, 90], a: [80, 84], b: [80, 84], pi: 112 },
        { x: 80, t: 138, g: [84, 8, 90], k: [84, 8, 90], a: [100, 98], b: [100, 98], pi: 112, c: 125 },
        { t: 178, a: [86, 88], b: [86, 88], pi: 112 }
      ],
      come: ["Siediti sul bordo di una sedia stabile, piedi a terra un po' arretrati.", "Porta il busto in avanti e alzati spingendo con le gambe, braccia avanti.", "Torna a sederti piano, controllando la discesa."],
      facile: "Aiutati con le mani sulle cosce o sui braccioli: con il tempo ne avrai meno bisogno.",
      attenzione: "Usa una sedia senza ruote, appoggiata al muro perché non scivoli."
    },
    muro_piegamenti: {
      nome: "Piegamenti al muro", vista: "lato", modo: "rip",
      oggetti: [["muro", 160]],
      pose: [{ t: 150, g: [-30, -30, 90], k: [-30, -30, 90], pi: 60, ma: [159, 88], mb: [159, 88], c: 150 }, { t: 138, g: [-42, -42, 90], k: [-42, -42, 90], pi: 60, ma: [159, 88], mb: [159, 88], c: 136 }],
      come: ["Mani al muro all'altezza delle spalle, piedi un passo indietro.", "Piega i gomiti e porta il petto verso il muro, con il corpo dritto come una tavola.", "Spingi e torna su."],
      facile: "Avvicina i piedi al muro: lo sforzo diminuisce.",
      attenzione: "Per più impegno, usa un tavolo robusto al posto del muro."
    },
    ponte: {
      nome: "Ponte per i glutei", vista: "lato", modo: "rip",
      oggetti: [["tappeto"]],
      pose: [{ x: 110, t: -90, c: -96, g: [140, -18, 90], k: [140, -18, 90], a: [90, 90], b: [90, 90] }, { x: 110, t: -56, c: -80, g: [100, -2, 92], k: [100, -2, 92], a: [100, 94], b: [100, 94] }],
      come: ["Sdraiato sulla schiena, ginocchia piegate e piedi appoggiati a terra.", "Spingi con i talloni e solleva il bacino finché spalle, anche e ginocchia sono in linea.", "Resta un secondo e scendi piano."],
      facile: "Solleva il bacino di poco.",
      attenzione: "Non inarcare la schiena: il lavoro lo fanno i glutei."
    },
    affondo: {
      nome: "Affondo con appoggio", vista: "lato", modo: "rip",
      oggetti: [["sedia", 54, 1]],
      pose: [{ x: 96, mb: [56, 110] }, { x: 96, g: [62, -4, 90], k: [-22, -78, 40], mb: [56, 110] }],
      come: ["In piedi, tieni una mano sullo schienale di una sedia.", "Fai un passo avanti e piega tutte e due le ginocchia, con il busto dritto.", "Spingi con la gamba davanti e torna in piedi. Alterna le gambe."],
      facile: "Fai un passo più corto e scendi poco.",
      attenzione: "Il ginocchio davanti resta sopra la caviglia, non oltre la punta del piede."
    },
    plank: {
      nome: "Plank sulle ginocchia", vista: "lato", modo: "tieni",
      oggetti: [["tappeto"]],
      pose: [{ x: 84, t: 100, c: 98, g: [-76, -110, -160], k: [-76, -110, -160], a: [0, 90], b: [0, 90] }, { x: 84, t: 108, c: 104, g: [-62, -110, -160], k: [-62, -110, -160], a: [0, 90], b: [0, 90] }],
      come: ["Avambracci a terra sotto le spalle, ginocchia a terra.", "Solleva il bacino finché il corpo è dritto dalle ginocchia alla testa.", "Stringi un po' la pancia e respira normalmente."],
      facile: "Tieni meno secondi, oppure fallo in piedi con le mani su un tavolo.",
      attenzione: "Non trattenere il fiato e non lasciar cadere il bacino."
    },
    quadricipite: {
      nome: "Allungamento della coscia", vista: "lato", modo: "tieni", lati: true,
      oggetti: [["sedia", 118]],
      pose: [{ x: 100, mb: [119, 112] }, { x: 100, g: [-14, -158, -100], ma: "ca", mb: [119, 112] }],
      come: ["In piedi, tieniti a una sedia o al muro.", "Piega una gamba e porta il tallone verso il gluteo, tenendo la caviglia con la mano.", "Ginocchia vicine; resta e respira."],
      facile: "Se non arrivi alla caviglia, usa un asciugamano o piega meno.",
      attenzione: "Non tirare forte il ginocchio."
    },
    un_piede: {
      nome: "In equilibrio su un piede", vista: "lato", modo: "tieni", lati: true,
      oggetti: [["sedia", 118]],
      pose: [{ ma: [119, 112] }, { g: [42, -22, 95], ma: [119, 112] }],
      come: ["In piedi accanto a una sedia stabile, una mano sullo schienale.", "Solleva un piede da terra e resta in equilibrio.", "Quando ti senti sicuro, appoggia solo un dito."],
      facile: "Solleva appena il tallone e lascia la punta a terra.",
      attenzione: "Fallo sempre vicino a un appoggio sicuro."
    },
    tallone_punta: {
      nome: "Tallone davanti alla punta", vista: "lato", modo: "ciclo", passi: 2,
      pose: [
        { g: [18, 4, 88], k: [-12, -10, 78], a: [55, 70], b: [35, 50] },
        { k: [18, 4, 88], g: [-12, -10, 78], a: [55, 70], b: [35, 50] }
      ], chiudi: true,
      come: ["Cammina su una linea immaginaria.", "A ogni passo appoggia il tallone proprio davanti alla punta dell'altro piede.", "Guarda avanti, non i piedi."],
      facile: "Cammina accanto a un muro o al bancone della cucina, per poterti appoggiare.",
      attenzione: "Togli dal pavimento tappeti e ostacoli."
    },
    punte_talloni: {
      nome: "Punte e talloni", vista: "lato", modo: "rip", icona: 1,
      oggetti: [["sedia", 118]],
      pose: [{ ma: [119, 112], mb: [119, 112] }, { g: [0, 0, 42], k: [0, 0, 42], ma: [119, 112], mb: [119, 112] }, { ma: [119, 112], mb: [119, 112] }, { g: [0, 0, 128], k: [0, 0, 128], t: 177, ma: [119, 112], mb: [119, 112] }],
      chiudi: true,
      come: ["Tieniti allo schienale di una sedia.", "Sali sulle punte e scendi.", "Poi solleva le punte restando sui talloni, e torna giù."],
      facile: "Fai solo la salita sulle punte.",
      attenzione: "Movimenti lenti, sempre con l'appoggio."
    },
    peso: {
      nome: "Sposta il peso", vista: "fronte", modo: "ciclo", periodo: 5,
      pose: [{ x: 92, t: 184, g: [-3, -3], k: [13, 13], a: [10, 10], b: [10, 10] }, { x: 108, t: 176, g: [13, 13], k: [-3, -3], a: [10, 10], b: [10, 10] }],
      chiudi: true,
      come: ["In piedi, piedi alla larghezza delle anche, vicino a un appoggio.", "Sposta lentamente il peso su un piede, poi sull'altro.", "Senti la pianta del piede che preme a terra."],
      facile: "Tieni le mani sull'appoggio per tutto il tempo.",
      attenzione: "Movimento piccolo e lento: non serve sollevare i piedi."
    },
    gatto_mucca: {
      nome: "Gatto e mucca", vista: "lato", modo: "rip", respiro: true,
      oggetti: [["tappeto"]],
      pose: [{ x: 72, t: 106, s: 11, c: 30, g: [0, -90, -150], k: [0, -90, -150], a: [0, 0], b: [0, 0] }, { x: 72, t: 106, s: -9, c: 118, g: [0, -90, -150], k: [0, -90, -150], a: [0, 0], b: [0, 0] }],
      come: ["A quattro zampe: mani sotto le spalle, ginocchia sotto le anche.", "Inspirando lascia scendere la pancia e alza lo sguardo.", "Espirando arrotonda la schiena verso l'alto e porta il mento verso il petto."],
      facile: "Puoi farlo da seduto, con le mani sulle ginocchia.",
      attenzione: "Muoviti piano. Se le ginocchia fanno male, mettici sotto un cuscino."
    },
    ginocchia_petto: {
      nome: "Ginocchia al petto", vista: "lato", modo: "tieni",
      oggetti: [["tappeto"]],
      pose: [{ x: 112, t: -90, c: -96, g: [140, -18, 90], k: [140, -18, 90], a: [90, 90], b: [90, 90] }, { x: 112, t: -90, c: -96, g: [-150, 95, 150], k: [-150, 95, 150], ma: "ka", mb: "kb" }],
      come: ["Sdraiato sulla schiena, porta le ginocchia verso il petto.", "Abbracciale con le mani e respira lentamente.", "Se ti fa bene, dondola piano da un lato all'altro."],
      facile: "Porta al petto una gamba alla volta.",
      attenzione: "Testa e spalle restano appoggiate."
    },
    torsione_sdraiato: {
      nome: "Torsione da sdraiato", vista: "lato", modo: "tieni", lati: true,
      oggetti: [["tappeto"]],
      pose: [{ x: 112, y: 177, t: -90, c: -96, g: [140, -18, 90], k: [140, -18, 90], a: [90, 90], b: [90, 90] }, { x: 112, y: 177, t: -90, c: -100, g: [118, -50, 90], k: [130, -35, 90], a: [90, 90], b: [90, 90] }],
      come: ["Sdraiato sulla schiena, ginocchia piegate, braccia aperte.", "Lascia scendere piano le ginocchia da un lato, tenendo le spalle a terra.", "Resta e respira, poi cambia lato."],
      facile: "Lascia scendere le ginocchia solo a metà.",
      attenzione: "Movimento lento e senza dolore."
    },
    bambino: {
      nome: "Posizione del bambino", vista: "lato", modo: "tieni",
      oggetti: [["tappeto"]],
      pose: [{ x: 76, t: 175, g: [62, -90, -170], k: [62, -90, -170], a: [5, 10], b: [5, 10] }, { x: 76, t: 98, s: 7, c: 60, g: [62, -90, -170], k: [62, -90, -170], a: [96, 92], b: [96, 92] }],
      come: ["In ginocchio, siediti sui talloni.", "Porta il busto in avanti sulle cosce e allunga le braccia a terra.", "Appoggia la fronte e respira lentamente."],
      facile: "Metti un cuscino tra talloni e glutei, o sotto la fronte.",
      attenzione: "Evitala se hai dolore alle ginocchia."
    },
    pancia: {
      nome: "Respiro con la pancia", vista: "lato", modo: "ciclo", periodo: 10,
      oggetti: [["tappeto"]],
      pose: [{ x: 112, t: -90, c: -96, g: [140, -18, 90], k: [140, -18, 90], ma: "ventre", mb: "ventre", ga: false, gb: false }, { x: 112, t: -90, c: -96, s: -5, g: [140, -18, 90], k: [140, -18, 90], ma: "ventre", mb: "ventre", ga: false, gb: false }],
      come: ["Sdraiato, ginocchia piegate, mani sulla pancia.", "Inspira dal naso e senti la pancia che si alza sotto le mani.", "Espira piano dalla bocca, più a lungo di quanto hai inspirato."],
      facile: "Va benissimo anche da seduto.",
      attenzione: null
    },
    scale: {
      nome: "Salire le scale", vista: "lato", modo: "ciclo", periodo: 1.6,
      oggetti: [["gradini", 116]],
      pose: [{ x: 100, g: [62, -14, 92], k: [0, 0, 90], a: [-20, -10], b: [20, 45], t: 172, ma: null }, { x: 100, g: [20, 6, 90], k: [-14, -24, 70], a: [10, 20], b: [-10, 0], t: 176 }],
      chiudi: true,
      come: ["Sali con passo regolare, appoggiando tutto il piede sul gradino.", "Tieni il corrimano.", "Scendi con calma: è la parte in cui si cade più facilmente."],
      facile: "Fai una sola rampa e riposa quanto serve.",
      attenzione: "Fermati se senti dolore al petto, vertigini o un fiato insolito."
    }
  };

  // Sessioni guidate delle routine: un blocco per esercizio.
  // rip = ripetizioni, ritmo = secondi per ripetizione, sec = durata, serie e rec = serie e recupero in secondi,
  // lati = da fare a destra e a sinistra, alterna = gambe alternate, tocchi = da segnare a mano, vel = velocità del passo.
  var SESSIONI = {
    risveglio: [
      { e: "braccia_respiro", rip: 5, ritmo: 8 },
      { e: "spalle_cerchi", rip: 10, ritmo: 3 },
      { e: "torsione_seduto", rip: 5, ritmo: 6 },
      { e: "marcia", sec: 60 },
      { e: "polpaccio", sec: 30, lati: true }
    ],
    scrivania: [
      { e: "camminare", sec: 60, testo: "Cammina per la stanza o in corridoio." },
      { e: "petto", sec: 30 },
      { e: "collo", sec: 20, lati: true },
      { e: "punte", rip: 15, ritmo: 2 },
      { e: "lontano", sec: 20 }
    ],
    forza: [
      { e: "sedia_alzati", rip: 10, ritmo: 3.5, serie: 3, rec: 45 },
      { e: "muro_piegamenti", rip: 10, ritmo: 3, serie: 3, rec: 45 },
      { e: "ponte", rip: 12, ritmo: 3.5, serie: 3, rec: 45 },
      { e: "affondo", rip: 16, ritmo: 3.5, serie: 2, rec: 45, alterna: true, testo: "8 per gamba, alternando." },
      { e: "plank", sec: 20, serie: 3, rec: 30 }
    ],
    camminata: [
      { e: "camminare", sec: 300, vel: "lento", testo: "Passo tranquillo per scaldarti." },
      { e: "camminare", sec: 1200, vel: "svelto", testo: "Passo svelto: puoi parlare, ma non cantare." },
      { e: "camminare", sec: 300, vel: "lento", testo: "Rallenta piano piano." },
      { e: "polpaccio", sec: 20, lati: true },
      { e: "quadricipite", sec: 20, lati: true }
    ],
    equilibrio: [
      { e: "un_piede", sec: 30, lati: true, serie: 2, rec: 15 },
      { e: "tallone_punta", rip: 10, ritmo: 2.2, serie: 3, rec: 20, testo: "10 passi su una linea." },
      { e: "punte_talloni", rip: 10, ritmo: 3 },
      { e: "peso", sec: 60 },
      { e: "sedia_alzati", rip: 10, ritmo: 4 }
    ],
    mobilita: [
      { e: "gatto_mucca", rip: 8, ritmo: 6 },
      { e: "ginocchia_petto", sec: 30 },
      { e: "torsione_sdraiato", sec: 30, lati: true },
      { e: "bambino", sec: 60 },
      { e: "pancia", sec: 60, respiro: [4, 0, 6, 0] }
    ],
    scale: [
      { e: "scale", tocchi: 5, testo: "Sali una rampa a passo normale e scendi con calma. Tocca «Fatto» alla fine di ogni rampa." },
      { rec: 60 },
      { e: "scale", tocchi: 3, vel: "svelto", testo: "Sali due rampe a passo svelto tenendo il corrimano, poi scendi lentamente e recupera. Tocca «Fatto» ogni volta." }
    ],
    intervalli: [{ e: "camminare", sec: 300, vel: "lento", testo: "Camminata tranquilla per scaldarti." }]
      .concat([1, 2, 3, 4].reduce(function (a, i) {
        return a.concat([{ e: "camminare", sec: 60, vel: "molto", testo: "Molto svelto: " + i + " di 4." }, { e: "camminare", sec: 120, vel: "normale", testo: "Passo normale, recupera il fiato." }]);
      }, []))
      .concat([{ e: "camminare", sec: 180, vel: "lento", testo: "Passo tranquillo per finire." }])
  };

  // Primi passi: quattro settimane per chi parte da zero. Ogni giorno 1-2 attività brevi.
  // "r:id" = routine, "r:id:facile" = routine in versione per iniziare, "c:N" = camminata di N minuti, "p" = esercizio di presenza del giorno.
  var PRIMI_PASSI = [
    ["Settimana 1 · Prendere confidenza", "Pochi minuti al giorno per imparare gli esercizi senza fretta.", [
      ["r:risveglio:facile"], ["p", "c:10"], ["r:risveglio:facile", "r:scrivania"], ["c:10", "p"], ["r:mobilita:facile"], ["c:10"], ["r:risveglio", "p"]]],
    ["Settimana 2 · Un po' di più", "Le camminate si allungano e arriva l'equilibrio.", [
      ["c:15"], ["r:risveglio", "r:equilibrio:facile"], ["c:15", "p"], ["r:forza:facile"], ["r:mobilita"], ["c:15"], ["r:risveglio", "p"]]],
    ["Settimana 3 · Prendere il ritmo", "Due giorni di forza, camminate da 20 minuti.", [
      ["c:20"], ["r:forza:facile"], ["c:20", "p"], ["r:equilibrio"], ["r:forza:facile"], ["c:20"], ["r:mobilita", "p"]]],
    ["Settimana 4 · Diventa abitudine", "Ti avvicini ai 150 minuti a settimana consigliati dall'OMS.", [
      ["c:25"], ["r:forza"], ["c:25", "p"], ["r:equilibrio", "r:scrivania"], ["r:forza"], ["c:30"], ["r:risveglio", "p"]]]
  ];

  // Azioni con timer collegate alle abitudini del giorno (chiave: titolo dell'abitudine).
  var AZIONI = {
    "Le mani, il primo vaccino": [{ sec: 40, testo: "Bagna le mani e insaponale. Strofina palmi, dorsi, tra le dita, pollici e punte delle dita, poi risciacqua.", icona: "mani" }],
    "Denti, due volte al giorno": [
      { sec: 30, testo: "Arcata in alto, lato esterno: piccoli movimenti dalla gengiva verso il dente.", icona: "denti" },
      { sec: 30, testo: "Arcata in alto, lato interno e superfici che masticano.", icona: "denti" },
      { sec: 30, testo: "Arcata in basso, lato esterno.", icona: "denti" },
      { sec: 30, testo: "Arcata in basso, lato interno e superfici che masticano. Poi filo o scovolino.", icona: "denti" }],
    "Gli occhi hanno bisogno di lontano": [{ e: "lontano", sec: 20, testo: "Guarda qualcosa ad almeno sei metri di distanza." }],
    "Respira con la pancia": [{ e: "pancia", sec: 120, respiro: [4, 0, 6, 0] }],
    "L'equilibrio si allena": [{ e: "un_piede", sec: 30, lati: true }],
    "Spezza la sedia": "r:scrivania",
    "Due giorni di forza": "r:forza",
    "150 minuti alla settimana": "r:camminata",
    "Ogni passo conta": "c:10",
    "Postura: cambia spesso": "r:scrivania",
    "Il fiato giusto": "r:intervalli"
  };

  window.QO = {
    ABITUDINI: ABITUDINI, PRESENZA: PRESENZA, DOMANDE: DOMANDE, ALIMENTI: ALIMENTI,
    ROUTINE: ROUTINE, MENTE: MENTE, URGENZE: URGENZE, DAL_MEDICO: DAL_MEDICO,
    GIORNATE: GIORNATE, DIARIO: DIARIO,
    ESERCIZI: ESERCIZI, SESSIONI: SESSIONI, PRIMI_PASSI: PRIMI_PASSI, AZIONI: AZIONI
  };
})();
