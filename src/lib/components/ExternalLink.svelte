<script>
  export let rel = 'nofollow noopener noreferrer';
  export let target = '_blank';
  export let href;
  export let ariaLabel;
</script>

<a aria-label={ariaLabel} {href} {rel} {target}><slot /></a>
