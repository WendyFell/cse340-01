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

/* ***************************
 *  Get all account data
 * ************************** */
// async function getAccountById(){
//   return await pool.query("SELECT * FROM public.account ORDER BY account_id")
// }

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
 *  Returning all message data, account first and last name of message to and message from with specific message id
 * ************************** */
async function getAllReadMessages(account_id){
  try {
  const messageData = await pool.query(
  "SELECT m.*, a1.account_firstname AS messageTo_firstname, a1.account_lastname AS messageTo_lastname, a2.account_firstname AS accountFrom_firstname, a2.account_lastname AS accountFrom_lastname FROM message m JOIN account a2 ON a2.account_id = m.message_from JOIN account a1 ON a1.account_id = m.message_to WHERE m.message_read = false AND m.message_to = $1",
  [account_id]
  )
  return messageData.rows
} catch (error){
  console.error("messagebyid"+error)
}
}

/* ***************************
 *  Get one message. Returning all message data, account first and last name of message to and message from with specific message id
 * ************************** */
async function getMessageById(message_id){
  try {
  const messageData = await pool.query(
  "SELECT m.*, a1.account_firstname AS messageTo_firstname, a1.account_lastname AS messageTo_lastname, a2.account_firstname AS accountFrom_firstname, a2.account_lastname AS accountFrom_lastname FROM message m JOIN account a2 ON a2.account_id = m.message_from JOIN account a1 ON a1.account_id = m.message_to WHERE  m.message_id = $1",
  [message_id]
  )
  return messageData.rows
} catch (error){
  console.error("messagebyid"+error)
}
}

/* ***************************
 *  Get all messages and account first name and last name by account_id by message_to identifier, excluding message archived
 * ************************** */
async function getInboxData(message_to) {
  try {
    const messageData = await pool.query(
      "SELECT m.*, a1.account_firstname AS messageTo_firstname, a1.account_lastname AS messageTo_lastname, a2.account_firstname AS accountFrom_firstname, a2.account_lastname AS accountFrom_lastname FROM message m JOIN account a2 ON a2.account_id = m.message_from JOIN account a1 ON a1.account_id = m.message_to WHERE m.message_archived = false AND m.message_to = $1",      
      [message_to]
    )    
    return messageData.rows
  } catch (error) {
    console.error("getinboxbyid error " + error)
  }
}

/* ***************************
 *  Get all messages and account first name and last name by account_id by message_from identifier, excluding message archived
 * ************************** */
async function getNewInboxData(message_from) {
  try {
    const messageData = await pool.query(
      "SELECT m.*, a1.account_firstname AS messageTo_firstname, a1.account_lastname AS messageTo_lastname, a2.account_firstname AS accountFrom_firstname, a2.account_lastname AS accountFrom_lastname FROM message m JOIN account a2 ON a2.account_id = m.message_from JOIN account a1 ON a1.account_id = m.message_to WHERE m.message_archived = false AND m.message_from = $1",      
      [message_from]
    )    
    return messageData.rows
  } catch (error) {
    console.error("getinboxbyid error " + error)
  }
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

/* ***************************
 *  Get archived messages final project
 * ************************** */
async function getArchivedData(message_to) {
  try {
    const archivedMessageData = await pool.query(
      "SELECT m.*, a1.account_firstname AS messageTo_firstname, a1.account_lastname AS messageTo_lastname, a2.account_firstname AS accountFrom_firstname, a2.account_lastname AS accountFrom_lastname FROM message m JOIN account a2 ON a2.account_id = m.message_from JOIN account a1 ON a1.account_id = m.message_to WHERE m.message_archived = true AND m.message_to = $1",      
      [message_to]
    )    
    return archivedMessageData.rows
  } catch (error) {
    console.error("getinboxbyid error " + error)
  }
}

/* ***************************
 *  Delete Message final project
 * ************************** */
async function deleteMessage(message_id) {
  try {
    const sql = "DELETE FROM public.message WHERE message_id = $1"
    const data = await pool.query(sql, [message_id])
    return data.rows
  } catch (error) {
    console.error("Delete Message Error")
  }
}

/* *****************************
*   Archive Message final project
* *************************** */
async function archiveMessage(message_id){
  try {
    const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1"
    const result = await pool.query(sql, [message_id])
    return result.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Message Read final project
* *************************** */
async function markMessageRead(message_id){
  try {
    const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1"
    const result = await pool.query(sql, [message_id])
    return result.rowCount
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
  getAccountById,
  updatePassword,
  getAllReadMessages,
  getMessageById,
  getInboxData,
  getNewInboxData,
  newMessage,
  getArchivedData,
  deleteMessage,
  archiveMessage,
  markMessageRead
};