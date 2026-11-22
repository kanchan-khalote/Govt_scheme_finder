import 'dotenv/config';
import mongoose from 'mongoose';
import { answerQuestion } from '../src/rag/answer.js';

const questions = [
    'Ladli Behna yojana ke liye kaun se documents chahiye?',
    'Ladli Behna mein mahine ke kitne rupaye milte hain?',
    'Ladli Behna ka helpline number kya hai?',
    'Cricket world cup kisne jeeta?',
];

try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const q of questions) {
        console.log ('\nSawal:', q);
        const r = await answerQuestion(q);
        console.log('Found:', r.found);
        console.log('Answer:', r.answer);
        if(r.officialLink) console.log('Official Link:', r.officialLink);
        r.sources.forEach((s) =>
        console.log(`[${s.id}] ${s.schemeName} - ${s.sectionTitle} (checked ${s.lastChecked}) `)
        );
    }
} catch (error) {
    console.error('Error:', error.message);
} finally{
    await mongoose.disconnect();
}