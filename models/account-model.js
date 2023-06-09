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
async function updateAccountInfo(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data 
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
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2"
    const result = await pool.query(sql, [account_password, account_id])
    return result.rows
    /* return result.rowCount  */
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all account data
 * ************************** */
async function getMessageById(message_id){
  try {
  const messageData = await pool.query("SELECT * FROM public.message WHERE message_id = $1",
  [message_id]
  )
  return messageData.rows
} catch (error){
  console.error("messagebyid"+error)
}
}


/* ***************************
 *  Get all messages and account first name by account_id for message_to field
 * ************************** */
async function getInboxData(message_to) {
  try {
    const messageData = await pool.query(
      "SELECT * FROM public.message AS i JOIN public.account AS c ON i.message_to = c.account_id WHERE i.message_to = $1",
      // "SELECT * FROM public.message AS i JOIN public.account AS c ON c.account_id = i.message_to AND c.account_id = i.message_from WHERE i.message_to = $1 AND i.message_from = $2",
      [message_to]
    )    
    return messageData.rows
  } catch (error) {
    console.error("getinboxbyid error " + error)
  }
}

/* ***************************
 *  Get all account data
 * ************************** */
async function getAccountById(){
  return await pool.query("SELECT * FROM public.account ORDER BY account_id")
}

/* ***************************
 *  Create message final project
 * ************************** */
async function newMessage( message_subject, message_body, message_to, message_from ) {
  try {
    const sql = "INSERT INTO message (message_subject, message_body, message_to, message_from ) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [message_subject, message_body, message_to, message_from])
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
  updatePassword,
  getMessageById,
  getInboxData,
  getAccountById,
  newMessage
};