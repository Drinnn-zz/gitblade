import React, { Component } from "react";
import moment from "moment";
import api from "../../services/api";

import { Container, Form } from "./styles";
import CompareList from "../../components/CompareList";

export default class Main extends Component {
  componentDidMount() {
    if (localStorage.getItem("repositories") !== null) {
      this.setState({
        repositories: JSON.parse(localStorage.getItem("repositories"))
      });
    }
  }

  state = {
    loading: false,
    repositoryError: false,
    repositoryInput: "",
    repositories: []
  };

  handleAddRepository = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { data: repository } = await api.get(
        `repos/${this.state.repositoryInput}`
      );
      repository.lastCommit = moment(repository.pushed_at).fromNow();
      this.setState({
        repositoryInput: "",
        repositories: [...this.state.repositories, repository],
        repositoryError: false
      });
      if (typeof Storage !== undefined) {
        localStorage.setItem(
          "repositories",
          JSON.stringify(this.state.repositories)
        );
      } else {
        console.log("This browser doesn't support Local Storage.");
      }
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = repositoryId => {
    let updatedRepos = this.state.repositories.filter(
      repository => repository.id !== repositoryId
    );
    this.setState(
      {
        repositories: [...updatedRepos]
      },
      () => {
        localStorage.setItem(
          "repositories",
          JSON.stringify(this.state.repositories)
        );
      }
    );
  };

  handleUpdate = async repositoryId => {
    const { repositories } = this.state;
    const repoToUpdate = repositories.find(
      repository => repository.id === repositoryId
    );
    try {
      const { data } = await api.get(`repos/${repoToUpdate.full_name}`);
      data.lastCommit = data.pushed_at
        ? moment(data.pushed_at).fromNow()
        : moment(repoToUpdate.pushed_at).fromNow();

      this.setState(
        {
          repositories: repositories.map(repository =>
            repository.id === data.id ? data : repository
          )
        },
        () => {
          localStorage.setItem(
            "repositories",
            JSON.stringify(this.state.repositories)
          );
        }
      );
    } catch (error) {
      console.log("Couldn't update repository!");
    }
  };

  render() {
    return (
      <Container>
        <h1>GitBlade</h1>
        <Form
          withError={this.state.repositoryError}
          onSubmit={this.handleAddRepository}
        >
          <input
            type="text"
            placeholder="user/repository"
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">
            {this.state.loading ? (
              <i className="fa fa-spinner fa-pulse" />
            ) : (
              "OK"
            )}
          </button>
        </Form>
        <CompareList
          repositories={this.state.repositories}
          handleDelete={this.handleDelete}
          handleUpdate={this.handleUpdate}
        />
      </Container>
    );
  }
}
