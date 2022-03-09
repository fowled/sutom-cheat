import TwitterAPI from "twitter-api-v2";
import cron from "node-cron";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const Client = new TwitterAPI({
	// @ts-ignore
	appKey: process.env.API_KEY,
	appSecret: process.env.API_SECRET,
	accessToken: process.env.ACCESS_TOKEN,
	accessSecret: process.env.ACCESS_SECRET,
});

Client.v2.me().then((data) => {
	console.log(data);
});

cron.schedule("0 0 * * *", async function () {
	const idPartie = process.env.ID_PARTIE;
	const datePartie = new Date();

	const wordOfTheDay: string = await (await fetch(`https://sutom.nocle.fr/mots/${Buffer.from(`${idPartie}-${datePartie.toISOString().split("T")[0]}`).toString("base64")}.txt`)).text();

	await Client.v2.tweet(`👋 Hey! Le mot du jour au SUTOM est disponible en réponse (attention, spoil) ⬇️ #SUTOM`).then((tweet) => {
		Client.v2.reply(`🔍 Le mot du jour est: ${wordOfTheDay}.`, tweet.data.id);
	});
});
