# Come aggiungere una certificazione

Le certificazioni vivono in un solo file, `certifications.json`. Da lì le leggono sia il sito (`index.html`) sia il CV stampabile (`cv.html`), quindi le aggiorni una volta sola.

## 1. Aggiungi la voce

```json
{
  "transcript": "https://learn.microsoft.com/it-it/users/TUO-UTENTE/transcript/CODICE",
  "showPlanned": false,
  "certifications": [
    {
      "name": "Microsoft Certified: Identity and Access Administrator Associate",
      "code": "SC-300",
      "earned": "2026-10-14",
      "expires": "2027-10-14",
      "verify": "https://learn.microsoft.com/api/credentials/share/..."
    }
  ]
}
```

| Campo | Obbligatorio | Note |
|---|---|---|
| `name` | sì | Il nome ufficiale, come compare su Microsoft Learn. Il prefisso “Microsoft Certified:” viene tolto in automatico nella visualizzazione. |
| `code` | no | Il codice dell’esame associato (es. SC-300). |
| `earned` | sì | Data di conseguimento, formato `AAAA-MM-GG`. |
| `expires` | no | Data di scadenza. Le certificazioni Fundamentals non scadono: ometti il campo. Quando la data passa, la certificazione resta visibile ma marcata “Scaduta”, in fondo all’elenco. |
| `verify` | no | Link di verifica pubblico. Sono accettati solo link `https://learn.microsoft.com/...`; gli altri vengono scartati. |

**Dove trovi il link `verify`:** Microsoft Learn › Profilo › Certificazioni › *Visualizza i dettagli della certificazione* › *Condividi*. Il profilo Learn deve essere pubblico, altrimenti chi apre il link non riesce a verificarla.

**Dove trovi il link `transcript`:** Microsoft Learn › Profilo › Transcript › *Impostazioni transcript* (scegli di condividere solo le certificazioni) › *Condividi collegamento*. Lascia il campo vuoto se non vuoi mostrarlo.

## 2. Certificazioni in preparazione (facoltativo)

```json
{ "status": "planned", "name": "Microsoft Certified: Endpoint Administrator Associate", "code": "MD-102", "target": "2027-01" }
```

Compaiono solo se imposti `"showPlanned": true`. Usale solo con un esame già prenotato.

## 3. Pubblica e rigenera il PDF

1. Salva `certifications.json`, fai commit e push. Il sito si aggiorna da solo.
2. Apri `https://tuodominio/cv.html` in Chrome o Edge, clicca **Salva come PDF**. Nella finestra di stampa: destinazione “Salva come PDF”, margini “Nessuno”, “Grafica di sfondo” attiva.
3. Salva il file come `cv-marco-toma.pdf`, sostituiscilo nel repository e fai push: è quello scaricabile dal sito.
4. Per la versione da allegare alle candidature, prima di stampare scrivi il telefono nel campo in alto. Resta solo in quella pagina e non viene salvato da nessuna parte.

## Promemoria di rinnovo

Quando apri `cv.html`, la barra in alto (visibile solo a schermo, mai nel PDF) segnala le certificazioni entrate nella finestra di rinnovo, cioè negli ultimi 180 giorni prima della scadenza, e quelle già scadute. Dopo il rinnovo aggiorna `expires` con la nuova data.

## Se una voce non compare

Se un campo è sbagliato (data non valida, nome mancante) la voce viene ignorata senza rompere la pagina. Il campo `type` non serve; se però lo scrivi con un valore diverso da `certification` la voce viene scartata, come protezione nel caso un giorno importassi i dati in automatico da Microsoft Learn insieme a badge ed esami. Apri la console del browser (F12) per vedere le voci scartate.
