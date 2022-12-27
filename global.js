const ALL_DATA_KEY = "ALL_QUESTIONS";
const SETTINGS_KEY = "SETTINGS";
const DEFAULT_SETTINGS = {
  TIME_VALUE: 15,
  TITLE: "مسابقه",
  NUMBER_OF_USERS: 4,
};

const get_saved_data = (key, default_value) => {
  const data = localStorage.getItem(key);
  if (!data) return default_value;
  return JSON.parse(data);
};

function format_numbers_to_persian(txt) {
  const str = "" + txt;
  const persianNums = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (digit) => persianNums[+digit]);
}

let data = get_saved_data(ALL_DATA_KEY, []);
let settings = get_saved_data(SETTINGS_KEY, DEFAULT_SETTINGS);
