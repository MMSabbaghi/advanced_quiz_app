//selecting all required elements
const start_btn = document.querySelector(".start_btn");
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
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");
const next_btn = document.querySelector("footer .next_btn");
const continue_btn = document.querySelector(".continue-btn");

const AllQuestions = data;
const RESULTS_KEY = "RESULTS";
let timeValue = settings.TIME_VALUE;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
let questions;

const get_results = () => get_saved_data(RESULTS_KEY, []);

const save_results = (newScore) => {
  const lastResult = [...get_results()];
  const result_string = JSON.stringify([...lastResult, newScore]);
  localStorage.setItem(RESULTS_KEY, result_string);
};

const render_all_results = () => {
  const info_list = document.querySelector(".info-list");
  const resultsArr = get_results();
  let infos = "";
  resultsArr.map((res, i) => {
    infos += `
    <div class="info">
        <p>
            امتیاز نفر${format_numbers_to_persian(i + 1)} :
        </p>
        <span>
            ${format_numbers_to_persian(res)}
        </span>
    </div>
          `;
  });
  info_list.innerHTML = infos;
};

const show_results = () => {
  set_user_questions();
  if (!questions) continue_btn.disabled = true;
  info_box.classList.add("activeInfo"); //show info box
  result_box.classList.remove("activeResult"); //hide result box
  intro_box.classList.remove("activeIntro");
  render_all_results();
};

const set_user_questions = () => {
  const userTurn = get_results().length;
  const { NUMBER_OF_USERS } = settings;
  const que_per_user = Math.floor(AllQuestions.length / NUMBER_OF_USERS);
  const user_questions = [...AllQuestions].slice(
    userTurn * que_per_user,
    que_per_user * (userTurn + 1)
  );
  questions = user_questions.length >= 1 ? user_questions : null;
};

const set_title = () => {
  document.title = settings.TITLE;
  document.querySelector(".title").innerHTML = settings.TITLE;
};

const start_game = () => {
  if (AllQuestions.length < settings.NUMBER_OF_USERS)
    alert(
      "به اندازه کافی سوال ثبت نشده است! لطفا از بخش مدیریت آزمون تعداد سوالات را افزایش دهید"
    );
  else {
    set_title();
    intro_box.classList.remove("activeIntro");
    quiz_box.classList.add("activeQuiz"); //show quiz box
    show_quetions(0); //calling showQestions function
    start_timer(settings.TIME_VALUE); //calling startTimer function
    start_timer_line(); //calling startTimerLine function
  }
};

newgame_btn.onclick = () => {
  localStorage.removeItem(RESULTS_KEY);
  set_user_questions();
  start_game();
};

start_btn.onclick = () => {
  set_user_questions();
  if (questions) start_game();
  else show_results();
};

restart_quiz.onclick = () => {
  set_user_questions();
  if (questions) {
    quiz_box.classList.add("activeQuiz"); //show quiz box
    result_box.classList.remove("activeResult"); //hide result box
    timeValue = settings.TIME_VALUE;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    show_quetions(que_count); //calling showQestions function
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    start_timer(timeValue); //calling startTimer function
    start_timer_line(); //calling startTimerLine function
    timeText.textContent = "زمان باقی مانده"; //change the text of timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else {
    show_results();
  }
};

// if quitQuiz button clicked
quit_quiz.onclick = show_results;

refresh_results_btn.onclick = () => {
  localStorage.setItem(RESULTS_KEY, JSON.stringify([]));
  location.reload();
};

// if Next Que button clicked
next_btn.onclick = () => {
  if (que_count < questions.length - 1) {
    //if question count is less than total question length
    que_count++; //increment the que_count value
    que_numb++; //increment the que_numb value
    timeValue = settings.TIME_VALUE;
    show_quetions(que_count); //calling showQestions function
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    start_timer(timeValue); //calling startTimer function
    start_timer_line(); //calling startTimerLine function
    timeText.textContent = "زمان باقی مانده"; //change the timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    show_turn_result(); //calling show_turn_result function
  }
};

continue_btn.onclick = () => {
  set_user_questions();
  if (questions) {
    start_game();
    info_box.classList.remove("activeInfo");
  }
};

// getting questions and options from array
function show_quetions(index) {
  const que_text = document.querySelector(".que_text");
  const number = format_numbers_to_persian(index + 1);

  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag =
    "<span>" +
    number +
    " . " +
    format_numbers_to_persian(questions[index].question) +
    "</span>";
  let option_tag = "";
  questions[index].options.forEach((opt) => {
    option_tag +=
      '<div class="option"><span>' +
      format_numbers_to_persian(opt) +
      "</span></div>";
  });
  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  option_list.innerHTML = option_tag; //adding new div tag inside option_tag

  const option = option_list.querySelectorAll(".option");

  // set onclick attribute to all available options
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", `option_selected(this , ${i + 1})`);
  }
}
// creating the new div tags which for icons
let tickIconTag = "<div >&#9989;</div>";
let crossIconTag = "<div > &#10060; </div>";

function render_correct_ans(correcAns) {
  const allOptions = option_list.children.length; //getting all option items
  for (i = 0; i < allOptions; i++) {
    if (correcAns - 1 == i) {
      //if there is an option which is matched to an array answer
      option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
      option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
}

function option_selected(answer, choice) {
  //if user clicked on option
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  stop_timer_line();
  const correntQue = questions[que_count];

  if (correntQue.answer == choice) {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    render_correct_ans(correntQue.answer);
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
}

function show_turn_result() {
  save_results(userScore);
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); //show result box
  const scoreText = result_box.querySelector(".complete_text");
  let scoreTag = `<p style=" font-size: 30px;font-weight: bold;" > 
  امتیاز شما : ${format_numbers_to_persian(userScore)} </p>`;
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
  time_line.style.animationDuration = settings.TIME_VALUE + "s";
  if (get_results().length > 0) start_btn.innerHTML = "ادامه مسابقه قبلی";
  else start_btn.style.display = "none";
})();


