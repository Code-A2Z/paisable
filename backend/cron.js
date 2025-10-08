const cron = require('node-cron');
const RecurringTransactions = require('./models/RecurringTransactions');
const IncomeExpense = require('./models/IncomeExpense');
const { calculateNextDueDate } = require('./utils');

cron.schedule('0 0 * * *', async () => {
    console.log('=== Running Recurring Transactions Cron ===');

    try {
        const now = new Date();

        const dueRecurringTransactions = await RecurringTransactions.find({
            nextDueDate: { $lte: now },
        });

        console.log(`Found ${dueRecurringTransactions.length} recurring transactions due`);

        for (const item of dueRecurringTransactions) {
            try {
                const transaction = await IncomeExpense.create({
                    user: item.user,
                    name: item.name,
                    category: item.category,
                    cost: item.amount,
                    isIncome: item.isIncome,
                    date: item.nextDueDate,
                });

                console.log(`Created transaction: ${transaction.name}, amount: ${transaction.amount}`);

                item.nextDueDate = calculateNextDueDate(item.startDate, item.frequency, item.nextDueDate);
                await item.save();

                console.log(`Updated nextDueDate for ${item.name} to ${item.nextDueDate}`);
            } catch (err) {
                console.error(`Failed to create transaction for ${item.name}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Cron job failed:', err.message);
    }
});