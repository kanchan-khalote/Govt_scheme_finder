import Scheme from '../models/Scheme.js';
import User from '../models/userModel.js';
import { findMatchingSchemes } from '../services/eligibility.js';

const DISCLAIMER =
  'Ye jaankaari official sites ke snapshot par based hai. Apply karne se pehle official site par confirm karein.';

export const getSchemes = async (req, res, next) => {
  try {
    const schemes = await Scheme.find()
      .select('slug name category sourceUrl lastChecked')
      .lean();
    res.json({ count: schemes.length, schemes });
  } catch (err) {
    next(err);
  }
};

export const getSchemeBySlug = async (req, res, next) => {
  try {
    const scheme = await Scheme.findOne({ slug: req.params.slug }).lean();
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json({ scheme, disclaimer: DISCLAIMER });
  } catch (err) {
    next(err);
  }
};

export const getMatches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.profile || {};
    const schemes = await Scheme.find().lean();
    const results = findMatchingSchemes(profile, schemes);

    res.json({
      count: results.length,
      total: schemes.length,
      results: results.map((r) => ({
        slug: r.scheme.slug,
        name: r.scheme.name,
        category: r.scheme.category,
        sourceUrl: r.scheme.sourceUrl,
        lastChecked: r.scheme.lastChecked,
        status: r.status,
        unknown: r.unknown,
        note: r.note,
      })),
      disclaimer: DISCLAIMER,
    });
  } catch (err) {
    next(err);
  }
};