// Asking for permision for motion sensors on iOS 13+ devices
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  document.body.addEventListener('click', function () {
    DeviceOrientationEvent.requestPermission();
    DeviceMotionEvent.requestPermission();
  })
}

// Open and connect input socket
let socket = io('/input');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
}

function draw() {
  // Tilt
  background(255);
  noStroke();
  fill(0);

  // Calculate transparency of left-right halves based on rotationZ of device
  // rotationZ gives you numbers from 0 to 360.
  let lr = floor(rotationZ);
  // Map rotation to alpha range
  let lra = map(lr, 0, 360, 255, 0)

  // Transparency reflects degree of rotation
  // Top Half
  fill(0, lra);
  rect(0, 0, width/2, height);
  // Bottom Half
  fill(0, 255 - lra);
  rect(width/2, 0, width/2, height);

  // Calculate transparency of top-down halves based on rotationX of device
  // rotationX gives you numbers from -180 to 180.
  let tb = floor(rotationX);
  // Ignore flipped over device
  tb = constrain(tb, 0, 180);
  // Map rotation to alpha range
  let tba = map(tb, 0, 120, 255, 0)

  // Transparency reflects degree of tilt
  // Top Half
  fill(0, tba);
  rect(0, 0, width, height / 2);
  // Bottom Half
  fill(0, 255 - tba);
  rect(0, height / 2, width, height);

  // Normalize lr and tb
  lr = map(lr, 0, 360, -1, 1);
  tb = map(tb, 0, 120, -1, 1);

  //Only send direction of tilt
  socket.emit('tilt', {x: lr, y: tb});
}
