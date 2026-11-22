import { answerQuestion } from "../rag/answer.js";

export const askQuestion = async (req, res, next) =>{
    try {
        const question = (req.body.question || '').trim();

        if(!question) {
            return res.status(400).json({message: 'Question is required'});
        }
        if (question.length > 500) {
            return res.status(400).json({message: 'Question is too long (max 500 characters'});
        }
        const result  = await answerQuestion(question);

        res.json({
            ...result,
            disclaimer: 'Ye jaankaari official sites ke snapshot par based hai.Apply karne se pehle official site par confirm karein. ',
        });

    } catch (error) {
        next(error);
    }
};