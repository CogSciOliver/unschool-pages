document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("topic-order-toggle");
    const topicGrid = document.getElementById("topic-grid");

    if (toggleButton && topicGrid) {
        let reversed = false;

        toggleButton.addEventListener("click", () => {
            Array.from(topicGrid.children)
                .reverse()
                .forEach(card => topicGrid.appendChild(card));

            reversed = !reversed;
            toggleButton.setAttribute("aria-pressed", String(reversed));
            toggleButton.textContent = reversed
                ? "Show topics A to Z"
                : "Show topics Z to A";
        });
    }
});