const express = require('express')
const Filter = require('bad-words')
const router = express.Router()
const dbService = require('../database/dbService')
const db = dbService.getDbServiceInstance()
filter = new Filter();


//Create 
router.post('/insert', (req, res) => {
    const { name } = req.body;
    const result = db.insertNewName(filter.clean(name))
    result.then(data => res.json({ data }))
        .catch(err => console.log(err))
})


//Read
router.get('/getAll', (req, res) => {
    const results = db.getAllData()
    results
        .then(data => { res.json({ data: data }) })
        .catch(err => console.log(err))
})


//Update
router.patch('/update', (req, res) => {
    const { id, name } = req.body
    const results = db.updateNameByID(id, filter.clean(name))
    results
        .then(data => { res.json({ success: data }) })
        .catch(err => console.log(err))
})


//Delete
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params
    const results = db.deleteRowByID(id)
    results
        .then(data => { res.json({ success: data }) })
        .catch(err => console.log(err))

})



//Search
router.get('/search/:name', (req, res) => {
    const { name } = req.params
    const results = db.searchByName(name)
    results
        .then(data => { res.json({ data: data }) })
        .catch(err => console.log(err))


})



module.exports = router