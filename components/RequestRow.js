import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

class RequestRow extends Component {
  onApprove = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0],
    });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  redirectToEdit = () => {
    Router.pushRoute(
      `/campaigns/${this.props.address}/requests/${this.props.id}`
    );
  };
  render() {
    const { Row, Cell } = Table;
    const { id, request, numApprovers } = this.props;

    // 投票選項 open條件 : 購案尚未完成 且 購案有修改過
    const approveFlag = !request.complete && request.isModify;

    // 同意票是否過半
    const approvalFlag = request.approvalCount > numApprovers / 2;

    // 結案條件 open條件 : 購案尚未完成下，購案無修改 或 同意票過半
    const finalizeFlag =
      (!request.isModify && !request.complete) ||
      (approvalFlag && !request.complete);

    console.log("approvalFlag\t=\t" + approvalFlag);
    return (
      <Row
        disabled={request.complete}
        positive={!request.complete && finalizeFlag}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          <Button icon="pencil alternate" basic onClick={this.redirectToEdit} />
        </Cell>
        <Cell>{request.isModify.toString()}</Cell>
        <Cell>
          {request.isModify
            ? `${request.approvalCount} / ${numApprovers}`
            : null}
        </Cell>

        <Cell>
          {approveFlag ? (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          ) : null}
        </Cell>

        <Cell>
          {finalizeFlag ? (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          ) : null}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
