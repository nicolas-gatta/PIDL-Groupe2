# Projet de gestion de données énergétiques de modèles IA
This project provides a web-based database for storing and analyzing AI model performance on Edge AI devices. It allows users to compare models based on accuracy, energy consumption, and various optimization parameters (compression, quantization, etc.) to select the best configuration before deployment.

## Table of contents
1. [Structure](#structure)
2. [Prerequisites](#prerequisites)
3. [Django basic command](#django-basics)
3. [React basic command](#react-basics)

---
### 🔧 Structure

- `backend/` – Django project (API, business logic, admin interface, endpoints)
- `database/` – SQL files for MySQL (schema, sample data, views)
- `frontend/` – GUI interface

- `docs/` – Specifications, reports, technical diagrams
    - `modelisation/` - MLD, MCD
    - `mockups/` – UI/UX designs and wireframes
----
### Prerequisites

#### 1. Install Python
Install ```python-3.12.8```. Follow the steps from the below reference document based on your Operating System.

Reference: [Python Version 3.12.8](https://www.python.org/downloads/release/python-3128/)

#### 2. Install MySQL
Install ```mysql-8.0.41```. Follow the steps form the below reference document based on your Operating System.

Reference: [MySQL Version 8.0.41](https://dev.mysql.com/downloads/installer/)

#### 3. Clone git repository
```bash
git clone "https://github.com/nicolas-gatta/PIDL-Groupe2.git"
```

#### 4. Install requirements
```bash
pip install -r requirements.txt
```

#### 5. Download .env file
Need to be done

---

### Django Basics

#### 1. Go to the backend folder
```bash
cd backend
```

#### 2. Run the server on the port 8000
```bash
python manage.py runserver
```

Try opening [http://localhost:8000](http://localhost:8000) in the browser.
Now you are good to go.

#### 3. Create App (which is directory containing a part of the app, for example, login page etc)
> [!IMPORTANT]  
> Please be sure that you are in the `backend` folder when you execute the command and replace the `X` by the name of the folder

```bash
python manage.py startapp X
```
---
### React Basics

### 1. Go to the frontend folder

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

Open [http://localhost:8081/](http://localhost:8081/) in your browser.  You're now up and running!
