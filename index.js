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

noble.on('discover', (peripheral) => {
  console.log('Discover: \n', peripheral)
  peripheral.connect((error) => {
    if (error) console.log(error)
  })
  peripheral.once('connect', (error) => {
    if (error) {
      return console.log('Connect error: \n', error)
    }

    peripheral.discoverServices()
    peripheral.once('servicesDiscover', (services) => {
      console.log('Services: \n', services)
    })
    peripheral.discoverAllServicesAndCharacteristics()
    peripheral.once('characteristicsDiscover', (characteristic) => {
      console.log(characteristic)
    })
  })
})

noble.on('warning', (result) => {
  console.log('Warning: \n', result)
})