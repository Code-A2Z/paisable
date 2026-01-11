const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
    try {
        const { type, message } = req.body;

        if (!type || !message) {
            return res.status(400).json({ message: 'Type and message are required' });
        }

        const feedback = new Feedback({
            user: req.user._id,
            type,
            message,
        });

        const savedFeedback = await feedback.save();

        res.status(201).json(savedFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createFeedback,
};
