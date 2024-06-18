
<script>
    import * as SC from 'svelte-cubed';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';
  
    // Component Props
    export let modelURL;
    export let scale = [1, 1, 1];
    export let position = [0, 0, 0];
    export let rotation = [0, 0, 0];
    export let name = 'UniqueName_' + Math.random() + Date.now();
  
    let model = null;
  
    //   Custom Event to track loading status from parent
    const dispatch = createEventDispatcher();
    function emitStatus(status){
      dispatch('statusChange', {name, status});
    }
  
    function loadGLTF() {
      const loader = new GLTFLoader();
      return loader.loadAsync(modelURL)
    }
  
    onMount(() => {
      if (modelURL) {
        emitStatus('LOADING');
        loadGLTF()
          .then(_model => {
            model = _model;
            emitStatus('SUCCESS');
          })
          .catch(err => {
            console.error('Error loading model:', name, err)
            emitStatus('ERROR');
        })
      }
    })
  
  </script>
  
  {#if model}
    <SC.Primitive
        object={model.scene}
        {scale}
        {position}
        {rotation}
      />
  {/if}