const fs = require('fs')
const formidable = require('formidable')
const shortid = require('shortid')
const qs = require('query-string')
const db = require('../config/dataBase')
const viewAllPath = './views/viewAll.html'
const viewAddMemePath = './views/addMeme.html'
const detailsPath = './views/details.html'

let checkDirNum = (dirNum, files, savedImagePath) => {
  if (files.length > 4) {
    dirNum++
    checkDirNum(dirNum, fs.readdir(savedImagePath + dirNum, (err, files) => {
      checkDirNum(dirNum, files, savedImagePath)
    }))
  }
  return dirNum
}

let viewAll = (req, res) => {
  let memes = db.getDb()
  fs.readFile(viewAllPath, 'utf8', (err, data) => {
    if (err) {
      console.log(err.message)
      return
    }
    let htmlBody = []
    for (let meme of memes) {
      htmlBody.push(`<div class="meme">
        <a href="/getDetails?id=${meme.id}">
        <img class="memePoster" src="${meme.memeSrc}" />  
        </a>        
        </div>`)
    }
    let html = data.replace('<div id="replaceMe">{{replaceMe}}</div>', htmlBody.join(''))
    res.writeHead(200, { 'content-type': 'text/html' })
    res.write(html)
    res.end()
  })
}
let viewAddMeme = (req, res) => {
  fs.readFile(viewAddMemePath, (err, data) => {
    if (err) {
      console.log(err.message)
      return
    }
    res.writeHead(200, { 'content-type': 'text/html' })
    res.write(data)
    res.end()
  })
}

let addMeme = (req, res) => {
  let currentMeme = {}
  let form = new formidable.IncomingForm()
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err.message)
      return
    }
    let imagePath = files.meme.path
    let imageExtIndex = files.meme.name.lastIndexOf('.')
    let imgExt = files.meme.name.substr(imageExtIndex, files.meme.name.length - 1)
    fs.readFile(imagePath, 'binary', (err, data) => {
      if (err) {
        console.log(err.message)
        return
      }
      let imgId = shortid.generate()
      let savedImagePath = `./public/memeStorage/0/`

      fs.writeFile(savedImagePath + imgId + imgExt, data, 'binary', (err) => {
        if (err) {
          console.log(err.message)
          return
        }
        let id = shortid.generate()
        currentMeme['id'] = id
        currentMeme['title'] = fields['memeTitle']
        currentMeme['memeSrc'] = savedImagePath + imgId + imgExt
        currentMeme['description'] = fields['memeDescription']
        currentMeme['privacy'] = fields['status']
        currentMeme['timeStamp'] = Date.now()
        res.writeHead(302, { 'location': '/viewAllMemes' })
        db.add(currentMeme)
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
      console.log(err.message)
      return
    }
    res.writeHead(200, { 'content-type': 'text/html' })
    let html = data.replace('<div id="replaceMe">{{replaceMe}}</div>', `<div class="content">
    <img src="${currentMeme.memeSrc}" alt=""/>
    <h3>Title  ${currentMeme.title}</h3>
    <p> ${currentMeme.description}</p>
    <button><a href="${currentMeme.memeSrc}">Download Meme</a></button>
    </div>`
    )
    res.write(html)
    res.end()
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
  } else {
    return true
  }
}
