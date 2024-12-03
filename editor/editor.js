document.addEventListener('DOMContentLoaded', () => {
    console.log('Level editor loaded');
  
    const canvas = document.getElementById('editorCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let level = {
      platforms: [],
      enemies: [],
      collectibles: []
    };
  
    let selectedElement = null;
    const toolbar = document.getElementById('toolbar');
    const propertiesPanel = document.getElementById('properties-panel');
  
    function drawLevel() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      level.platforms.forEach(platform => {
        ctx.fillStyle = platform.color || 'gray';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });
      // Draw enemies and collectibles similarly
    }
  
    function addPlatform(x, y, width, height, color) {
      level.platforms.push({ x, y, width, height, color });
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
      } else {
        propertiesPanel.innerHTML = '<p>No element selected</p>';
      }
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
  
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = 100;
      const height = 20;
      const color = '#808080';
      addPlatform(x, y, width, height, color);
    });
  
    // Add toolbar buttons for adding enemies and collectibles similarly
  });