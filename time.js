function updateTime() {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString();
  document.getElementById("time-display").innerText = timeString;
}

setInterval(updateTime, 1000);
updateTime();
