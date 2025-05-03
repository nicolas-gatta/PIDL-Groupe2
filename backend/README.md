
# Backend PIDL - Documentation et Démarrage

## Prérequis

- Python 3.12
- MySQL Server
- pip (gestionnaire de paquets Python)
- Un environnement virtuel activé (recommandé)

## Installation des dépendances

```bash
cd backend
pip install -r requirements.txt
```

## Initialisation de la base de données

1. Créer et remplir la base de données avec la structure et les données initiales :

```bash
mysql -u root -p < ../database/full_script.sql
pass: 1234
```

2. Appliquer les migrations Django (nécessaires pour les tables auth, admin, etc.) :

```bash
python manage.py migrate
```

3. Injecter les permissions liées aux modèles existants :

```bash
mysql -u root -p pidl < ../database/init_permissions.sql
pass: 1234
```

## Lancement du serveur de développement

```bash
python manage.py runserver
```

## Accès à la documentation API

- Documentation Swagger (interactive) : [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
- Documentation ReDoc : [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)

## quelques accès au navigateur:

1. Lister tous les modèles (Model)
http://127.0.0.1:8000/api/v1/models/

2. Obtenir les détails d’un modèle spécifique (ex: modèle avec id=1)

http://127.0.0.1:8000/api/v1/models/1/

3. Filtrer les modèles par architecture

http://127.0.0.1:8000/api/v1/models/?architecture=CNN

4. Recherche dans le nom du modèle

http://127.0.0.1:8000/api/v1/models/?search=YOLO

5. Filtrer les évaluations selon une valeur minimale de accuracy

http://127.0.0.1:8000/api/v1/evaluations/?accuracy__gte=0.80
