# Projet de gestion de données énergétiques de modèles IA
This project provides a web-based database for storing and analyzing AI model performance on Edge AI devices. It allows users to compare models based on accuracy, energy consumption, and various optimization parameters (compression, quantization, etc.) to select the best configuration before deployment.

## Table of contents
1. [Prerequisites](#prerequisites)
2. [Django basic command](#django-basics)

----
### Prerequisites

#### 1. Install Python
Install ```python-X```. Follow the steps from the below reference document based on your Operating System.
Reference: [Python Version X](https://www.python.org/)

#### 2. Install MySQL
Install ```mysql-X```. Follow the steps form the below reference document based on your Operating System.
Reference: [MySQL Version X](https://www.mysql.com/fr/)

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

#### 1. Go to the src file
```bash
cd src
```

#### 2. Run the server on the port 8000
```bash
python manage.py runserver
```

Try opening [http://localhost:8001](http://localhost:8000) in the browser.
Now you are good to go.

#### 3. Create App (which is directory containing a part of the app, for example, login page etc)
> [!IMPORTANT]  
> Please be sure that you are in the src folder when you execute the command and replace the X by the name of the folder

```bash
python manage.py startapp X
```
