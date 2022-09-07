class HtmlRenderer {
  getContractCardHtml(contractItem) {
    return `<div class="card" style="width: 18rem;">
              
                    <div class="card-body">
                        <h5 class="card-title">${contractItem.vinCode}</h5>
                        <p class="card-text"><b>Price : </b> ${
                          contractItem.price
                        }</p>
                        <p class="card-text"><b>AmountPaid : </b> ${
                          contractItem.amountPaid
                        }</p>
                        <p class="card-text"><b>AmountToBePaid : </b> ${
                          contractItem.amountToBePaid
                        }</p>
                        <p class="card-text"><b>Purchase : </b> ${
                          contractItem.purchase
                        }</p>
                          <p class="card-text"><b>Container : </b> ${
                            contractItem.container
                          }</p>
                          <p class="card-text"><b>Car Manufacture : </b> ${
                            contractItem.carManufacture
                          }</p>
                          <p class="card-text"><b>Car Model : </b> ${
                            contractItem.carModel
                          }</p>
                          <p class="card-text"><b>Year : </b> ${
                            contractItem.year
                          }</p>
                        <hr>
                        <button type='button' onclick='updatecontractItem(${JSON.stringify(
                          contractItem
                        )})' class='btn btn-warning col-md-12 d-block'>Update</button> 
                        <br>
                        <button onclick="removecontractItem(${
                          contractItem.id
                        })" id='removeContact' class='btn btn-danger col-md-12 d-block'>Remove</button>
                    </div>
                </div>`;
  }

  renderNewCard(contractItem) {
    contractcardsArea.innerHTML += this.getContractCardHtml(contractItem);
  }

  renderCards(contracts) {
    contractcardsArea.innerHTML = "";
    contracts.forEach((contractItem) => {
      this.renderNewCard(contractItem);
    });
  }
}

class Contract {
  constructor(
    userId,
    vinCode,
    price,
    amountPaid,
    amountToBePaid,
    purchase,
    container,
    carManufacture,
    carModel,
    year
  ) {
    this.userId = userId;
    this.vinCode = vinCode;
    this.price = price;
    this.amountPaid = amountPaid;
    this.amountToBePaid = amountToBePaid;
    this.purchase = purchase;
    this.container = container;
    this.carManufacture = carManufacture;
    this.carModel = carModel;
    this.year = year;
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

class HttpServiceforContact {
  xmlHttp = new XMLHttpRequest();

  constructor() {
    this.getcontracts();
  }

  getcontracts() {
    fetch("https://testingservice.azurewebsites.net/api/Contract")
      .then((response) => response.json())
      .then((response) => {
        htmlRendererService.renderCards(response);
      });
    // var self = this;
    // this.xmlHttp.open(
    //   "GET",
    //   "https://testingservice.azurewebsites.net/api/Contract"
    // );
    // this.xmlHttp.onloadstart = function () {
    //   console.log("started .....");
    // };
    // this.xmlHttp.onload = function () {
    //   console.log("loading....");
    //   console.log(self.xmlHttp.status);
    // };
    // this.xmlHttp.onloadend = function () {
    //   const text = self.xmlHttp.responseText;

    //   var contracts = JSON.parse(text);
    //   console.log(contracts);
    //   htmlRendererService.renderCards(contracts);
    // };
    // this.xmlHttp.send();
  }

  addContract(contract) {
    fetch("https://testingservice.azurewebsites.net/api/Contract", {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        authorization: `bearer ${localStorage["jwt"]}`,
      }),

      body: JSON.stringify(contract),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getcontracts();
      });
    //   .catchError((response) => {
    //     console.log(response);
    //   });
    // var self = this;
    // this.xmlHttp.open(
    //   "POST",
    //   `https://testingservice.azurewebsites.net/api/Contract`
    // );
    // this.xmlHttp.setRequestHeader("content-type", "application/json");
    // this.xmlHttp.setRequestHeader(
    //   "authorization",
    //   `bearer ${localStorage["jwt"]}`
    // );
    // this.xmlHttp.onloadend = function () {
    //   console.log(JSON.parse(self.xmlHttp.responseText));
    //   console.log(self.xmlHttp.status);
    //   if (self.xmlHttp.status == 200) {
    //     AlertService.showSuccess();
    //   } else {
    //     AlertService.showError();
    //   }
    //   console.log(self.xmlHttp.status);
    // };
    // this.xmlHttp.send(JSON.stringify(contract));
  }

