const calculateNextDueDate = (startDate, frequency) => {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
        throw new Error('Invalid startDate');
    }

    let nextDueDate = new Date(start);


    switch (frequency) {
        case 'daily':
            nextDueDate.setDate(nextDueDate.getDate() + 1);
            break;
        case 'weekly':
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
        case 'monthly':
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
        case 'annually':
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
        default:
            throw new Error(`Unknown frequency: ${frequency}`);
    }

    return nextDueDate;
};

module.exports = { calculateNextDueDate };