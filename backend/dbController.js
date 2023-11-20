// Import mongo module
const { MongoClient } = require("mongodb");


/**
 * Class for controlling the database
 * @class
 * @param {string} uri - Uri to connect to the database
 * @param {string} db - Name of the database to use
 * 
 * @example
 * // Create db controller
 * const dbController = new DbController(uri, db);
 * 
 */
class DbController {
    
    // Constructor
    constructor(uri, db) {
        this.uri = uri;
        this.client = new MongoClient(uri);
        this.db = this.client.db(db);
    }

    /**
     * 
     * @param {string} coll - Name of the collection to use
     * @param {Filter<Document>} query - Query to find documents
     * @param {FindOptions} proj - Projection to use (optional) default: {}
     * @param {boolean} one - If true, returns only one document (optional) default: false
     * @returns - Promise with the documents found in an array
     * 
     * @example
     * // Projection
     * 
     * const proj = {
     *    sort: { name: 1 },
     *   projection: { _id: 0, name:1, age: 1},
     * };
     * 
     * // Find documents
     * 
     * dbController.find("people", {age: {$lt: 40}}, proj).then(docs => {
     *    console.log(docs);
     * }).catch(err => {
     *   console.log(err);
     * });
     * 
     */
    find(coll, query, proj={}, one=false) {

        return new Promise((res, rej) => {
            try {
                const collection = this.db.collection(coll);
                const cursor = collection.find(query, proj);
                res(one ? cursor.next() : cursor.toArray());
            } catch (err) {
                rej(err);
            }
        });
    }

    /**
     * 
     * @param {string} coll - Name of the collection to use
     * @param {OptionalId<Document>} docs - Documents to insert
     * @param {BulkWriteOptions} options - Options for the insert (optional) default: {ordered: true}
     * @returns - Promise with the result of the insert
     *  
     * @example
     * // Insert documents
     * 
     * const docs = [
     *  {name: "Markus", age: 21},
     *  {name: "Pete", age:22},
     *  {name: "Onni", age: 22}
     * ];
     *  
     * dbController.insert("people", docs).then(result => {
     *   console.log(result);
     * }).catch(err => {
     *  console.log(err);
     * });
     * 
     */
    insert(coll, docs, options={ordered: true}) {

        return new Promise((res, rej) => {
            const collection = this.db.collection(coll);
            collection.insertMany(docs, options)
            .then( result => {
            res(`${result.insertedCount} documents inserted.`);
            });
        });
    }

    /**
     * 
     * @param {string} coll - Name of the collection to use
     * @param {Filter<Document>} filter - Filter to find documents to update
     * @param {UpdateFilter<Document>} update - Update to apply to the documents
     * @param {UpdateOptions} options - Options for the update (optional) default: {}
     * @returns - Promise with the result of the update
     * 
     * @example
     * // Update documents
     * 
     * dbController.update("people", {name: "Onni"}, {$set: {age: 23}}).then(result => {
     *   console.log(result);
     * }).catch(err => {
     *  console.log(err);
     * });
     * 
     */
    update(coll, filter, update, options={}) {
        return new Promise((res, rej) => {
            const collection = this.db.collection(coll);
            collection.updateMany(filter, update, options)
            .then(result => {
                res(`${result.matchedCount} documents matched, ${result.modifiedCount} documents modified.`);
            });
        });
    }

    /**
     * 
     * @param {string} coll - Name of the collection to use
     * @param {Filter<Document>} filter - Filter to find documents to delete
     * @param {DeleteOptions} options - Options for the delete (optional) default: {}
     * @returns - Promise with the result of the delete
     * 
     * @example
     * // Delete documents
     * 
     * dbController.delete("people", {name: "Markus"}).then(result => {
     *    console.log(result);
     * }).catch(err => {
     *    console.log(err);
     * });
     * 
     */
    delete(coll, filter, options={}) {
        return new Promise((res, rej) => {
            const collection = this.db.collection(coll);
            collection.deleteMany(filter, options)
            .then(result => {
                res(`${result.deletedCount} documents deleted.`);
            });
        });
    }
}

// Export class
// Should be exported differently but oh well
module.exports = { DbController };
