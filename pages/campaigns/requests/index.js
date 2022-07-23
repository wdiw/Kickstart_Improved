import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    var address = "";
    if (props.query === undefined) {
      address = this.props.address;
    } else {
      address = props.query.address;
    }
    console.log("debug\t\t" + address);
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.numRequests().call();
    const numApprovers = await campaign.methods.numApprovers().call();
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );
    // Here I Need to Check React New Tech
    return { address, requests, requestCount, numApprovers };
  }

  //Helper Methods?
  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          numApprovers={this.props.numApprovers}
        />
      );
    });
  }

  render() {
    // Here I Need to Check JS New Tech
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Request List</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add request
            </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell></HeaderCell>
              <HeaderCell>isModified</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Table.Body>{this.renderRows()}</Table.Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
