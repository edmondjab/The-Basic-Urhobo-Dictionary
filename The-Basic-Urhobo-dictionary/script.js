document.addEventListener("DOMContentLoaded", function () {
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

      // Add event listeners for search
      searchButton.addEventListener("click", performSearch);
      searchInput.addEventListener("input", performSearch);
      searchInput.addEventListener("keydown", function (event) {
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
    dictionaryContainer.innerHTML = ""; // Clear the container

    words.forEach(wordData => {
      const { word, meaning, partOfSpeech, audio } = wordData;
      if (
        word.toLowerCase().includes(searchTerm) ||
        meaning.toLowerCase().includes(searchTerm) ||
        partOfSpeech.toLowerCase().includes(searchTerm)
      ) {
        createWordEntry(wordData, dictionaryContainer);
      }
    });
  }

  function createWordEntry(wordData, container) {
    const wordContainer = document.createElement("div");
    wordContainer.classList.add("word");

    const wordHeading = document.createElement("h2");
    wordHeading.textContent = wordData.word;

    const wordDetails = document.createElement("div");
    wordDetails.innerHTML = `
      <strong>Meaning:</strong> ${wordData.meaning}<br>
      <strong>Part of Speech:</strong> ${wordData.partOfSpeech}<br>
      <audio id="audio-${wordData.word}" controls>
        <source src="${wordData.audio}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <button id="play-pause-${wordData.word}">Play/Pause</button>
    `;

    const audioElement = wordDetails.querySelector(`#audio-${wordData.word}`);
    const playPauseButton = wordDetails.querySelector(`#play-pause-${wordData.word}`);

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
