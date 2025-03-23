import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("products.db");

export const fetchItem = async (setItem, fetchData = "") => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    const res = await db.getAllAsync(fetchData);
    console.log("fetched data: ", res);
    setItem(res);
  } catch (err) {
    console.log("Error fetching items: ", err);
  }
};

export const insertItem = async (insertData = String) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    const res = await db.execAsync(insertData);
    console.log("Inserted data: ", insertData);
  } catch (err) {
    console.log("Error inserting items: ", err);
  }
};

export const updateItem = async (insertData = String) => {
  try {
    console.log("Update data: ", insertData);
    const db = SQLite.openDatabaseSync("products.db");
    const res = await db.execAsync(insertData);
  } catch (err) {
    console.log("Error updating items: ", err);
  }
};

export const deleteAllItems = async () => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    await db.execAsync(
      `DELETE FROM items; DELETE FROM currency; DELETE FROM item_type`
    );
    console.log("Delete all successful");
  } catch (err) {
    console.log("Error inserting items: ", err);
  }
};

export const deleteItem = async (query) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    await db.execAsync(query);
    console.log("Delete operation successful");
  } catch (err) {
    console.log("Error deleting items: ", err);
  }
};
export const createDB = async () => {
  console.log("Creating database...");
  try {
    const db = SQLite.openDatabaseSync("products.db");

    await db.execAsync(` 
        DROP currency;
        DROP type;
        DROP product;
        DROP cart;

      CREATE TABLE IF NOT EXISTS currency (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
      CREATE TABLE IF NOT EXISTS type (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
      CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, price DOUBLE, currency_id INTEGER, type_id INTEGER, FOREIGN KEY(currency_id) REFERENCES currency(id), FOREIGN KEY(type_id) REFERENCES type(id));
      CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, FOREIGN KEY(product_id) REFERENCES product(id));

      INSERT OR IGNORE INTO currency (name) VALUES ("USD");
      INSERT OR IGNORE INTO currency (name) VALUES ("JPY");
      INSERT OR IGNORE INTO currency (name) VALUES ("EURO");
      INSERT OR IGNORE INTO currency (name) VALUES ("POUND");
      
      INSERT OR IGNORE INTO type (name) VALUES ("Meat");
      INSERT OR IGNORE INTO type (name) VALUES ("Dairy");
      INSERT OR IGNORE INTO type (name) VALUES ("Seafood");
      INSERT OR IGNORE INTO type (name) VALUES ("Vegetable");
      INSERT OR IGNORE INTO type (name) VALUES ("Canned Goods");

      INSERT OR IGNORE INTO product (name, price, currency_id, type_id)
      VALUES ('Longgadog','5000', (SELECT id FROM currency WHERE name = 'JPY'), (SELECT id FROM type WHERE name = 'Meat'));
      INSERT OR IGNORE INTO product (name, price, currency_id, type_id)
      VALUES ('Century Tuna','5', (SELECT id FROM currency WHERE name = 'POUND'), (SELECT id FROM type WHERE name = 'Canned Goods'));
        `);
    console.log("Database created successfully");
  } catch (err) {
    console.log(err);
  }
};
