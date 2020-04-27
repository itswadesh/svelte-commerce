<script>
  export let loading = false
</script>

<style>
  div#wave .olive {
    background: rgba(128, 128, 0, 0.5);
  }
  div#wave .purple {
    background: rgba(0, 0, 255, 0.5);
  }
  div#wave .green {
    background: rgba(0, 128, 0, 0.5);
  }
  div#wave .red {
    background: rgba(255, 0, 0, 0.5);
  }
  div#wave {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 200px;
    z-index: 10000;
  }
  div#wave .dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 3px;

    animation: wave 1.3s linear infinite;
  }
  div#wave .dot:nth-child(2) {
    animation-delay: -1.1s;
  }
  div#wave .dot:nth-child(3) {
    animation-delay: -0.9s;
  }
  div#wave .dot:nth-child(4) {
    animation-delay: -0.7s;
  }
  div#wave .dot:nth-child(5) {
    animation-delay: -0.5s;
  }
  @keyframes wave {
    0%,
    60%,
    100% {
      transform: initial;
    }

    30% {
      transform: translateY(-7px);
    }
  }
</style>

{#if loading}
  <div id="wave">
    <span class="dot olive" />
    <span class="dot purple" />
    <span class="dot green" />
    <span class="dot red" />
  </div>
{/if}
