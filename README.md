# 📝 Blog Multi-Utente API & Real-time

Sistema backend professionale costruito con **Node.js**, **Express**, **MongoDB** e **Socket.io**. Gestisce il ciclo di vita dell'utente, la pubblicazione di contenuti e le interazioni social istantanee.



---

## 🚀 Caratteristiche Principali

* **Autenticazione**: Registrazione, Login JWT, conferma account via email e recupero password.
* **Gestione Post**: CRUD completo con supporto a tag, stati (`public`, `draft`, `delete`) e validazione degli ID.
* **Real-time engine**: Like e Commenti gestiti tramite classi `Action` asincrone e WebSockets.
* **Media Management**: Upload di avatar personalizzati con rinomina univoca e gestione automatica del filesystem.
* **Validazione Dati**: Protezione totale tramite schemi **Joi** (Body, Params, Query).
* **CI/CD Pipeline**: Testing automatico e deploy continuo su AWS tramite GitHub Actions.

---

## 📋 Documentazione API (REST)

### 🔐 Autenticazione e Profilo
| Metodo | Endpoint | Descrizione | Validazione Joi |
| :--- | :--- | :--- | :--- |
| **POST** | `/user` | Registrazione | `name`(3+), `email`, `pwd`(3+) |
| **GET** | `/user/:id/confirm/:token` | Conferma Account | `id`(24 hex), `token`(16 char) |
| **POST** | `/user/login` | Login | `email`, `password` |
| **PATCH** | `/user/profile/update` | Aggiorna Nome | `profileBodyValidator` |
| **POST** | `/user/profile/avatar/upload` | Upload Avatar | `imageCreationMiddleware` |
| **POST** | `/user/reset_password` | Richiesta Reset | `email` valida |
| **POST** | `/user/new_password/:token` | Nuova Password | `passwordNew`(3+) |



### ✍️ Gestione Post (`PostRoutes`)
*Le rotte private richiedono l'header `Authorization: Bearer <token>`.*

| Metodo | Endpoint | Descrizione | Middleware / Validatore |
| :--- | :--- | :--- | :--- |
| **POST** | `/user/post/create` | Crea Post | `postBodyValidator` | 
| **GET** | `/user/post/` | Post dell'utente | `checkAuthorizationMiddleware` |
| **GET** | `/user/post/:id` | Dettaglio post utente | `postIdParamValidator` |
| **GET** | `/post/` | **Elenco pubblico** | *Accesso Libero* |
| **GET** | `/user/tag/:id` | Tag di un post | `postIdParamValidator` |
| **PATCH** | `/user/post/update/:id` | Modifica stato/post | `postUpdateBodyValidator` |



---

## 🔌 Interazioni Real-time (Socket.io)

Il sistema gestisce le interazioni social tramite eventi socket autenticati. Le logiche sono incapsulate in classi `Action`.

* **Handshake**: Autenticazione obbligatoria tramite token JWT nell'handshake.
* **Azioni supportate**:
    * `LIKE_POST`: Toggle atomico del "Mi piace". Validato da `LikeBodyValidator`.
    * `COMMENT_POST`: Invio commenti (min 3 char). Validato da `CommentBodyValidator`.



---

## 🚢 Deploy e CI/CD

### Pipeline GitHub Actions
Il file `.github/workflows/main.yml` automatizza:
1.  **Test**: Esecuzione suite Mocha/Chai con `MongoMemoryServer`.
2.  **Deploy**: Connessione SSH su AWS, `git pull`, aggiornamento `.env` e reload tramite **PM2**.

### Configurazione Nginx
```nginx
location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}