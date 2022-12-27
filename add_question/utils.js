function save_data(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function save_as_text(file_name, txt) {
  let blob = new Blob([JSON.stringify(txt)], { type: "octet/stream" });
  let anchor = document.createElement("a");
  anchor.download = file_name;
  anchor.href = window.URL.createObjectURL(blob);
  anchor.click();
}

function read_file(file, on_load) {
  const fileread = new FileReader();
  fileread.onload = (e) => on_load(e.target.result);
  fileread.readAsText(file);
}

function get_form_data(form) {
  const form_data = new FormData(form);
  const form_data_obj = {};
  form_data.forEach((value, key) => (form_data_obj[key] = value));
  return form_data_obj;
}

function load_form(form, data) {
  Object.keys(data).forEach((key) => {
    const input = form.elements[key];
    input.value = data[key];
  });
}

function notify({ type, msg }) {
  alertify.set("notifier", "position", "top-center");
  alertify.notify(msg, type, 5);
}

function notify_success(msg) {
  notify({ type: "success", msg });
}

function notify_error(msg) {
  notify({ type: "error", msg });
}

function confirm({ title, msg, on_ok }) {
  alertify
    .confirm(msg)
    .set("onok", on_ok)
    .set("labels", { ok: "تایید", cancel: "لغو" })
    .setHeader(title);
}

