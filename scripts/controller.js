import { getResource } from "./tomato-api";

export class Controller {
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
