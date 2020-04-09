const express = require('express');
const Posts = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ errorMessage: `Internal error retrieving posts`, err }))
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.post.id)
    .then(post => {
      if(post) {
        res.status(202).json({ message: `post was deleted` })
      } else {
        res.status(204).json({ message: `post will be deleted, currently in que.` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal Server error while deleting post` }))
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  Posts.update(req.post.id, req.body)
    .then(post => {
      if(post) {
        res.status(201).json({ post })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal Server error while deleting post` }))
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id
  Posts.getById(id)
    .then(post => {
      if(post) {
        req.post = post
        next();
      } else {
        res.status(404).json({ errorMessage: `Invalid post id.` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Internal error when finding post`, err }))
}

function validatePost(req, res, next) {
  if(req.body.text.length) {
    Posts.insert({ post_id: req.post.id, text: req.body.text })
      .then(post => {
        req.post = post;
        next();
      })
      .catch(err => res.status(500).json({ errorMessage: `Internal error editing post`, err }))
  } else {
    res.status(404).json({ errorMessage: 'post must contain text' })
  }
}

module.exports = router;
