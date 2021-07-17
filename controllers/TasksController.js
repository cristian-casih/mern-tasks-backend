const Project = require('../models/Project')
const Task = require('../models/Task')
const { validationResult } = require('express-validator')

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    let project = await Project.findById(req.body.project)
    if (!project) res.status(404).send({ msg: 'Proyecto no encontrado' })

    if (project.creator.toString() !== req.user)
      return res.status(401).json({ msg: 'No Autorizado' })

    const task = new Task(req.body)
    await task.save()
    res.json({ task })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
exports.getTask = async (req, res) => {
  try {
    const projectId = req.query.project
    let project = await Project.findById(projectId)
    if (!project) res.status(404).send({ msg: 'Proyecto no encontrado' })

    if (project.creator.toString() !== req.user)
      return res.status(401).json({ msg: 'No Autorizado' })

    const task = await Task.find({ project: projectId }).sort({ created: -1 })
    res.json({ task })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
exports.updateTask = async (req, res) => {
  try {
    const { project, name, state } = req.body
    let task = await Task.findById(req.params.id)
    if (!task) res.status(404).send({ msg: 'Tarea no encontrada' })

    let projectExits = await Project.findById(project)
    if (projectExits.creator.toString() !== req.user)
      return res.status(401).json({ msg: 'No Autorizado' })

    const newTask = {}
    newTask.name = name
    newTask.state = state
    task= await Task.findOneAndUpdate(
      { _id: req.params.id },
      newTask ,
      { new: true }
    )
    res.json({ task })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query
    let task = await Task.findById(req.params.id)

    if (!task) res.status(404).send({ msg: 'Tarea no encontrada' })

    let projectExits = await Project.findById(project)

    if (projectExits.creator.toString() !== req.user)
      return res.status(401).json({ msg: 'No Autorizado' })

    await Task.findByIdAndRemove({ _id: req.params.id })
    res.json({ task })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
