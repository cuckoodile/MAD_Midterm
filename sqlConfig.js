import * as SQLite from "expo-sqlite";

export const createDB = async () => {
  console.log("Creating database...");
  try {
    const db = SQLite.openDatabaseSync("products.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS currency (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
      CREATE TABLE IF NOT EXISTS type (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
      CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, price DOUBLE, currency_id INTEGER, type_id INTEGER, image TEXT, FOREIGN KEY(currency_id) REFERENCES currency(id), FOREIGN KEY(type_id) REFERENCES type(id));
      CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER, quantity INTEGER, FOREIGN KEY(product_id) REFERENCES product(id));
      
      INSERT OR IGNORE INTO currency (name) VALUES ("USD"), ("JPY"), ("EURO"), ("POUND");
      INSERT OR IGNORE INTO type (name) VALUES ("Meat"), ("Seafood"), ("Vegetable"), ("Canned Goods"), ("Dairy");

      INSERT OR IGNORE INTO product (name, price, currency_id, type_id)
      VALUES 
      ('Steak', 99, (SELECT id FROM currency WHERE name = 'JPY'), (SELECT id FROM type WHERE name = 'Meat')), 
      ('Ligo Sardines', 142, (SELECT id FROM currency WHERE name = 'POUND'), (SELECT id FROM type WHERE name = 'Canned Goods')),
      ('Carrots', 331, (SELECT id FROM currency WHERE name = 'USD'), (SELECT id FROM type WHERE name = 'Vegetable')),
      ('Petchay', 31, (SELECT id FROM currency WHERE name = 'JPY'), (SELECT id FROM type WHERE name = 'Vegetable')),
      ('Milk', 1152, (SELECT id FROM currency WHERE name = 'USD'), (SELECT id FROM type WHERE name = 'Dairy')),
      ('Salmon', 12, (SELECT id FROM currency WHERE name = 'EURO'), (SELECT id FROM type WHERE name = 'Seafood')),
      ('Tilapya', 122, (SELECT id FROM currency WHERE name = 'EURO'), (SELECT id FROM type WHERE name = 'Seafood'));
    `);
    console.log("Database created successfully");
  } catch (err) {
    console.log(err);
  }
};

export const insert = async (insertData = []) => {
  console.log("Submitted data: ", insertData);
  try {
    const db = SQLite.openDatabaseSync("products.db");

    const query = `
      INSERT INTO product (name, price, currency_id, type_id, image)
      VALUES ('${insertData[0]}', ${insertData[1]}, (SELECT id FROM currency WHERE name = '${insertData[2]}'), (SELECT id FROM type WHERE name = '${insertData[3]}'), '${insertData[4]}');
    `;
    await db.execAsync(query).then((res) => {
      console.log("Response: ", res);
    });
    console.log("Inserted data successfully");
  } catch (err) {
    alert(err);
    console.log("Error inserting items: ", err);
  }
};

export const update = async (id, updateData = []) => {
  console.log("Submitted data: ", updateData);
  try {
    const db = SQLite.openDatabaseSync("products.db");

    const query = `
      UPDATE product SET name = '${updateData[0]}', 
      currency_id = (SELECT id FROM currency WHERE name = '${updateData[1]}'), 
      type_id = (SELECT id FROM type WHERE name = '${updateData[2]}'),
      price = ${updateData[3]}
      WHERE id = ${id};
    `;
    await db.execAsync(query).then((res) => {
      console.log("Response: ", res);
    });
    console.log(`Update data id: ${id} successfully`);
  } catch (err) {
    alert(err);
    console.log("Error updateing items: ", err);
  }
};

export const fetchAll = async (table, setData = []) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    const res = await db.getAllAsync(`SELECT * from ${table}`);
    setData(res);
    console.log(`Fetched ${table}`, res);
  } catch (err) {
    console.log("Error Fetch All: ", err);
  }
};

export const fetchProduct = async (setData = []) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    const res = await db.getAllAsync(`
      SELECT p.id, p.name, p.price, p.image, c.name AS currency_name, t.name AS type_name
      FROM product AS p
      JOIN currency AS c ON p.currency_id = c.id
      JOIN type AS t ON p.type_id = t.id
    `);
    setData(res);
    console.log("Fetched products: ", res);
  } catch (err) {
    console.log("Error fetching products: ", err);
  }
};

export const deleteAll = async (table) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    await db.execAsync(`DELETE FROM ${table}; `);
    console.log(`Delete from ${table} successful`);
  } catch (err) {
    console.log("Error Deleting table: ", err);
  }
};

export const dropTable = async (table) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    await db.execAsync(`DROP TABLE ${table}; `);
    console.log(`Delete from ${table} successful`);
  } catch (err) {
    console.log("Error Droping table: ", err);
  }
};

export const deleteOnId = async (id) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    await db.execAsync(`DELETE FROM product WHERE id = ${id};`);
    console.log(`Delete product with id ${id} successful`);
  } catch (err) {
    console.log("Error deleting product: ", err);
  }
};

export const toCart = async (id, quantity) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    await db.execAsync(
      `INSERT INTO cart(product_id, quantity) VALUES(${id}, ${quantity});`
    );
    console.log(`Add to cart ID: ${id} successful!`);
  } catch (err) {
    alert("ERROR Insert", err);
    console.log("Error inserting cart: ", err);
  }
};

export const fetchCart = async (setData = []) => {
  try {
    const db = SQLite.openDatabaseSync("products.db");
    const res = await db.getAllAsync(`
      SELECT c.id, c.quantity, p.name AS product_name, p.id AS product_id, p.price AS product_price, cy.name AS currency_name, ty.name AS type_name
      FROM cart AS c
      JOIN product AS p ON c.product_id = p.id
      JOIN currency AS cy ON p.currency_id = cy.id
      JOIN type AS ty ON p.type_id = ty.id;
    `);

    console.log("Fetched cart", res);
    return res;
  } catch (err) {
    console.log("Error Fetch All: ", err);
  }
};

// Global Handlers
export const handleCurrencySymbol = (currency, price) => {
  switch (currency) {
    case "USD":
      return `$ ${price}`;
    case "JPY":
      return `¥ ${price}`;
    case "EURO":
      return `€ ${price}`;
    case "POUND":
      return `£ ${price}`;
    default:
      return "Error currency input";
  }
};
