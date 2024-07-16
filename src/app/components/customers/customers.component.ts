import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/shared/interfaces/customer';
import { Transaction } from 'src/shared/interfaces/transaction';
import { CustomerService } from 'src/shared/services/customer.service';
import { TransactionService } from 'src/shared/services/transaction.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customersWithTransactions: any[] = [];
  filteredCustomersWithTransactions: any[] = [];
  customerNameFilter: string = '';
  transactionAmountFilter: number | null = null;
  selectedCustomerTransactions: Transaction[] = [];
  showGraph: boolean = false;
  barChartData: any[] = [];

  constructor(
    private customerService: CustomerService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((response: any) => {
      const customers: Customer[] = response.data.customers;
      this.transactionService.getTransactions().subscribe((response: any) => {
        const transactions: Transaction[] = response.data.transactions;

        this.customersWithTransactions = customers.map((customer: Customer) => ({
          customer,
          transactions: transactions.filter(transaction => transaction.customer_id === customer.id),
        }));

        this.filteredCustomersWithTransactions = [...this.customersWithTransactions];
      });
    });
  }

  filterCustomers(): void {
    this.filteredCustomersWithTransactions = this.customersWithTransactions.filter(cwt => {
      const matchesCustomerName = cwt.customer.name.toLowerCase().includes(this.customerNameFilter.toLowerCase());
      const matchesTransactionAmount = this.transactionAmountFilter === null ||
        cwt.transactions.some((transaction: Transaction) => this.transactionAmountFilter !== null && transaction.amount >= this.transactionAmountFilter);

      return matchesCustomerName && matchesTransactionAmount;
    });
  }

  getCustomerTotalAmount(transactions: Transaction[]): number {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  onShowGraph(transactions: Transaction[]): void {
    const dailyTotals = transactions.reduce((acc, transaction) => {
      const date = transaction.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {} as { [key: string]: number });

    this.barChartData = Object.keys(dailyTotals).map(date => ({
      name: date,
      value: dailyTotals[date]
    }));

    this.showGraph = true;
  }
}
