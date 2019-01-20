import mongoose from 'mongoose';
import * as models from './models';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/marvinjs';

class Database {
    constructor() {
        this.db = null;
        this.host = MONGODB_URI;
        this.models = models;
    }

    connect = () => {
        return new Promise((resolve, reject) => {
            mongoose.connect(MONGODB_URI)
                .then(() => {
                    this.db = mongoose.connection.db;

                    let modelPromises = [];
                    // Initialize Models
                    Object.keys(models).forEach(
                        (model) => modelPromises.push(models[model].init())
                    );

                    Promise.all(modelPromises)
                        .then(() => resolve(this.db))
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

export default new Database();
