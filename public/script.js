document.addEventListener("DOMContentLoaded", function () {
    const textArea = document.getElementById("text_to_summarize");
    const submitButton = document.getElementById("submit-button");
    const summarizedTextArea = document.getElementById("summary");

    submitButton.disabled = true;

    textArea.addEventListener("input", verifyTextLength);
    submitButton.addEventListener("click", submitData);

    function verifyTextLength(e) {
        const textarea = e.target;

        if (textarea.value.length >= 200 && textarea.value.length <= 100000) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    function submitData(e) {
        e.preventDefault(); // Prevent default form submission behavior

        submitButton.classList.add("submit-button--loading");
        const text_to_summarize = textArea.value;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "mySecret"); // Ensure this is a string

        const raw = JSON.stringify({
            text_to_summarize: text_to_summarize,
            parameters: {
                max_length: 100,
                min_length: 30,
            },
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("/summarize", requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then((summary) => {
                summarizedTextArea.value = summary;
                submitButton.classList.remove("submit-button--loading");
            })
            .catch((error) => {
                console.error("Error:", error.message);
                submitButton.classList.remove("submit-button--loading");
            });
    }
});
