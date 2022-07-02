<script>
import { page } from '$app/stores'
$: {
	if (typeof gtag !== 'undefined') {
		gtag('config', 'G-VBF1CPS8VD', {
			page_path: $page.url.pathname,
		})
	}
}
</script>
