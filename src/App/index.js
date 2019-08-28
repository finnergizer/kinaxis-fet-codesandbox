import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

export class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>Kinaxis FET Demo</h1>
        <h2>A search table for the NBA API</h2>
        <NbaPlayersTable />
      </div>
    );
  }
}

class NbaPlayersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      searchValue: ""
    };
  }

  componentDidMount() {
    this.queryPlayers(this.state.searchValue);
  }

  handleChange = event => {
    this.setState({
      searchValue: event.target.value
    });
    this.queryPlayers(event.target.value);
  };

  render() {
    return (
      <div>
        <TextField
          id="search-name"
          label="Search"
          value={this.state.searchValue}
          onChange={this.handleChange}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">First Name</TableCell>
              <TableCell align="center">Last Name</TableCell>
              <TableCell align="center">Position</TableCell>
              <TableCell align="center">Team</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {this.state.players.map(player => (
              <TableRow key={player["id"]}>
                <TableCell align="center">{player["first_name"]}</TableCell>
                <TableCell align="center">{player["last_name"]}</TableCell>
                <TableCell align="center">{player["position"]}</TableCell>
                <TableCell align="center">{player.team["full_name"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  queryPlayers(searchValue) {
    fetch("https://www.balldontlie.io/api/v1/players?search=" + searchValue)
      .then(res => {
        return res.json();
      })
      .then(
        result => {
          this.setState({
            players: result.data
          });
        },
        error => {
          console.error(error);
          this.setState({
            players: []
          });
        }
      );
  }
}
