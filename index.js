import { process } from "/env";
import { Configuration, OpenAIApi } from "openai";

const setupInputContainer = document.getElementById("setup-input-container");
const gojoBossText = document.getElementById("gojo-boss-text");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

delete configuration.baseOptions.headers["User-Agent"];
// this resolves ERROR : Set Unsafe Header “User Agent”

const openai = new OpenAIApi(configuration);

document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById("setup-textarea");
  if (setupTextarea.value) {
    const userInput = setupTextarea.value;
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`;
    gojoBossText.innerText = `Ok, just wait a second while my digital brain digests that...`;
    fetchBotReply(userInput);
    fetchSynopsis(userInput);
  }
});

async function fetchBotReply(outline) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline:A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline: ${outline}
    message: 
    `,
    max_tokens: 60,
  });
  gojoBossText.innerText = response.data.choices[0].text.trim();
}

async function fetchSynopsis(outline) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate an engaging, professional and marketable anime synopsis based on an outline. The synopsis should include voice actors names in brackets after each character. Choose actors that would be ideal for this role. 
    ###
    outline: A young ninja dreams of becoming the head of his village 
    and the most powerful ninja of all the neighbouring clan.
    synopsis: In a world where danger lurks around every corner, 
    a young ninja named Hiro(Daisuke Namikawa) envisions a future where he becomes 
    the revered leader of his village. Determined to prove his worth, 
    he embarks on a perilous journey to become the strongest ninja in 
    all the neighboring clans.With each passing mission, Hiro faces 
    unimaginable trials and encounters formidable adversaries who 
    test his skills and resolve. Along the way, he forms an 
    unbreakable bond with his eccentric mentor, Master Koji 
    (Junichi Suwabe), a wise and enigmatic figure 
    who has seen the ravages of war firsthand.However, Hiro's path 
    takes an unexpected turn when he discovers a hidden conspiracy 
    that threatens both his village and the very fabric of their ninja 
    society. Together with his loyal and courageous friends, Yuki (Aoi Yuuki), 
    a fierce warrior with a mysterious past, and Kenta (Yuki Kaji), 
    a mischievous trickster, Hiro must navigate a dark and treacherous world 
    filled with betrayals and deceit.As their journey unfolds, Hiro will have 
    to confront his own limitations and face the ultimate choice to either 
    sacrifice everything he has worked for or risk losing everything he 
    holds dear.
    ###
    outline: ${outline}
    synopsis: 
    `,
    max_tokens: 700,
  });
  const synopsis = response.data.choices[0].text.trim();
  document.getElementById("output-text").innerText = synopsis;
  setTimeout(() => {
    fetchTitle(synopsis);
  }, 60000);
  fetchStars(synopsis);
}

async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate a catchy anime title for this synopsis: ${synopsis}`,
    max_tokens: 25,
    temperature: 0.7,
  });
  const title = response.data.choices[0].text.trim();
  document.getElementById("output-title").innerText = title;
  fetchImagePromt(title, synopsis);
}

