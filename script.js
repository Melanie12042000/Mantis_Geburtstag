const MENU = "menu";
const INFO = "info";
const GAME1 = "game1";
const QUIZ1 = "quiz1";
const GAME2 = "game2";
const QUIZ2 = "quiz2";
const END = "end";


let state = MENU;
let infoRead = false;
const QUIZ1_ANSWER = "MANTIVA";
const QUIZ2_ANSWER = "SNACKBUX";

let quizInput = "";
let quizMessage = "";


const boardBgEl = document.getElementById("board-bg");
const LEVEL1_INDICES = [0, 1, 2, 3, 4, 5, 6];
const LEVEL2_INDICES = [7, 8, 9, 10, 11, 12, 13, 14];

const LEVEL1_WORD = "MANTIVA";
const LEVEL2_WORD = "SNACKBUX";

const LETTER_FOR_FOUR = new Array(15).fill(null);
LEVEL1_INDICES.forEach((idx, i) => LETTER_FOR_FOUR[idx] = LEVEL1_WORD[i]);
LEVEL2_INDICES.forEach((idx, i) => LETTER_FOR_FOUR[idx] = LEVEL2_WORD[i]);

const INFO_TEXT = [
  "Hi Manti!",
  "",
  "Das hier ist eines meiner Geburtstagsgeschenke,",
  "die ich dir programmiert habe.",
  "",
  "Wie ich ja weiß, LIEEEBST du Sudokus",
  "(siehe Date everything *wink wink*)",
  "",
  "Deswegen dachte ich, ich programmiere dir",
  "dein persönliches Sudoku!",
  "",
  "(Wirst schon sehen, wie ich das meine xD)",
  "",
  "In den Sudokus (ja, Mehrzahl) sind Buchstaben enthalten,",
  "mit denen du im Anschluss noch zwei Rätsel löst,",
  "also behalte sie im Hinterkopf!",
  "",
  "Viel Spaß beim Lösen :D",
  "",
  "Bist die Beste, Mantis EUW 🧡"
];

const SUDOKU_UNSOLVED = [
  "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
  "960405100020060504001703006100004000490130050002007601209006038070218905600079000",
  "627140503345206971089503602000700364793054018460008059056031097971005836834067105",
  "800005047040008500000000630000000490590040002072006305980000273067804051030070000",
  "604001035003450001521900000069807104250014007410090006000060010000039070070140503",
  "420796050300280497879004612690005201538400009010369004983647025006150000100020346",
  "005020040007090318106840070510000693300000700074230001050764189040001002081902030",
  "290800300000000046786500200020000100100009482647000903875200004310645700009008000",
  "908260351500094872002010409003000084154083007020000905760100040009006000001005090",
  "790400801100780090000910402975821046000000785006504000207090034300200908009100627",
  "049003825500709106361025007600590084800004309190370562008000691415986273970130450",
  "690538072080000600030907085040000900006029051000751800904000010008610090003000740",
  "760009001024810076001706902600905018005030607800060295200600700400357009530090800",
  "090143802600590007480672593547261009368459721019837654906384215154706930030915006",
  "000963000301520490060001325810290574096000130072004080930048060108659740647130058"
];

const SOLUTIONS = [
  "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
  "968425173723861594541793286157684329496132857832957641219546738374218965685379412",
  "627149583345286971189573642518792364793654218462318759256831497971425836834967125",
  "829365147643718529751492638318527496596143782472986315984651273267834951135279864",
  "694281735783456921521973648369827154258614397417395286835762419146539872972148563",
  "421796853365281497879534612694875231538412769712369584983647125246153978157928346",
  "835127946427695318196843275512478693368519724974236851253764189749381562681952437",
  "294816375531927846786534219928453167153769482647182953875291634312645798469378521",
  "948267351516394872372518469693752184154983627827641935765139248289476513431825796",
  "793452861124786593658913472975821346412369785836574219287695134361247958549138627",
  "749613825582749136361825947623591784857264319194378562238457691415986273976132458",
  "691538472587142639432967185145386927876429351329751864964273518758614293213895746",
  "768529431924813576351746982642975318195238647873461295219684753486357129537192864",
  "795143862623598147481672593547261389368459721219837654976384215154726938832915476",
  "254963817381527496769481325813296574496875132572314689935748261128659743647132958"
];

