// share_link_copy_to_clipboard.js

function copyLinkToClipboard() {
    var linkText = document.getElementById("linkText");

    // Create a temporary textarea and set its value
    var textarea = document.createElement("textarea");
    textarea.value = linkText.innerText;

    // Append the textarea to the document
    document.body.appendChild(textarea);

    // Select the content of the textarea
    textarea.select();

    // Execute the copy command
    document.execCommand("copy");

    // Remove the temporary textarea
    document.body.removeChild(textarea);

    // Visual feedback (optional)
    linkText.style.color = "green";

    // Reset the color after a short delay (optional)
    setTimeout(function () {
        linkText.style.color = "black";
    }, 1000);
}
