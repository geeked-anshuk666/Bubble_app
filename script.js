const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const resetbtn = document.getElementById("resetbtn");

const c_radius = 20;
const color = ["#FF6F43", "#6B5B95", "#84B04B", "#F7AAC9"];
const newColors = ["#FFE700", "#FF8500", "#990000", "#2D90FF"];

const c_pos = [];
const a_pos = [];
const arrowWidth = 30;
const arrowHeight = 10;
const arrowHeadSize = 10;
let animationIds = [];
let colorsChanged = [false, false, false, false];

function initializePositions() {
  c_pos.length = 0;
  a_pos.length = 0;
  colorsChanged = [false, false, false, false];

  for (let i = 0; i < 4; i++) {
    const y = 60 + i * 60;
    c_pos.push({ x: 60, y, color: color[i] });
    a_pos.push({ x: canvas.width - 60, y: y, moving: false });
  }
}

function drawCircle(x, y, radius, color) {
  c.beginPath();
  c.arc(x, y, radius, 0, 2 * Math.PI);
  c.fillStyle = color;
  c.fill();
  c.stroke();
}

function drawArrow(x, y, width, height, headSize) {
  c.beginPath();
  c.moveTo(x, y - height / 2);
  c.lineTo(x - width + headSize, y - height / 2);
  c.lineTo(x - width + headSize, y - height);
  c.lineTo(x - width, y);
  c.lineTo(x - width + headSize, y + height);
  c.lineTo(x - width + headSize, y + height / 2);
  c.lineTo(x, y + height / 2);
  c.closePath();
  c.fillStyle = "black";
  c.fill();
}

function drawScene() {
  c.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < c_pos.length; i++) {
    drawCircle(c_pos[i].x, c_pos[i].y, c_radius, c_pos[i].color);
    drawArrow(a_pos[i].x, a_pos[i].y, arrowWidth, arrowHeight, arrowHeadSize);
  }
}

function moveArrow(index) {
  if (!a_pos[index].moving) return;

  const circleX = c_pos[index].x;
  const arrowX = a_pos[index].x;
  const stopX = circleX + c_radius;
  if (arrowX - arrowWidth <= stopX) {
    a_pos[index].moving = false;
    c_pos[index].color = newColors[index];
    colorsChanged[index] = true;
    cancelAnimationFrame(animationIds[index]);
    drawScene();
    return;
  }

  const speed = 2;
  a_pos[index].x -= speed;

  drawScene();
  animationIds[index] = requestAnimationFrame(() => moveArrow(index));
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  for (let i = 0; i < c_pos.length; i++) {
    const dx = x - c_pos[i].x;
    const dy = y - c_pos[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < c_radius) {
      if (!a_pos[i].moving && !colorsChanged[i]) {
        a_pos[i].moving = true;
        animationIds[i] = requestAnimationFrame(() => moveArrow(i));
      }
      break;
    }
  }
});

resetbtn.addEventListener("click", () => {
  animationIds.forEach((id) => cancelAnimationFrame(id));
  initializePositions();
  drawScene();
});

initializePositions();
drawScene();
