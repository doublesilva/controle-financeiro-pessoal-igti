
const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

export default class HttpTransactionHelper{
    
    static async creatTransaction(transaction){
        fetch(`/api/transaction`, {
            method: "POST",
            headers,
            body: JSON.stringify(transaction),
          }).then(async (response) => {
            const result = await response.json();
            return result;
          });
    }

    static async updateTransaction (transaction){        
      fetch(`/api/transaction/${transaction.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(transaction),
      }).then(async (response) => {
        const result = await response.json();
        return result;
      });
    }

    static async getTransactions(yearMonth){
        
        return fetch(`/api/transaction/${yearMonth}`).then(async (response) => {
            const result = await response.json();
            return result;
          });      
    }

    static async deleteTransaction(id){
        fetch(`/api/transaction/${id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          }).then(async (response) => {
            const result = await response.json();
            return result;
          });
    }
}