# Mess Manager

Mess Manager is a web application designed to streamline mess billing and meal tracking for customers. The system automates billing processes, generates bills for each customer in 30-day cycles, and ensures efficient data management through CRUD operations.

## Technologies Used

<p align="left">
  <img src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Bootstrap Logo" height="50" style="margin-right: 20px;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js Logo" height="50" style="margin-right: 20px;">
  <img src="https://expressjs.com/images/express-facebook-share.png" alt="Express Logo" height="50" style="margin-right: 20px;">
  <img src="https://handlebarsjs.com/images/handlebars_logo.png" alt="Express Handlebars Logo" height="50" style="margin-right: 20px;">
  <img src="https://www.mysql.com/common/logos/logo-mysql-170x115.png" alt="MySQL Logo" height="50">
<p>

- **Bootstrap:** Front-end framework for responsive and visually appealing design.
- **Node.js:** Server-side JavaScript runtime.
- **Express:** Web application framework for Node.js.
- **Express Handlebars:** Templating engine for Express.
- **MySQL:** Relational database management system for data storage.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- MySQL: [Download and Install MySQL](https://www.mysql.com/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Shubham4f/mess_manager.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd mess_manager
   ```

3. **Open a terminal in the project folder and run the following command to install dependencies:**

   ```bash
   npm install
   ```

4. **Create a MySQL database using the following structure:**

   - Price Category Table

   ```sql
   CREATE TABLE `your_database_name`.`price_cat` (
     `pid` INT NOT NULL AUTO_INCREMENT,
     `pname` VARCHAR(45) NOT NULL,
     `pbreakfast` DECIMAL(7,3) NOT NULL,
     `plunch` DECIMAL(7,3) NOT NULL,
     `pdinner` DECIMAL(7,3) NOT NULL,
     UNIQUE INDEX `pname_UNIQUE` (`pname` ASC) VISIBLE,
     PRIMARY KEY (`pid`)
   );
   ```

   - Customer Table

   ```sql
   CREATE TABLE `your_database_name`.`cust` (
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
       REFERENCES `your_database_name`.`price_cat` (`pid`)
       ON DELETE CASCADE
       ON UPDATE NO ACTION
   );
   ```

   - Meal Table

   ```sql
   CREATE TABLE `your_database_name`.`meal` (
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
       REFERENCES `your_database_name`.`cust` (`cid`)
       ON DELETE CASCADE
       ON UPDATE NO ACTION
   );
   ```

   - Bill Table

   ```sql
   CREATE TABLE `your_database_name`.`bill` (
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
       REFERENCES `your_database_name`.`cust` (`cid`)
       ON DELETE CASCADE
       ON UPDATE NO ACTION,
     CONSTRAINT `fk_pidbill`
       FOREIGN KEY (`pid`)
       REFERENCES `your_database_name`.`price_cat` (`pid`)
       ON DELETE NO ACTION
       ON UPDATE NO ACTION
   );
   ```

5. **Update the `.env` file in the project root with your database credentials::**

   ```env
   PORT=8080
   DB_HOST=localhost
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASS=your_database_password
   ```

6. **Navigate to the project folder in the terminal and execute the following command to run the application:**

   ```bash
   npm start
   ```

7. **Open your browser:**
   - Visit [http://localhost:8080](http://localhost:8080) to access the Mess Manager application.

## Usage

- The website provides a user-friendly interface for managing mess billing and tracking meals.
- Perform CRUD operations to manage customer data and billing information efficiently.
- Bills are automatically generated for each customer in 30-day cycles.
