
window.onload = getStore;

async function getStore() {
    const response = await fetch(`http://localhost:3000/store-data`);
    const data = await response.json();
    displayStore(data.cstate, data.pstate)
}

async function sendActiveCat(attributes) {
    const response = await fetch(`http://localhost:3000/` + attributes.cat_id.nodeValue + `/set-cat`);
    const data = await response.json();
    getStore();
}