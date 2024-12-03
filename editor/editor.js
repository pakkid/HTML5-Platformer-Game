document.addEventListener('DOMContentLoaded', () => {
    console.log('Level editor loaded');
  
    const canvas = document.getElementById('editorCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let level = {
      platforms: [],
      enemies: [],
      collectibles: [],
      sky: { imageSrc: '' }
    };
  
    let selectedElement = null;
    const toolbar = document.getElementById('toolbar');
    const propertiesPanel = document.getElementById('properties-panel');
  
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
        ctx.fillStyle = platform.color || 'gray';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });
      // Draw enemies and collectibles similarly
    }
  
    function addPlatform(x, y, width, height, color) {
      level.platforms.push({ x, y, width, height, color });
      drawLevel();
    }
  
    function addEnemy(x, y, width, height, color) {
      level.enemies.push({ x, y, width, height, color });
      drawLevel();
    }
  
    function addCollectible(x, y, width, height, color) {
      level.collectibles.push({ x, y, width, height, color });
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
  
    document.getElementById('add-platform').addEventListener('click', () => {
      const x = 50, y = 50, width = 100, height = 20, color = '#808080';
      addPlatform(x, y, width, height, color);
    });
  
    document.getElementById('add-enemy').addEventListener('click', () => {
      const x = 50, y = 50, width = 50, height = 50, color = '#FF0000';
      addEnemy(x, y, width, height, color);
    });
  
    document.getElementById('add-collectible').addEventListener('click', () => {
      const x = 50, y = 50, width = 20, height = 20, color = '#FFFF00';
      addCollectible(x, y, width, height, color);
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
      const width = 100;
      const height = 20;
      const color = '#808080';
      addPlatform(x, y, width, height, color);
    });
  
    // Add toolbar buttons for adding enemies and collectibles similarly
  });