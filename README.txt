## Installation

First of all, create the .env file at the root of the project

```bash
	- docker-compose.yml
	- .env
	- .env-dist
```

After that u can start the cocker-compose by enter
```bash
	docker-compose up --build
```

Then u need to create the database from the backend container : 
```bash
	#find the id of matcha-fastapi-backend
	docker ps 

	docker exec -it <container_id> bash
	python create_database.py
```

Finally, u can start the frontend by enter in the frontend folder :
```bash
	npm install && npm run dev
```