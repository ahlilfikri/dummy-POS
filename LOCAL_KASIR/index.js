const express = require('express')
const app = express()
const port = 3987

app.get('/', (req, res) => {
    res.send('local pos')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
