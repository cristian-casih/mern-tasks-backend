const express = require('express')
const router = express.Router()
const ProjectsController = require('../controllers/ProjectsController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

router.post(
  '/',
  auth,
  [check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()],
  ProjectsController.createProject
)
router.get('/', auth, ProjectsController.getProject)
router.put('/:id', auth, ProjectsController.updateProject)
router.delete('/:id', auth, ProjectsController.deleteProject)

module.exports = router
