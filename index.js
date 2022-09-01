const $download = document.getElementById("download")
const $clear = document.getElementById("clear")
const $canvas = document.getElementById("canvas")
const ctx = $canvas.getContext("2d")
let center_x, center_y, interval, font_size, arc, play_width, play_height
let i = 0

const $imagen = document.createElement("img")
$imagen.onload = () => {
  $canvas.width = $imagen.width
  $canvas.height = $imagen.height
  center_x = $canvas.width / 2
  center_y = $canvas.height / 2
  font_size = $imagen.width * 0.1
  play_width = $imagen.width * 0.1
  play_height = play_width * 1.2
  arc = $imagen.width * 0.1
  ctx.drawImage($imagen, 0, 0, $imagen.width, $imagen.height)
}
$imagen.src = './imagen.png'

$download.onclick = () => {
  fetch('names.json')
  .then((res) => res.json())
  .then((data) => {
    interval = setInterval(() => {
      const name = data[i]
      console.log(name)
      
      clearCanvas()
      
      ctx.drawImage($imagen, 0, 0, $imagen.width, $imagen.height)
      
      // Text
      ctx.font = `500 ${font_size}px Roboto`
      ctx.fillStyle = "rgb(0 20 135)"
      ctx.textAlign = 'center';
      ctx.fillText(name, center_x, center_y * 1.1);

      // Make circle
      ctx.fillStyle = "#FFFFFFAA";
      ctx.beginPath();
      ctx.arc(center_x, center_y, arc, 0, 2 * Math.PI, false);
      ctx.fill();

      // Make play button
      ctx.fillStyle = "#222222AA";
      ctx.beginPath();
      const init_x = (center_x - (play_width / 2)) * 1.025
      const init_y = center_y - (play_height / 2)
      ctx.moveTo(init_x, init_y);
      ctx.lineTo(init_x, init_y + play_height);
      ctx.lineTo(init_x + play_width, init_y + (play_height / 2));
      ctx.fill();

      const $a = document.createElement("a")
      document.body.appendChild($a)
      $a.href = $canvas.toDataURL("image/jpeg")
      $a.download = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "") + ".jpg"
      $a.click()
      document.body.removeChild($a)

      i++
      if (i >= data.length) {
        clearInterval(interval)
      }
    }, 1500)
  })
}

$clear.onclick = () => {
  if (interval) {
    clearInterval(interval)
  }
}

function clearCanvas() {
  ctx.beginPath()    // clear existing drawing paths
  ctx.save()         // store the current transformation matrix

  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, $canvas.width, $canvas.height)

  ctx.restore()        // restore the transform
}