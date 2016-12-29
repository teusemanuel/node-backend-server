---
layout: default
title: header.title
description: header.description

---

# {% t index.useExistentStep %}


## Steps:

1. Install [Node JS](https://nodejs.org/en/ "Node Js"). Node itself is just an executable, so you don’t really need to install it, but doing so will be easier and will install the node package manager (npm) as well.

2. Install [MySQL](http://dev.mysql.com/downloads/mysql/ "MySQL Database") to persist data.

3. Check-out project

	```$ git clone https://github.com/teusemanuel/node-backend-server.git```
	
4. Checkout of project dependencies in command-line

	* go to node-backend-server checkout folder 
		
		`$ cd ~/folder-checkout` 
		
	* install dependencies 

		`$ npm install` 
		
	* in project root folder install typings dependencies for working with typescript:
	
		`$ node_modules/.bin/typings install`

5. Configure database for run fist time

	* in `src/config.ts` have:
		
		**host:** *host of the your database*
		
		**user:** *user for authentication in database with the necessary privileges*
		
		**password:** *password utilised for user authentication in the database*
		
		**database_production:** *database utilised when this server run in your production*
		
		**database_test:** *database utilised when you developing your application*
		
	* Initial script

```sql
/*
 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50625
 Source Host           : localhost
 Source Database       : node_server_test
	
 Target Server Type    : MySQL
 Target Server Version : 50625
 File Encoding         : utf-8
*/
	
SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;
	
-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
	
-- ----------------------------
--  Table structure for `user_provider`
-- ----------------------------
DROP TABLE IF EXISTS `user_provider`;
CREATE TABLE `user_provider` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `user_token` varchar(128) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `connected_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_id` (`id`) USING BTREE,
  KEY `idx_type` (`type`),
  CONSTRAINT `fk_user_provider_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
	
SET FOREIGN_KEY_CHECKS = 1;

```

5. Configure your secret key utilized from when generate your secrete hash in login authentication.

	* in `src/config.ts` change:
		
		**secret:** *key utilized from you application for generate a hash token* see more about [Node-JsonWebToken](https://github.com/auth0/node-jsonwebtoken "JsonWebToken from Node JS") utilization.

6. Build project

	`$ npm run build`
	
7. Run server

	`$ npm start`
