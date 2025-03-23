# Projet de gestion de données énergétiques de modèles IA
This project provides a web-based database for storing and analyzing AI model performance on Edge AI devices. It allows users to compare models based on accuracy, energy consumption, and various optimization parameters (compression, quantization, etc.) to select the best configuration before deployment.

## Table of contents
[Prerequisites](#prerequisites)


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
git clone "https://github.com/nicolas-gatta/BDDW_WS_Groupe2.git"
```

#### 4. Install requirements
```bash
pip install -r requirements.txt
```

#### 5. Download .env file
Need to be done

#### 6. Run the server
```bash


# Run the server on the port 8001
python manage.py runserver 0:8001
```
Try opening [http://localhost:8001](http://localhost:8001) in the browser.
Now you are good to go.
