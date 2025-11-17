const express = require('express')
const { getTodos, createTodo, updateTodo, toggleDone, deleteTodo } = require('../controllers/todoController')

const router = express.Router()

router.get('/', getTodos)
router.post('/', createTodo)
router.put('/:id', updateTodo)
router.patch('/:id/done', toggleDone)
router.delete('/:id', deleteTodo)

module.exports = router