const noble = require('noble')

const REALTIME_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'
const REALTIME_CHARACTERISTIC_READ_UUID = '6e400003b5a3f393e0a9e50e24dcca9e'
const REALTIME_CHARACTERISTIC_WRITE_UUID = '6e400002b5a3f393e0a9e50e24dcca9e'
const CHECKUP_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'
const BACKUP_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e'
noble.startScanning([REALTIME_SERVICE_UUID], false, (error) => {
  if (error) {
    return console.error(error)
  }
})

// noble.startScanning()

noble.on('scanStart', (result) => {
  console.log('Scan start: \n', result)
})

noble.on('scanStop', (error) => {
  if (error) {
    console.log('Scan error: \n', error)
  }
})

noble.on('stateChange', (state) => {
  console.log('State change: \n', state)
})

noble.on('discover', (peripheral) => {
  noble.stopScanning()
  console.log('Discover: \n', peripheral)
  onConnectAndNotify(peripheral)
})

noble.on('warning', (result) => {
  console.log('Warning: \n', result)
})

function onConnectAndNotify(peripheral) {
  peripheral.connect((error) => {
    if (error) console.log(error)
  })
  peripheral.once('connect', (error) => {
    if (error) {
      return console.log('Connect error: \n', error)
    }

    peripheral.discoverSomeServicesAndCharacteristics([REALTIME_SERVICE_UUID, CHECKUP_SERVICE_UUID, BACKUP_SERVICE_UUID], [REALTIME_CHARACTERISTIC_READ_UUID, REALTIME_CHARACTERISTIC_WRITE_UUID], (error, services,  characteristics) => {
      console.log(services)
      console.log(characteristics)
      const [read, write] = characteristics
      read.on('data', (data) => {
        console.log('Receive: ', Buffer.from(data).toString('hex'))
      })
      read.subscribe((error) => {
        if (error) {
          return console.error(error)
        }
        console.log('等待数据通知')
      })
      write.write(Buffer.from([0x01]))
    })

  })
}