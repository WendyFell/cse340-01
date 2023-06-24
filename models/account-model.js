/* Unit 4 process registration activity */
const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for correct password
 * ********************* */
async function checkPassword(account_password){
  try {
    const sql1 = "SELECT * FROM account WHERE account_password = $1"
    const password = await pool.query(sql1, [account_password])
    return password.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
*   Update account information from update view (assignment 5)
* *************************** */
async function updateAccountInfo(account_firstname, account_lastname, account_email){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_type) VALUES ($1, $2, $3, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email])
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

/* *****************************
*   Update password information from update view (assignment 5)
* *************************** */
async function updatePassword(account_password){
  try {
    const sql = "INSERT INTO account (account_password) VALUES $1,  RETURNING *"
    return await pool.query(sql, [account_password])
  } catch (error) {
    return error.message
  }
}

module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  checkPassword, 
  getAccountByEmail, 
  updateAccountInfo,
  getAccountById,
  updatePassword 
};