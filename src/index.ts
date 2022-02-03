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
    accessSecret: process.env.ACCESS_SECRET
});

Client.v2.me().then(data => {
    console.log(data);
});

cron.schedule("0 0 * * *", async function () {
    const creationDate: Date = new Date("01/07/2022");
    const todaysDate: Date = new Date();

    const differenceInTime: number = todaysDate.getTime() - creationDate.getTime();
    const differenceInDays: number = differenceInTime / (1000 * 3600 * 24);

    const wordOfTheDay: string = await (await fetch(`https://sutom.nocle.fr/mots/${Math.trunc(differenceInDays)}.txt`)).text();
    const wordOfTomorrow: string = await (await fetch(`https://sutom.nocle.fr/mots/${Math.trunc(differenceInDays + 1)}.txt`)).text();
    
    Client.v2.tweet(`🔍 Le mot du jour est: ${wordOfTheDay}.\n⚡ Le mot de demain sera ${wordOfTomorrow}. #SUTOM`);
});
