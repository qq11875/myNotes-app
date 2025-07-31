const form = document.getElementById("note-form");
const notesList = document.getElementById("notes-list");
const searchInput = document.getElementById("search");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("note-text").value.trim();
    const tags = document.getElementById("note-tags").value.trim().split(",").map(t => t.trim()).filter(t => t !== "");
    const color = document.getElementById("note-color").value;

    if (text) {
        notes.push({text, tags, pinned: false, color});
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

function startEditNote(index) {
    const note = notes[index];

    const li = document.createElement("li");

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = note.text;
    textInput.className = "edit-input";

    const tagsInput = document.createElement("input");
    tagsInput.type = "text";
    tagsInput.value = note.tags.join(", ");
    tagsInput.className = "edit-input";

    const colorOptions = {
        "#fff8b3": "Yellow",
        "#b3ffd9": "Mint",
        "#fddde6": "Pink",
        "#d1ecf1": "Blue"
    };

    const colorSelect = document.createElement("select");
    colorSelect.className = "edit-color-select";
    Object.entries(colorOptions).forEach(([hex, name]) => {
        const option = document.createElement("option");
        option.value = hex;
        option.textContent = name;
        if (note.color === hex) option.selected = true;
        colorSelect.append(option)
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
        const newText = textInput.value.trim();
        const newTags = tagsInput.value.trim().split(",").map(t => t.trim()).filter(t => t !== "");
        const newColor = colorSelect.value;
        if (newText) {
            notes[index] = {text: newText, tags: newTags, color: newColor};
            saveNotes();
            renderNotes(notes);
        }
    });

    li.appendChild(textInput);
    li.appendChild(tagsInput);
    li.appendChild(colorSelect);
    li.appendChild(saveBtn);

    notesList.replaceChild(li, notesList.children[index]);
}

function renderNotes(notesToRender) {
    notesList.innerHTML = "";
    document.getElementById("filter-controls").innerHTML = "";

    notesToRender.sort((a, b) => (b.pinned === true) - (a.pinned === true));

    notesToRender.forEach((note, index) => {
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

        const pinBtn = document.createElement("button");
        pinBtn.textContent = note.pinned ? "Unpin": "Pin";
        pinBtn.className = "pin-button";
        pinBtn.addEventListener("click", () => {
            notes[index].pinned = !notes[index].pinned;
            saveNotes();
            renderNotes(notes);
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

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-button";
        editBtn.addEventListener("click", () => startEditNote(index));
        
        const btns = document.createElement("div");
        btns.className = "note-buttons";
        btns.appendChild(pinBtn);
        btns.appendChild(editBtn);
        btns.appendChild(deleteBtn);
        
        li.style.backgroundColor = note.color || "#f2f2f2";
        li.appendChild(text);
        li.appendChild(tagsDiv);
        li.appendChild(btns);
        notesList.appendChild(li);
    });
}

renderNotes(notes);