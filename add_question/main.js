const $ = (selector) => document.querySelector(selector);
let form = $("#form");
let ans = $("#ans");
let tasks = $("#tasks");
let list_number = $("#list_number");
let settings_form = $("#settings_form");
let settings_btn = $("#settings_btn");
let export_btn = $("#export_btn");
let import_input = $("#import_input");
let choices = $("#choices");

let answer = 1;

let saveAns = (ans) => (answer = ans);

let create_choice_elements = () => {
  let choicesHtml = "";
  ["۱", "۲", "۳", "۴"].forEach((ch, i) => {
    choicesHtml += `<div class="d-flex">
    <input 
    class="form-check-input"
    type="radio"
    onclick="saveAns(${i + 1})"
    ${answer === i + 1 ? "checked" : ""}
    name="ChoiceRadio" 
    id = "slot${i}">
    <label class="form-check-label px-2" for="ChoiceRadio"> ${ch} </label>
    </div>`;
  });
  choices.innerHTML = choicesHtml;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  add_data();
  form.reset();
  answer = 1;
});

let add_data = () => {
  let form_data = get_form_data(form);
  const new_data = {
    question: form_data.question,
    options: [form_data.opt1, form_data.opt2, form_data.opt3, form_data.opt4],
    answer,
  };
  console.log(new_data);
  data.push(new_data);
  save_all_data();
  notify_success("با موفقیت ذخیره شد.");
};

let save_all_data = () => {
  save_data(ALL_DATA_KEY, data);
  render_data_list();
};

const render_options = (options, ans) => {
  let result = "";
  options.forEach((op, i) => {
    result += `
    <span class="badge bg-${ans === i + 1 ? "success" : "dark"}">${ format_numbers_to_persian(op)}</span>
    `;
  });
  return result;
};

let render_data_list = () => {
  list_number.innerText = `تعداد سوال : ‍‍‍${format_numbers_to_persian(
    data.length
  )}`;
  if (data.length) {
    tasks.innerHTML = "";
    data.map((x, y) => {
      return (tasks.innerHTML += `
    <div id=${y} class="position-relative">
    <p style="margin: 0;">${format_numbers_to_persian(x.question)}</p>  
    <div class="d-flex border-0">
    <p style="margin: 0;">${render_options(x.options, x.answer)}</p>
    </div>
    <div class="position-absolute top-50 start-0 translate-middle" style="padding: 1px;">
    <span style="cursor: pointer;" onClick ="delete_single_data(this)">&#10060;</span>
    </div>
    </div>
    `);
    });
  } else {
    tasks.innerHTML = `
  <section class="m-auto" >
  <img class="w-100" src="../images/no_data.jpg" alt="no_data" style="max-height: 400px;">
  </section>
  `;
  }
};

let delete_single_data = (e) => {
  confirm({
    title: "حذف سوال",
    msg: "آیا از حذف سوال اطمینان دارید ؟",
    on_ok: () => {
      data.splice(e.parentElement.parentElement.id, 1);
      notify({ type: "success", msg: "سوال  با موفقیت حذف شد." });
      save_all_data();
    },
  });
};

settings_form.addEventListener("submit", (e) => {
  e.preventDefault();
  save_settings();
  notify_success("با موفقیت ذخیره شد.");
});

const load_settings = () => {
  const settings_to_load = {
    quiz_time: settings.TIME_VALUE,
    quiz_title: settings.TITLE,
    quiz_users_number: settings.NUMBER_OF_USERS,
  };
  load_form(settings_form, settings_to_load);
};

const save_settings = () => {
  const form_data = get_form_data(settings_form);
  const new_settings = {
    TIME_VALUE: form_data.quiz_time,
    TITLE: form_data.quiz_title,
    NUMBER_OF_USERS: form_data.quiz_users_number,
  };
  save_data(SETTINGS_KEY, new_settings);
  settings = new_settings;
};

settings_btn.addEventListener("click", load_settings);

function saveToFile(txt) {
  let blob = new Blob([txt], { type: "octet/stream" });
  let anchor = document.createElement("a");
  anchor.download = "questions.json";
  anchor.href = window.URL.createObjectURL(blob);
  anchor.click();
}

export_btn.addEventListener("click", () =>
  save_as_text("questions.json", data)
);

const load_external_data = (json) => {
  try {
    const content = JSON.parse(json);
    confirm({
      title: "وارد کردن سوال",
      msg: "آیا می خواهید سوالات ورودی را به سوالات موجود اضافه کنید؟",
      on_ok: () => {
        data = [...data, ...content];
        save_all_data();
        notify({ type: "success", msg: "سوالات با موفقیت اضافه شدند." });
      },
    });
  } catch (error) {
    notify({
      type: "error",
      msg: "فایل نامعتبر است.",
    });
  }
};

import_input.addEventListener("change", () => {
  const file_to_read = import_input.files[0];
  const fileread = new FileReader();
  fileread.onload = (e) => load_external_data(e.target.result);
  fileread.readAsText(file_to_read);
});

(() => {
  render_data_list();
  create_choice_elements();
})();
