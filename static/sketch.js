let Text = [];
let User = [];
let you = "paconcito";
let spacing = 38;
let textBox;
let sendButton;

const API_BASE = "https://tu-api.onrender.com"; // <-- cambialo por tu URL real

function request() {
  Text.length = 0;
  User.length = 0;

  fetch(`${API_BASE}/messages`)
    .then(response => response.json())
    .then(data => {
      Text = data.text;
      User = data.user;
      redraw();
    })
    .catch(error => console.error("Error al obtener datos:", error));
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textSize(24);

  textBox = createInput();
  sendButton = createButton("Send");

  textBox.position(40, height - 20);
  sendButton.position(width - 70, height - 20);
  textBox.size(width - 80 - 40, 20);
  sendButton.size(47, 25);

  sendButton.mousePressed(send);
  request();

  // Si tu backend soporta sockets, podrías usar esto más adelante
  // const socket = io(API_BASE);
  // socket.on('refresh_files', request);

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
      rect(cX + 7, cY - 4, -textWidth(msg) - 14, textAscent() + textDescent() + 7, 4);
      text(msg, cX, cY + 2);
    } else {
      textAlign(LEFT, TOP);
      let cX = 50;
      let cY = i * spacing + 50;
      rect(cX - 7, cY - 4, textWidth(msg) + 14, textAscent() + textDescent() + 7, 4);
      text(msg, cX, cY + 2);
    }
  }
}

function keyPressed() {
  if (key === ' ') send();
}

function send() {
  const text = textBox.value().trim();
  if (text === "") return;

  fetch(`${API_BASE}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text, user: you })
  })
    .then(response => response.json())
    .then(data => {
      console.log("Respuesta del servidor:", data);
      request(); // opcional si tenés sockets
    })
    .catch(error => console.error("Error al enviar:", error));

  textBox.value("");
}
