require('dotenv').config()
const app = require('./src/app')
const { PORT } = process.env


app.listen(PORT, console.log('Server ON'))