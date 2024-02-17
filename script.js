const form_Data = [
    {
        "id": "c0ac49c5-871e-4c72-a878-251de465e6b4",
        "type": "input",
        "label": "Sample Label",
        "placeholder": "Sample placeholder"
    },
    {
        "id": "146e69c2-1630-4a27-9d0b-f09e463a66e4",
        "type": "select",
        "label": "Sample Label",
        "options": ["Sample Option", "Sample Option", "Sample Option"]
    },
    {
        "id": "680cff8d-c7f9-40be-8767-e3d6ba420952",
        "type": "textarea",
        "label": "Sample Label",
        "placeholder": "Sample Placeholder"
    },
];

const inputBtn = document.getElementById("inputBtn");
const selectBtn = document.getElementById("selectBtn");
const textAreaBtn = document.getElementById("textAreaBtn");
const main = document.getElementById("main");
const saveBtn=document.querySelector('.saveBtn');
inputBtn.addEventListener('click', () => {
    addElement("input");
});
selectBtn.addEventListener('click', () => {
    addElement("select"); 
});
textAreaBtn.addEventListener('click', () => {
    addElement("textarea");
});
let draggedElement=null;
let items;
function handleDragStart(e){
    this.style.opacity="0.4";
    draggedElement=this;
    e.dataTransfer.effectAllowed="move";
    e.dataTransfer.setData("item",this.innerHTML);
}
function handleDragOver(e) {
    if (e.preventDefault) 
        e.preventDefault();

    e.dataTransfer.dropEffect = "move";
    return false;
}

function handleDragEnter(e) {
    this.classList.add("dragover");
}

function handleDragLeave(e) {
    this.classList.remove("dragover");
}

function handleDrop(e) {
    if (e.stopPropagation)
        e.stopPropagation();

    if (draggedElement != this) {
        draggedElement.innerHTML = this.innerHTML;
        draggedElement.setAttribute("data-item", this.innerHTML);

        let replacedItem = e.dataTransfer.getData("item");
        this.innerHTML = replacedItem;
        this.setAttribute("data-item", replacedItem);
    }
    Array.from(main.children).forEach(item => {
        const delButton = item.querySelector('.dltBtn');
        if (delButton) {
            delButton.addEventListener("click", (event) => {
                event.stopPropagation();
                item.remove();
            });
        }
    });

    return false;
}

function handleDragEnd(e) {
    this.style.opacity = "1";

    items.forEach(function(item) {
        item.classList.remove("dragover");
        });
}
function addElement(type) {
    const data = form_Data.find(item => item.type === type);
    const mainDiv = createMainDiv(data);
    mainDiv.className='form-element';
    mainDiv.draggable=true;
    main.appendChild(mainDiv);
     items=document.querySelectorAll(".form-element");
    items.forEach(function(item){
        item.addEventListener("dragstart",handleDragStart);
        item.addEventListener("dragenter",handleDragEnter);
        item.addEventListener("dragover",handleDragOver);
        item.addEventListener("dragleave",handleDragLeave);
        item.addEventListener("drop",handleDrop);
        item.addEventListener("dragend",handleDragEnd);
    });
}

function createMainDiv(data) {
    const maindiv = document.createElement('div');
    
    const upperDiv = document.createElement("div");
    upperDiv.className='box'
    const label = document.createElement('label');
    label.innerText = data.label;

    const delButton = document.createElement("button");
    delButton.className='dltBtn';
    delButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    delButton.addEventListener("click", (event) => {
        // event.stopPropagation();
        maindiv.remove();
    });

    let inputElement;
    if (data.type === 'select') {
        inputElement = document.createElement('select');
        inputElement.className='inputText';
        data.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.innerText = option;
            inputElement.appendChild(optionElement);
        });
    } else {
        inputElement = document.createElement(data.type);
        inputElement.className='inputText'
        inputElement.placeholder = data.placeholder;
    }

    upperDiv.append(label, delButton);
    maindiv.append(upperDiv, inputElement);

    return maindiv;
}
saveBtn.addEventListener('click',()=>{
    const updatedForm=Array.from(main.children).map(item=>{
        const label = item.querySelector('label').innerText;
        const type = item.querySelector('select, input, textarea').tagName.toLowerCase();
        const placeholder = item.querySelector('select, input, textarea').placeholder;
        const options = type === 'select' ? Array.from(item.querySelectorAll('select option')).map(option => option.innerText) : undefined;
        return placeholder? {
          "id": UniqueId(),
          "type": type,
          "label": label,
          "placeholder": placeholder,
        }:{
            "id": UniqueId(),
          "type": type,
          "label": label,
          "options": options
        };
      });
    console.log(updatedForm);
})

function UniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }