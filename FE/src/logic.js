import { faker } from "@faker-js/faker";

export function generateRandomSentence(wordCount = 10) {
  let sentence = "";

  for (let i = 0; i < wordCount; i++) {
    const randomWord = faker.word.noun();
    sentence += randomWord + " ";
  }

  return sentence.trim();
}
