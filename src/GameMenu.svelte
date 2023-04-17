<script>
  export let onStructureSelect, onToolSelect;

  function buildFactory(factoryType) {
    onStructureSelect(factoryType);
  }

  function selectTool(activeTool) {
    onToolSelect(activeTool);
  }
</script>

<div class="controls-ui">
  <div class="row">
    <div class="col">
      <p class="title">Create structure (Build):</p>
      <div class="row mb-1">
        <button class="build-btn" on:click={() => buildFactory('conveyor-belt')}
          ><div class="structure structure--conveyor-belt">
            Conveyor Belt
          </div></button>
        <button class="build-btn" on:click={() => buildFactory('bank')}
          ><div class="structure structure--bank">Bank</div></button>
        <button class="build-btn" on:click={() => buildFactory('market')}
          ><div class="structure structure--market">Market</div></button>
        <button class="build-btn" on:click={() => buildFactory('mine')}
          ><div class="structure structure--coal-mine">Mine</div></button>
        <button class="build-btn" on:click={() => buildFactory('research-lab')}
          ><div class="structure structure--research-lab">
            Research Lab
          </div></button>
        <button class="build-btn" on:click={() => buildFactory('storage')}
          ><div class="structure structure--storage">Storage</div></button>
      </div>
      <div class="row">
        <button class="build-btn" on:click={() => buildFactory('workshop')}
          ><div class="structure structure--workshop">Workshop</div></button>
        <button class="build-btn" on:click={() => buildFactory('furnace')}
          ><div class="structure structure--furnace">Furnace</div></button>
        <button
          class="build-btn"
          on:click={() => buildFactory('industrial-factory')}
          ><div class="structure structure--industrial-factory">
            Industrial Factory
          </div></button>
        <button class="build-btn" on:click={() => buildFactory('machine-shop')}
          ><div class="structure structure--machine-shop">
            Machine shop
          </div></button>
        <button class="build-btn" on:click={() => buildFactory('manufacturer')}
          ><div class="structure structure--manufacturer">
            Manufacturer
          </div></button>
      </div>
    </div>
    <div class="col">
      <button on:click={() => selectTool('path')}>Path</button>
      <button on:click={() => selectTool('structure')}>Structure</button>
      <button on:click={() => selectTool(null)}>x</button>
    </div>
  </div>
</div>

<style>
  p {
    margin: 0 0 0.2em;
  }

  .mb-1 {
    margin-bottom: 0.5rem;
  }

  .mb-2 {
    margin-bottom: 1rem;
  }

  .row {
    display: flex;
    gap: 0.5rem;
  }

  .title {
    font-weight: 900;
    text-transform: uppercase;
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
  }

  .build-btn {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
    padding: 0;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    border: 0;
    width: calc(var(--cell-size) * 1px);
    height: calc(var(--cell-size) * 1px);
    font-size: 0;
    text-indent: -9999999px;
  }

  .buttons-row:not(:last-child) {
    margin-bottom: 10px;
  }
</style>
