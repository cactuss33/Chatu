let Text = [];
let User = [];
let you = "paconcito";
let spacing = 38;
let contador = 0;
let textBox;
let sendButton;

function request() {
  // Reset data
  Text.length = 0;
  User.length = 0;

  // Get data and save it
  loadStrings("/static/text.txt?t=" + Date.now(), (incomingText) => {
    loadStrings("/static/user.txt?t=" + Date.now(), (incomingUser) => {
      Text = incomingText;
      User = incomingUser;
      Text.pop(); // Delete the blank line
      User.pop(); // Delete the blank line
      redraw(); // Redraw the screen with the new information
    });
  });
}

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  textSize(24);

  // Create Inputs
  textBox = createInput();
  sendButton = createButton("Send");

  // Set positions
  textBox.position(40, height - 20);
  sendButton.position(width - 70, height - 20);
  textBox.size(width - 80 - 40, 20);
  sendButton.size(47, 25);
  
  // Set event
  sendButton.mousePressed(send);

  request(); // Get data from the server

  // Aquí conectamos con Socket.IO y escuchamos el evento 'refresh_files'
  const socket = io();

  socket.on('refresh_files', () => {
    console.log("Mensaje recibido del servidor: refresh_files");
    request(); // Actualizamos solo cuando el servidor avisa
  });

  noLoop();
}

function draw() {
  background(220);

  for (let i = 0; i < User.length; i++) {
    let name = User[i];
    let msg = Text[i];

    if (name == you) {
      textAlign(RIGHT, TOP);
      let cX = width - 50;
      let cY = i * spacing + 50;
      rect(
        cX + 7,
        cY - 4,
        -textWidth(msg) - 14,
        textAscent() + textDescent() + 7,
        4
      );
      text(msg, cX, cY + 2);
    } else {
      textAlign(LEFT, TOP);
      let cX = 50;
      let cY = i * spacing + 50;
      rect(
        cX - 7,
        cY - 4,
        textWidth(msg) + 14,
        textAscent() + textDescent() + 7,
        4
      );
      text(msg, cX, cY + 2);
    }
  }
}
function keyPressed(){
	if(key === ' ')
		send()
}


function send() {
  let message = []
  //load message data to send
  message.push(textBox.value()); //text you just write
  message.push(you); //your name

  if (message[0].trim() !== "") {
    httpPost('/send-data', 'text', message, (respuesta) => {
      console.log('Respuesta del servidor:', respuesta);
      // Opcional: puedes quitar esta llamada si prefieres esperar el evento push
      // request();
    });
    textBox.value("");  
  }
}
