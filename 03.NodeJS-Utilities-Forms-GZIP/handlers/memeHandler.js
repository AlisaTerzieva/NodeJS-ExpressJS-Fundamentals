const fs = require('fs')
const formidable = require('formidable')
const shortid = require('shortid')
const qs = require('query-string')
const db = require('../config/dataBase')
const viewAllPath = './views/viewAll.html'
const viewAddMemePath = './views/addMeme.html'
const detailsPath = './views/details.html'
const utils = require('../utils/default')

let viewAll = (req, res) => {
  let memes = db.getDb()
  fs.readFile(viewAllPath, 'utf8', (err, data) => {
    if (err) {
      utils.defaultErrorRes(res, err)
      return
    }
    let html = utils.generateHtmlBody(memes, data)
    utils.defaultSuccessRes(res, html)
  })
}
let viewAddMeme = (req, res) => {
  fs.readFile(viewAddMemePath, (err, data) => {
    if (err) {
      utils.defaultErrorRes(res, err)
      return
    }
    utils.defaultSuccessRes(res, data)
  })
}

let addMeme = (req, res) => {
  let currentMeme = {}
  let form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if (err) {
      utils.defaultErrorRes(res, err)
      return
    }
    let imagePath = files.meme.path
    let imageExtIndex = files.meme.name.lastIndexOf('.')
    let imgExt = files.meme.name.substr(imageExtIndex, files.meme.name.length - 1)
    fs.readFile(imagePath, 'binary', (err, data) => {
      if (err) {
        utils.defaultErrorRes(res, err)
        return
      }
      let imgId = shortid.generate()
      let savedImagePath = `./public/memeStorage/0/`

      fs.writeFile(savedImagePath + imgId + imgExt, data, 'binary', (err) => {
        if (err) {
          utils.defaultErrorRes(res, err)
          return
        }
        let id = shortid.generate()
        currentMeme['id'] = id
        currentMeme['title'] = fields['memeTitle']
        currentMeme['memeSrc'] = savedImagePath + imgId + imgExt
        currentMeme['description'] = fields['memeDescription']
        currentMeme['privacy'] = fields['status']
        currentMeme['timeStamp'] = Date.now()
        db.add(currentMeme)
        res.writeHead(302, { 'location': '/viewAllMemes' })
        res.end()
      })
    })
  })
}
let getDetails = (req, res) => {
  let memeId = qs.parse(qs.extract(req.url))['id']
  let currentDb = db.getDb()
  let currentMeme = currentDb.find(m => m.id === memeId)
  fs.readFile(detailsPath, 'utf8', (err, data) => {
    if (err) {
      utils.defaultErrorRes(res, err)
      return
    }
    let html = utils.generateDetailsHtml(currentMeme, data)
    utils.defaultSuccessRes(res, html)
  })
}

let downloadMeme = (req, res) => {
  fs.readFile('.' + req.url, 'binary', (err, data) => {
    if (err) {
      utils.defaultErrorRes(res, err)
      return
    }
    res.writeHead(200, { 'Content-type': 'image/jpeg', 'Content-Disposition': `attachment; filename=test.jpg` })
    res.end(data, 'binary')
  })
}

module.exports = (req, res) => {
  if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
    viewAll(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'GET') {
    viewAddMeme(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'POST') {
    addMeme(req, res)
  } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
    getDetails(req, res)
  } else if (req.pathname.startsWith('/public/memeStorage/') && req.method === 'GET') {
    downloadMeme(req, res)
  } else return true
}
