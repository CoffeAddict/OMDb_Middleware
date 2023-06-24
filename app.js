const dotenv = require('dotenv')
const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

dotenv.config()

const apiKEY = process.env.API_KEY_VALUE
const apiURL = process.env.API_BASE_URL

app.post('/login', function(req, res) {
    if (!req.query.user || !req.query.password) {res.status(400).json({error: 'Bad Request'}); return}

    const auth = req.query

    if (auth.user == process.env.AUTH_USER && auth.password == process.env.AUTH_PASSWORD) {
        res.json({
            token: generateAccessToken()
        })
    } else {
        res.status(401).json({error: 'Invalid Credentials'})
    }
})

app.get('/movie', function(req, res) {
    if (Object.keys(req.query).length == 0) {res.status(400).json({error: 'Bad Request'}); return}

    fetch(`${apiURL}/?apikey=${apiKEY}${formatParams(req.query)}`, {
        method: 'GET'
    })
    .then(resp => resp.json())
    .then(data => {
        res.send(data)
    })
})

app.listen(port, () => {
    console.log(`IMDb Proxy Middleware Running...`)
})

function formatParams(params) {
    if (!params) return ''

    let string = ''

    for (property in params) {
        string += `&${property}=${params[property]}`
    }

    return string
}

function generateAccessToken () {
    return jwt.sign({user: process.env.AUTH_USER}, process.env.JWT_TOKEN, {expiresIn: '20m'});
}