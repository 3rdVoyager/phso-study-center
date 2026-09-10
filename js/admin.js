const bulkForm = document.querySelector("#bulk-resource-form");
const bulkStatusMessage = document.querySelector("#bulk-form-status");

async function createResources(payload) {
  const response = await fetch("/api/admin/resources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Could not add resource.");
  }

  return result;
}

async function handleBulkSubmit(event) {
  event.preventDefault();
  bulkStatusMessage.textContent = "Importing resources...";
  bulkStatusMessage.classList.remove("is-error");

  const json = document.querySelector("#bulk-resources").value;
  let resources;

  try {
    resources = JSON.parse(json);
  } catch {
    setBulkStatus("The bulk entry is not valid JSON.", true);
    return;
  }

  if (!Array.isArray(resources)) {
    setBulkStatus("Bulk JSON must be an array of resource objects.", true);
    return;
  }

  try {
    const result = await createResources(resources);
    bulkForm.reset();
    setBulkStatus(`${result.created_count} resources added.`);
  } catch (error) {
    setBulkStatus(error.message, true);
  }
}

function setBulkStatus(message, isError = false) {
  bulkStatusMessage.textContent = message;
  bulkStatusMessage.classList.toggle("is-error", isError);
}

bulkForm.addEventListener("submit", handleBulkSubmit);
