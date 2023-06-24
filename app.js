const dotenv = require('dotenv')
const express = require('express')
const app = express()
const port = 3000

dotenv.config()

const apiKEY = process.env.API_KEY_VALUE
const apiURL = process.env.API_BASE_URL

app.get("/movie", function(req, res) {
    fetch(`${apiURL}/?apikey=${apiKEY}${formatParams(req.query)}`, {
        method: "GET"
    })
    .then(resp => resp.json())
    .then(data => {
        res.send(data)
    })
})

app.listen(port, () => {
    console.log(`Movies Backend Running...`)
})

function formatParams(params) {
    if (!params) return ''

    let string = ''

    for (property in params) {
        string += `&${property}=${params[property]}`
    }

    return string
}