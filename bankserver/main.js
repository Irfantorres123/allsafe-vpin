const BASE_URL = "http://localhost:5000";
window.onload = async function () {
  let response = await fetch(`${BASE_URL}/services/list?${Date.now()}`, {});
  let services = await response.json();
  const banks = document.getElementById("banks");
  for (let service of services) {
    let option = document.createElement("option");
    option.value = service.token;
    option.innerText = service.name;
    banks.appendChild(option);
  }
  let lastSelectedBank = localStorage.getItem("lastSelectedIndex");
  if (lastSelectedBank) {
    banks.selectedIndex = lastSelectedBank;
  }
  const loginButton = document.getElementById("loginButton");
  loginButton.onclick = async function () {
    let username = document.getElementById("username").value;
    let selectedOption = banks.options[banks.selectedIndex];
    localStorage.setItem("lastSelectedIndex", banks.selectedIndex);
    let token = selectedOption.value;
    let response = await fetch(
      `${BASE_URL}/vcs/generate-call?username=${username}&date=${Date.now()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-service-id": token,
        },
      }
    );
    if (response.status === 200) {
      window.location.href = `verify.html?serviceId=${token}&name=${
        services[banks.selectedIndex].name
      }&username=${username}`;
    }
  };
};
