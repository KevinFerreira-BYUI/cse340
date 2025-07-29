const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// module.exports = {getClassifications}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// get the inventory item by their id number 
async function getInventoryById(inv_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error(`getInventoryById error ${error}`)
  }
}

async function insertClassification(classification_name) {
  try{
    const data = await pool.query(
      `INSERT INTO classification (classification_name)
        VALUES ($1)
        RETURNING *`,
        [classification_name]
    )
    return data.rows
  } catch(error) {
    console.error(`insertClassification error ${error}`)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, insertClassification};