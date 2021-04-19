const headings = ["NORTH", "EAST", "SOUTH", "WEST"];

class NullCommand {
  execute() {
    // noop
  }
}

class PlaceCommand {
  constructor(robot, argsStr) {
    const [x, y, heading] = argsStr.split(",");

    this._robot = robot;
    this._position = { x: parseInt(x, 10), y: parseInt(y, 10) };
    this._heading = heading;
  }

  _isValidPosition() {
    return (
      this._position.x >= 0 &&
      this._position.x < 5 &&
      this._position.y >= 0 &&
      this._position.y < 5
    );
  }

  _isValidHeading() {
    return headings.includes(this._heading);
  }

  execute() {
    if (this._isValidPosition() && this._isValidHeading()) {
      this._robot.isOnTable = true;
      this._robot.position = this._position;
      this._robot.heading = this._heading;
    }
  }
}

class RotateCommand {
  constructor(robot, direction) {
    this._robot = robot;
    this._direction = direction;
  }

  execute() {
    if (this._robot.isOnTable) {
      let idx = headings.indexOf(this._robot.heading);

      idx = this._direction === "LEFT" ? idx - 1 : idx + 1;
      if (idx < 0) idx = 3;
      if (idx > 3) idx = 0;

      this._robot.heading = headings[idx];
    }
  }
}

class MoveCommand {
  constructor(robot) {
    this._robot = robot;
  }

  _isValidPosition(position) {
    return (
      position.x >= 0 && position.x < 5 && position.y >= 0 && position.y < 5
    );
  }

  execute() {
    if (this._robot.isOnTable) {
      let toPosition = Object.assign({}, this._robot.position);

      switch (this._robot.heading) {
        case "NORTH":
          toPosition.y++;
          break;
        case "EAST":
          toPosition.x++;
          break;
        case "SOUTH":
          toPosition.y--;
          break;
        default:
          toPosition.x--;
          break;
      }

      if (this._isValidPosition(toPosition)) {
        this._robot.position = toPosition;
      }
    }
  }
}

class ReportCommand {
  constructor(robot) {
    this._robot = robot;
  }

  execute() {
    if (this._robot.isOnTable) {
      console.log(this._robot.toString());
    }
  }
}

class CommandFactory {
  constructor(robot) {
    this._robot = robot;
  }

  create(commandStr) {
    if (!commandStr) return new NullCommand();
    const [type, ...args] = commandStr.split(" ");

    switch (type) {
      case "PLACE":
        return new PlaceCommand(this._robot, args.join());
      case "LEFT":
      case "RIGHT":
        return new RotateCommand(this._robot, type);
      case "MOVE":
        return new MoveCommand(this._robot);
      case "REPORT":
        return new ReportCommand(this._robot);
      default:
        return new NullCommand();
    }
  }
}

export default class Robot {
  constructor() {
    this._isOnTable = false;
    this._position = null;
    this._heading = null;
    this._commandFactory = new CommandFactory(this);
  }

  get isOnTable() {
    return this._isOnTable;
  }

  set isOnTable(isOnTable) {
    this._isOnTable = isOnTable;
  }

  get position() {
    return this._position;
  }

  set position(position) {
    this._position = position;
  }

  get heading() {
    return this._heading;
  }

  set heading(heading) {
    this._heading = heading;
  }

  processCommand(commandStr) {
    const command = this._commandFactory.create(commandStr);

    command.execute();
  }

  toString() {
    return (
      this.position &&
      this.heading &&
      `${this.position.x},${this.position.y},${this.heading}`
    );
  }
}
