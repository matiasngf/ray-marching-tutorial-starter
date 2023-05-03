import { start } from './renderer'

const { canvas } = start();
document.body.appendChild(canvas);
document.body.style.margin = '0px';