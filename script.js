// ============================================================
// 1. COSTANTI E VARIABILI GLOBALI
// ============================================================

const GIORNI_TOTALI = 24;
const STORAGE_KEY = 'calendario_avvento';

let nomeUtente = '';
let statoUtente = null;

// ============================================================
// 2. MAPPA COMPLETA DELLE FOTO PER OGNI AMICO
// ============================================================

const MAPPA_FOTO_AMICI = {
    'ale': {
        'foto1': 'https://i.imgur.com/3BeK4IJ.jpeg',
        'foto2': 'https://i.imgur.com/znlNfTR.jpeg',
        'foto3': 'https://i.imgur.com/Cg4VAnD.jpeg',
        'foto4': 'https://i.imgur.com/nvboBaX.jpeg',
        'foto5': 'https://i.imgur.com/qcF28ZU.jpeg'
    },
    'alessia': {
        'foto1': 'https://i.imgur.com/XojOIZ8.jpeg',
        'foto2': 'https://i.imgur.com/SQuektT.jpeg',
        'foto3': 'https://i.imgur.com/cJVubzo.jpeg',
        'foto4': 'https://i.imgur.com/iWUzIzC.jpeg'
    },
    'barba': {
        'foto1': 'https://i.imgur.com/m2ztf3l.jpeg',
        'foto2': 'https://i.imgur.com/UjvWpbG.jpeg',
        'foto3': 'https://i.imgur.com/fIuTSER.jpeg',
        'foto4': 'https://i.imgur.com/R6VDOJH.jpeg',
        'foto5': 'https://i.imgur.com/D31nb5S.jpeg'
    },
    'carla': {
        'foto1': 'https://i.imgur.com/LPe9gKO.jpeg',
        'foto2': 'https://i.imgur.com/TclNj0r.jpeg',
        'foto3': 'https://i.imgur.com/6TZuPii.jpeg',
        'foto4': ''
    },
    'cuggi': {
        'foto1': 'https://i.imgur.com/Ha1Eyyi.jpeg',
        'foto2': 'https://i.imgur.com/qxY9Nez.jpeg',
        'foto3': 'https://i.imgur.com/27n4ZnU.jpeg',
        'foto4': 'https://i.imgur.com/09hVrGA.jpeg'
    },
    'eli': {
        'foto1': 'https://i.imgur.com/CxWKolw.jpeg',
        'foto2': 'https://i.imgur.com/JEJR4EK.jpeg',
        'foto3': 'https://i.imgur.com/CPCensr.jpeg',
        'foto4': 'https://i.imgur.com/f84WAle.jpeg'
    },
    'fra': {
        'foto1': 'https://i.imgur.com/N20Ma3u.jpeg',
        'foto2': 'https://i.imgur.com/aVAgOJR.jpeg',
        'foto3': 'https://i.imgur.com/kyXCF6M.jpeg',
        'foto4': 'https://i.imgur.com/mlSxeNS.jpeg'
    },
    'jo': {
        'foto1': 'https://i.imgur.com/P8WuqHi.jpeg',
        'foto2': 'https://i.imgur.com/HEOekCY.jpeg',
        'foto3': 'https://i.imgur.com/Gqt91cr.jpeg',
        'foto4': 'https://i.imgur.com/59UD5FC.jpeg'
    },
    'sara': {
        'foto1': 'https://i.imgur.com/5ToMzEM.jpeg',
        'foto2': 'https://i.imgur.com/d79viZx.jpeg',
        'foto3': 'https://i.imgur.com/TPXqgfx.jpeg',
        'foto4': 'https://i.imgur.com/BpYSzoM.jpeg'
    },
    'marta': {
        'foto1': 'https://i.imgur.com/Qt3s2Tf.jpeg',
        'foto2': 'https://i.imgur.com/cQe0hkl.jpeg',
        'foto3': 'https://i.imgur.com/w3qUBq9.jpeg',
        'foto4': 'https://i.imgur.com/SsVMecY.jpeg'
    }
};

// ============================================================
// 3. MAPPA FOTO DI GRUPPO (UGUALI PER TUTTI)  ← AGGIUNTA!
// ============================================================

