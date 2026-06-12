const { app, BrowserWindow, Tray, Menu, nativeImage, screen, ipcMain } = require('electron');
const path = require('path');

let win, tray;

// 트레이 아이콘: 1x1 투명 PNG + 텍스트 타이틀로 표시
const EMPTY_ICON = nativeImage.createFromDataURL(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
);

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay();

  win = new BrowserWindow({
    width: Math.round(workArea.width / 2),
    height: Math.round(workArea.height / 2),
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');
  Menu.setApplicationMenu(null);
}

function createTray() {
  tray = new Tray(EMPTY_ICON);
  tray.setTitle('🐕');
  tray.setToolTip('픽셀 강아지');

  const contextMenu = Menu.buildFromTemplate([
    { label: '열기 / 닫기', click: toggleWindow },
    { type: 'separator' },
    { label: '종료', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on('click', toggleWindow);
}

function toggleWindow() {
  if (win.isVisible()) {
    win.hide();
    return;
  }

  const { workArea } = screen.getPrimaryDisplay();
  const winWidth = Math.round(workArea.width / 2);
  win.setPosition(workArea.x + workArea.width - winWidth, workArea.y);
  win.show();
}

ipcMain.on('set-opacity', (_, value) => {
  if (win) win.setOpacity(value);
});

app.whenReady().then(() => {
  if (app.dock) app.dock.hide();  // Dock에서 숨기기 (메뉴바 전용 앱)
  createWindow();
  createTray();
});

// 창이 닫혀도 앱 종료하지 않음 (트레이로만 종료)
app.on('window-all-closed', () => {});
