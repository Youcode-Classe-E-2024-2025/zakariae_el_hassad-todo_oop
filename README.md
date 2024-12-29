# TaskFlow

TaskFlow est une application web simple de gestion de tâches, conçue pour aider les développeurs à apprendre les bases de la programmation orientée objet (POO) tout en créant un outil utile pour gérer leurs tâches. Cette application inclut des fonctionnalités essentielles telles que la création de tâches, la gestion des statuts, et l’attribution des tâches aux utilisateurs.

## Fonctionnalités Principales

### Gestion des Tâches
- **Création de Tâches Basiques :** Permet de créer des tâches simples avec un titre, une description, et une priorité.
- **Création de Tâches Spécifiques :** Les utilisateurs peuvent créer des bugs ou des features avec des attributs spécifiques.
- **Changement de Statut :** Les utilisateurs peuvent changer le statut d’une tâche (To Do, In Progress, Done).
- **Attribution des Tâches :** Les tâches peuvent être assignées à un utilisateur spécifique.

### Interface Simple
- **Liste des Tâches :** Vue centrale affichant toutes les tâches existantes.
- **Formulaire de Création :** Une interface intuitive pour créer de nouvelles tâches.
- **Page de Détail :** Affiche les détails complets d’une tâche spécifique.
- **Vue par Utilisateur :** Permet de filtrer les tâches par utilisateur assigné.

## User Stories

### En tant qu’Utilisateur
1. Je veux pouvoir créer une tâche simple.
2. Je veux pouvoir créer un bug ou une feature.
3. Je veux pouvoir changer le statut d’une tâche.
4. Je veux voir les tâches qui me sont assignées.

### En tant que Développeur
1. Je dois utiliser l’encapsulation (private, getters/setters).
2. Je dois utiliser l’héritage pour les types de tâches (Bug, Feature).
3. Je dois créer un diagramme de classes basique.
4. Je dois valider les données d’entrée pour garantir leur cohérence.

## Architecture du Projet

### Structure des Dossiers
- **assets/** : Contient les fichiers CSS, images et JavaScript.
- **classes/** : Contient les classes principales (Task, Bug, Feature, User, Database).
- **config/** : Contient la configuration de la base de données.
- **controllers/** : Contient les fichiers de contrôleur pour la logique backend (TaskController, UserController).
- **database/** : Contient les scripts SQL pour initialiser la base de données.
- **docs/** : Contient la documentation et le diagramme de classes.
- **views/** : Contient les fichiers PHP pour la vue (index.php, login.php, signup.php, etc.).

### Diagramme de Classes
Un diagramme de classes est inclus dans `docs/class-diagram.png` pour illustrer les relations entre les entités principales du projet.

### Base de Données
Le script d’initialisation de la base de données se trouve dans `database/init.sql`.

## Installation

1. **Prérequis** : Assurez-vous d’avoir PHP, un serveur local (comme Laragon ou XAMPP), et une base de données MySQL installés.
2. Clonez le projet :
   ```bash
   https://github.com/Youcode-Classe-E-2024-2025/hamza_atig-todo_oop.git
   ```
3. Importez le fichier `database/init.sql` dans votre serveur MySQL.
4. Configurez le fichier `config/db.php` avec vos identifiants MySQL.
5. Lancez le projet sur votre serveur local.
6. Accédez à l’application via `http://localhost/TODO_OOP`.

## Utilisation

1. Créez un compte ou connectez-vous.
2. Accédez à la page d’ajout de tâches pour créer une nouvelle tâche.
3. Visualisez et gérez vos tâches depuis la page principale.
4. Filtrez les tâches par utilisateur ou par statut selon vos besoins.

## Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes pour contribuer :
1. Forkez le projet.
2. Créez une branche pour vos modifications : `git checkout -b nouvelle-fonctionnalite`.
3. Envoyez vos changements : `git commit -m "Ajout d'une nouvelle fonctionnalité"`.
4. Poussez votre branche : `git push origin nouvelle-fonctionnalite`.
5. Soumettez une pull request.

## License

Ce projet est sous licence [MIT](LICENSE).