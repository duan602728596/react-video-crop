import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PlaySvgComponent, PauseSvgComponent } from './icons';
import { style, classname as ce, formatTime, getStyleValue } from './utils';

function ReactVideoCrop(props) {
  const { src, className, width, height, aspect, onCropChange, onRangeChange } = props;
  const videoRef = useRef();

  // state
  const [playStatus, setPlayStatus] = useState(false);     // 播放状态
  const [currentTime, setCurrentTime] = useState(0);       // 播放进度
  const [duration, setDuration] = useState(0);             // 视频的长度
  const [gifStartTime, setGifStartTime] = useState(0);     // gif裁图开始时间
  const [gifEndTime, setGifEndTime] = useState(undefined); // gif裁图结束时间
  const [videoCrop, setVideoCrop] = useState(undefined);   // 坐标

  let timer;
  let startX, startFatherWidth, startLeft, endX, endFatherWidth, endLeft;
  let cropX, cropY, fatherCropX, fatherCropY, fatherCropWidth, fatherCropHeight;

  // 定时器
  function progressTimer() {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      timer = requestAnimationFrame(progressTimer);
    }
  }

  // 播放
  function handleVideoPlayClick(event) {
    videoRef.current.play();
    setPlayStatus(true);

    timer = requestAnimationFrame(progressTimer);
  }

  // 暂停
  function handleVideoPauseClick(event) {
    videoRef.current.pause();
    setPlayStatus(false);

    clearInterval(timer);
    timer = undefined;
  }

  // 事件结束
  function handleVideoEnded(event) {
    setPlayStatus(false);

    cancelAnimationFrame(timer);
    timer = undefined;
  }

  // 可以播放
  function handleVideoCanPlay(event) {
    setDuration(videoRef.current.duration);
  }

  // 改变进度
  function handleCurrentTimeChangeClick(event) {
    const { target: e, pageX } = event;
    const fatherRect = e.parentNode.getBoundingClientRect();
    const left = pageX - fatherRect.left;
    const time = duration * left / fatherRect.width;

    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }

  // 左侧范围
  function handleRangeStartMouseMove(event) {
    const { pageX } = event;
    const displacement = pageX - startX;
    const time = duration * ((displacement / startFatherWidth) + (startLeft / 100));

    if (!(time < 0 || time > duration || (gifEndTime && time >= gifEndTime))) {
      setGifStartTime(time);
      onRangeChange && onRangeChange({
        start: time,
        end: gifEndTime
      });
    }
  }

  function handleRangeStartMouseUp(event) {
    document.removeEventListener('mousemove', handleRangeStartMouseMove, false);
    document.removeEventListener('mouseup', handleRangeStartMouseUp, false);

    startX = undefined;
    startFatherWidth = undefined;
    startLeft = undefined;
  }

  function handleRangeStartMouseDown(event) {
    const { target: e, pageX } = event;
    const fatherRect = e.parentNode.getBoundingClientRect();

    startX = pageX;
    startFatherWidth = fatherRect.width;
    startLeft = getStyleValue(e.style.left);

    document.addEventListener('mousemove', handleRangeStartMouseMove, false);
    document.addEventListener('mouseup', handleRangeStartMouseUp, false);
  }

  // 右侧范围
  function handleRangeEndMouseMove(event) {
    const { pageX } = event;
    const displacement = pageX - endX;
    const time = duration * ((displacement / endFatherWidth) + (endLeft / 100));

    if (!(time < 0 || time > duration || (time <= gifStartTime))) {
      setGifEndTime(time);
      onRangeChange && onRangeChange({
        start: gifStartTime,
        end: time
      });
    }
  }

  function handleRangeEndMouseUp(event) {
    document.removeEventListener('mousemove', handleRangeEndMouseMove, false);
    document.removeEventListener('mouseup', handleRangeEndMouseUp, false);

    endX = undefined;
    endFatherWidth = undefined;
    endLeft = undefined;
  }

  function handleRangeEndMouseDown(event) {
    const { target: e, pageX } = event;
    const fatherRect = e.parentNode.getBoundingClientRect();

    endX = pageX;
    endFatherWidth = fatherRect.width;
    endLeft = getStyleValue(e.style.left);

    document.addEventListener('mousemove', handleRangeEndMouseMove, false);
    document.addEventListener('mouseup', handleRangeEndMouseUp, false);
  }

  // 点击裁图
  function handleCropBoxMouseMove(event) {
    const { pageX, pageY } = event;
    let x = pageX - fatherCropX,
      y = pageY - fatherCropY;

    if (x > fatherCropWidth) {
      x = fatherCropWidth;
    }

    if (y > fatherCropHeight) {
      y = fatherCropHeight;
    }

    const crop = {
      x: cropX,
      y: cropY,
      width: x <= cropX ? 1 : (x - cropX),
      height: y <= cropY ? 1 : (y - cropY)
    };

    // 比例
    if (aspect) {
      crop.height = crop.width / aspect;
    }

    setVideoCrop(crop);
    onCropChange && onCropChange(crop);
  }

  function handleCropBoxMouseUp(event) {
    document.removeEventListener('mousemove', handleCropBoxMouseMove, false);
    document.removeEventListener('mouseup', handleCropBoxMouseUp, false);

    cropX = undefined;
    cropY = undefined;
    fatherCropX = undefined;
    fatherCropY = undefined;
    fatherCropWidth = undefined;
    fatherCropHeight = undefined;
  }

  function handleCropBoxMouseDown(event) {
    const { target: e, pageX, pageY } = event;
    const fatherRect = e.parentNode.getBoundingClientRect();

    cropX = pageX - fatherRect.left;
    cropY = pageY - fatherRect.top;
    fatherCropX = fatherRect.left;
    fatherCropY = fatherRect.top;
    fatherCropWidth = fatherRect.width;
    fatherCropHeight = fatherRect.height;

    document.addEventListener('mousemove', handleCropBoxMouseMove, false);
    document.addEventListener('mouseup', handleCropBoxMouseUp, false);
  }

  return (
    <div className={ className } style={ style(width) }>
      <div className={ ce('video-box') } style={ style(width, height) } onMouseDown={ handleCropBoxMouseDown }>
        <video ref={ videoRef }
          className={ ce('video') }
          src={ src }
          onEnded={ handleVideoEnded }
          onCanPlay={ handleVideoCanPlay }
        />
        {
          // 裁图
          do {
            if (videoCrop) {
              <div className={ ce('adjustment') }
                style={{
                  width: `${ videoCrop.width }px`,
                  height: `${ videoCrop.height }px`,
                  top: `${ videoCrop.y }px`,
                  left: `${ videoCrop.x }px`
                }}
              />;
            }
          }
        }
      </div>
      {/* 控件 */}
      <div className={ ce('controls') }>
        <button className={ ce('btn') } type="button" onClick={ playStatus ? handleVideoPauseClick : handleVideoPlayClick }>
          {
            playStatus
              ? <PauseSvgComponent className={ ce('play-icon') } />
              : <PlaySvgComponent className={ ce('play-icon') } />
          }
        </button>
        <div className={ ce('progress-box') }>
          {/* 进度条 */}
          <div className={ ce('progress') } onClick={ handleCurrentTimeChangeClick }>
            <div className={ ce('progress-child') }
              style={{ width: `${ duration === 0 ? 0 : (currentTime / duration * 100) }%` }}
            />
          </div>
          {/* 调整左侧 */}
          <div className={ classNames(ce('range'), ce('range-start')) }
            style={{ left: `${ duration === 0 ? 0 : (gifStartTime / duration * 100) }%` }}
            onMouseDown={ handleRangeStartMouseDown }
          >
            <div className={ classNames(ce('range-text'), ce('range-start-text')) }>{ formatTime(gifStartTime) }</div>
          </div>
          {/* 调整右侧 */}
          <div className={ classNames(ce('range'), ce('range-end')) }
            style={{ left: `${ (gifEndTime === undefined || duration === 0) ? 100 : (gifEndTime / duration * 100) }%` }}
            onMouseDown={ handleRangeEndMouseDown }
          >
            <div className={ classNames(ce('range-text'), ce('range-end-text')) }>{ formatTime(gifEndTime ?? duration) }</div>
          </div>
        </div>
        <div className={ ce('timeStr') }>{ formatTime(currentTime) }</div>
      </div>
    </div>
  );
}

ReactVideoCrop.propTypes = {
  src: PropTypes.string,        // 视频地址
  className: PropTypes.string,  // className
  width: PropTypes.number,      // 宽
  height: PropTypes.number,     // 高
  aspect: PropTypes.number,     // 视频比例
  onCropChange: PropTypes.func, // 视频裁剪方法
  onRangeChange: PropTypes.func // 视频范围改变
};

ReactVideoCrop.defaultProps = {
  width: 800,
  height: 600
};

export default ReactVideoCrop;