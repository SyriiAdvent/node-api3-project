const express = require('express');
const server = express();
const PORT = 5000
// Middleware imports
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger')
// Routes
const userRouter = require('./users/userRouter');
const postsRouter = require('./posts/postRouter');

//custom middleware
server.use(helmet())
server.use(logger)
server.use(morgan('short'))
server.use(express.json())

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/users', userRouter);
server.use('/api/posts', postsRouter);

server.listen(PORT, () => {
  console.log(`\n-= Server is listening on port: ${PORT} =-\n`);
});