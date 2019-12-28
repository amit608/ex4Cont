import { initialize } from '@muzilator/sdk';

var midiChannel;
const press = 4;
var shape ="circle";
var offset = 0;

var circles = [
  {
    id: 60,
    x: 150,
    y: 70,
    radius: 50,
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
    console.log("started!5")
  }
  init()
  draw()
})

function isIntersect(point, circle) {
  if(shape == "circle") {
  return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
  }
  else {
    return (point.y-circle.y) > 0 && (point.x-circle.x) > 0 && (point.x-circle.x) < circle.radius  && (point.y - circle.y) < circle.radius;
  }
}

function getCurrentPosition(event) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

function sendUserEvent(event, type, i) {
  const pos = getCurrentPosition(event);
  circles.forEach(circle => {
    if (isIntersect(pos, circle)) {
      console.log("intersection event in: "+circle.id);
      circle.radius = circle.radius+i;
      midiChannel.postMessage({type: type, pitch: circle.id+offset, velocity: 100});
    }
  });
}

function changeShape(mshape, canvas) {
  shape = mshape;
  clear(canvas); 
  paint(canvas);
}

function changeSize(i, canvas, offs) {
  circles.forEach(circle => {
      circle.radius = i;
  });
  offset = offs;
  clear(canvas); 
  paint(canvas);
}

function paint(canvas) {
  var ctx = canvas.getContext('2d');
  circles.forEach(circle => {
    ctx.beginPath();
    if(shape == "circle") {
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    }
    else if(shape == "rectangle") {
      ctx.rect(circle.x, circle.y, circle.radius, circle.radius);
    }
    ctx.fillStyle = circle.color;
    ctx.fill();
  });

}
function clear(canvas) {
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function draw() {
    var canvas = document.getElementById("myCanvas");

    paint (canvas);

    canvas.onmousedown = function(e) { 
      sendUserEvent(e, commands.NOTE_ON, -1*press); 
      clear(canvas); 
      
      paint(canvas); 
    };
    canvas.onmouseup = function(e) { sendUserEvent(e, commands.NOTE_OFF, press); clear(canvas); paint(canvas);};

    canvas.addEventListener("touchstart", function(e) {
      sendUserEvent(e.touches[0], commands.NOTE_ON, -1*press)
    }, false);

    canvas.addEventListener("touchend", function (e) {
      sendUserEvent(e.touches[0], commands.NOTE_OFF, press)
    }, false);

    var circ = document.getElementById("myCirc");
    var rect = document.getElementById("myRect");

    circ.onmousedown = (e) => {
      changeShape("circle", canvas);
    }
    rect.onmousedown = (e) => {
      changeShape("rectangle", canvas);
    }

    var up = document.getElementById("myUp");
    var down = document.getElementById("myDown");

    up.onmousedown = (e) => {
      changeSize(50, canvas, 0);
    }
    down.onmousedown = (e) => {
      changeSize(40, canvas, 10);
    }

}
