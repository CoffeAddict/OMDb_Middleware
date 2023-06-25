const dotenv = require('dotenv')
const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()

dotenv.config()

const port = process.env.PORT || 3000
const apiKEY = process.env.API_KEY_VALUE
const apiURL = process.env.API_BASE_URL

app.post('/login', function(req, res) {
    if (!req.query.user || !req.query.password) {returnError(res, 400, 'Bad Request'); return}

    const auth = req.query

    if (auth.user == process.env.AUTH_USER && auth.password == process.env.AUTH_PASSWORD) {
        res.json({
            token: generateAccessToken()
        })
    } else {
        returnError(res, 401, 'Invalid Credentials')
    }
})

app.get('/movie', function(req, res) {
    if (!checkAccessToken(req)) {returnError(res, 403, 'Unauthorized'); return}

    if (Object.keys(req.query).length == 0) {returnError(res, 400, 'Bad Request'); return}

    fetch(`${apiURL}/?apikey=${apiKEY}${formatParams(req.query)}`, {
        method: 'GET'
    })
    .then(resp => resp.json())
    .then(data => {
        res.send(data)
    })
})

app.get('*', function(req, res){
    returnError(res, 403, 'Not Found')
});

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

function checkAccessToken (req) {
    return jwt.verify(req.query.token, process.env.JWT_TOKEN, (error, token) => {return token} )
}

function returnError(res, status, message) {
    if (!res || !status || !message) {console.error('Missing function parameters'); return}
    res.status(status).json({message})
}


module.exports = app