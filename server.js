var express = require('express')
var app = express()

app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    res.end("hello world")
})




var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`listning to http://localhost:${PORT}/`)