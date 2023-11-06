import { getResource } from "./tomato-api";

export class Controller {
  constructor() {
    this.question = null;
    this.solution = null;
    this.score = 0;
  }

  // Gets resource from tomato api and assigns question and solution to variables.
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

  incrementScore() {
    this.score++;
  }

  getScore() {
    return this.score;
  }

  resetScore() {
    this.score = 0;
  }

  getQuestion() {
    return this.question;
  }

  getSolution() {
    return this.solution;
  }
}
