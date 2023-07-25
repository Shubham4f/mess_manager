//price table

CREATE TABLE `dmr`.`price_cat` (
  `pid` INT NOT NULL AUTO_INCREMENT,
  `pname` VARCHAR(45) NOT NULL,
  `pbreakfast` DECIMAL(7,3) NOT NULL,
  `plunch` DECIMAL(7,3) NOT NULL,
  `pdinner` DECIMAL(7,3) NOT NULL,
  UNIQUE INDEX `pname_UNIQUE` (`pname` ASC) VISIBLE,
  PRIMARY KEY (`pid`));

//user table

CREATE TABLE `dmr`.`cust` (
  `cid` INT NOT NULL AUTO_INCREMENT,
  `cname` VARCHAR(45) NOT NULL,
  `mstart` DATE NOT NULL,
  `mend` VARCHAR(45) NOT NULL,
  `grp` INT NOT NULL,
  `pid` INT NOT NULL,
  PRIMARY KEY (`cid`),
  UNIQUE INDEX `cname_UNIQUE` (`cname` ASC) VISIBLE,
  INDEX `fk_pid_idx` (`pid` ASC) VISIBLE,
  CONSTRAINT `fk_pid`
    FOREIGN KEY (`pid`)
    REFERENCES `dmr`.`price_cat` (`pid`)
    ON DELETE CASCADE  
    ON UPDATE NO ACTION);

//Meal Tabel

CREATE TABLE `dmr`.`meal` (
  `mid` INT NOT NULL AUTO_INCREMENT,
  `cid` INT NOT NULL,
  `date` DATE NOT NULL,
  `b` TINYINT NOT NULL DEFAULT 1,
  `l` TINYINT NOT NULL DEFAULT 1,
  `d` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`mid`),
  INDEX `fk_cid_idx` (`cid` ASC) VISIBLE,
  CONSTRAINT `fh_cid`
    FOREIGN KEY (`cid`)
    REFERENCES `dmr`.`cust` (`cid`)
    ON DELETE CASCADE  
    ON UPDATE NO ACTION);

  //Bill Table

CREATE TABLE `dmr`.`bill` (
  `bid` INT NOT NULL AUTO_INCREMENT,
  `cid` INT NOT NULL,
  `cname` VARCHAR(45) NOT NULL,
  `mstart` DATE NOT NULL,
  `mend` DATE NOT NULL,
  `pid` INT NOT NULL,
  PRIMARY KEY (`bid`),
  INDEX `fk_cid_idx` (`cid` ASC) VISIBLE,
  INDEX `fk_pid_idx` (`pid` ASC) VISIBLE,
  CONSTRAINT `fk_cidbill`
    FOREIGN KEY (`cid`)
    REFERENCES `dmr`.`cust` (`cid`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pidbill`
    FOREIGN KEY (`pid`)
    REFERENCES `dmr`.`price_cat` (`pid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
