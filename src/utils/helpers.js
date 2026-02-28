export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const calculateBalance = (transactions) => {
  return transactions.reduce((balance, txn) => {
    return txn.type === 'CREDIT'
      ? balance + txn.amount
      : balance - txn.amount;
  }, 0);
};