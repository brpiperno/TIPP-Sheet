//add a legend to the slider and label the item selected

const slider = document.getElementById("stepSlider");
const output = document.getElementById("sliderValue");

const labels = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5"
];

slider.addEventListener("input", () => {
  const index = parseInt(slider.value, 10);
  output.textContent = labels[index];
});
