import "./style.css";

// Behaviour only: the look comes from the rc-* classes. Native <dialog> does the focus handling.
const dialog = document.querySelector("#new-invoice");
document.querySelector("[data-open='new-invoice']")?.addEventListener("click", () => dialog?.showModal());
