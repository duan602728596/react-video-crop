/**
 * 创建style
 * @param { number } width
 * @param { number } height
 */
export function style(width, height) {
  return {
    width: `${ width }px`,
    height: `${ height }px`
  };
}

/**
 * className
 * @param { string } name
 */
export function classname(name) {
  return `react-video-crop-${ name }`;
}

/**
 * 将秒格式化成HH:mm:ss.ms格式
 * @param { number } time: 秒的时间
 */
export function formatTime(time) {
  // 秒
  const sLen = Math.floor(time);
  const s = sLen % 60;

  // 分
  const mLen = Math.floor(sLen / 60);
  const m = mLen % 60;

  // 小时
  const hLen = Math.floor(mLen / 60);
  const h = hLen % 60;

  const sStr = String(s).padStart(2, '0');
  const mStr = String(m).padStart(2, '0');
  const hStr = String(h).padStart(2, '0');

  const str = `${ hStr }:${ mStr }:${ sStr }`;

  return str;
}

/**
 * 获取style的值
 * @param { string } styleValue
 */
export function getStyleValue(styleValue) {
  const str = styleValue.match(/[0-9]+/g);

  return Number(str[0]);
}