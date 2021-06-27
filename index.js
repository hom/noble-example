const noble = require('noble')
noble.startScanning(['6e400001b5a3f393e0a9e50e24dcca9e'], false, (error) => {
  if (error) {
    return console.error(error)
  }
})

// noble.startScanning()

noble.on('scanStart', (result) => {
  console.log('Scan start: \n', result)
})

noble.on('scanStop', (result) => {
  console.log('Scan stop: \n', result)
})

noble.on('stateChange', (state) => {
  console.log('State change: \n', state)
})

noble.on('discover', (result) => {
  console.log('Discover: \n', result)
})

noble.on('warning', (result) => {
  console.log('Warning: \n', result)
})