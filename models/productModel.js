const dbSingleton = require('../database/dbSingleton');
const db = dbSingleton.getConnection();

class ProductModel {
    static async findAll(limit = null) {
        return new Promise((resolve, reject) => {
            const query = limit
                ? 'SELECT * FROM products LIMIT ?'
                : 'SELECT * FROM products';
            
            const params = limit ? [parseInt(limit, 10)] : [];
            
            db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM products WHERE id = ?';
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    static async create(productData) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
            db.query(query, [productData.name, productData.price], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async update(id, productData) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
            db.query(query, [productData.name, productData.price, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM products WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = ProductModel;
