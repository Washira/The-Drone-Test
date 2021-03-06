import React, { Component } from "react";
import Robot from "./robot.js";
import "./App.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Toast from "react-bootstrap/Toast";

class Table extends React.Component {
  render() {
    let rows = [];
    for (var i = 1; i <= 5; i++) {
      rows.unshift(
        <Row
          key={i}
          number={i}
          robot={this.props.children}
          onPlace={this.props.onPlace}
        />
      );
    }
    return <div className="table">{rows}</div>;
  }
}

class Row extends React.Component {
  render() {
    let row = [];
    for (let i = 1; i <= 5; i++) {
      row.push(
        <Cell
          key={i}
          number={(this.props.number - 1) * 5 + i}
          robot={this.props.robot}
          onPlace={this.props.onPlace}
        />
      );
    }
    return <div className="row">{row}</div>;
  }
}

class Cell extends React.Component {
  render() {
    const {
      position: { x, y },
      heading,
    } = this.props.robot;
    let rowNumber = Math.ceil(this.props.number / 5) - 1;
    let colNumber = Math.ceil((this.props.number - 1) % 5);

    let className = "cell ";
    if (rowNumber % 2) {
      className += "odd";
      //  console.log(rowNumber);
    } else {
      className += "even";
      //  console.log('even');
    }
    if (rowNumber === y && colNumber === x) {
      className += " robot";
    }

    const arrowHeadingMap = { N: "↑", S: "↓", E: "→", W: "←" };

    return (
      <div
        className={className}
        onClick={() =>
          this.props.onPlace(`PLACE ${colNumber},${rowNumber},${heading}`)
        }
      >
        {className.includes("robot") && "✈️" + arrowHeadingMap[heading[0]]}
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.robot = new Robot();
    this.robot.processCommand("PLACE 0,0,NORTH");
    this.robot.processCommand("REPORT");

    this.state = {
      command: "",
      clicked: "",
    };
  }

  result = [];

  onchange = (e) => {
    this.setState({ command: e.target.value });
  };

  onsubmit = async (e) => {
    await e.preventDefault();
    await this.robot.processCommand(this.state.command);
    await this.forceUpdate();
    await console.log(this.state.command);
    await e.target.reset();
  };

  onclick = () => {
    this.result.push(this.state.command);
    console.log(this.result);
    this.setState({ clicked: this.state.command });
  };

  render() {
    return (
      <div className="App">
        <Alert variant="warning">
          Please commands in the following format: - PLACE X,Y,F - MOVE - LEFT -
          RIGHT PLACE will put the toy drone on the table in position X,Y and
          facing NORTH, SOUTH, EAST or WEST.
        </Alert>
        <div className="App-intro">
          <Form className="form-wrapper mt-5" onSubmit={this.onsubmit}>
            <Form.Group>
              <Form.Label>Command </Form.Label>
              <Form.Control
                autoCapitalize="characters"
                type="text"
                onChange={this.onchange}
              />
              <Button type="submit" onClick={this.onclick}>
                Enter
              </Button>
            </Form.Group>
          </Form>
        </div>
        <div>
          <Table
            key={this.robot.toString()}
            onPlace={(commandStr) => {
              this.robot.processCommand(commandStr);
              this.forceUpdate();
            }}
          >
            {this.robot}
          </Table>
        </div>
        <div>
          <Container fluid className="command">
            Current Position :{" "}
            {this.state.command === "REPORT" && this.state.clicked === "REPORT"
              ? this.robot.toString()
              : null}
          </Container>
        </div>
        <div>
          {this.result.map((val, index) => (
            <Toast>
              <Toast.Body key={index}>{val}</Toast.Body>
            </Toast>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
