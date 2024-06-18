export function loadGumletScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

        // Checks if the script is already loaded on the page
        if (document.querySelector("script#gumlet-sdk-script")) {
            resolve();
        } else {
            (window as any).GUMLET_CONFIG = {
                hosts: [{
                    current: "s3.ap-south-1.amazonaws.com",
                    gumlet: "misiki.gumlet.io"
                }],
                lazy_load: true
            };

            // Load the script and appends it on the page
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/gumlet.js@2.1/dist/gumlet.min.js";
            script.id = "gumlet-sdk-script";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = (e) => reject(new Error(`Failed to load script: ${e}`));
            document.body.appendChild(script);
        }
    });
}
