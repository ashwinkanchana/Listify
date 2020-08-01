const mysql = require('mysql')
const dotenv = require('dotenv')
const { isBoolean } = require('util')
const { resolve } = require('path')
const { rejects } = require('assert')
const { lchmod } = require('fs')
let instance  = null



const conn = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,  
    port: process.env.DB_PORT,
    multipleStatements: true
})

conn.connect((err) =>{
    if(err){
        console.log(err.message)
    }
    console.log(`DB - ${conn.state}, ID: ${conn.threadId}`)
})


class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService()
    }

    async getAllData(){
        try {
            const response  = await new Promise((resolve, reject) =>{
                const query = 'SELECT * FROM names;'
                conn.query(query, (err, results)=>{
                    if(err){
                        reject(new Error(err.message))
                    }
                    resolve(results)
                })
            })
            return response
        } catch (error) {
            console.log(error)
        }
    }


    async insertNewName(name){
        if(name!=''){
            try {
                const dateAdded = new Date();

                const insertId = await new Promise((resolve, reject) => {
                    const query = 'INSERT INTO names (name, date_added) VALUES (?, ?);'
                    conn.query(query, [name.substring(0, 30), dateAdded], (err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result.insertId)
                    })
                })
                return {
                    id: insertId,
                    name,
                    dateAdded
                }
            } catch (error) {
                console.log(error)
            }
        }
    }



    async deleteRowByID(id){
        id = parseInt(id, 10)
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM names WHERE id = ?;'
                conn.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows)
                })
            })
            return response === 1 ?  true : false;
        } catch (error) {
            console.log(error)
            return false;
        }       
    }



    async updateNameByID(id, name) {
        id = parseInt(id, 10)
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE names SET name = ? WHERE id = ?;'
                conn.query(query, [name.substring(0, 30), id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows)
                })
            })
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM names WHERE name like '+mysql.escape('%'+name+'%')
                conn.query(query, [name], (err, results) => {
                    if (err) {
                        reject(new Error(err.message))
                    }
                    resolve(results)
                })
            })
            return response
        } catch (error) {
            console.log(error)
        }
    }


}



module.exports = DbService