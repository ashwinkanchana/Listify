const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config({ path: './config/config.env' })


const PORT = process.env.PORT || 3000

const app = express()



app.use(cors())


app.use(express.json())
app.use(express.urlencoded({extended: false}))


//Static folder
app.use(express.static(path.join(__dirname, 'public')))



//Handlebars
app.engine(
    '.hbs',
    exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
    })
)
app.set('view engine', '.hbs')


//Render page
app.get('/', (req, res) => {
    res.render('index')
})


//AJAX routes
app.use('/', require('./routes/ajax'))



app.listen(PORT, console.log(`Server up on port ${PORT}`))
