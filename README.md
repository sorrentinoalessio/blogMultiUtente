# Blog Multi-Utente API & Real-time

Sistema backend costruito con **Node.js**, **Express**, **MongoDB** e **Socket.io**. Gestisce il ciclo di vita dell'utente, la pubblicazione di contenuti e commenti e like istantanei, con notifica nuovi commenti.

---

## 🔗 Repository GitHub
> **URL:** https://github.com/sorrentinoalessio/blogMultiUtente/

---

## Caratteristiche Principali

* **Autenticazione**: Registrazione, Login JWT, conferma account via email e recupero password.
* **Gestione Post**: CRUD completo con supporto a tag, stati (public, draft, delete, archived) e validazione degli ID.
* **Real-time engine**: Like e Commenti gestiti tramite classi Action asincrone e WebSockets.
* **Media Management**: Upload di avatar personalizzati con rinomina univoca.
* **Validazione Dati**: Protezione totale tramite schemi Joi (Body, Params, Query).
* **CI/CD Pipeline**: Testing automatico e deploy continuo su AWS tramite GitHub Actions.

---

## 🚀 Installazione e Avvio Locale

1. Clona la repository.
2. Installa le dipendenze:
   npm install
3. Configura il file .env.
4. Avvia il server:
   npm start

---

## 📖 Documentazione Interattiva (Swagger)

Il progetto utilizza **Swagger (OpenAPI 3.0)** per mappare gli endpoint e testare i CRUD.

### Accesso
Una volta avviato il server localmente, la documentazione è raggiungibile a:
> **URL:** http://127.0.0.1:3001/api-docs

### Come testare le rotte protette (JWT)
1. Esegui la chiamata POST /user/login.
2. Copia il token ricevuto.
3. Clicca su "Authorize" (icona lucchetto) in alto a destra.
4. Incolla il token (formato: Bearer <tuo_token>) e conferma.

---

## 🔐 Configurazione Environment (.env)

Crea un file .env nella root del progetto:

MAIL_USER=""
MAIL_PASSWORD=""
PRIVATE_KEY=''
PUBLIC_KEY=''

---

## 🛡️ Repository Secrets (GitHub Actions)
Configura queste variabili in **Settings > Secrets and variables > Actions** per il deploy automatico su AWS:

* AWS_HOST          -> Indirizzo IP/Host del server
* AWS_SSH_KEY       -> Chiave privata (.pem) per accesso SSH
* MAIL_USER         -> Email per invio notifiche
* MAIL_PASSWORD     -> App Password email
* MONGODB_URI       -> Stringa connessione DB
* PRIVATE_KEY       -> Chiave privata firma JWT
* PUBLIC_KEY        -> Chiave pubblica verifica JWT
* SWAGGER_URL       -> URL Swagger (es. https://alessio-be.longwavestudio.dev/api-docs)

---

## 🧪 Testing & Code Coverage

npm install
npm test          # Esegue i test (Mocha/Chai)
npm run coverage  # Genera report di copertura (C8)

---

## 🌐 Configurazione Nginx (Reverse Proxy)

Configurazione per il dominio **alessio-be.longwavestudio.dev** con supporto WebSocket e CORS:

server {
    server_name alessio-be.longwavestudio.dev;
    root /usr/local/repos/todolist-be;
    index index.html;

    add_header "Access-Control-Allow-Origin" "*" always;
    add_header "Access-Control-Allow-Methods" "PUT, POST, PATCH, DELETE, GET, OPTIONS, HEAD" always;

    if ($request_method = "OPTIONS") {
        return 204;
    }

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443;
}

---

## Deploy CI/CD (GitHub Actions)
Il workflow automatizza:
1. Setup e **npm install**.
2. Esecuzione Test.
3. Deploy SSH su AWS: git pull, aggiornamento env e restart con PM2.