CREATE DATABASE IF NOT EXISTS db_smarttheeth;

USE db_smarttheeth;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE IF NOT EXISTS users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  secret VARCHAR (33) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id)
);

-- TABLE FAVORITE WIKIS
CREATE TABLE IF NOT EXISTS favorites (
  id INT(11) NOT  NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
  title VARCHAR(100) NOT NULL,
  link TEXT  NOT NULL,
  PRIMARY KEY (id),
  FOREIGN  KEY (user_id) REFERENCES users(id)
);

-- TABLE CREATED WIKIS
CREATE TABLE IF NOT EXISTS wikis (
  id INT(11) NOT  NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
  title VARCHAR(100) NOT NULL,
  category CHAR(20) NOT NULL,
  content TEXT NOT NULL,
  link TEXT  NOT NULL,
  PRIMARY KEY (id),
  FOREIGN  KEY (user_id) REFERENCES users(id)
);

DESCRIBE users;
DESCRIBE favorites;
DESCRIBE wikis;