const boardPassed = new Array(15).fill(false);

let boardIndex = LEVEL1_INDICES[0];
let selectedRow = 0;
let selectedCol = 0;

function createBoardFromString(str) {
  const board = [];
  for (let r = 0; r < 9; r++) {
    const row = [];
    for (let c = 0; c < 9; c++) {
      const i = r * 9 + c;
      const value = Number(str[i]);

      row.push({
        value: value,
        fixed: value !== 0,
        pencilmarks: new Set()
      });
    }
    board.push(row);
  }
  return board;
}

function updateBoardBackground() {
  const cols = 3;
  const rows = 5;

  const col = boardIndex % cols;
  const row = Math.floor(boardIndex / cols);

  const xPercent = (col / (cols - 1)) * 100;
  const yPercent = (row / (rows - 1)) * 100;

  boardBgEl.style.backgroundImage = 'url("assets/mantiva.png")';
  boardBgEl.style.backgroundRepeat = "no-repeat";
  boardBgEl.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
  boardBgEl.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
}

const boards = SUDOKU_UNSOLVED.map(createBoardFromString);

const screenMenu = document.getElementById("screen-menu");
const screenInfo = document.getElementById("screen-info");
const screenGame = document.getElementById("screen-game");

const startBtn = document.getElementById("start-btn");
const infoBtn = document.getElementById("info-btn");
const closeBtn = document.getElementById("close-btn");


const backFromInfoBtn = document.getElementById("back-from-info-btn");
const backFromGameBtn = document.getElementById("back-from-game-btn");

const prevBoardBtn = document.getElementById("prev-board-btn");
const progressBoardBtn = document.getElementById("progress-board-btn");

const infoTextContainer = document.getElementById("info-text");
const sudokuBoardEl = document.getElementById("sudoku-board");
const boardLabelEl = document.getElementById("board-label");

const screenQuiz = document.getElementById("screen-quiz");
const screenEnd = document.getElementById("screen-end");

const quizTitleEl = document.getElementById("quiz-title");
const quizPromptEl = document.getElementById("quiz-prompt");
const quizInputEl = document.getElementById("quiz-input");
const quizSubmitBtn = document.getElementById("quiz-submit-btn");
const quizMessageEl = document.getElementById("quiz-message");

function setState(newState) {
  state = newState;
  render();
}

function renderInfoText() {
  infoTextContainer.innerHTML = "";

  INFO_TEXT.forEach(line => {
    const p = document.createElement("p");
    p.className = "info-line";
    p.textContent = line;
    infoTextContainer.appendChild(p);
  });
}

function updateMenuButton() {
  if (infoRead) {
    startBtn.disabled = false;
    startBtn.textContent = "Spielen (Level 1)";
  } else {
    startBtn.disabled = true;
    startBtn.textContent = "Bitte erst Infotext lesen";
  }
}

function updateProgressButton() {
  if (boardPassed[boardIndex]) {
    progressBoardBtn.textContent = "Nächstes Board";
  } else {
    progressBoardBtn.textContent = "Check";
  }
}

function getCurrentLevelLabel() {
  const isLevel1 = LEVEL1_INDICES.includes(boardIndex);
  const level = isLevel1 ? "Level 1" : "Level 2";
  const visibleIndex = isLevel1
    ? LEVEL1_INDICES.indexOf(boardIndex) + 1
    : LEVEL2_INDICES.indexOf(boardIndex) + 1;

  return `${level} • Board ${visibleIndex}`;
}

function solved(index) {
  const solution = SOLUTIONS[index];
  if (!solution || solution.length !== 81) return false;

  let current = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      current += String(boards[index][r][c].value);
    }
  }

  return current === solution;
}

