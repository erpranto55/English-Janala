const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then((res) => res.json()) //promise of json data
    .then((json) => displayLessons(json.data));
};

const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLevelWords(data.data));
};

const displayLevelWords = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-8">
          <div class="space-y-5">
            <h2 class="font-bold text-3xl">${word.word}</h2>
            <p class="font-semibold text-xl">Meaning /Pronunciation</p>
            <p class="font-bangla font-semibold opacity-[80%] text-3xl">
              "${word.meaning} / ${word.pronunciation}"
            </p>
            <div class="flex justify-between items-center">
              <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
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
    <button class="btn btn-outline btn-primary" onclick="loadLevelWord(${lesson.level_no})">
    <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
    </button>
    `;
    // 4.append child in container
    levelContainer.append(btnDiv);
  });
};

loadLessons();
