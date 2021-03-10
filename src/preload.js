import { ipcRenderer } from 'electron';
import Store from 'electron-store';

window.ipcRenderer = ipcRenderer;
window.electronStore = new Store();