async function fetchStars(synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Extract the names in brackets from the synopsis.
    ###
    synopsis: In a world where danger lurks around every corner, 
    a young ninja named Hiro(Daisuke Namikawa) envisions a future where he becomes 
    the revered leader of his village. Determined to prove his worth, 
    he embarks on a perilous journey to become the strongest ninja in 
    all the neighboring clans.With each passing mission, Hiro faces 
    unimaginable trials and encounters formidable adversaries who 
    test his skills and resolve. Along the way, he forms an 
    unbreakable bond with his eccentric mentor, Master Koji 
    (Junichi Suwabe), a wise and enigmatic figure 
    who has seen the ravages of war firsthand.However, Hiro's path 
    takes an unexpected turn when he discovers a hidden conspiracy 
    that threatens both his village and the very fabric of their ninja 
    society. Together with his loyal and courageous friends, Yuki (Aoi Yuuki), 
    a fierce warrior with a mysterious past, and Kenta (Yuki Kaji), 
    a mischievous trickster, Hiro must navigate a dark and treacherous world 
    filled with betrayals and deceit.As their journey unfolds, Hiro will have 
    to confront his own limitations and face the ultimate choice to either 
    sacrifice everything he has worked for or risk losing everything he 
    holds dear.
    names: Daisuke Namikawa, Junichi Suwabe, Aoi Yuuki, Yuki Kaji
    ###
    synopsis: ${synopsis}
    names:   
    `,
    max_tokens: 30,
  });
  document.getElementById("output-stars").innerText =
    response.data.choices[0].text.trim();
}

async function fetchImagePromt(title, synopsis) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Give a short description of an image which could be used to advertise a anime based on a title and synopsis. The description should be rich in visual detail but contain no names.
    ###
    title: Shadows of Destiny: The Unbreakable Path
    synopsis: In a world brimming with rival clans and mystical powers, Kazuki(Yūki Kaji), a determined young ninja, embarks on an extraordinary journey. Driven by an unwavering dream to lead his village and become the mightiest ninja, Kazuki faces numerous trials and encounters powerful adversaries. Along the way, he befriends an enigmatic swordsman, Haruki (Hiroshi Kamiya), and a spirited sorceress, Sakura (Aoi Yuuki). As they delve deeper into their intertwined destinies, secrets unravel, hidden alliances emerge, and Kazuki must confront the shadows of his past to forge his own destiny.
    image description: Against a moonlit backdrop, Kazuki stands tall, his silhouette fierce and determined. Vibrant sorcery and masterful swordplay surround him, hinting at the thrilling adventures in "Shadows of Destiny: The Unbreakable Path."
    ###
    title: Ocean's Legacy: Quest for the Lost Treasure
    synopsis:In a world overflowing with legends of sunken riches and uncharted realms, young and spirited Hiro (Yoshitsugu Matsuoka) embarks on an awe-inspiring sea adventure. Haunted by tales of a long-lost treasure, Hiro sets sail on his trusty ship, The Seahawk, in search of unfathomable wealth. Along his perilous journey, he befriends the charismatic and enigmatic Captain Luka(Hiroshi Kamiya), the cunning and resourceful Nina(Kana Hanazawa ), the fearless navigator Barrett(Tomokazu Sugita ), and the magical and mysterious Mira(Aoi Yuuki). Together, this unconventional crew faces treacherous waters, encounters legendary sea creatures, and battles against rival treasure hunters. As the secrets of the sea unfold before them, Hiro discovers that the true treasure lies not in gold or jewels, but in the bonds of friendship, the strength of the human spirit, and the untamed beauty of the vast ocean itself. As they sail deeper into uncharted waters, mysteries unravel, legends come to life, and the heart-stopping race to claim the Ocean's Legacy becomes a breathtaking adventure beyond their wildest dreams.
    image description: In the captivating poster image, Hiro, our young protagonist, stands at the helm of The Seahawk, his eyes shining with determination as waves crash behind him. The vast expanse of the mysterious ocean stretches out, promising thrilling adventures in "Ocean's Legacy: Quest for the Lost Treasure."
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description: 
    `,
    temperature: 0.8,
    max_tokens: 100,
  });
  fetchImageUrl(response.data.choices[0].text.trim());
}

async function fetchImageUrl(imagePrompt) {
  const response = await openai.createImage({
    prompt: `${imagePrompt}. There should be no text in this image.`,
    n: 1,
    size: "256x256",
    response_format: "b64_json",
  });
  document.getElementById(
    "output-img-container"
  ).innerHTML = `<img src="data:image/png;base64,${response.data.data[0].b64_json}">`;
  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Pitch</button>`;
  document.getElementById("view-pitch-btn").addEventListener("click", () => {
    document.getElementById("setup-container").style.display = "none";
    document.getElementById("output-container").style.display = "flex";
    gojoBossText.innerText = `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`;
  });
}
