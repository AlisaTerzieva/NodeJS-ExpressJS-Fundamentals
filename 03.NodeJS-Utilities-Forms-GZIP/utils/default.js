let defaultErrorRes = (res, err) => {
  console.log(err.message)
  res.writeHead(404, { 'content-type': 'text/plain' })
  res.write('Resource not found!')
  res.end()
}

let defaultSuccessRes = (res, data) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  res.write(data)
  res.end()
}

let generateHtmlBody = (memes, data) => {
  let htmlBody = []
  for (let meme of memes) {
    if (meme.privacy) {
      htmlBody.push(`<div class="meme">
      <a href="/getDetails?id=${meme.id}">
      <img class="memePoster" src="${meme.memeSrc}" />  
      </a>        
      </div>`)
    }
  }
  return data.replace('<div id="replaceMe">{{replaceMe}}</div>', htmlBody.join(''))
}

let generateDetailsHtml = (currentMeme, data) => {
  let html = data.replace('<div id="replaceMe">{{replaceMe}}</div>', `<div class="content">
  <img src="${currentMeme.memeSrc}" alt=""/>
  <h3>Title  ${currentMeme.title}</h3>
  <p> ${currentMeme.description}</p>
  <button><a href="${currentMeme.memeSrc}">Download Meme</a></button>
  </div>`
  )
  return html
}

module.exports = {
  defaultErrorRes: defaultErrorRes,
  defaultSuccessRes: defaultSuccessRes,
  generateHtmlBody: generateHtmlBody,
  generateDetailsHtml: generateDetailsHtml
}
