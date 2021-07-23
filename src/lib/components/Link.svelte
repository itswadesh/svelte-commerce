<script>
  export let rel = '';
  export let target = '';
  export let href;
  export let ariaLabel;
</script>

<a aria-label={ariaLabel} {href} {rel} {target}><slot /></a>
