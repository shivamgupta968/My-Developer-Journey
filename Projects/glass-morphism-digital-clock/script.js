const $ = (id) => document.getElementById(id);
let use24Hour = false;

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  $("hours").textContent = String(use24Hour ? hours : (hours % 12 || 12)).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");
  $("ampm").textContent = use24Hour ? "" : ampm;
  $("ampm").style.display = use24Hour ? "none" : "inline";

  $("date").textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  }).format(now);
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
  $("timezone").textContent = zone.replaceAll("_", " ");
  const offset = -now.getTimezoneOffset();
  $("offset").textContent = `UTC${offset >= 0 ? "+" : "−"}${String(Math.floor(Math.abs(offset)/60)).padStart(2,"0")}:${String(Math.abs(offset)%60).padStart(2,"0")}`;

  const secondsDeg = seconds * 6;
  const minutesDeg = minutes * 6 + seconds * 0.1;
  const hoursDeg = (now.getHours() % 12) * 30 + minutes * 0.5;
  $("secondHand").style.transform = `rotate(${secondsDeg}deg)`;
  $("minuteHand").style.transform = `rotate(${minutesDeg}deg)`;
  $("hourHand").style.transform = `rotate(${hoursDeg}deg)`;
}

$("formatBtn").addEventListener("click", () => {
  use24Hour = !use24Hour;
  $("formatBtn").innerHTML = `${use24Hour ? "24-HOUR" : "12-HOUR"} <span>↔</span>`;
  updateClock();
});
$("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
  $("themeBtn").textContent = document.body.classList.contains("light") ? "☾" : "☼";
});
updateClock();
setInterval(updateClock, 1000);
