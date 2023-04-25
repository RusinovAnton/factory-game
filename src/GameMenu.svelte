<script>
  export let onStructureSelect, onToolSelect, onGameSave, onGameSaveClear;

  function buildFactory(factoryType) {
    onStructureSelect(factoryType);
  }

  function selectTool(activeTool) {
    onToolSelect(activeTool);
  }

  function saveGame() {
    onGameSave();
  }

  function clearSaved() {
    onGameSaveClear();
  }
</script>

<div class="controls-ui">
  <div class="row">
    <div class="col">
      <button on:click={() => selectTool('path')}>Path</button>
      <button on:click={() => selectTool('structure')}>Structure</button>
      <button class="btn-secondary" on:click={() => selectTool(null)}>x</button>
    </div>

    <div class="col">
      <button on:click={saveGame}>Save</button>
      <button on:click={clearSaved}>Clear Saved</button>
    </div>
  </div>
</div>

<style>
  .row {
    display: flex;
    gap: 0.5rem;
  }

  .controls-ui {
    position: fixed;
    bottom: 16px;
    left: 16px;
    background: rgba(255, 255, 255, 0.56);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 1rem;
    z-index: 1;
  }
</style>
