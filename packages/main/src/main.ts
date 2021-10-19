import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null;
const isDev: boolean = process.env.ELECTRON_ENV === 'dev';

// Render main window w/ configuration settings
const renderWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDev,
    },
    frame: false,
    maximizable: false,
  });

  // Depending on the environment the frontend will either load from the react server or the static html file
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000/');
  } else {
    mainWindow.loadFile('./build/index.html');
  }

  // Detect if devtools was somehow opened outside development
  mainWindow.webContents.on('devtools-opened', () => {
    if (!isDev) {
      mainWindow?.webContents.closeDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Closes app once all windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  renderWindow();

  // MacOS
  app.on('activate', () => {
    if (mainWindow === null) renderWindow();
  });
});
