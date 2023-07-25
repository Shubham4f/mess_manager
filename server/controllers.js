const mysql = require('mysql');
const moment = require('moment');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


//Prcing

//View Pricing
exports.viewPrice = (req, res) => {

    connection.query('SELECT * FROM price_cat', (err, rows) => {
      if (!err) {
        res.render('price', { title: 'Pricing', rows });
      } else {
        res.render('price', { title : 'Pricing', error: err });
      }
    });
}
  

//Add Pricing
exports.createPrice = (req, res) => {

    const { pname, pbreakfast, plunch, pdinner } = req.body;

    connection.query('INSERT INTO price_cat (pname, pbreakfast, plunch, pdinner) VALUES (?, ?, ?, ?)', [pname, pbreakfast, plunch, pdinner], (err, rows) => {
      if (!err) {
        connection.query('SELECT * FROM price_cat', (errs, rows) => {
            if (!errs) {
              res.render('price', { title: 'Pricing', success: 'Price Category added successfully.', rows });
            } 
          });
      } else {
        connection.query('SELECT * FROM price_cat', (errs, rows) => {
            if (!errs) {
              res.render('price', { title: 'Pricing', error: err, rows });
            } 
          });
      }
    });
  }
  
//Edit View Price 


exports.editPriceView = (req, res) => {

    const pid = req.params.id;

    connection.query('SELECT * FROM price_cat where pid = ?',[ pid ], (err, rows) => {
      if (!err) {
        res.render('editprice', { title: 'Pricing', rows });
      } else {
        res.render('editprice', { title : 'Pricing', error: err, });
      }
    });
}

//Edit Price

exports.editPrice = (req, res) => {

    const {pid, pname, pbreakfast, plunch, pdinner } = req.body;

    connection.query('UPDATE price_cat SET pname = ? , pbreakfast = ? , plunch = ? , pdinner = ? WHERE pid = ?', [pname, pbreakfast, plunch, pdinner, pid], (err, rows) => {
      if (!err) {
        connection.query('SELECT * FROM price_cat', (errs, rows) => {
            if (!errs) {
              res.render('price', { title: 'Pricing', success: 'Price Category updated successfully.', rows });
            } 
          });
      } else {
        connection.query('SELECT * FROM price_cat', (errs, rows) => {
            if (!errs) {
              res.render('price', { title: 'Pricing', error: err, rows });
            } 
          });
      }
    });
  }


//Customer

//Main View

exports.home = (req, res) => {
    billList(moment().add(-1, 'days').format('YYYY-MM-DD'));
    const date = moment(req.params.d).format('YYYY-MM-DD');

    var name;
    if(req.body.cname === undefined){
      name = '';
    }else{
      name = req.body.cname;
    }

    connection.query('SELECT * FROM cust, price_cat WHERE cust.pid = price_cat.pid AND cname LIKE ? ORDER BY grp',['%' + name + '%'], (err, rows) => {
      if (!err) {
        connection.query('SELECT * FROM meal WHERE date = ?', [date], (err1, rows1) => {
          if (!err1){
            rows.forEach((element)=>{
              element.b = 1;
              element.l = 1;
              element.d = 1;
              element.mstart  = moment(element.mstart).format('DD-MM-YYYY');
              element.mend  = moment(element.mend).format('DD-MM-YYYY');
              element.date = date;
              rows1.forEach((element2) => {
                if(element.cid === element2.cid){
                  element.b = element2.b;
                  element.l = element2.l;
                  element.d = element2.d;
                }
              });
            });
            res.render('home', { title: 'Home', date, date1 : moment(date).format('DD-MM-YYYY'), rows, name, tc : rows.length });
          } else {
            res.render('alertpage', {title : "Error", error: err1});
          }
        });
      } else {
        res.render('alertpage', {title : "Error", error: err});
      }
    });
}

// Main View Date

exports.homeDate = (req, res) => {
  req.params.d = req.body.d;
  this.home(req, res);

}

//Meal toggle 

exports.homeToggle = (req, res) => {

    const {id , m, o, d} = req.params;

    connection.query('SELECT * FROM meal WHERE cid = ? and date = ?',[id, d], (err, rows) => {
      if(rows.length){
        const sqlString = `UPDATE meal SET ${m} = ? WHERE cid = ? and date = ?`
        connection.query(sqlString, [o, id, d], (err1, rows1)=>{
          if(!err1){
            this.home(req, res);
          }else{
            res.render('alertpage', {title : "Error", error: err1});
          }
        });
      } else {
        const sqlString = `INSERT INTO meal (cid, date, ${m}) VALUES (?, ?, ?)`
        connection.query(sqlString, [id, d, o], (err1, rows1) =>{
          if(!err1){
            this.home(req, res);
          }else{
            res.render('alertpage', {title : "Error", error: err1});
          }
        });
      }
    });
}

