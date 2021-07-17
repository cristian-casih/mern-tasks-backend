const Project = require('../models/Project')
const { validationResult } = require('express-validator')

exports.createProject = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const project = new Project(req.body)
    project.creator = req.user
    await project.save()
    res.json(project)
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'Hubo un error' })
  }
}
exports.getProject = async (req, res) => {
  try {
    const project = await Project.find({ creator: req.user }).sort({
      created: -1
    })
    res.json({ project })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id)
    if (!project) res.status(404).send({ msg: 'Proyecto no encontrado' })

    if (project.creator.toString() !== req.user)
      return res.status(401).json({ msg: 'No Autorizado' })

    const newProject = {}
    if (req.body.name) newProject.name = req.body.name

    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    )
    res.json({ project })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
exports.deleteProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id)
    if (!project) res.status(404).send({ msg: 'Proyecto no encontrado' })
    if (project.creator.toString() !== req.user)
      return res.status(401).json({ msg: 'No Autorizado' })

    project = await Project.findByIdAndDelete({ _id: req.params.id })
    res.json({ msg: 'Proyecto eliminado' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
