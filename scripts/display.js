import { Controller } from "./controller";

async function startGame() {
  const gameTutorial = document.getElementById("game-tutorial");
  const gameContent = document.getElementById("game-content");
  const gameQuestion = document.getElementById("game-question");
  const gameController = new Controller();

  await gameController.getResource().then((data) => {
    gameQuestion.src = data.question;
  });

  gameTutorial.classList.add("inactive");
  gameContent.classList.add("active");
}

function initCommonListeners() {
  const btnHamburger = document.getElementById("btn-hamburger");
  const responsiveMenu = document.getElementById("responsive-menu");
  const desktopStateQuery = window.matchMedia("(min-width: 700px)");
  const submitLinks = document.querySelectorAll(".submit-link");

  btnHamburger.addEventListener("click", () => {
    if (responsiveMenu.classList.contains("active")) {
      responsiveMenu.classList.remove("active");
    } else {
      responsiveMenu.classList.add("active");
    }
  });

  desktopStateQuery.addEventListener("change", () => {
    responsiveMenu.classList.remove("active");
  });

  submitLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.target.parentNode.submit();
    });
  });
}

function initGameListeners() {
  const btnPlay = document.getElementById("btn-play");

  btnPlay.addEventListener("click", () => {
    startGame();
  });
}

window.onload = () => {
  initCommonListeners();
  if (location.href.split("/").slice(-1)[0] == "") {
    initGameListeners();
  }
};
