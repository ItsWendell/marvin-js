import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1/marvinjs';

class Database {
    constructor() {
        this.db = null;
        this.host = DATABASE_URL;
    }

    connect = () => {
        return new Promise((resolve, reject) => {
            mongoose.connect(DATABASE_URL)
                .then(() => {
                    this.db = mongoose.connection.db;
                    resolve(this.db);
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }
}

export default new Database();
