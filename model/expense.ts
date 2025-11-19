export class Expense {
  docId: string;
  type: string;
  amount: string;
  date: string;
  description: string;

  constructor({
    docId,
    type,
    amount,
    date,
    description,
  }: {
    docId: string;
    type: string;
    amount: string;
    date: string;
    description: string;
  }) {
    this.docId = docId;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.description = description;
  }
  // copy() {
  //   return new Expense({
  //     docId: this.docId,
  //     amount: this.amount,
  //     date: this.date,
  //     description: this.description,
  //     type: this.type,
  //   });
  // }
}
