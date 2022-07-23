import React, { Component } from "react";
import { Form, Button, Message, Input, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";
import web3 from "../../../ethereum/web3";

class Edit extends Component {
  static async getInitialProps(props) {
    const id = props.query.id;
    const address = props.query.address;
    const campaign = new Campaign(address);
    const request = await campaign.methods.getRequests(id).call();
    return { id, request, campaign, address };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const campaign = this.props.campaign;
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      const { id, description, value, recipient } = this.state;
      await campaign.methods
        .modifyRequest(
          id,
          description,
          web3.utils.toWei(value, "ether"),
          recipient
        )
        .send({ from: accounts[0] });
      Router.pushRoute(`/campaigns/${this.props.address}/requests/`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false });
  };

  state = {
    id: this.props.id,
    description: this.props.request[0],
    value: web3.utils.fromWei(this.props.request[1], "ether"),
    recipient: this.props.request[2],
    loading: false,
    errorMessage: "",
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>
            <Button>Back</Button>
          </a>
        </Link>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <lable>No.</lable>
            <Input
              value={this.state.id}
              onChange={(event) => this.setState({ id: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <lable>Descrition</lable>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <lable>Value in ether</lable>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <lable>Recipient</lable>
            <Input
              value={this.state.recipient}
              onChange={(event) =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Submit
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default Edit;
