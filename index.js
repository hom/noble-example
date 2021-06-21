const noble = require('noble')
noble.startScanning()

noble.on('scanStart', (result) => {
  console.log(result)
})

noble.on('stateChange', (state) => {
  console.log(state)
})