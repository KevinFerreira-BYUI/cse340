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
    console.error("getInventoryByClassificationId " + error)
  }
}

// get the inventory item by their id number 
async function getInventoryById(inv_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error(`getInventoryById ${error}`)
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

async function getExistClasificationName(classification_name) {
  try{
    const data = await pool.query(
      `SELECT * FROM classification WHERE classification_name = $1`
      [classification_name]
    )
    return data.rows
  } catch(error){
    console.error(`getExistClasificationName ${error}`)
  }
}

async function insertNewVehicle(
  classification_id,
  inv_make, 
  inv_model,
  inv_description,  
  inv_image,
  inv_thumbnail,     
  inv_price,
  inv_year,
  inv_miles,
  inv_color
) {
  try{
    const data = await pool.query(
      `INSERT INTO inventory ( 
        classification_id,
        inv_make, 
        inv_model,
        inv_description,  
        inv_image,
        inv_thumbnail,     
        inv_price,
        inv_year,
        inv_miles,
        inv_color ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        classification_id,
        inv_make, 
        inv_model,
        inv_description,  
        inv_image,
        inv_thumbnail,     
        inv_price,
        inv_year,
        inv_miles,
        inv_color
      ]
    )
    return data.rows
  } catch (error){
    console.error(`insertNewVehicle ${error}`)
  }
}

async function updateInventory(
  classification_id,
  inv_make, 
  inv_model,
  inv_description,  
  inv_image,
  inv_thumbnail,     
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  inv_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *" 
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error(`model error: ${error}`)
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById, 
  insertClassification, 
  getExistClasificationName,
  insertNewVehicle,
  updateInventory
};