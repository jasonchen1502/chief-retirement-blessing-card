# 官長退休祝福卡片

這是一個可放到 GitHub Pages 的靜態祝福頁，沿用「泓豪新婚祝福卡片」的畫面邏輯，並改用 Apps Script 與 Google Sheet 保存祝福。手機或電腦開同一個網址，會讀取同一份雲端祝福資料。

此版本只保留給官長的祝福，不內建預設祝福文字。

## 使用方式

1. 開啟 `index.html`。
2. 填寫署名與祝福語。
3. 送出後，祝福會寫入雲端資料表。
4. 表情包會以網站內建 SVG 貼圖顯示，手機與電腦外觀一致。
5. 需要整理或備份時，使用「匯出祝福」下載 JSON。
6. 要分享網站時，使用「複製分享連結」。

## 發布到 GitHub Pages

1. 建立 GitHub repository。
2. 上傳 `github-pages` 資料夾中的所有檔案到 repository 根目錄。
3. 到 repository 的 `Settings` -> `Pages`。
4. Source 選 `Deploy from a branch`。
5. Branch 選 `main`，資料夾選 `/root`。
6. 等 GitHub Pages 產生網址。

網址通常會長這樣：

```text
https://你的帳號.github.io/你的repository名稱/
```

## 重新產出發布檔

```powershell
python build_outputs.py
```

會產出：

- `github-pages/`：適合直接上傳 GitHub Pages 的多檔版本。
- `github-pages-single/index.html`：把圖片、CSS、JS 合成在同一個檔案中的版本。
