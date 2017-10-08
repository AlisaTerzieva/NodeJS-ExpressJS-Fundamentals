const fs = require('fs')
const storagePath = './storage.json'

let storage = {}

function checkIfString(val) {
  if (typeof val !== 'string') {
    throw new Error('The input key should be a string!')
  }
}

function checkIfExists(val) {
  if (!storage.hasOwnProperty(val)) {
    throw new Error('The key does not exist!')
  }
}

function put(key, value) {
  checkIfString(key)
  if (storage.hasOwnProperty(key)) {
    throw new Error('The key already exists!')
  }
  storage[key] = value
}

function get(key) {
  checkIfString(key)
  checkIfExists(key)
  return storage[key]
}

function getAll() {
  if (Object.keys(storage).length === 0) {
    return 'The storage has no records!'
  } else {
    return storage
  }
}

function update(key, value) {
  checkIfString(key)
  checkIfExists(key)
  storage[key] = value
}

function deleteKey(key) {
  checkIfString(key)
  checkIfExists(key)
  delete storage[key]
}

function clear() {
  storage = {}
}

function save(callback) {
  let storageJSON = JSON.stringify(storage)
  fs.writeFile(storagePath, storageJSON, (err) => {
    if (err) {
      console.log(err)
    }
    callback()
  })
}

function load(callback) {
  fs.stat(storagePath, (err, data) => {
    if (err == null) {
      fs.readFile(storagePath, 'utf8', (err, data) => {
        if (err) {
          console.log(err.message)
        }
        storage = JSON.parse(data)
        callback()
      })
      return
    }
    callback()
  })
}

module.exports = {
  put: put,
  get: get,
  getAll: getAll,
  update: update,
  delete: deleteKey,
  clear: clear,
  save: save,
  load: load
}
