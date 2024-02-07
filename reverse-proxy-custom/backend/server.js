const express = require('express')
const fs = require('node:fs');

const app = express()
const port = process.env.PORT ?? 8000

app.get('/*', async(req, res) => {
    res.send('backend response')
})

app.listen(port, () => {
    console.log(`Server started at localhost:${port}`)
})