const MAPPA_FOTO_GRUPPO = {
    'gruppo1': 'https://via.placeholder.com/400x300/1a1f35/ffd200?text=Foto+di+Gruppo',
    'natale': 'https://via.placeholder.com/400x300/1a1f35/ffd200?text=Buon+Natale'
};

// ============================================================
// 4. REFERENZE AL DOM
// ============================================================

const schermataLogin = document.getElementById('schermataLogin');
const schermataCalendario = document.getElementById('schermataCalendario');
const inputNome = document.getElementById('inputNome');
const btnLogin = document.getElementById('btnLogin');
const erroreLogin = document.getElementById('erroreLogin');
const nomeUtenteSpan = document.getElementById('nomeUtente');
const calendarioDiv = document.getElementById('calendario');
const contenutoGiornoDiv = document.getElementById('contenutoGiorno');
const btnReset = document.getElementById('btnReset');

// ============================================================
// 5. FUNZIONI DI SALVATAGGIO
// ============================================================

function salvaStato() {
    if (!nomeUtente) return;
    const chiave = `${STORAGE_KEY}_${nomeUtente.toLowerCase().trim()}`;
    localStorage.setItem(chiave, JSON.stringify(statoUtente));
    console.log('💾 Stato salvato per', nomeUtente);
}

function caricaStato(nome) {
    const chiave = `${STORAGE_KEY}_${nome.toLowerCase().trim()}`;
    const dati = localStorage.getItem(chiave);
    if (dati) {
        try {
            statoUtente = JSON.parse(dati);
            console.log('📂 Stato caricato per', nome, statoUtente);
            return true;
        } catch {
            return false;
        }
    }
    return false;
}

function creaNuovoStato() {
    statoUtente = {
        giorniAperti: [],
        dataUltimoAccesso: new Date().toISOString().split('T')[0]
    };
    salvaStato();
}

// ============================================================
// 6. FUNZIONE PER OTTENERE IL LINK DELLA FOTO
// ============================================================

function getLinkFoto(nome, tipo) {
    if (!nome) nome = 'default';

    const nomeMinuscolo = nome.toLowerCase().trim();

    // 1. Controllo se è una foto di gruppo
    if (MAPPA_FOTO_GRUPPO[tipo]) {
        return MAPPA_FOTO_GRUPPO[tipo];
    }

    // 2. Controllo se l'amico esiste nella mappa
    if (MAPPA_FOTO_AMICI[nomeMinuscolo]) {
        const fotoAmico = MAPPA_FOTO_AMICI[nomeMinuscolo];

        // 3. Se il tipo è una chiave (es. "foto1", "foto2"), cerco quella specifica
        if (fotoAmico[tipo]) {
            return fotoAmico[tipo];
        }

        // 4. Se non trovo il tipo specifico, prendo la prima foto disponibile
        const primaChiave = Object.keys(fotoAmico)[0];
        if (primaChiave) {
            return fotoAmico[primaChiave];
        }
    }

    // 5. Se non trovo nulla, uso una foto di placeholder
    return `https://via.placeholder.com/400x300/1a1f35/ffd200?text=${encodeURIComponent(nome)}`;
}

// ============================================================
// 7. LOGICA DEI GIORNI - FORZATA PER TEST (return 24)
// ============================================================

function giornoCorrente() {
    // 🔧 FORZATO PER TEST: Oggi è il 24 dicembre
    return 24;

    // CODICE ORIGINALE (commentato)
    // const oggi = new Date();
    // const mese = oggi.getMonth();
    // const giorno = oggi.getDate();
    // if (mese !== 11 || giorno > 24 || giorno < 1) {
    //     return null;
    // }
    // return giorno;
}

function isGiornoSbloccato(giorno) {
    const oggi = giornoCorrente();
    if (oggi === null) return false;
    return giorno <= oggi;
}

function isGiornoAperto(giorno) {
    if (!statoUtente) return false;
    return statoUtente.giorniAperti.includes(giorno);
}

function apriGiorno(giorno) {
    if (!statoUtente) return;
    if (!statoUtente.giorniAperti.includes(giorno)) {
        statoUtente.giorniAperti.push(giorno);
        statoUtente.giorniAperti.sort((a, b) => a - b);
        statoUtente.dataUltimoAccesso = new Date().toISOString().split('T')[0];
        salvaStato();
        console.log('🔓 Giorno aperto:', giorno);
    }
}

