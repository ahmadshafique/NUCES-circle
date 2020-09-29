-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema NU_circle
-- -----------------------------------------------------

DROP SCHEMA IF EXISTS `NU_circle`;

CREATE SCHEMA IF NOT EXISTS `NU_circle` DEFAULT CHARACTER SET latin1 ;
USE `NU_circle` ;


-- -----------------------------------------------------
-- Table `NU_circle`.`userauthenticate`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`userauthenticate` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`userauthenticate` (
  `userid` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(25) NOT NULL,
  `usertype` VARCHAR(3) default 'usr',
  `password` VARCHAR(200) NULL DEFAULT NULL,
  `approved` TINYINT(1) NULL DEFAULT '0',
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  `salt` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`userid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE UNIQUE INDEX `uc_username` ON `NU_circle`.`userauthenticate` (`username` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`posts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`posts` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`posts` (
  `userid` INT(11) NOT NULL,
  `postid` INT(11) NOT NULL AUTO_INCREMENT,
  `postbody` VARCHAR(1000) NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`postid`),
  CONSTRAINT `posts_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_userid` ON `NU_circle`.`posts` (`userid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`education`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`education` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`education` (
  `userid` INT(11) NOT NULL,
  `educationid` INT(11) NOT NULL AUTO_INCREMENT,
  `school` VARCHAR(50) NULL DEFAULT NULL,
  `startdate` DATE NULL DEFAULT NULL,
  `enddate` DATE NULL DEFAULT NULL,
  `currentlydoing` TINYINT(1) NULL DEFAULT '0',
  `degree` VARCHAR(50) NULL DEFAULT NULL,
  `field` VARCHAR(50) NULL DEFAULT NULL,
  `grade` DECIMAL(4,1) NULL DEFAULT NULL,
  `activities` VARCHAR(250) NULL DEFAULT NULL,
  `description` VARCHAR(1000) NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`educationid`),
  CONSTRAINT `education_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`)
  )
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `education_ibfk_1` ON `NU_circle`.`education` (`userid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`educationdetails`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`educationdetails` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`educationdetails` (
  `userid` INT(11) NOT NULL,
  `educationid` INT(11) NOT NULL,
  `detailslink` VARCHAR(50) NULL DEFAULT NULL,
  `fileorurl` ENUM('file','url') NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  CONSTRAINT `educationdetails_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`education` (`userid`),
  CONSTRAINT `educationdetails_ibfk_2`
    FOREIGN KEY (`educationid`)
    REFERENCES `NU_circle`.`education` (`educationid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_educationid` ON `NU_circle`.`educationdetails` (`userid` ASC, `educationid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`skills`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`skills` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`skills` (
  `userid` INT(11) NOT NULL,
  `skillid` INT(11) NOT NULL AUTO_INCREMENT,
  `skillname` VARCHAR(50) NULL DEFAULT NULL,
  `endorsementcount` INT(11) NULL DEFAULT '0',
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`skillid`),
  CONSTRAINT `skills_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_userid` ON `NU_circle`.`skills` (`userid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`experience`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`experience` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`experience` (
  `userid` INT(11) NOT NULL,
  `experienceid` INT(11) NOT NULL AUTO_INCREMENT,
  `companyname` VARCHAR(100) NULL DEFAULT NULL,
  `title` VARCHAR(50) NULL DEFAULT NULL,
  `location` VARCHAR(50) NULL DEFAULT NULL,
  `startdate` DATE NULL DEFAULT NULL,
  `enddate` DATE NULL DEFAULT NULL,
  `currentlyworking` TINYINT(1) NULL DEFAULT '0',
  `description` VARCHAR(1000) NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`experienceid`),
  CONSTRAINT `experience_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `experience_ibfk_1` ON `NU_circle`.`experience` (`userid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`experiencedetails`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`experiencedetails` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`experiencedetails` (
  `userid` INT(11) NOT NULL,
  `experienceid` INT(11) NOT NULL,
  `detailslink` VARCHAR(50) NULL DEFAULT NULL,
  `fileorurl` ENUM('file','url') NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  CONSTRAINT `experiencedetails_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`experience` (`userid`),
  CONSTRAINT `experiencedetails_ibfk_2`
    FOREIGN KEY (`experienceid`)
    REFERENCES `NU_circle`.`experience` (`experienceid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_experience` ON `NU_circle`.`experiencedetails` (`userid` ASC, `experienceid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`connections`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`connections` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`connections` (
  `user1id` INT(11) NOT NULL,
  `user2id` INT(11) NOT NULL,
  `approved` TINYINT(1) NOT NULL DEFAULT '0',
  `creationdate` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`user1id`, `user2id`),
  CONSTRAINT `connections_ibfk_1`
    FOREIGN KEY (`user1id`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`),
  CONSTRAINT `connections_ibfk_2`
    FOREIGN KEY (`user2id`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE UNIQUE INDEX `fk_user1id` ON `NU_circle`.`connections` (`user1id` ASC, `user2id` ASC);
CREATE UNIQUE INDEX `fk_user2id` ON `NU_circle`.`connections` (`user2id` ASC, `user1id` ASC);

DROP TRIGGER IF EXISTS `NU_circle`.`connections_bi`;

DELIMITER $$
CREATE TRIGGER `NU_circle`.`connections_bi` BEFORE INSERT ON `NU_circle`.`connections` FOR EACH ROW 
BEGIN 
    DECLARE found_count,found_count2,newcol1,newcol2,dummy INT;
    SET newcol1 = NEW.user1id;
    SET newcol2 = NEW.user2id;
    SELECT COUNT(1) INTO found_count FROM `NU_circle`.`connections`
    WHERE user1id = newcol2 AND user2id = newcol1;
    IF found_count = 1 THEN
        SELECT 1 INTO dummy FROM information_schema.tables;
    END IF;
END; $$ 
DELIMITER ;


-- -----------------------------------------------------
-- Table `NU_circle`.`organisation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`organisation` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`organisation` (
  `userid` INT(11) NULL DEFAULT NULL,
  `organisationname` VARCHAR(50) NULL DEFAULT NULL,
  `motto` VARCHAR(20) NULL DEFAULT NULL,
  `url` VARCHAR(20) NULL DEFAULT NULL,
  `overview` VARCHAR(40) NULL DEFAULT NULL,
  `email` VARCHAR(40) NULL DEFAULT NULL,
  `photo` VARCHAR(50) NULL DEFAULT NULL,
  `connections` INT(11) NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  CONSTRAINT `organisation_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_userid` ON `NU_circle`.`organisation` (`userid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`summary`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`summary` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`summary` (
  `userid` INT(11) NOT NULL,
  `summarydesc` VARCHAR(1000) NULL DEFAULT NULL,
  `document` VARCHAR(50) NULL DEFAULT NULL,
  `photo` VARCHAR(50) NULL DEFAULT NULL,
  `link` VARCHAR(50) NULL DEFAULT NULL,
  `video` VARCHAR(50) NULL DEFAULT NULL,
  `presentation` VARCHAR(50) NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  `modifydate` DATE NULL DEFAULT NULL,
  CONSTRAINT `summary_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE INDEX `fk_userid` ON `NU_circle`.`summary` (`userid` ASC);


-- -----------------------------------------------------
-- Table `NU_circle`.`userdetails`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`userdetails` ;

CREATE TABLE IF NOT EXISTS `NU_circle`.`userdetails` (
  `userid` INT(11) NOT NULL,
  `firstname` VARCHAR(25) NULL DEFAULT NULL,
  `lastname` VARCHAR(25) NULL DEFAULT NULL,
  `email` VARCHAR(40) NULL DEFAULT NULL,
  `dob` VARCHAR(25) NULL DEFAULT NULL,
  `photo` VARCHAR(50) NULL DEFAULT NULL,
  `headline` VARCHAR(100) NULL DEFAULT NULL,
  `country` VARCHAR(50) NULL DEFAULT NULL,
  `state` VARCHAR(50) NULL DEFAULT NULL,
  `city` VARCHAR(50) NULL DEFAULT NULL,
  `industry` VARCHAR(50) NULL DEFAULT NULL,
  `phone` VARCHAR(50) NULL DEFAULT NULL,
  `address` VARCHAR(50) NULL DEFAULT NULL,
  `linkedIn_handle` VARCHAR(50) NULL DEFAULT NULL,
  `websites` VARCHAR(50) NULL DEFAULT NULL,
  `summary` VARCHAR(250) NULL DEFAULT NULL,
  `certifications` TINYINT(1) NULL DEFAULT '0',
  `honorsandawards` TINYINT(1) NULL DEFAULT '0',
  `experience` TINYINT(1) NULL DEFAULT '0',
  `skillsandendorsements` TINYINT(1) NULL DEFAULT '0',
  `projects` TINYINT(1) NULL DEFAULT '0',
  `languages` TINYINT(1) NULL DEFAULT '0',
  `education` TINYINT(1) NULL DEFAULT '0',
  `additionalinfo` TINYINT(1) NULL DEFAULT '0',
  `volunteer` TINYINT(1) NULL DEFAULT '0',
  `courses` TINYINT(1) NULL DEFAULT '0',
  `connections` TINYINT(1) NULL DEFAULT '0',
  `modifydate` DATE NULL DEFAULT NULL,
  `creationdate` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`userid`),
  CONSTRAINT `userdetails_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `NU_circle`.`job`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`job` ;

CREATE TABLE `job` (
  `jobid` INT(11) NOT NULL AUTO_INCREMENT,
  `userid` INT(11) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `location` VARCHAR(45) NULL DEFAULT NULL,
  `detailslink` VARCHAR(50) NULL DEFAULT NULL,
  `fromdate` DATE NULL DEFAULT NULL,
  `todate` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`jobid`),
  CONSTRAINT `job_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))
ENGINE=InnoDB
AUTO_INCREMENT=2
DEFAULT CHARSET=latin1;


-- -----------------------------------------------------
-- Table `NU_circle`.`jobapplications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `NU_circle`.`jobapplications` ;

CREATE TABLE `jobapplications` (
  `applicationid` INT(11) NOT NULL AUTO_INCREMENT,
  `jobid` INT(11) NOT NULL,
  `userid` INT(11) NOT NULL,
  PRIMARY KEY (`applicationid`),
  CONSTRAINT UNIQUE (`jobid`, `userid`),
  CONSTRAINT `jobapplications_ibfk_1`
    FOREIGN KEY (`jobid`)
    REFERENCES `NU_circle`.`job` (`jobid`),
  CONSTRAINT `jobapplications_ibfk_2`
    FOREIGN KEY (`userid`)
    REFERENCES `NU_circle`.`userauthenticate` (`userid`))  
ENGINE=InnoDB
AUTO_INCREMENT=2
DEFAULT CHARSET=latin1;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';

