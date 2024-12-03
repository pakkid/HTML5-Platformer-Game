document.addEventListener('DOMContentLoaded', () => {
  console.log('Level editor loaded');

  const canvas = document.getElementById('editorCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  let level = {
    platforms: [],
    killbars: [],
    collectibles: [],
    sky: { imageSrc: '' }
  };

  let selectedElement = null;
  let mode = 'select'; // Modes: 'select', 'add-platform', 'add-killbar', 'add-collectible'
  const toolbar = document.getElementById('toolbar');
  const propertiesPanel = document.getElementById('properties-panel');
  const elementsList = document.getElementById('elements-list');

  function drawLevel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (level.sky.imageSrc) {
      const skyImage = new Image();
      skyImage.src = level.sky.imageSrc;
      skyImage.onload = () => {
        ctx.drawImage(skyImage, 0, 0, canvas.width, canvas.height);
      };
    }
    level.platforms.forEach(platform => {
      if (platform.visible !== false) {
        ctx.fillStyle = platform.color || 'gray';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      }
    });
    level.killbars.forEach(killbar => {
      if (killbar.visible !== false) {
        ctx.fillStyle = killbar.color || 'red';
        ctx.fillRect(killbar.x, killbar.y, killbar.width, killbar.height);
      }
    });
    level.collectibles.forEach(collectible => {
      if (collectible.visible !== false) {
        ctx.fillStyle = collectible.color || 'yellow';
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
      }
    });
    updateElementsList();
  }

  function addPlatform(x, y, width, height, color) {
    level.platforms.push({ x, y, width, height, color, collidable: true, visible: true });
    drawLevel();
  }

  function addKillbar(x, y, width, height, color) {
    level.killbars.push({ x, y, width, height, color, collidable: true, visible: true });
    drawLevel();
  }

  function addCollectible(x, y, width, height, color) {
    level.collectibles.push({ x, y, width, height, color, collidable: true, visible: true });
    drawLevel();
  }

  function selectElement(element) {
    selectedElement = element;
    updatePropertiesPanel();
  }

  function updatePropertiesPanel() {
    if (selectedElement) {
      propertiesPanel.innerHTML = `
        <label>X: <input type="number" id="prop-x" value="${selectedElement.x}"></label>
        <label>Y: <input type="number" id="prop-y" value="${selectedElement.y}"></label>
        <label>Width: <input type="number" id="prop-width" value="${selectedElement.width}"></label>
        <label>Height: <input type="number" id="prop-height" value="${selectedElement.height}"></label>
        <label>Color: <input type="color" id="prop-color" value="${selectedElement.color || '#808080'}"></label>
        <label>Collidable: <input type="checkbox" id="prop-collidable" ${selectedElement.collidable ? 'checked' : ''}></label>
        <label>Visible: <input type="checkbox" id="prop-visible" ${selectedElement.visible !== false ? 'checked' : ''}></label>
      `;
      document.getElementById('prop-x').addEventListener('input', (e) => {
        selectedElement.x = parseInt(e.target.value);
        drawLevel();
      });
      document.getElementById('prop-y').addEventListener('input', (e) => {
        selectedElement.y = parseInt(e.target.value);
        drawLevel();
      });
      document.getElementById('prop-width').addEventListener('input', (e) => {
        selectedElement.width = parseInt(e.target.value);
        drawLevel();
      });
      document.getElementById('prop-height').addEventListener('input', (e) => {
        selectedElement.height = parseInt(e.target.value);
        drawLevel();
      });
      document.getElementById('prop-color').addEventListener('input', (e) => {
        selectedElement.color = e.target.value;
        drawLevel();
      });
      document.getElementById('prop-collidable').addEventListener('change', (e) => {
        selectedElement.collidable = e.target.checked;
        drawLevel();
      });
      document.getElementById('prop-visible').addEventListener('change', (e) => {
        selectedElement.visible = e.target.checked;
        drawLevel();
      });
    } else {
      propertiesPanel.innerHTML = '<p>No element selected</p>';
    }
  }

  function updateElementsList() {
    elementsList.innerHTML = '';
    level.platforms.forEach((platform, index) => {
      const li = document.createElement('li');
      li.textContent = `Platform ${index + 1}`;
      li.addEventListener('click', () => selectElement(platform));
      elementsList.appendChild(li);
    });
    level.killbars.forEach((killbar, index) => {
      const li = document.createElement('li');
      li.textContent = `Killbar ${index + 1}`;
      li.addEventListener('click', () => selectElement(killbar));
      elementsList.appendChild(li);
    });
    level.collectibles.forEach((collectible, index) => {
      const li = document.createElement('li');
      li.textContent = `Collectible ${index + 1}`;
      li.addEventListener('click', () => selectElement(collectible));
      elementsList.appendChild(li);
    });
  }

  function saveLevel() {
    const levelData = JSON.stringify(level, null, 2);
    const blob = new Blob([levelData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'level.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadLevel(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      level = JSON.parse(e.target.result);
      drawLevel();
    };
    reader.readAsText(file);
  }

  document.getElementById('save-button').addEventListener('click', saveLevel);

  document.getElementById('load-button').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });

  document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      loadLevel(file);
    }
  });

  document.getElementById('select-mode').addEventListener('click', () => {
    mode = 'select';
    console.log('Mode changed to select');
  });

  document.getElementById('add-platform').addEventListener('click', () => {
    mode = 'add-platform';
    console.log('Mode changed to add-platform');
  });

  document.getElementById('add-killbar').addEventListener('click', () => {
    mode = 'add-killbar';
    console.log('Mode changed to add-killbar');
  });

  document.getElementById('add-collectible').addEventListener('click', () => {
    mode = 'add-collectible';
    console.log('Mode changed to add-collectible');
  });

  document.getElementById('change-sky').addEventListener('click', () => {
    const skyUrl = prompt('Enter the URL of the sky image:');
    if (skyUrl) {
      level.sky.imageSrc = skyUrl;
      drawLevel();
    }
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'add-platform') {
      const width = 100;
      const height = 20;
      const color = '#808080';
      addPlatform(x, y, width, height, color);
    } else if (mode === 'add-killbar') {
      const width = 100;
      const height = 20;
      const color = '#FF0000';
      addKillbar(x, y, width, height, color);
    } else if (mode === 'add-collectible') {
      const width = 20;
      const height = 20;
      const color = '#FFFF00';
      addCollectible(x, y, width, height, color);
    } else if (mode === 'select') {
      // Implement selection logic
      const elements = [...level.platforms, ...level.killbars, ...level.collectibles];
      const element = elements.find(el => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height);
      if (element) {
        selectElement(element);
      } else {
        selectElement(null);
      }
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (mode === 'select' && selectedElement) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= selectedElement.x + selectedElement.width - 10 && x <= selectedElement.x + selectedElement.width + 10) {
        canvas.style.cursor = 'ew-resize';
      } else if (y >= selectedElement.y + selectedElement.height - 10 && y <= selectedElement.y + selectedElement.height + 10) {
        canvas.style.cursor = 'ns-resize';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    if (mode === 'select' && selectedElement) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= selectedElement.x + selectedElement.width - 10 && x <= selectedElement.x + selectedElement.width + 10) {
        mode = 'resize-width';
      } else if (y >= selectedElement.y + selectedElement.height - 10 && y <= selectedElement.y + selectedElement.height + 10) {
        mode = 'resize-height';
      }
    }
  });

  canvas.addEventListener('mouseup', () => {
    if (mode === 'resize-width' || mode === 'resize-height') {
      mode = 'select';
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (mode === 'resize-width' && selectedElement) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      selectedElement.width = x - selectedElement.x;
      drawLevel();
    } else if (mode === 'resize-height' && selectedElement) {
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      selectedElement.height = y - selectedElement.y;
      drawLevel();
    }
  });

  drawLevel();
});