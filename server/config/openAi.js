import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    const completion = await openai.createCompletion("text-davinci-002", {
        prompt: req.body.message
    });
    console.log(completion.data);
    res.status(200).json({ result: completion.data.choices[0].text });
}
