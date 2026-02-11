//render options to select an emotion and a possibly more specific descriptor

// Core emotion → outer emotion mapping
const emotionMap = {
  Joyful: [
    "Excited",
    "Sensuous",
    "Energetic",
    "Cheerful",
    "Creative",
    "Hopeful",
  ],
  Powerful: [
    "Aware",
    "Proud",
    "Respected",
    "Appreciated",
    "Important",
    "Faithful",
  ],
  Peaceful: [
    "Content",
    "Thoughtful",
    "Intimate",
    "Loving",
    "Trusting",
    "Nurturing",
  ],
  Sad: ["Tired", "Bored", "Lonely", "Depressed", "Ashamed", "Guilty"],
  Mad: ["Hurt", "Hostile", "Angry", "Selfish", "Hateful", "Critical"],
  Scared: [
    "Confused",
    "Rejected",
    "Helpless",
    "Submissive",
    "Insecure",
    "Anxious",
  ],
};

// DOM references
const mainContainer = document.getElementById("main-options");
const subContainer = document.getElementById("sub-options");

// Build row 1 (main options)
function renderMainOptions() {
  Object.keys(emotionMap).forEach((key, index) => {
    const id = `main-${index}`;

    mainContainer.insertAdjacentHTML(
      "beforeend",
      `
            <input type="radio" class="btn-check" name="main" id="${id}" value="${key}">
            <label class="btn btn-outline-primary" for="${id}">${key}</label>
            `,
    );
  });

  // Add event listener
  mainContainer.addEventListener("change", (e) => {
    renderSubOptions(e.target.value);
  });
}

// Build row 2 (sub options)
function renderSubOptions(mainKey) {
  const subs = emotionMap[mainKey];

  subContainer.innerHTML = `
        <h5>Choose a sub-option for <strong>${mainKey}</strong></h5>
        <div class="btn-group" role="group">
            ${subs
              .map((sub, i) => {
                const id = `sub-${i}`;
                return `
                        <input type="radio" class="btn-check" name="sub" id="${id}" value="${sub}">
                        <label class="btn btn-outline-secondary" for="${id}">${sub}</label>
                    `;
              })
              .join("")}
        </div>
    `;
}

// Initialize
renderMainOptions();