window.addEventListener("load", (e) => {
  handleFormSubmission();
});

function handleFormSubmission() {
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector("#submit-btn");
    submitBtn.setAttribute("disabled", true);

    const email = e.target.querySelector("#email-input").value;
    const password = e.target.querySelector("#password-input").value;

    const loginRes = await loginReq(email, password);
    handleResponse(loginRes, e);

    submitBtn.removeAttribute("disabled");
  });
}

async function loginReq(email, password) {
  try {
    const res = await fetch("/api/v1/login-user", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err.message;
  }
}

async function handleResponse(res, target) {
  if (res.success) {
    const loginSuccess = target.target.querySelector("#login-success");
    loginSuccess.innerText = res.msg;
    setTimeout(() => {
      window.location.assign(res.location);
    }, 1000);
  } else if (!res.success) {
    if (res.error.email) {
      const loginFailEmail = target.target.querySelector("#login-fail-email");
      showErrorMsg(loginFailEmail, res.error.email);
    } else if (res.error.password) {
      const loginFailPwd = target.target.querySelector("#login-fail-pwd");
      showErrorMsg(loginFailPwd, res.error.password);
    }
  }
}

function showErrorMsg(ele, error) {
  ele.innerText = error;
  setTimeout(() => {
    ele.innerText = "";
  }, 5000);
}
