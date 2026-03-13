const createElements = (arr) => {
  const htmlElements = arr.map(
    (el) =>
      `<span class="bg-[#EDF7FF] text-xl border border-[#D7E4EF] btn">${el}</span>`,
  );
  return htmlElements.join(" ");
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

const displayLevelWords = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-5 font-bangla">
            <img src="./assets/alert-error.png" alt="" class="mx-auto">
            <p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-[#292524] font-medium text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
    `;
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
              <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]" onclick="loadWordDetail(${word.id})">
                <i class="fa-solid fa-circle-info"></i>
              </button>
              <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
          </div>
        </div>
    `;
    wordContainer.appendChild(card);
  });
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

loadLessons();
