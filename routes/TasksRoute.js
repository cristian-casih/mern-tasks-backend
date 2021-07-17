const express = require('express')
const router = express.Router()
const TasksController = require('../controllers/TasksController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

router.post(
  '/',
  auth,
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('project', 'El proyecto es obligatorio').not().isEmpty()
  ],
  TasksController.createTask
)
router.get('/', auth, TasksController.getTask)
router.put('/:id', auth, TasksController.updateTask)
router.delete('/:id', auth, TasksController.deleteTask)

module.exports = router
