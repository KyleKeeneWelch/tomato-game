import { getResource } from "./tomato-api";

export class Controller {
  constructor() {
    // this.gameOver = false;
    this.question = null;
    this.solution = null;
    this.score = 0;
  }

  async getResource() {
    try {
      const response = await getResource();
      this.question = response.question;
      this.solution = response.solution;
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  // setGameOver() {
  //   this.gameOver = true;
  // }

  // isGameOver() {
  //   return this.gameOver;
  // }

  incrementScore() {
    this.score++;
  }

  getScore() {
    return this.score;
  }

  resetScore() {
    this.score = 0;
  }

  // playRound() {
  //   const resource = this.getResource();
  //   // const resource = { question: "question", solution: "solution" };
  //   this.question = resource.question;
  //   this.solution = resource.solution;
  // }

  getQuestion() {
    return this.question;
  }

  getSolution() {
    return this.solution;
  }
}