function allSolved(levelState) {
  const seq = levelState === GAME1 ? LEVEL1_INDICES : LEVEL2_INDICES;
  return seq.every(index => solved(index));
}

function prepareQuiz(stateName) {
  quizInput = "";
  quizMessage = "";

  if (stateName === QUIZ1) {
    quizTitleEl.textContent = "Endrätsel – Teil 1";
    quizPromptEl.textContent = "Wer ist unsere Lieblingsmantis?";
  } else if (stateName === QUIZ2) {
    quizTitleEl.textContent = "Endrätsel – Teil 2";
    quizPromptEl.textContent = "Wie heißt die beste Community?";
  }

  quizInputEl.value = "";
  quizMessageEl.textContent = "";
}

function renderBoard() {
  sudokuBoardEl.innerHTML = "";
  boardLabelEl.textContent = getCurrentLevelLabel();
  updateProgressButton();
  updateBoardBackground();

  const board = boards[boardIndex];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      const cellEl = document.createElement("div");
      cellEl.className = "cell";

      if (r === selectedRow && c === selectedCol) {
        cellEl.classList.add("selected");
      }

      if (cell.fixed) {
        cellEl.classList.add("fixed");
      }

      if (c === 2 || c === 5) {
        cellEl.classList.add("block-right");
      }

      if (r === 2 || r === 5) {
        cellEl.classList.add("block-bottom");
      }

      cellEl.addEventListener("click", () => {
        selectedRow = r;
        selectedCol = c;
        renderBoard();
      });

      if (cell.value !== 0) {
        let displayValue = String(cell.value);

        if (cell.value === 4 && LETTER_FOR_FOUR[boardIndex]) {
          displayValue = LETTER_FOR_FOUR[boardIndex];
        }

        cellEl.textContent = displayValue;
      } else if (cell.pencilmarks.size > 0) {
        const pmWrap = document.createElement("div");
        pmWrap.className = "pencilmarks";

        for (let n = 1; n <= 9; n++) {
          const pm = document.createElement("div");
          pm.className = "pencilmark";

          if (cell.pencilmarks.has(n)) {
            let displayValue = String(n);

            if (n === 4 && LETTER_FOR_FOUR[boardIndex]) {
              displayValue = LETTER_FOR_FOUR[boardIndex];
            }

            pm.textContent = displayValue;
          }

          pmWrap.appendChild(pm);
        }

        cellEl.appendChild(pmWrap);
      }

      sudokuBoardEl.appendChild(cellEl);
    }
  }
}

function nextBoard() {
  const seq = LEVEL1_INDICES.includes(boardIndex) ? LEVEL1_INDICES : LEVEL2_INDICES;
  const pos = seq.indexOf(boardIndex);

  if (pos === seq.length - 1) {
    if (state === GAME1) {
      setState(QUIZ1);
    } else if (state === GAME2) {
      setState(QUIZ2);
    }
    return;
  }

  boardIndex = seq[pos + 1];
  selectedRow = 0;
  selectedCol = 0;
  renderBoard();
}

function prevBoard() {
  const seq = LEVEL1_INDICES.includes(boardIndex) ? LEVEL1_INDICES : LEVEL2_INDICES;
  const pos = seq.indexOf(boardIndex);

  if (pos === 0) {
    return;
  }

  boardIndex = seq[pos - 1];
  selectedRow = 0;
  selectedCol = 0;
  renderBoard();
}

function handleNumberInput(n, withShift) {
  const cell = boards[boardIndex][selectedRow][selectedCol];

  if (cell.fixed) {
    return;
  }

  if (withShift) {
    if (cell.value !== 0) {
      return;
    }

    if (cell.pencilmarks.has(n)) {
      cell.pencilmarks.delete(n);
    } else {
      cell.pencilmarks.add(n);
    }
  } else {
    cell.value = n;
    cell.pencilmarks.clear();
    boardPassed[boardIndex] = false;
  }

  renderBoard();
}

