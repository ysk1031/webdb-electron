import fs from 'fs';
import { markdown } from 'markdown';
import chokidar from 'chokidar';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.currentTarget = null;

    this.watcher = chokidar.watch();
    this.state = { markdown: "" };
  }
  componentDidMount() {
    this.watcher.on('add', this.updateMarkdown.bind(this));
    this.watcher.on('change', this.updateMarkdown.bind(this));
  }
  updateMarkdown(path, stats) {
    fs.readFile(path, 'utf8', (err, content) => {
      if (err) throw err;
      this.setState({ markdown: content });
    });
  }
  handleFileDrop(path) {
    this.changeWatchTarget(path);
  }
  changeWatchTarget(path) {
    this.watcher.unwatch(this.currentTarget);
    this.watcher.add(path);
    this.currentTarget = path;
  }
  render() {
    const html = markdown.toHTML(this.state.markdown);
    return (
      <div>
        <Holder onFileDrop={this.handleFileDrop.bind(this)} />
        <div dangerouslySetInnerHTML={{__html: html}} />
      </div>
    );
  }
}

class Holder extends React.Component {
  handleDragOver(e) {
    e.preventDefault();
  }
  handleDrop(e) {
    e.preventDefault();

    let file = e.dataTransfer.files[0];
    this.props.onFileDrop(file.path);
  }
  render() {
    let style = {
      position: 'absolute',
      width: window.innerWidth,
      height: window.innerHeight
    };
    return (
      <div id="holder" style={style} onDragOver={this.handleDragOver.bind(this)}
        onDrop={this.handleDrop.bind(this)} />
    );
  }
}

Holder.propTypes = {
  onFileDrop: React.PropTypes.func.isRequired
};

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
