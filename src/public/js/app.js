const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;
let roomName;
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.textContent = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#message input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#nickname input");
  socket.emit("nickname", input.value, () => {});
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.textContent = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");

  msgForm.addEventListener("submit", handleMessageSubmit);
  nicknameForm.addEventListener("submit", handleNicknameSubmit);
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  console.log("welcome from client");
  addMessage("Someone joined");
});
socket.on("bye", () => {
  addMessage("someone left");
});
socket.on("new_message", addMessage);
