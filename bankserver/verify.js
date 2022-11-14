window.onload = async function () {
  let queryParams = new URLSearchParams(window.location.search);
  let serviceId = queryParams.get("serviceId");
  let name = queryParams.get("name");
  let username = queryParams.get("username");
  document.getElementById("bankName").innerText = name;
  const verifyButton = document.getElementById("verifyButton");
  verifyButton.onclick = async function () {
    const code = document.getElementById("code").value;
    let response = await fetch(
      `http://localhost:5000/vcs/verify?response=${code}&username=${username}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-service-id": serviceId,
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      if (data.status === "success") {
        window.location.href = `status.html?status=success`;
      } else {
        window.location.href = `status.html?status=failure`;
      }
    }
  };
};
