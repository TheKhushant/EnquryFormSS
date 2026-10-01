// Captures marketing attribution (UTM parameters + external referrer) from the
// landing URL. First touch within the browser session wins, so navigating
// inside the site doesn't lose the campaign that brought the visitor in.
const KEY = "ss_attribution";
const UTM_KEYS = ["source", "medium", "campaign", "term", "content"] as const;

export interface Attribution {
    utm: Partial<Record<(typeof UTM_KEYS)[number], string>>;
    referrer: string;
}

export function captureAttribution(): Attribution {
    try {
        const saved = sessionStorage.getItem(KEY);
        if (saved) return JSON.parse(saved) as Attribution;
    } catch {
        // storage unavailable: fall through and read the URL
    }

    const params = new URLSearchParams(window.location.search);
    const utm: Attribution["utm"] = {};
    UTM_KEYS.forEach((k) => {
        const v = params.get(`utm_${k}`)?.trim();
        if (v) utm[k] = v.slice(0, 120);
    });

    let referrer = "";
    try {
        const host = document.referrer ? new URL(document.referrer).hostname : "";
        if (host && host !== window.location.hostname) referrer = host;
    } catch {
        // malformed referrer
    }

    const attribution = { utm, referrer };
    try {
        sessionStorage.setItem(KEY, JSON.stringify(attribution));
    } catch {
        // not persisted; still returned for this page view
    }
    return attribution;
}
