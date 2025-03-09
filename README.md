# toto_election

---

# README - Backend du site de publications et commentaires

Ce projet est une API RESTful développée avec Node.js pour un site permettant aux administrateurs de publier des articles et aux utilisateurs anonymes de commenter (les commentaires sont organisés sous forme de discussions).

---

## Fonctionnalités principales

- **Gestion des administrateurs** : Création, authentification et gestion des comptes admins.
- **Gestion des publications** : Création, modification, suppression et consultation des publications par les admins.
- **Gestion des commentaires** : Ajout de commentaires anonymes sur les publications, organisation des réponses sous forme de discussions, reaction au publication, censure des reponses.

---

## Liste des endpoints

### 1. **Endpoints pour les administrateurs**
- `POST /api/admins/register`  
- `POST /api/admins/login`  
- `GET /api/admins/me` *(protégé)*  
- `PUT /api/admins/me` *(protégé)*  

### 2. **Endpoints pour les publications**
- `POST /api/publications/create` *(protégé)*  
- `GET /api/publications/list`  
- `GET /api/publications/profile/:id`  
- `PUT /api/publications/profile/:id` *(protégé)*  
- `DELETE /api/publications/profile/:id` *(protégé)*  

### 3. **Endpoints pour les commentaires**
- `POST /api/publications/:id/comments/new`  
- `GET /api/publications/:id/comments/list`  
- `POST /api/comments/:commentId/replies/new`
- `GET /api/comments/:commentId/replies/list` *(protégé)*  
- `DELETE /api/comments/:messageId` *(protégé)*

---

## Division des tâches

### Développeur Backend Toky : Gestion des administrateurs et des publications
- Implémenter les endpoints pour les administrateurs (`/api/admins/*`).
- Implémenter les endpoints pour les publications (`/api/publications/*`).
- Configurer la base de données pour les tables "admins" et "publications".
- Écrire les tests unitaires pour ces endpoints.

### Développeur Backend Angelo : Gestion des commentaires
- Implémenter les endpoints pour les commentaires (`/api/publications/:id/comments`, `/api/comments/:commentId/*`).
- Configurer la base de données pour la table "comments" avec une structure hiérarchique (ex. : champ `parentId` pour les réponses).
- Écrire les tests unitaires pour ces endpoints.

---