// ============================================================
// 8. CARICAMENTO CONTENUTI (JSON nella stessa cartella)
// ============================================================

async function caricaContenuto(giorno) {
    console.log('📥 Carico contenuto per il giorno:', giorno);
    try {
        const response = await fetch(`${giorno}.json`);
        console.log('📡 Response status:', response.status);
        if (!response.ok) throw new Error('File non trovato');
        const data = await response.json();
        console.log('✅ Contenuto caricato:', data);
        return data;
    } catch (error) {
        console.error('❌ Errore caricamento contenuto:', error);
        return {
            titolo: `🎁 Giorno ${giorno}`,
            testo: `Contenuto non disponibile per oggi. Torna domani! 🎄`,
            tipo: 'testo'
        };
    }
}

// ============================================================
// 9. RENDER DEL CONTENUTO
// ============================================================

function renderizzaContenuto(data, giorno) {
    const nome = nomeUtente;
    console.log('🎨 Renderizzo contenuto per', nome, 'giorno', giorno, data);

    let html = `<h2>${data.titolo || `🎁 Giorno ${giorno}`}</h2>`;

    // Sostituisco {nome} nel testo
  let testo = data.testo || '';
testo = testo.replace(/\{nome\}/g, nome);

// 🔧 CONVERTE I LINK IN LINK CLICCABILI
testo = testo.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

html += `<div class="testo">${testo.replace(/\n/g, '<br>')}</div>`;

    // IMMAGINE: Uso la mappa delle foto in base al nome e al tipo
    if (data.immagine) {
        const tipoFoto = data.immagine.trim();
        let fotoLink;

        // Se il tipo contiene "http", è già un link completo
        if (tipoFoto.startsWith('http')) {
            fotoLink = tipoFoto;
        } else {
            // Altrimenti uso la mappa
            fotoLink = getLinkFoto(nome, tipoFoto);
        }

        html += `<img src="${fotoLink}" alt="Contenuto giorno ${giorno}" loading="lazy" style="max-width:100%; border-radius:12px; margin-top:15px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">`;
    }

    // VIDEO
    if (data.video) {
        let videoPath = data.video.replace(/\{nome\}/g, nome);
        if (videoPath.includes('youtube.com') || videoPath.includes('youtu.be')) {
            html += `<iframe src="${videoPath}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen style="width:100%; height:400px; border:none; border-radius:12px; margin-top:15px;"></iframe>`;
        } else {
            html += `<video src="${videoPath}" controls style="max-width:100%; border-radius:12px; margin-top:15px;"></video>`;
        }
    }

    // AUDIO
    if (data.audio) {
        let audioPath = data.audio.replace(/\{nome\}/g, nome);
        html += `<audio src="${audioPath}" controls style="width:100%; margin-top:15px;"></audio>`;
    }

    // MINI-GIOCO
    if (data.minigioco) {
        let minigiocoPath = data.minigioco.replace(/\{nome\}/g, nome);
        minigiocoPath = minigiocoPath.replace('minigiochi/', '');
        html += `<iframe id="minigioco-frame-${giorno}" src="${minigiocoPath}" allow="autoplay; encrypted-media" style="width:100%; height:500px; border:none; border-radius:12px; margin-top:15px; background:#0a0e1a; transition: height 0.3s ease;"></iframe>`;

        // Adatta l'altezza al contenuto dopo il caricamento
        setTimeout(() => {
            const frame = document.getElementById(`minigioco-frame-${giorno}`);
            if (frame) {
                try {
                    // Prova a leggere l'altezza del contenuto
                    const height = frame.contentWindow.document.body.scrollHeight;
                    if (height > 100) {
                        frame.style.height = height + 'px';
                    }
                } catch (e) {
                    // Se non riesce (per problemi di cross-origin), usa l'altezza minima
                    frame.style.height = '500px';
                }
            }
        }, 300);
    }

    // Data di apertura
    const oggi = new Date();
    html += `<div class="data-apertura" style="font-size:0.8em; color:#667; margin-top:20px; font-style:italic;">📅 Aperto il ${oggi.toLocaleDateString('it-IT')}</div>`;

    contenutoGiornoDiv.innerHTML = html;
    console.log('✅ Contenuto renderizzato!');
}

// ============================================================
// 10. RENDER DEL CALENDARIO
// ============================================================

