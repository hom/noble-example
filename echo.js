// Connect to a peripheral running the echo service
// https://github.com/noble/bleno/blob/master/examples/echo

// subscribe to be notified when the value changes
// start an interval to write data to the characteristic

//const noble = require('noble');
const noble = require('noble');

const ECHO_SERVICE_UUID = '6e400001b5a3f393e0a9e50e24dcca9e';
const ECHO_CHARACTERISTIC_READ_UUID = '6e400003b5a3f393e0a9e50e24dcca9e';
const ECHO_CHARACTERISTIC_WRITE_UUID = '6e400002b5a3f393e0a9e50e24dcca9e';

noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    console.log('Scanning');
    noble.startScanning([ECHO_SERVICE_UUID]);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', peripheral => {
    // connect to the first peripheral that is scanned
    noble.stopScanning();
    const name = peripheral.advertisement.localName;
    console.log(`Connecting to '${name}' ${peripheral.id}`);
    connectAndSetUp(peripheral);
});

function connectAndSetUp(peripheral) {

  peripheral.connect(error => {
    console.log('Connected to', peripheral.id);

    // specify the services and characteristics to discover
    const serviceUUIDs = [ECHO_SERVICE_UUID];
    const characteristicUUIDs = [ECHO_CHARACTERISTIC_READ_UUID,  ECHO_CHARACTERISTIC_WRITE_UUID];

    peripheral.discoverSomeServicesAndCharacteristics(
        serviceUUIDs,
        characteristicUUIDs,
        onServicesAndCharacteristicsDiscovered
    );
  });
  
  peripheral.on('disconnect', () => console.log('disconnected'));
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
  console.log('Discovered services and characteristics');
  console.log(characteristics)
  const [read, write] = characteristics;

  // data callback receives notifications
  read.on('data', (data, isNotification) => {
    console.log('Received: ', Buffer.from(data).toString('hex'));
  });
  
  // subscribe to be notified whenever the peripheral update the characteristic
  read.subscribe(error => {
    if (error) {
      console.error('Error subscribing to echoCharacteristic');
    } else {
      console.log('Subscribed for echoCharacteristic notifications');
    }
  });

  write.write(Buffer.from([0x01]))

}
