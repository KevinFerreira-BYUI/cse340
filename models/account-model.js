const pool = require("../database")


async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

async function checkExistingEmail(account_email) {
  try{
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error){
    return error.message
  }
}

async function checkLogIn(account_email, account_password) {
  try{
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const checkLogIn = await pool.query(sql, [account_email, account_password])
    return checkLogIn.rowCount
  } catch (error){
    return error.message
  }
}

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    )
    return result.rows[0]
  } catch(error){
    return new Error("No matching email found")
  }
}

async function getAccountInfosById(account_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM account WHERE account_id = $1`,
      [account_id]
    )
    return data.rows[0]
  } catch(error){
    console.error(error)
  }
}

async function updateAccountInfos(account_firstname, account_lastname, account_email, account_id) {
  try{
    data = await pool.query(
      `UPDATE account 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4`,
      [account_firstname, account_lastname, account_email, account_id]
    )
    return data
  } catch(error){
    console.error(error)
  }
}

async function updatePassword(account_password, account_id) {
  try{
    const data = pool.query(
      `UPDATE account SET account_password = $1 WHERE account_id = $2`,
      [account_password, account_id]
    )
    return data
  } catch(error){
    console.error(error)
  }
}

module.exports = {registerAccount, checkExistingEmail, checkLogIn, getAccountByEmail, updateAccountInfos, getAccountInfosById, updatePassword}