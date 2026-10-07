const { app, BrowserWindow } = require("electron");
const path = require("node:path");
app.setPath("userData", path.join(__dirname, ".electron-user-data"));
app.setPath("sessionData", path.join(__dirname, ".electron-session-data"));
app.whenReady().then(async () => {
  const window = new BrowserWindow({ show: false, width: 1440, height: 1000, webPreferences: { contextIsolation: true, nodeIntegration: false } });
  await window.loadFile(path.join(__dirname, "dist/index.html"));
});
app.on("window-all-closed", () => app.quit());
