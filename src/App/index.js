import React from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

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
      searchValue: "",
      rowsPerPage: 5,
      currentPage: 0
    };
  }

  componentDidMount() {
    this.queryPlayers(
      this.state.searchValue,
      this.state.currentPage,
      this.state.rowsPerPage
    );
  }

  handleChange = event => {
    this.setState({
      searchValue: event.target.value,
      currentPage: 0
    });
    this.queryPlayers(event.target.value, 0, this.state.rowsPerPage);
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

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={4}
                count={this.state.count}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.currentPage}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      currentPage: newPage
    });
    this.queryPlayers(this.state.searchValue, newPage, this.state.rowsPerPage);
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 0
    });
    this.queryPlayers(
      this.state.searchValue,
      0,
      parseInt(event.target.value, 10)
    );
  };

  queryPlayers(searchValue, page, rowsPerPage) {
    fetch(
      "https://www.balldontlie.io/api/v1/players?search=" +
        searchValue +
        (page ? "&page=" + page + 1 : "") +
        (rowsPerPage ? "&per_page=" + rowsPerPage : "")
    )
      .then(res => {
        return res.json();
      })
      .then(
        result => {
          this.setState({
            players: result.data,
            count: result.meta["total_count"]
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

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onChangePage } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

  return (
    <div>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
