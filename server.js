const express = require('express')
const app = express()

//views are written in ejs, which is then converted to html by the view engine
app.set("view engine", "ejs")

app.get('/', (req,res) => {
    // res.send("test")
    res.render("index")
})

app.listen(3000)