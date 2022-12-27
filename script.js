//selecting all required elements
const continue_btn = document.querySelector(".continue_btn");
const newgame_btn = document.querySelector(".newgame_btn");
const info_box = document.querySelector(".info_box");
const quiz_box = document.querySelector(".quiz_box");
const intro_box = document.querySelector(".intro_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const refresh_results_btn = document.querySelector(".refresh-results");
const next_turn_btn = result_box.querySelector(".buttons .next_turn_btn");
const show_results_btn = result_box.querySelector(".buttons .show_results_btn");
const next_btn = document.querySelector("footer .next_btn");
const back_to_game = document.querySelector(".back_to_game");

const AllQuestions = data;
const TURNS_KEY = "TURNS";
let counter;
let questions;
let turns = [];
let saved_time = 0;
let userScore = 0;
let timeValue = settings.TIME_VALUE;
let que_count = 0;

const is_game_over = () => {
  return turns.length > settings.NUMBER_OF_USERS;
};

const add_new_turn = () => {
  if (!is_game_over()) {
    const new_turn = { score: 0, saved_time: 0, que_count: 0 };
    turns.push(new_turn);
    save_data(TURNS_KEY, turns);
  }
};

const update_corrent_turn = (que_count) => {
  const last_index = turns.length - 1;
  turns[last_index] = { score: userScore, saved_time, que_count };
  save_data(TURNS_KEY, turns);
};

const render_all_results = () => {
  const info_list = document.querySelector(".info-list");
  turns.forEach((turn, i) => {
    info_list.innerHTML += `
    <tr>
       <td> نفر شماره ${format_numbers_to_persian(i + 1)}</td>
       <td>${format_numbers_to_persian(turn.score)}</td>
       <td>${format_numbers_to_persian(turn.saved_time)} ثانیه</td>
    </tr>
    `;
  });
};

const show_results = () => {
  info_box.classList.add("activeInfo"); //show info box
  result_box.classList.remove("activeResult"); //hide result box
  intro_box.classList.remove("activeIntro");
  render_all_results();
};

const set_user_questions = () => {
  const current_turn = turns.length - 1;
  const { NUMBER_OF_USERS } = settings;
  const que_per_user = Math.floor(AllQuestions.length / NUMBER_OF_USERS);
  const user_questions = [...AllQuestions].slice(
    que_per_user * current_turn,
    que_per_user * (current_turn + 1)
  );
  questions = user_questions;
};

const set_title = () => {
  document.title = settings.TITLE;
  document.querySelector(".title").innerHTML = settings.TITLE;
};

const start_game = () => {
  intro_box.classList.remove("activeIntro");
  result_box.classList.remove("activeResult"); //hide result box
  quiz_box.classList.add("activeQuiz"); //show quiz box
  show_quetions(que_count); //calling showQestions function
  start_timer(timeValue); //calling startTimer function
  start_timer_line(); //calling startTimerLine function
};

newgame_btn.onclick = () => {
  if (AllQuestions.length < settings.NUMBER_OF_USERS) {
    alert(
      "به اندازه کافی سوال ثبت نشده است! لطفا از بخش مدیریت آزمون تعداد سوالات را افزایش دهید"
    );
  } else {
    localStorage.removeItem(TURNS_KEY);
    turns = [];
    que_count = 0;
    saved_time = 0;
    timeValue = settings.TIME_VALUE;
    add_new_turn();
    set_user_questions();
    start_game();
  }
};

continue_btn.onclick = () => {
  set_user_questions();
  const last_turn = turns[turns.length - 1];
  que_count = last_turn.que_count;
  saved_time = +last_turn.saved_time;
  userScore = last_turn.score;
  timeValue = settings.TIME_VALUE;
  if (que_count <= questions.length - 1) {
    if (!is_game_over()) start_game();
    else {
      turns.pop();
      show_results();
    }
  } else show_turn_result();
};

next_turn_btn.onclick = () => {
  add_new_turn();
  set_user_questions();
  saved_time = 0;
  que_count = 0;
  userScore = 0;
  timeValue = settings.TIME_VALUE;
  if (!is_game_over()) start_game();
  else {
    turns.pop();
    show_results();
  }
};

show_results_btn.onclick = show_results;

refresh_results_btn.onclick = () => {
  save_data(TURNS_KEY, []);
  location.reload();
};

// if Next Que button clicked
next_btn.onclick = () => {
  clearInterval(counter); //clear counter
  if (que_count < questions.length - 1) {
    que_count++;
    timeValue = settings.TIME_VALUE;
    start_game();
    timeText.textContent = "زمان باقی مانده"; //change the timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else show_turn_result(); //calling show_turn_result function
};

back_to_game.onclick = () => {
  location.reload();
};

// getting questions and options from array
function show_quetions(index) {
  const que_text = document.querySelector(".que_text");
  const number = format_numbers_to_persian(index + 1);
  const { question, options, answer } = questions[index];
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag = `<span>${
    number + " . " + format_numbers_to_persian(question)
  }</span>`;
  let option_tag = "";
  options.forEach((opt) => {
    option_tag += `<div class="option"><span>
      ${format_numbers_to_persian(opt)}
      </span></div>`;
  });
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  const option = option_list.querySelectorAll(".option");

  // set onclick attribute to all available options
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute(
      "onclick",
      `option_selected(this , ${answer} , ${i + 1})`
    );
  }
}
// creating the new div tags which for icons
let tickIconTag = "<div >&#9989;</div>";
let crossIconTag = "<div > &#10060; </div>";

function render_correct_ans(answer) {
  const allOptions = option_list.children; //getting all option items
  allOptions[answer - 1].setAttribute("class", "option correct"); //adding green color to matched option
  allOptions[answer - 1].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
  for (i = 0; i < allOptions.length; i++) {
    allOptions[i].classList.add("disabled"); //once user select an option then disabled all options
  }
}

function update_option_item(item, className, icon) {
  item.classList.add(className);
  item.insertAdjacentHTML("beforeend", icon);
}

function option_selected(choice, answer, option_index) {
  clearInterval(counter);
  stop_timer_line();

  if (answer === option_index) {
    userScore += 1; //upgrading score value with 1
    update_option_item(choice, "correct", tickIconTag);
  } else {
    update_option_item(choice, "incorrect", crossIconTag);
    render_correct_ans(answer);
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
  saved_time += +timeValue;
  update_corrent_turn(que_count + 1);
}

function show_turn_result() {
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); //show result box
  const scoreText = result_box.querySelector(".complete_text");
  let scoreTag = `
  <p style=" font-size: 25px;font-weight: bold;" > 
  امتیاز شما : ${format_numbers_to_persian(userScore)} 
  </p>
  <p style=" font-size: 20px ; color : gray" > 
   زمان ذخیره : ${format_numbers_to_persian(saved_time)} ثانیه
  </p>
  `;
  scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
}

function start_timer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeCount.textContent = format_numbers_to_persian(time); //changing the value of timeCount with time value
    time--; //decrement the time value
    timeValue = time;
    if (time < 9) {
      //if timer is less than 9
      let addZero = format_numbers_to_persian(timeCount.textContent);
      timeCount.textContent = "۰" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "اتمام زمان"; //change the time text to time off
      const correntQue = questions[que_count];
      render_correct_ans(correntQue.answer);
      next_btn.classList.add("show"); //show the next button if user selected any option
      update_corrent_turn(que_count + 1);
    }
  }
}

function start_timer_line() {
  time_line.classList.add("active");
}

function stop_timer_line() {
  time_line.classList.remove("active");
}

(() => {
  set_title();
  turns = get_saved_data(TURNS_KEY, []);
  time_line.style.animationDuration = settings.TIME_VALUE + "s";
  if (turns.length > 0) continue_btn.style.display = "block";
})();
