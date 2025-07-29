const form = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");
const searchInput = document.getElementById("search");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("note-text").value.trim();
    const tags = document.getElementById("note-tags").value.trim().split(",").map(t => t.trim()).filter(t => t !== "");

    if (text) {
        notes.push({text, tags});
        saveNotes();
        form.reset();
        renderNotes(notes);
    }
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered  = notes.filter((note) => 
        note.text.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    renderNotes(filtered);
});

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function showClearFilter() {
    const btn = document.createElement("button");
    btn.textContent = "Clear Filter";
    btn.style.marginBottom = "10px";
    btn.addEventListener("click", () => {
        renderNotes(notes);
    });

    const container = document.getElementById("filter-controls");
    container.appendChild(btn);
}

function renderNotes(notesToRender) {
    notesList.innerHTML = "";
    document.getElementById("filter-controls").innerHTML = "";

    notesToRender.forEach((note) => {
        const li = document.createElement("li");
        const text = document.createElement("p");
        text.textContent = note.text;

        const tagsDiv = document.createElement("div");
        note.tags.forEach((tag) => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = `#${tag}`;
            span.style.cursor = "pointer";
            span.addEventListener("click", () => {
                const filtered = notes.filter(n => n.tags.includes(tag));
                renderNotes(filtered);
                showClearFilter();
            });
            tagsDiv.appendChild(span);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-button"
        deleteBtn.addEventListener("click", () => {
            const fullIndex = notes.findIndex(n =>
                n.text === note.text &&
                JSON.stringify(n.tags) === JSON.stringify(note.tags)
            );
            if (fullIndex !== -1) {
                notes.splice(fullIndex, 1);
                saveNotes();
                renderNotes(notes);
            }
        });

        

        li.appendChild(text);
        li.appendChild(tagsDiv);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

renderNotes(notes);