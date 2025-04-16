document.addEventListener("DOMContentLoaded", function () {
    let isBlurred = false;
    let editor = null;
    const editorSelector = ".monaco-workbench .part.editor > .content .editor-group-container > .editor-container > .editor-instance";
    const floatingDialogSelectors = [".quick-input-widget", ".editor-hover"];

    function getEditor() {
        if (!editor) {
            editor = document.querySelector(editorSelector); // Cache the editor once
        }
        return editor;
    }

    function applyBlur() {
        if (isBlurred) return;
        const editor = getEditor();
        if (editor) {
            // Use requestAnimationFrame for smoother transition
            requestAnimationFrame(() => {
                editor.style.transition = "filter 0.05s ease-in-out";
                editor.style.filter = "blur(10px)";
            });
            isBlurred = true;
        }
    }

    function removeBlur() {
        if (!isBlurred) return;
        const editor = getEditor();
        if (editor) {
            // Use requestAnimationFrame for smoother transition
            requestAnimationFrame(() => {
                editor.style.filter = "none";
            });
            isBlurred = false;
        }
    }

    function observeFloatingDialogs() {
        const observer = new MutationObserver(() => {
            const floatingDialogs = document.querySelectorAll(floatingDialogSelectors.join(","));
            const anyVisible = [...floatingDialogs].some(el => window.getComputedStyle(el).display !== "none");

            if (anyVisible) {
                applyBlur();
            } else {
                removeBlur();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    }

    // Detect key shortcuts (Ctrl+P and Escape)
    document.addEventListener("keydown", function (event) {
        if ((event.ctrlKey && event.key.toLowerCase() === "p") || (event.ctrlKey && event.shiftKey && event.key === "P")) {
            event.preventDefault();
            applyBlur();
        }
        if (event.key === "Escape") {
            removeBlur();
        }
    }, true);

    // Detect clicking outside floating elements
    document.addEventListener("click", function (event) {
        const floatingDialogs = document.querySelectorAll(floatingDialogSelectors.join(","));
        const clickedInside = [...floatingDialogs].some(el => el.contains(event.target));

        if (!clickedInside) {
            removeBlur();
        }
    });

    // Function to monitor tab changes
    function monitorTabChange() {
        const activeTabObserver = new MutationObserver(() => {
            const activeTab = document.querySelector(".monaco-workbench .part.editor > .content .editor-group-container .editor-group");
            const isSettingsOrExtension = activeTab && (
                activeTab.classList.contains("settings") || activeTab.classList.contains("extensions")
            );

            if (isSettingsOrExtension) {
                removeBlur(); // Remove blur when switching to settings or extension tab
            } else {
                // Blur should stay if we're back to the editor tab
                if (!isBlurred) {
                    applyBlur();
                }
            }
        });

        activeTabObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Start monitoring tab changes
    monitorTabChange();

    // Trigger the blur application when floating dialogs are visible
    observeFloatingDialogs();
});
