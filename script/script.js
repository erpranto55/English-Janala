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

const displayLevelWords = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-5 font-bangla">
            <img src="./assets/alert-error.png" alt="" class=mx-auto>
            <p class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-[#292524] font-medium text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
    `;
    return;
  }
  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-8">
          <div class="space-y-5">
            <h2 class="font-bold text-3xl">${word.word ? word.word : "No Word Found"}</h2>
            <p class="font-semibold text-xl">Meaning /Pronunciation</p>
            <p class="font-bangla font-semibold opacity-[80%] text-3xl">
              "${word.meaning ? word.meaning : "No Meaning Found"} / ${word.pronunciation ? word.pronunciation : "No Pronunciation Found"}"
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
    <button id="lesson-btn-${lesson.level_no}" class="btn btn-outline btn-primary lesson-btn" onclick="loadLevelWord(${lesson.level_no})">
    <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
    </button>
    `;
    // 4.append child in container
    levelContainer.append(btnDiv);
  });
};

loadLessons();
