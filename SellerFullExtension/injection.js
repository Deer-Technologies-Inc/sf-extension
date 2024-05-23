(() => {
    setTimeout(() => {
        if (window.P && window.P.appConfig) {
            window.postMessage({ type: "getCsrfToken", csrfToken: window.P.appConfig.csrfToken });
        }
    }, 1000);

})();