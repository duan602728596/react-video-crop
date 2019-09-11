import React, { Component } from 'react';
import { hot } from '@sweet-milktea/milktea/react-hot-loader';
import './global.sass';
import ReactVideoCrop from '../src/react-video-crop';

@hot(module)
class App extends Component {
  // change
  handleCropChange(crop) {
    console.log(crop);
  }

  handleRangeChange(range) {
    console.log(range);
  }

  render() {
    return (
      <div>
        <ReactVideoCrop src={ require('./video.mp4') }
          width={ 400 }
          height={ 300 }
          aspect={ 4 / 3 }
          onCropChange={ this.handleCropChange.bind(this) }
          onRangeChange={ this.handleRangeChange.bind(this) }
        />
      </div>
    );
  }
}

export default App;