import { Controller } from "./controller";
import tomatoLoading from "../public/static-images/tomato-loading.png";

class Display {
  // Initializes controller and timer.
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

  // Uses fetch to submit score to highscore route with formatted JSON.
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

  // Uses fetch to receive top ten highscores and compares to current score.
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
        if (currentScore >= userScore.score) {
          gameOverHighScore.classList.add("active");
          return;
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
      let secondsRemaining = 60;
      let currentScore = this.controller.getScore();

      // Increases difficulty every five score points earned up to 25.
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

  // Sets game question to loading state while obtaining new question then sets to question and starts timer.
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

  // Assigns game status for current question to display correct or incorrect depending on status passed.
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

  // Initializes listeners common across all pages.
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

    // Removes responsive menu upon reaching a desktop state.
    desktopStateQuery.addEventListener("change", () => {
      responsiveMenu.classList.remove("active");
    });

    // Assists submitting the logout process.
    submitLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.target.parentNode.submit();
      });
    });
  }

  // Initializes listeners specific to the game.
  initGameListeners() {
    const btnPlay = document.getElementById("btn-play");
    const gameOptions = document.querySelectorAll(".game-option");
    const btnQuit = document.querySelectorAll(".btn-quit");
    const btnRestart = document.querySelectorAll(".btn-restart");

    btnPlay.addEventListener("click", () => {
      this.startGame();
    });

    // Passes button text content without whitespace to function.
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

// On window load, initialize new display, common listeners and game listeners if index.
window.onload = () => {
  const display = new Display();
  display.initCommonListeners();
  if (location.href.split("/").slice(-1)[0] == "") {
    display.initGameListeners();
  }
};
