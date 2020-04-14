import React from 'react';
import data from "./data";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: data.CustomerInfo
    };
    this.state.customerInfo.forEach(customer => {
      customer.totalPoints = 0;
      customer.januaryPoints = 0;
      customer.februaryPoints = 0;
      customer.marchPoints = 0;
    })
    this.showTable = false;
  }

  //== JDW: main call from customer list to calculate month and grand total rewards
  setCustomerRewardPoints(customer) {
    //-- numbers to accrue values
    let tp = 0;
    let janP = 0;
    let febP = 0;
    let marP = 0;

    //-- loop model for customer's purchases
    customer.purchases.forEach(t => {
      tp = tp + this.getPoints(t); 
      janP = this.setMonthlyPoints(customer.purchases, "2020-01-01", "2020-01-31");
      febP = this.setMonthlyPoints(customer.purchases, "2020-02-01", "2020-02-29");
      marP = this.setMonthlyPoints(customer.purchases, "2020-03-01", "2020-03-31");
    })

    //-- set model properties
    customer.totalPoints = tp;
    customer.januaryPoints = janP;
    customer.februaryPoints = febP;
    customer.marchPoints = marP;
  }

  //== JDW: recieves list of purchases and date range to calc
  setMonthlyPoints(purchases, start, end) {
    let sDate = new Date(start), eDate = new Date(end);
    let points = 0;
    purchases.forEach(p => {
      var pd = new Date(p.purchaseDate);
      if (pd >= sDate && pd <= eDate) {
        points = points + this.getPoints(p);
      }
    })

    return points;
  }

  //== JDW: set financial algorithm 
  getPoints(purchase) {
    let points = 0, overFifty = 0, overHundred = 0, total = purchase.total;
    if (total > 50)
      overFifty = total - 50;

    if (total > 100)
      overHundred = (total - 100) * 2;

    points = overHundred + overFifty;
    return points;
  }


  render() {
    return (
      <div class="container">
        <div class="row pt-4 pb-4">
        <h2 class="h2-responsive text-muted text-indigo">First Quarter Reward Points</h2>
      </div>
      <div class="row">
        <table class="table table-condensed table-striped table-hover table-sm" size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>January Reward Points</th>
              <th>February Reward Points</th>
              <th>March Reward Points</th>
              <th class="bg-info">First Quarter Total Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.customerInfo.map((info, i) => {
                this.setCustomerRewardPoints(info)
                return (
                  <tr key={i}>
                    <td>{info.id}</td>
                    <td>{info.name}</td>
                    <td>{info.januaryPoints}</td>
                    <td>{info.februaryPoints}</td>
                    <td>{info.marchPoints}</td>
                    <td class="bg-info border-0">{info.totalPoints} </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}

export default App;
