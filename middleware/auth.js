const express = require('express')

const auth = (req, res, next) => {
  if(req.url === '/melon' || req.url === '/' ) {
    next();
  } else {
    res.send('invalid')
  }
}

module.exports = auth;