import fs from 'fs';
import { markdown } from 'markdown';
import chokidar from 'chokidar';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.watcher = chokidar.watch("./README.md");
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
  render() {
    const html = markdown.toHTML(this.state.markdown);
    return <div dangerouslySetInnerHTML={{ __html:html }} />;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
