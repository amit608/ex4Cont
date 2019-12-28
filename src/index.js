import { initialize } from '@muzilator/sdk';

var midiChannel;

var circles = [
  {
    id: 60,
    x: 150,
    y: 70,
    radius: 20,
    color: 'rgb(255,0,0)'
  },
  {
    id: 64,
    x: 100,
    y: 170,
    radius: 50,
    color: 'rgb(0,255,0)'
  },
  {
    id: 67,
    x: 210,
    y: 270,
    radius: 50,
    color: 'rgb(255,0,255)'
  },
  {
    id: 72,
    x: 270,
    y: 160,
    radius: 50,
    color: 'rgb(255,255,125)'
  }
];

const commands = {
  NOTE_ON: 'note-on',
  NOTE_OFF: 'note-off'
}

window.addEventListener('load', () => {
  async function init() {
    var platform = await initialize()
    midiChannel = await platform.createChannel('midi')
    midiChannel.start()
    console.log("started!2")
  }
  init()
  draw()
})

function isIntersect(point, circle) {
  return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

function getCurrentPosition(event) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

function sendUserEvent(event, type) {
  const pos = getCurrentPosition(event);
  circles.forEach(circle => {
    if (isIntersect(pos, circle)) {
      Console.log("intersection event in: "+circle.id);
      circle.radius = circle.radius-10;
      midiChannel.postMessage({type: type, pitch: circle.id, velocity: 100});
      draw();
    }
  });
}

function draw() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext('2d');
    circles.forEach(circle => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = circle.color;
      ctx.fill();
    });

    canvas.onmousedown = function(e) { sendUserEvent(e, commands.NOTE_ON) };
    canvas.onmouseup = function(e) { sendUserEvent(e, commands.NOTE_OFF) };
    canvas.addEventListener("touchstart", function(e) {
      sendUserEvent(e.touches[0], commands.NOTE_ON)
    }, false);

    canvas.addEventListener("touchend", function (e) {
      sendUserEvent(e.touches[0], commands.NOTE_OFF)
    }, false);
}
