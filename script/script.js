let savedWords = [];

const createElements = (arr) => {
  const htmlElements = arr.map(
    (el) =>
      `<span class="bg-[#EDF7FF] text-xl border border-[#D7E4EF] btn">${el}</span>`,
  );
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then((res) => res.json()) //promise of json data
    .then((json) => displayLessons(json.data));
};

const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
};

const loadLevelWord = (id) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  manageSpinner(true);

  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLevelWords(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
      <div class="border border-[#EDF7FF]">
      <div class="">
        <h2 class="text-3xl font-semibold">
          ${word.word} ( <i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})
        </h2>
      </div>
      <div class="">
        <h2 class="text-2xl font-semibold">Meaning</h2>
        <p class="font-bangla font-medium">${word.meaning}</p>
      </div>
      <div class="">
        <h2 class="text-2xl font-bold">Example</h2>
        <p class="text-2xl opacity-80">
          ${word.sentence}
        </p>
      </div>
      <div class="">
        <h2 class="text-2xl font-medium font-bangla">সমার্থক শব্দ গুলো</h2>
        <div class="flex flex-wrap gap-3 mt-3">
          ${word.synonyms?.length ? createElements(word.synonyms) : "<p>No synonyms found</p>"}
        </div>
      </div>
      </div>
  `;

  document.getElementById("word_modal").showModal();
};

const displayLevelWords = (words, isSearch = false) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (!words || words.length === 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-5 font-bangla">
            <img src="./assets/alert-error.png" alt="Alert Error" class="mx-auto">           
            ${
              isSearch
                ? `<p class="text-[#79716B]">কোন শব্দ পাওয়া যায়নি</p>
                   <h2 class="text-[#292524] font-medium text-4xl">No Word Found</h2>`
                : `<p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                   <h2 class="text-[#292524] font-medium text-4xl">নেক্সট Lesson এ যান</h2>`
            }

        </div>
    `;
    manageSpinner(false);
    return;
  }
  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl border-2 border-[#E5E7EB] text-center py-10 px-8">
          <div class="space-y-8">
            <h2 class="font-bold text-3xl">${word.word ? word.word : "No Word Found"}</h2>
            <p class="font-semibold text-xl">Meaning /Pronunciation</p>
            <p class="font-bangla font-semibold opacity-[80%] text-3xl">
              "${word.meaning ? word.meaning : "No Meaning Found"} / ${word.pronunciation ? word.pronunciation : "No Pronunciation Found"}"
            </p>
            <div class="flex justify-between items-center">

              <!-- Info Button -->
              <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" onclick="loadWordDetail(${word.id})">
                <i class="fa-solid fa-circle-info"></i>
              </button>

              <!-- Sound Button -->
              <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" onclick="pronounceWord('${word.word}')">
                <i class="fa-solid fa-volume-high"></i>
              </button>

              <!-- Save Word Button -->
              <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" onclick='saveWord(${JSON.stringify(word)})'>
                <i class="fa-solid fa-heart"></i>
              </button>

            </div>
          </div>
        </div>
    `;
    wordContainer.appendChild(card);
  });
  manageSpinner(false);
};

const displayLessons = (lessons) => {
  // 1. get the container
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  // 2. get into every lessons
  lessons.forEach((lesson) => {
    // 3.create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}" class="btn btn-outline btn-primary lesson-btn" onclick="loadLevelWord(${lesson.level_no})">
    <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
    </button>
    `;
    // 4.append child in container
    levelContainer.append(btnDiv);
  });
};

const saveWord=(word)=> {
  const exists = savedWords.find((w) => w.id === word.id);
  if (exists) {
    alert("Word already saved!");
    return;
  }
  savedWords.push(word);

  displaySavedWords();
}

const displaySavedWords=()=> {
  const container = document.getElementById("saved-container");
  container.innerHTML = "";

  // Empty state
  if (savedWords.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-10 space-y-4">

        <img src="./assets/alert-error.png" class="mx-auto w-16 opacity-60" />

        <p class="text-gray-600 text-lg font-bold">
          No saved vocabularies yet
        </p>

        <p class="text-gray-400">
          Save words by clicking the ❤️ icon
        </p>

      </div>
    `;
    return;
  }

  savedWords.forEach((word) => {
    const card = document.createElement("div");

    card.innerHTML = `
      <div class="bg-white rounded-xl border-2 border-[#E5E7EB] text-center py-10 px-8">
        <div class="space-y-8">

          <h2 class="font-bold text-3xl">
            ${word.word || "No Word Found"}
          </h2>

          <p class="font-semibold text-xl">
            Meaning / Pronunciation
          </p>

          <p class="font-bangla font-semibold opacity-[80%] text-3xl">
            "${word.meaning || "No Meaning Found"} / ${word.pronunciation || "No Pronunciation Found"}"
          </p>

          <div class="flex justify-between items-center">

            <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" onclick="loadWordDetail(${word.id})">
              <i class="fa-solid fa-circle-info"></i>
            </button>

            <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" onclick="pronounceWord('${word.word}')">
              <i class="fa-solid fa-volume-high"></i>
            </button>

            <button class="btn bg-red-100 hover:bg-red-300" onclick="removeSavedWord(${word.id})">
              <i class="fa-solid fa-trash"></i>
            </button>

          </div>

        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

const removeSavedWord=(id)=> {
  savedWords = savedWords.filter((word) => word.id !== id);
  displaySavedWords();
}

loadLessons();
displaySavedWords();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  manageSpinner(true);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word?.toLowerCase().includes(searchValue),
      );
      displayLevelWords(filterWords, true);
      // input.value = "";
    });
});

document.getElementById("input-search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("btn-search").click();
  }
});
