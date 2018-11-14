import { MongoClient, Db } from "mongodb";

export class DbClient {

    public db!: Db;
    public async connect() {
        // async / await approach:

        this.db = await MongoClient.connect("mongodb://localhost:27017/test");
        console.log("Connected to db");
        return this.db;
    }
}

//export = new DbClient();