// All toggle

exports.allToggle = (req, res) => {
  const sqlInsert = `INSERT INTO meal (cid, date, ${req.params.m}) (SELECT cid, ? as date, ? as ${req.params.m} FROM cust WHERE cid NOT IN (SELECT cid FROM meal WHERE date = ?))`;
  const sqlUpdate = `UPDATE meal SET ${req.params.m} = ? WHERE date = ?`;
  connection.query(sqlInsert,[req.params.d, req.params.o, req.params.d],(err, rows) => {
    if(!err){
      connection.query(sqlUpdate,[req.params.o, req.params.d],(err1, rows) => {
        if(!err1){
          this.home(req, res);
        }else{
          res.render('alertpage', {title : "Error", error: err1});
        }
      });
    }else{
      res.render('alertpage', {title : "Error", error: err});
    }
  });
}

//Create customer Form

  exports.createCustomerForm = (req, res) => {

    connection.query('SELECT * FROM price_cat', (err, rows) => {
      if (!err) {
        res.render('createCustomer', {title : 'Add Customer', rows});
      } else {
        res.render('createCustomer', { title : 'Add Customer', error: err, });
      }
    });
}

//Create Customer

exports.createCustomer = (req, res) => {

    const {cname, pid, start, grp} = req.body;

    const mstart = moment(start).format('YYYY-MM-DD');
    const mend = moment(mstart).add(29, 'days').format('YYYY-MM-DD');;

    connection.query('INSERT INTO cust (cname, mstart, mend, grp, pid) VALUES (?, ?, ?, ?, ?)',[cname, mstart, mend, grp, pid] , (err, rows) => {
      if (!err) {
        connection.query('SELECT * FROM price_cat', (errs, rows) => {
            if (!errs) {
              res.render('createCustomer', {title : 'Add Customer', success: "Customer added successfully.", rows});
            }
        });
      } else {
        connection.query('SELECT * FROM price_cat', (errs, rows) => {
            if (!errs) {
              res.render('createCustomer', {title : 'Add Customer', error : err, rows});
            }
        });
      }
    });
}

// Edit Customer Form

exports.editCustomerForm = (req, res) => {

  const cid = req.params.id;

  connection.query('SELECT * FROM cust WHERE cid = ?', [cid], (err, rows) => {
    if (!err) {
      connection.query('SELECT * FROM price_cat', (err1, rows1,) => {
        if(!err1){
          const row = rows[0];
          rows1.forEach(element => {
            if(element.pid === rows[0].pid)
              element.selected = 1;
          });
          res.render('editCustomer', {title : 'Edit Customer', row, rows1});
        }
        else
        res.render('alertpage', {title : "Error", error: err});
      });
    } else {
      res.render('alertpage', {title : "Error", error: err});
    }
  });
}

// Edit customer

exports.editCustomer = (req, res) => {
  const {cid, cname, pid, grp} = req.body;

  connection.query('UPDATE cust SET cname = ?, pid = ?, grp = ? WHERE cid = ?',[cname, pid, grp, cid], (err,rows) => {
    if(!err){
      res.render('alertpage', {title : "Edit Customer", success : 'Customer updated successfully.'});
    }
    else
    res.render('alertpage', {title : "Error", error : err});
  });
}

// Delete Customer

exports.deleteCustomer = (req, res) => {
  connection.q
  connection.query('DELETE FROM cust WHERE cid = ?',[req.params.id], (err,rows) => {
    if(!err){
      res.render('alertpage', {title : "Delete Customer", success : 'Customer deleted successfully.'});
    }
    else
    res.render('alertpage', {title : "Error", error : err});
  });
}


// Bill

//Bill Table
exports.bill = (req, res) => {
  var name;
  if(req.body.cname === undefined){
    name = '';
  }else{
    name = req.body.cname;
  }
  connection.query('SELECT * FROM bill WHERE cname LIKE ? ORDER BY mend DESC',['%' +  name + '%'] ,(err, rows) => {
    if(!err){
      rows.forEach((element) =>{
        element.mstart = moment(element.mstart).format('DD-MM-YYYY');
        element.mend = moment(element.mend).format('DD-MM-YYYY');
      });
      res.render('bill', {title:'BIll',name, rows});
    } else {
      res.render('alertpage', {title : "Error", error : err});
    }
  });

}

function billList(date){
  connection.query('SELECT * FROM cust WHERE mend <= ?',[date], (err, rows) =>{
    for(i = 0; i < rows.length; i++){
      connection.query('INSERT INTO bill (cid, cname, mstart, mend, pid) VALUES (?, ?, ?, ?, ?)',[rows[i].cid, rows[i].cname, moment(rows[i].mstart).format('YYYY-MM-DD'), moment(rows[i].mend).format('YYYY-MM-DD'), rows[i].pid]);
      connection.query('UPDATE cust SET mstart = ?, mend = ? WHERE cid = ?',[moment(rows[i].mend).add(+1, 'days').format('YYYY-MM-DD'),moment(rows[i].mend).add(+30, 'days').format('YYYY-MM-DD'),rows[i].cid]);
    }
  });
}

