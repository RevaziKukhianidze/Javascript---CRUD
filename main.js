class User {
  constructor(userName, email, password) {
    this.userName = userName;
    this.email = email;
    this.password = password;
  }
}

class AlertService {
  static showSuccess() {
    swal("SUCCESS!", "", "success");
  }

  static showError() {
    swal("ERROR!", "", "error");
  }
}

class HttpService {
  constructor() {
    this.xmlHttp = new XMLHttpRequest();
    this.serverBaseUrl = "https://testingservice.azurewebsites.net/api";
  }

  registerUser(user) {
    var self = this;
    this.xmlHttp.open(
      "POST",
      `${this.serverBaseUrl}/user/registerUser?api-version=1`
    );
    this.xmlHttp.setRequestHeader("content-type", "application/json");
    this.xmlHttp.onloadend = function () {
      console.log(self.xmlHttp.responseText);
      if (self.xmlHttp.status == 200) {
        AlertService.showSuccess();
      } else {
        AlertService.showError();
      }
    };
    this.xmlHttp.send(JSON.stringify(user));
  }

  registerAdmin(user) {
    var self = this;
    this.xmlHttp.open("POST", `${this.serverBaseUrl}/user/registerAdmin`);
    this.xmlHttp.setRequestHeader("content-type", "application/json");
    this.xmlHttp.setRequestHeader(
      "authorization",
      `bearer ${localStorage["jwt"]}`
    );
    this.xmlHttp.onloadend = function () {
      if (self.xmlHttp.status == 200) {
        AlertService.showSuccess();
      } else {
        AlertService.showError();
      }
      console.log(self.xmlHttp.responseText);
    };
    this.xmlHttp.send(JSON.stringify(user));
  }

  logIn(logInUser) {
    var self = this;
    this.xmlHttp.open("POST", `${this.serverBaseUrl}/User/LogIn`);
    this.xmlHttp.setRequestHeader("content-type", "application/json");
    this.xmlHttp.onloadend = function () {
      var token = JSON.parse(self.xmlHttp.responseText).jwt;
      if (
        (token != undefined || token.length != 0) &&
        self.xmlHttp.status == 200
      ) {
        AlertService.showSuccess();
      } else {
        AlertService.showError();
      }
      localStorage["jwt"] = token;
    };
    this.xmlHttp.send(JSON.stringify(logInUser));
  }
}

const userNameInp = document.querySelector("#userName");
const emailInp = document.querySelector("#email");
const passwordInp = document.querySelector("#password");
const confirmInp = document.querySelector("#confirm");
const registerUserBtn = document.querySelector("#registerUser");
const allRegitrationInps = document.querySelectorAll(".register-control");
const userRoleSelect = document.querySelector("#userRole");
const signInEmailInp = document.querySelector("#signInEmail");
const signInPassword = document.querySelector("#signInPassword");
const signInBtn = document.querySelector("#signIn");
var http = new HttpService();

function checkInputsValidation() {
  var inpsAreValid = true;
  allRegitrationInps.forEach((inpItem) => {
    if (inpItem.value == undefined || inpItem.value.length == 0) {
      inpItem.classList.add("error-border");
      inpsAreValid = false;
    } else {
      inpItem.classList.remove("error-border");
    }
  });

  if (passwordInp.value != confirmInp.value) {
    inpsAreValid = false;
  }

  return inpsAreValid;
}

function clearInpsValues() {
  allRegitrationInps.forEach((inp) => (inp.value = ""));
}

registerUserBtn.addEventListener("click", function () {
  if (checkInputsValidation()) {
    var user = new User(userNameInp.value, emailInp.value, passwordInp.value);
    if (userRoleSelect.value == "admin") {
      http.registerAdmin(user);
    } else {
      http.registerUser(user);
    }
    clearInpsValues();
  }
});

signInBtn.addEventListener("click", function () {
  var signInUser = {
    email: signInEmailInp.value,
    password: signInPassword.value,
  };
  http.logIn(signInUser);
  signInEmailInp.value = "";
  signInPassword.value = "";
});

// ------------------------------------------------------------------------