function clearSelectedCell() {
  const cell = boards[boardIndex][selectedRow][selectedCol];

  if (cell.fixed) {
    return;
  }

  cell.value = 0;
  cell.pencilmarks.clear();
  boardPassed[boardIndex] = false;
  renderBoard();
}

function render() {
  screenMenu.classList.add("hidden");
  screenInfo.classList.add("hidden");
  screenGame.classList.add("hidden");
  screenQuiz.classList.add("hidden");
  screenEnd.classList.add("hidden");

  updateMenuButton();

  if (state === MENU) {
    screenMenu.classList.remove("hidden");
  } else if (state === INFO) {
    screenInfo.classList.remove("hidden");
  } else if (state === GAME1 || state === GAME2) {
    screenGame.classList.remove("hidden");
    renderBoard();
  } else if (state === QUIZ1 || state === QUIZ2) {
    screenQuiz.classList.remove("hidden");
    prepareQuiz(state);
  } else if (state === END) {
    screenEnd.classList.remove("hidden");
  }
}

startBtn.addEventListener("click", () => {
  if (!infoRead) return;
  boardIndex = LEVEL1_INDICES[0];
  selectedRow = 0;
  selectedCol = 0;
  setState(GAME1);
});

infoBtn.addEventListener("click", () => {
  setState(INFO);
});

backFromInfoBtn.addEventListener("click", () => {
  infoRead = true;
  setState(MENU);
});

backFromGameBtn.addEventListener("click", () => {
  setState(MENU);
});

prevBoardBtn.addEventListener("click", () => {
  prevBoard();
});

progressBoardBtn.addEventListener("click", () => {
  /*
  if (!boardPassed[boardIndex]) {
    if (solved(boardIndex)) {
      boardPassed[boardIndex] = true;
      renderBoard();
    } else {
      alert("Noch nicht korrekt.");
    }
  } else {
    nextBoard();
  }
  */

  nextBoard();
});
  

closeBtn.addEventListener("click", () => {
  window.close();

  setTimeout(() => {
    alert("Die Seite kann im Browser meist nicht automatisch geschlossen werden.");
  }, 80);
});

document.addEventListener("keydown", (event) => {
    if (state === QUIZ1 || state === QUIZ2) {
  if (event.key === "Enter") {
    event.preventDefault();
    quizSubmitBtn.click();
  }
  return;
}
  if (state !== GAME1 && state !== GAME2) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    selectedCol = (selectedCol - 1 + 9) % 9;
    renderBoard();
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    selectedCol = (selectedCol + 1) % 9;
    renderBoard();
    return;
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    selectedRow = (selectedRow - 1 + 9) % 9;
    renderBoard();
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectedRow = (selectedRow + 1) % 9;
    renderBoard();
    return;
  }

  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    clearSelectedCell();
    return;
  }

  if (event.key.toLowerCase() === "n") {
    event.preventDefault();
    prevBoard();
    return;
  }

  if (event.key.toLowerCase() === "b") {
    event.preventDefault();
    return;
  }

  const match = event.code.match(/^Digit([1-9])$/);
  if (match) {
    event.preventDefault();
    const digit = Number(match[1]);
    handleNumberInput(digit, event.shiftKey);
  }
});

quizSubmitBtn.addEventListener("click", () => {
  const answer = quizInputEl.value.trim().toUpperCase();

  if (state === QUIZ1) {
    if (answer === QUIZ1_ANSWER) {
      quizMessage = "";
      boardIndex = LEVEL2_INDICES[0];
      selectedRow = 0;
      selectedCol = 0;
      setState(GAME2);
    } else {
      quizMessage = "Leider falsch 😅";
      quizMessageEl.textContent = quizMessage;
    }
  } else if (state === QUIZ2) {
    if (answer === QUIZ2_ANSWER) {
      quizMessage = "";
      setState(END);
    } else {
      quizMessage = "Leider falsch 😅";
      quizMessageEl.textContent = quizMessage;
    }
  }
});

renderInfoText();
render();