// Instant Bill

exports.instantBill = (req, res) => {
  connection.query('SELECT * FROM cust WHERE cid = ?',[req.params.id],(err, rows) => {
    if(!err){
      if( Number(moment().diff(moment(rows[0].mstart)), 'days') < 0){
        res.render('alertpage', {title : "INFO", error : `Bill for ${rows[0].cname} can not be generated today.`});
      }else{
        connection.query('INSERT INTO bill (cid, cname, mstart, mend, pid) VALUES (?, ?, ?, ?, ?)',[rows[0].cid, rows[0].cname, moment(rows[0].mstart).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), rows[0].pid],(err1, rows1) => {
          if(!err1){
            connection.query('UPDATE cust SET mstart = ?, mend = ? WHERE cid = ?',[moment().add(+1, 'days').format('YYYY-MM-DD'),moment().add(+30, 'days').format('YYYY-MM-DD'),rows[i].cid],(err2, rows2) => {
              if(!err2){
                res.render('alertpage', {title : "Bill", success : `Bill for ${rows[0].cname} generated successfully.`});
              } else {
                res.render('alertpage', {title : "Error", error : err2});
              }
            });
          }
          else{
            res.render('alertpage', {title : "Error", error : err1});
          }
        });
      }
    }else{
      res.render('alertpage', {title : "Error", error : err});
    }
    
  });
}

// Genrate Bill Details

exports.genrateBill = (req, res) =>{
  var total = 0;
  var frows = [];
  connection.query('SELECT * FROM bill WHERE bid =?',[req.params.id],(berr, brows) =>{
    if(!berr){
      connection.query('SELECT * FROM meal WHERE date BETWEEN ? AND ? AND cid = ? ORDER BY date',[moment(brows[0].mstart).format('YYYY-MM-DD'), moment(brows[0].mend).format('YYYY-MM-DD'), brows[0].cid],(err, rows) =>{
        if(!err){
          connection.query('SELECT * FROM price_cat WHERE pid = ?',[brows[0].pid,],(perr,prows) => {
            if(!perr){
              const period = moment(brows[0].mend).diff(moment(brows[0].mstart), 'days') + 1; 
              for(i = 0; i  < period; i++){
                frows.push({
                date : moment(brows[0].mstart).add(i, 'days').format('DD-MM-YYYY'),
                b : 1,
                l : 1,
                d : 1});
              }
              total = prows[0].pbreakfast*period + prows[0].plunch*period + prows[0].pdinner*period;
              rows.forEach((element) => {
                element.date = moment(element.date).format('DD-MM-YYYY');
                if(element.b == 0)
                  total = total - (prows[0].pbreakfast);
                if(element.l == 0)
                  total = total - (prows[0].plunch);
                if(element.d == 0)
                  total = total - (prows[0].pdinner);
              });
              frows.forEach((element) => {
                rows.forEach((element2) => {
                  if(element.date == element2.date){
                    element.b = element2.b;
                    element.l = element2.l;
                    element.d = element2.d;
                  }
                }
                );
              }
              );
              total = Math.round(total);
              res.render('billdetails',{title : 'Bill', cat : prows[0].pname, pbreakfast : prows[0].pbreakfast, plunch : prows[0].plunch, pdinner : prows[0].pdinner, bid : brows[0].bid, name : brows[0].cname, mstart : moment(brows[0].mstart).format('DD-MM-YYYY'), mend : moment(brows[0].mend).format('DD-MM-YYYY'), frows, total})
            }else{
              res.render('alertpage', {title : "Error", error : perr});
            }
          });
        }else{
          res.render('alertpage', {title : "Error", error : err});
        }
      });
    }else{
      res.render('alertpage', {title : "Error", error : berr});
    }
  });
}


// Delete Bill

exports.deleteBill = (req, res) => {
    connection.query('DELETE FROM meal WHERE date >= (SELECT mstart FROM bill WHERE bid = ?) AND date <= (SELECT mend FROM bill WHERE bid = ?) AND cid = (SELECT cid FROM bill WHERE bid = ?)',[req.params.id, req.params.id, req.params.id], (err, rows) =>{
      if(!err){
        connection.query('DELETE FROM bill WHERE bid = ?', [req.params.id], (err1, rows1) => {
          if(!err1){
            res.redirect('/bill');
          }
          else{
            res.render('alertpage', {title : "Error", error : err1});
          }
        });
      }
      else{
        res.render('alertpage', {title : "Error", error : err});
      }
    });
}