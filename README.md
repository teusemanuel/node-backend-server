# Node Backend Server #

This project create for working of the api for any Apps with node .

### What is this repository for? ###

* Quick summary
* Version

### How do I get set up? ###

* run:
	
	`npm install`

* after run:

	```
	node_modules/.bin/typings install dt~body-parser --global --save
	```
	```
	node_modules/.bin/typings install dt~cookie-parser --global --save
	```
	```
	node_modules/.bin/typings install dt~express --global --save
	```
	```
	node_modules/.bin/typings install dt~express-serve-static-core --global --save
	```
	```
	node_modules/.bin/typings install dt~mime --global --save
	```
	```
	node_modules/.bin/typings install dt~morgan --global --save
	```
	```
	node_modules/.bin/typings install dt~mysql --global --save
	```
	```
	node_modules/.bin/typings install dt~node --global --save
	```
	```
	node_modules/.bin/typings install dt~serve-favicon --global --save
	```
	```
	node_modules/.bin/typings install dt~serve-static --global --save
	```
	```
	node_modules/.bin/typings install npm:cerialize --save
	```
	```
	node_modules/.bin/typings install npm:typedi --save
	```

* Database configuration
* How to run tests

	[https://www.npmjs.com/package/loadtest](https://www.npmjs.com/package/loadtest)
	
	* Example:
	
		```
		loadtest -c 10 --rps 200 http://localhost:9000/
		```

* Deployment instructions

### Build and run app ###

* Build app:

	```
	gulp compile
	```

* Run app:(In root project path)

	```
	node bin/www
	```

* Build and Run app:(In root project path)

	```
	npm start
	```

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact