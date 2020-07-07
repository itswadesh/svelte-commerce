<style>
  .loader {
    border: 5px solid #f3f3f3;
    border-radius: 50%;
    border-top: 5px solid #555;
    width: 30px;
    height: 30px;
    -webkit-animation: spin 1.2s linear infinite; /* Safari */
    animation: spin 1.2s linear infinite;
  }

  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="relative z-50">
  <div class="flex items-end justify-center pin">
    <div
      class="flex items-center px-4 py-2 text-center border rounded shadow-lg loading w-">
      <div class="flex items-center justify-center">
        <div class="mr-2 loader" />
        Loading...
      </div>
    </div>
  </div>
</div>

<div
  class="fixed top-0 w-full h-full overflow-auto bg-gray-300 opacity-75 z-1" />
