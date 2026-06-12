const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setOpacity: (value) => ipcRenderer.send('set-opacity', value),
});

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.electron = '1';

  // '처음부터' 버튼을 레벨 뱃지 오른쪽으로 이동
  const resetBtn = document.getElementById('resetBtn');
  const lvl = document.getElementById('lvl');
  resetBtn.textContent = '처음부터';
  lvl.after(resetBtn);

  const style = document.createElement('style');
  style.textContent = `
    /* ===== 상태 패널 축소 ===== */
    html[data-electron] #panel {
      width: 176px;
      padding: 8px 10px;
    }
    html[data-electron] #nameRow { margin-bottom: 4px; }
    html[data-electron] #dogName { font-size: 14px; }
    html[data-electron] #lvl    { font-size: 11px; padding: 1px 5px; }
    html[data-electron] #mood   { font-size: 15px; }
    html[data-electron] .xpbar  { height: 5px; margin-bottom: 7px; }
    html[data-electron] .stat   { font-size: 12px; margin: 3px 0; }
    html[data-electron] .bar    { height: 9px; }
    html[data-electron] #themeRow { gap: 4px; margin-top: 7px; }
    html[data-electron] #themeRow button { font-size: 11px; padding: 3px 0; }
    html[data-electron] #tip    { font-size: 10px; margin-top: 5px; }

    /* ===== 리셋 버튼: nameRow 인라인 배치 ===== */
    html[data-electron] #resetBtn {
      position: static;
      font-size: 10px;
      color: #a08a6a;
      text-shadow: none;
      text-decoration: underline;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-weight: 600;
      white-space: nowrap;
    }

    /* ===== 행동 버튼: 상단으로 이동 + 축소 ===== */
    html[data-electron] #controls {
      bottom: auto;
      top: 12px;
      left: auto;
      right: 16px;
      transform: none;
      gap: 8px;
    }
    html[data-electron] #controls button {
      font-size: 13px;
      padding: 6px 12px;
      border-width: 2px;
      border-radius: 10px;
      box-shadow: 0 3px 0 #5a4632;
    }
    html[data-electron] #controls button:hover:not(:disabled) {
      box-shadow: 0 1px 0 #5a4632;
    }
  `;
  document.head.appendChild(style);

  // 투명도 슬라이더 (우측 하단)
  const opacityWrap = document.createElement('div');
  opacityWrap.style.cssText = `
    position: fixed; bottom: 14px; right: 16px; z-index: 9000;
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.88); border: 1.5px solid #d8c9ae;
    border-radius: 8px; padding: 3px 8px;
  `;
  opacityWrap.innerHTML = `
    <span style="font-size:11px;font-weight:700;color:#5a4632;">투명도</span>
    <input id="opacitySlider" type="range" min="20" max="100" value="100"
      style="width:80px;height:3px;cursor:pointer;accent-color:#8a6cd1;">
  `;
  document.body.appendChild(opacityWrap);

  document.getElementById('opacitySlider').addEventListener('input', (e) => {
    ipcRenderer.send('set-opacity', parseFloat(e.target.value) / 100);
  });
});
