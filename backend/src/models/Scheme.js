import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
    {
        slug:{ type: String, required: true, unique: true },
        name:{ type: String, required: true },
        category: String,
        sourceUrl: String,
        lastChecked: String,
        eligibility: { type: mongoose.Schema.Types.Mixed },
        sections: [{ title: String, text: String }],
    },
    { timestamps: true }
);

export default mongoose.model('Scheme', schemeSchema);