  updateContract(contract) {
    fetch("https://testingservice.azurewebsites.net/api/Contract", {
      method: "PUT",
      body: JSON.stringify(contract),
      headers: new Headers({
        "content-type": "application/json",
        authorization: `bearer ${localStorage["jwt"]}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getcontracts();
      });
  }
  deleteContract(id) {
    fetch(`https://testingservice.azurewebsites.net/api/Contract/${id}`, {
      method: "DELETE",
      headers: new Headers({
        "content-type": "application/json",
        authorization: `bearer ${localStorage["jwt"]}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.getcontracts();
      });
    // var self = this;
    // this.xmlHttp.open(
    //   "Delete",
    //   `https://testingservice.azurewebsites.net/api/Contract/${id}`
    // );
    // this.xmlHttp.onloadend = function () {
    //   console.log(self.xmlHttp.responseText);
    //   if (self.xmlHttp.responseText) {
    //     self.ReadAll();
    //   }
    // };
    // this.xmlHttp.send();
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const vinCode = document.querySelector("#vinCode");
const price = document.querySelector("#price");
const amountPaid = document.querySelector("#amountPaid");
const amountToBePaid = document.querySelector("#amountToBePaid");
const purchase = document.querySelector("#purchase");
const container = document.querySelector("#container");
const carManufacture = document.querySelector("#carManufacture");
const carModel = document.querySelector("#carModel");
const year = document.querySelector("#year");
const allRegitrationInps = document.querySelectorAll(".register-control");
const contractRegBtn = document.querySelector("#contactReg");

const contractId = document.querySelector("#contractId");
const updateVinCode = document.querySelector("#updateVinCode");
const updatePrice = document.querySelector("#updatePrice");
const updatePayId = document.querySelector("#updatePayId");
const updateAmountToBePaid = document.querySelector("#updateAmountToBePaid");
const updatePurchase = document.querySelector("#updatePurchase");
const updateContainer = document.querySelector("#updateContainer");
const updateCarManufacture = document.querySelector("#updateCarManufacture");
const updateCarModel = document.querySelector("#updateCarModel");
const updateYear = document.querySelector("#updateYear");
const updateAllInputs = document.querySelector(".update-contract-info");
const modalOpenBtn = document.querySelector("#modalOpen");

const contractcardsArea = document.querySelector(".contract-cards-area");
const htmlRendererService = new HtmlRenderer();
var httpContract = new HttpServiceforContact();
const userId = parseJwt(localStorage.getItem("jwt")).nameid;

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

  return inpsAreValid;
}

contractRegBtn.addEventListener("click", function () {
  if (checkInputsValidation()) {
    var contract = new Contract(
      userId,
      vinCode.value,
      price.value,
      amountPaid.value,
      amountToBePaid.value,
      purchase.value,
      container.value,
      carManufacture.value,
      carModel.value,
      year.value
    );
    httpContract.addContract(contract);

    clearInpsValues();
  }
});

function removecontractItem(Id) {
  this.httpContract.deleteContract(Id);
}

function updatecontractItem(contract) {
  contractId.value = contract.id;
  updateVinCode.value = contract.vinCode;
  updatePrice.value = contract.price;
  updatePayId.value = contract.amountPaid;
  updateAmountToBePaid.value = contract.amountToBePaid;
  updatePurchase.value = contract.purchase;
  updateContainer.value = contract.container;
  updateCarManufacture.value = contract.carManufacture;
  updateCarModel.value = contract.carModel;
  updateYear.value = contract.year;

  modalOpenBtn.click();
}

function updateContactInfo() {
  var contract = new Contract(
    parseInt(userId),
    updateVinCode.value,
    parseInt(updatePrice.value),
    parseInt(updatePayId.value),
    parseInt(updateAmountToBePaid.value),
    updatePurchase.value,
    updateContainer.value,
    updateCarManufacture.value,
    updateCarModel.value,
    updateYear.value
  );

  contract.id = parseInt(contractId.value);
  httpContract.updateContract(contract);
}