function renderizzaCalendario() {
    console.log('📅 Renderizzo calendario');
    calendarioDiv.innerHTML = '';
    const oggi = giornoCorrente();
    console.log('📅 Oggi (forzato):', oggi);

    for (let i = 1; i <= GIORNI_TOTALI; i++) {
        const div = document.createElement('div');
        div.className = 'giorno';
        div.dataset.giorno = i;

        const sbloccato = isGiornoSbloccato(i);
        const aperto = isGiornoAperto(i);

        let icona = '🔒';
        let check = '';

        if (aperto) {
            div.classList.add('aperto');
            icona = '🎄';
            check = '<span class="check">✓</span>';
        } else if (sbloccato) {
            div.classList.add('sbloccato');
            icona = '🎁';
        } else {
            div.classList.add('bloccato');
            icona = '🔒';
        }

        div.innerHTML = `${icona}<span class="numero">${i}</span>${check}`;

        if (sbloccato) {
            div.addEventListener('click', () => {
                gestisciClickGiorno(i);
            });
        }

        calendarioDiv.appendChild(div);
    }
    console.log('✅ Calendario renderizzato!');
}

// ============================================================
// 11. GESTIONE CLICK GIORNO
// ============================================================

async function gestisciClickGiorno(giorno) {
    console.log('🖱️ Cliccato giorno:', giorno);
    apriGiorno(giorno);
    const data = await caricaContenuto(giorno);
    renderizzaContenuto(data, giorno);
    renderizzaCalendario();
    setTimeout(() => {
        contenutoGiornoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ============================================================
// 12. LOGIN
// ============================================================

function login() {
    const nome = inputNome.value.trim();
    if (!nome) {
        erroreLogin.textContent = '⚠️ Inserisci il tuo nome!';
        return;
    }

    if (!/^[a-zA-ZàèìòùÀÈÌÒÙ\s]+$/.test(nome)) {
        erroreLogin.textContent = '⚠️ Usa solo lettere!';
        return;
    }

    nomeUtente = nome;
    erroreLogin.textContent = '';
    console.log('👤 Login:', nomeUtente);

    const statoEsistente = caricaStato(nome);
    if (!statoEsistente) {
        creaNuovoStato();
    }

    schermataLogin.style.display = 'none';
    schermataCalendario.style.display = 'block';
    nomeUtenteSpan.textContent = nomeUtente;

    renderizzaCalendario();

    if (statoUtente.giorniAperti.length > 0) {
        const ultimoGiorno = statoUtente.giorniAperti[statoUtente.giorniAperti.length - 1];
        caricaContenuto(ultimoGiorno).then(data => {
            renderizzaContenuto(data, ultimoGiorno);
        });
    } else {
        contenutoGiornoDiv.innerHTML = `
            <h2>🎄 Benvenuto, ${nomeUtente}!</h2>
            <div class="testo">
                Apri un giorno del calendario per scoprire la sorpresa di oggi!<br><br>
                🗓️ Ogni giorno, dal 1 al 24 dicembre, troverai qualcosa di speciale.<br>
                🎅 I giorni futuri sono bloccati... dovrai aspettare!<br><br>
                Buon Avvento! ⭐
            </div>
        `;
    }
}

// ============================================================
// 13. RESET
// ============================================================

function resetCalendario() {
    if (!confirm(`⚠️ Sicuro di voler ricominciare da capo, ${nomeUtente}? Perderai tutti i progressi.`)) {
        return;
    }
    const chiave = `${STORAGE_KEY}_${nomeUtente.toLowerCase().trim()}`;
    localStorage.removeItem(chiave);
    creaNuovoStato();
    renderizzaCalendario();
    contenutoGiornoDiv.innerHTML = `
        <h2>🔄 Ricominciato!</h2>
        <div class="testo">
            Tutti i giorni sono stati bloccati. Buon avvento, ${nomeUtente}! 🎄
        </div>
    `;
}

// ============================================================
// 14. EVENTI
// ============================================================

btnLogin.addEventListener('click', login);
inputNome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') login();
});
btnReset.addEventListener('click', resetCalendario);

document.addEventListener('DOMContentLoaded', () => {
    inputNome.focus();
});

console.log('🚀 Calendario Avvento caricato!');
