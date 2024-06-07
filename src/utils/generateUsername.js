// Function to generate a unique random name
const generateUniqueRandomName = () => {
  const adjectives = ["happy", "silly", "crazy", "clever", "brave"];
  const nouns = ["elephant", "lion", "tiger", "giraffe"];

  const generatedNames = new Set();
  const maxAttempts = 1000;

  for (let i = 0; i < maxAttempts; i++) {
    const randomAdjectiveIndex = Math.floor(Math.random() * adjectives.length);
    const randomNounIndex = Math.floor(Math.random() * nouns.length);

    const adjective =
      Math.random() < 0.5
        ? adjectives[randomAdjectiveIndex]
        : adjectives[randomAdjectiveIndex].toUpperCase();
    const noun =
      Math.random() < 0.5
        ? nouns[randomNounIndex]
        : nouns[randomNounIndex].toUpperCase();

    let uniqueName = adjective + noun;

    const randomNumber = Math.floor(Math.random() * 10000);
    uniqueName += randomNumber;

    if (!generatedNames.has(uniqueName)) {
      generatedNames.add(uniqueName);
      return uniqueName;
    }
  }

  throw new Error("Failed to generate a unique name");
};

export default generateUniqueRandomName;
