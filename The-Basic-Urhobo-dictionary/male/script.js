document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const dictionaryContainer = document.getElementById("dictionary-container");

  let words = []; // Initialize an empty array to hold the words data

  // Fetch words data from a JSON file
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      words = data; // Assign the fetched data to the 'words' array
      populateDictionary();
      searchButton.addEventListener("click", performSearch);
      searchInput.addEventListener("input", performSearch);
      searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          performSearch();
        }
      });
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });

  function populateDictionary() {
    dictionaryContainer.innerHTML = "";
    words.forEach(wordData => {
      createWordEntry(wordData, dictionaryContainer);
    });
  }

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    dictionaryContainer.innerHTML = "";

    words.forEach(wordData => {
      const { name, abbreviation, meaning, audio } = wordData;
      if (
        name.toLowerCase().includes(searchTerm) ||
        abbreviation.toLowerCase().includes(searchTerm) ||
        meaning.toLowerCase().includes(searchTerm)
      ) {
        createWordEntry(wordData, dictionaryContainer);
      }
    });
  }

  function createWordEntry(wordData, container) {
    const wordContainer = document.createElement("div");
    wordContainer.classList.add("word");

    const wordHeading = document.createElement("h2");
    wordHeading.textContent = wordData.name;

    const wordDetails = document.createElement("div");
    wordDetails.innerHTML = `
      <strong>Abbreviation:</strong> ${wordData.abbreviation}<br>
      <strong>Meaning:</strong> ${wordData.meaning}<br>
      <audio id="audio-${wordData.name}" controls>
        <source src="${wordData.audio}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <button id="play-pause-${wordData.name}">Play/Pause</button>
    `;

    const audioElement = wordDetails.querySelector(`#audio-${wordData.name}`);
    const playPauseButton = wordDetails.querySelector(`#play-pause-${wordData.name}`);

    playPauseButton.addEventListener("click", () => {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    });

    wordContainer.appendChild(wordHeading);
    wordContainer.appendChild(wordDetails);

    container.appendChild(wordContainer);
  }
});
