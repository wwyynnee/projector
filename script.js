let images = [
  `assets/photo/photo-1.jpg`,
  `assets/photo/photo-2.jpg`,
  `assets/photo/photo-3.jpeg`,
  `assets/photo/photo-4.jpeg`
];

let num = 0;

function right() {
  let slider = document.getElementById("slider");
  num++;

  if (num >= images.length) {
    num = 0;
  }

  slider.src = images[num];
}

function left() {
  let slider = document.getElementById("slider");
  num--;

  if (num < 0) {
    num = images.length - 1;
  }

  slider.src = images[num];
}