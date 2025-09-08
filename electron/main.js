const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    backgroundColor: '#f7f9fc',
    webPreferences: {
      contextIsolation: true,
    },
  });

  const devUrl = process.env.ELECTRON_START_URL || '';
  if (devUrl) {
    win.loadURL(devUrl);
  } else {
    // Production: load the static web export
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    win.loadFile(indexPath);
  }

  // Optional: Open devtools in dev mode
  if (process.env.ELECTRON_START_URL) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
