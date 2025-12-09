import mongoose, { Connection } from 'mongoose';
import config from '../../config';

export default async (): Promise<Connection> => {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(config.databaseURL);
    return conn.connection;
};