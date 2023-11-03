import { Controller } from "./controller";
import tomatoLoading from "../public/static-images/tomato-loading.png";

class Display {
  constructor() {
    this.controller = new Controller();
    this.timer = null;
  }

  openGameHub() {
    const gameHub = document.getElementById("game-hub");
    const gameContent = document.getElementById("game-content");
    gameHub.classList.remove("inactive");
    gameContent.classList.remove("active");
  }

  closeGameHub() {
    const gameHub = document.getElementById("game-hub");
    const gameContent = document.getElementById("game-content");
    gameHub.classList.add("inactive");
    gameContent.classList.add("active");
  }

  openGameOverModal() {
    const gameOverModal = document.getElementById("game-over-modal");
    const overlay = document.getElementById("overlay");
    gameOverModal.classList.add("active");
    overlay.classList.add("active");
  }

  closeGameOverModal() {
    const gameOverModal = document.getElementById("game-over-modal");
    const gameOverHighScore = document.getElementById("game-over-high-score");
    const overlay = document.getElementById("overlay");
    gameOverModal.classList.remove("active");
    overlay.classList.remove("active");
    gameOverHighScore.classList.remove("active");
  }

  async submitScore() {
    try {
      const data = { score: this.controller.getScore() };
      await fetch("/highscores", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async checkHighScore() {
    const gameOverHighScore = document.getElementById("game-over-high-score");
    try {
      const response = await fetch("/highscores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await response.json();
      const currentScore = this.controller.getScore();
      jsonResponse.forEach((userScore) => {
        if (currentScore > userScore.score) {
          console.log("Is a high score");
          gameOverHighScore.classList.add("active");
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  startTimer() {
    const gameTimer = document.getElementById("game-timer");
    const scoreInterval = 5;

    try {
      let secondsRemaining = 5;
      let currentScore = this.controller.getScore();
      if (Math.floor(currentScore / scoreInterval) == 1) {
        secondsRemaining = 50;
      } else if (Math.floor(currentScore / scoreInterval) == 2) {
        secondsRemaining = 40;
      } else if (Math.floor(currentScore / scoreInterval) == 3) {
        secondsRemaining = 30;
      } else if (Math.floor(currentScore / scoreInterval) == 4) {
        secondsRemaining = 20;
      } else if (Math.floor(currentScore / scoreInterval) == 5) {
        secondsRemaining = 10;
      }
      gameTimer.textContent = secondsRemaining;

      this.timer = setInterval(() => {
        // console.log(secondsRemaining);
        if (secondsRemaining == 0) {
          this.openGameOverModal();
          this.checkHighScore();
          this.submitScore();
          clearInterval(this.timer);
          return;
        }
        secondsRemaining--;
        gameTimer.textContent = secondsRemaining;
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }

  async getNewQuestion() {
    const gameQuestion = document.getElementById("game-question");
    gameQuestion.src = tomatoLoading;
    try {
      await this.controller.getResource().then((data) => {
        gameQuestion.src = data.question;
      });
      clearInterval(this.timer);
      this.startTimer();
    } catch (e) {
      console.log(e);
    }
  }

  restartGame() {
    this.closeGameOverModal();
    this.controller.resetScore();
    this.startGame();
  }

  quitGame() {
    clearInterval(this.timer);
    this.controller.resetScore();
    this.closeGameOverModal();
    this.openGameHub();
  }

  startGame() {
    const gameHeader = document.getElementById("game-header");
    const gameScore = document.getElementById("game-score");
    const gameOverScore = document.getElementById("game-over-score");
    const gameOverHighScore = document.getElementById("game-over-high-score");

    this.getNewQuestion();
    this.closeGameHub();
    gameHeader.textContent = "Six Equations";
    gameScore.textContent = "0";
    gameOverScore.textContent = "0";
    gameOverHighScore.classList.remove("active");
  }

  updateScore(status) {
    const gameStatus = document.getElementById("game-status");

    if (status) {
      const gameScore = document.getElementById("game-score");
      const gameOverScore = document.getElementById("game-over-score");

      this.controller.incrementScore();
      const currentScore = this.controller.getScore();
      gameScore.textContent = currentScore;
      gameOverScore.textContent = currentScore;
      gameStatus.textContent = "Correct!";
      this.getNewQuestion();
      setTimeout(() => {
        gameStatus.textContent = "Select an Answer";
      }, 1500);
    } else {
      gameStatus.textContent = "Incorrect!";
    }
  }

  checkAnswer(answer) {
    if (answer == this.controller.getSolution()) {
      this.updateScore(true);
    } else {
      this.updateScore(false);
    }
  }

  initCommonListeners() {
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

  initGameListeners() {
    const btnPlay = document.getElementById("btn-play");
    const gameOptions = document.querySelectorAll(".game-option");
    const btnQuit = document.querySelectorAll(".btn-quit");
    const btnRestart = document.querySelectorAll(".btn-restart");

    btnPlay.addEventListener("click", () => {
      this.startGame();
    });

    gameOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        this.checkAnswer(e.target.textContent.trim());
      });
    });

    btnQuit.forEach((button) => {
      button.addEventListener("click", () => {
        this.quitGame();
      });
    });

    btnRestart.forEach((button) => {
      button.addEventListener("click", () => {
        this.restartGame();
      });
    });
  }
}

window.onload = () => {
  const display = new Display();
  display.initCommonListeners();
  if (location.href.split("/").slice(-1)[0] == "") {
    display.initGameListeners();
  }
};
