function toggleDefinition(wordElement) {
  const definition = wordElement.nextElementSibling;
  const arrow = wordElement.querySelector(".arrow");

  const isOpen = definition.style.display === "block";
  definition.style.display = isOpen ? "none" : "block";
  arrow.textContent = isOpen ? "▼" : "▲";
}