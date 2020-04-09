const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  res.status(201).json(req.user)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  res.status(201).json(req.post)
});

router.get('/', (req, res) => { // returns all [users]
  Users.get(req.query)
    .then(users => res.status(200).json({ users }))
    .catch(err => res.status(400).json({ errorMessage: `Error while retrieving users` }))
});

router.get('/:id', validateUserId, (req, res) => { // returns user by id
  console.log(req.user)
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then(posts => {
      if(posts.length) {
        res.status(200).json({ posts })
      } else {
        res.status(404).json({ errorMessage: `There are no post available` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal Server error while retrieving user post` }))
});

router.delete('/:id', validateUserId,  (req, res) => {
  Users.remove(req.user.id)
    .then(user => {
      if(user) {
        res.status(202).json({ message: `user was deleted` })
      } else {
        res.status(204).json({ message: `user will be deleted, currently in que.` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal Server error while deleting user` }))
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.user.id, req.body)
    .then(user => {
      if(user) {
        res.status(201).json({ user })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal Server error while deleting user` }))
});

//custom middleware
function validateUser(req, res, next) {
  if(req.body.name) {
    Users.insert(req.body)
      .then(user => {
        req.user = user
        next();
      })
      .catch(err => res.status(500).json({ errorMessage: `Internal error creating new user.`, err }))
  } else {
    res.status(400).json({ errorMessage: `must contain a name field with at minimium 3 chars.` })
  }
}

function validateUserId(req, res, next) {
  const id = req.params.id
  Users.getById(id)
    .then(user => {
      if(user) {
        req.user = user
        next();
      } else {
        res.status(404).json({ errorMessage: `Invalid user id.` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal error when finding user`, err }))
}

function validatePost(req, res, next) {
  if(req.body.text.length) {
    Posts.insert({ user_id: req.user.id, text: req.body.text })
      .then(post => {
        req.post = post;
        next();
      })
      .catch(err => res.status(500).json({ errorMessage: `Internal error creating user post`, err }))
  } else {
    res.status(404).json({ errorMessage: 'post must contain text' })
  }
}

module.exports = router;
