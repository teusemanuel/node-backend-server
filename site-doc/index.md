---
layout: default
title: header.title
description: header.description
languageLink: header.languageLink

---

# {% t index.useExistentStep %}

{% t index.contents %}
-----------------
* [1\. {% t index.confSteps.title %}](#{% t index.confSteps.titleId %})
* [2\. {% t index.requestsInApp.title %}](#{% t index.requestsInApp.titleId %})
* [3\. {% t index.components.title %}](#{% t index.components.titleId %})
* [4\. {% t index.codeStructure.title %}](#{% t index.codeStructure.titleId %})
* [5\. {% t index.guidelines.title %}](#{% t index.guidelines.titleId %})
* [6\. {% t index.scripts.title %}](#{% t index.scripts.titleId %})
    * [6\.1 {% t index.scripts.userAndProviders %}](#{% t index.scripts.userAndProvidersId %})

## {% t index.confSteps.title %}:

1. {% t index.confSteps.step1 %}

2. {% t index.confSteps.step2 %}

3. {% t index.confSteps.step3 %}

	```$ git clone https://github.com/teusemanuel/node-backend-server.git```
	
4. {% t index.confSteps.step4.title %}

	* {% t index.confSteps.step4.sub_0 %}:
		
		`$ cd ~/folder-checkout` 
		
	* {% t index.confSteps.step4.sub_1 %}:

		`$ npm install` 
		
	* {% t index.confSteps.step4.sub_2 %}:

	    `$ node_modules/.bin/typings install`

5. {% t index.confSteps.step5.title %}

	* {% t index.confSteps.step5.sub_0.title %}:
		
		**host:** *{% t index.confSteps.step5.sub_0.host %}*
		
		**user:** *{% t index.confSteps.step5.sub_0.user %}*
		
		**password:** *{% t index.confSteps.step5.sub_0.password %}*
		
		**database_production:** *{% t index.confSteps.step5.sub_0.database_production %}*
		
		**database_test:** *{% t index.confSteps.step5.sub_0.database_test %}*
		
	* {% t index.confSteps.step5.sub_1.title %}

	    {% t index.confSteps.step5.sub_1.link %}

6. {% t index.confSteps.step6.title %}

	* {% t index.confSteps.step6.sub_0.title %}:
		
		**secret:** {% t index.confSteps.step6.sub_0.secret %}

7. {% t index.confSteps.step7 %}

	`$ npm run build`
	
8. {% t index.confSteps.step8 %}

	`$ npm start`

## {% t index.components.title %}

## {% t index.codeStructure.title %}

## {% t index.guidelines.title %}

## {% t index.requestsInApp.title %}

## {% t index.scripts.title %}

#### {% t index.scripts.userAndProviders %}

~~~sql

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
--  Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  birthday date DEFAULT NULL,
  photo_url varchar(500) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for user_provider
-- ----------------------------
DROP TABLE IF EXISTS user_provider;
CREATE TABLE user_provider (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  user_id bigint(20) NOT NULL,
  user_token varchar(128) NOT NULL,
  display_name varchar(255) DEFAULT NULL,
  email varchar(255) NOT NULL,
  photo_url varchar(500) DEFAULT NULL,
  type varchar(20) NOT NULL,
  created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  connected_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_id (id) USING BTREE,
  KEY idx_type (type),
  CONSTRAINT fk_user_provider_user_id FOREIGN KEY (user_id) REFERENCES user (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

~~~