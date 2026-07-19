const STORAGE_KEY = "ImageBoard_Save";
const input = document.getElementById("imageInput");
const imageList = document.getElementById("imageList");
const board = document.querySelector(".board");
const addSlot = document.getElementById("addSlot");
const removeSlot = document.getElementById("removeSlot");

let draggedImage = null;
let draggedSlot = null;

//========================
// 枠を作る
//========================

function createSlot(number){

    const slot = document.createElement("div");

    slot.className = "slot";
    slot.textContent = number;

    setupSlot(slot);

    return slot;

}

//========================
// ドラッグ設定
//========================

function setupSlot(slot){

    slot.addEventListener("dragover",(e)=>{
        e.preventDefault();
    });

    slot.addEventListener("dragstart",(e)=>{

        if(e.target.tagName==="IMG"){

            draggedImage = e.target;
            draggedSlot = slot;

        }

    });

    slot.addEventListener("drop",()=>{

        // サムネイルから
        if(draggedImage && draggedSlot===null){

            const img = draggedImage.cloneNode();

            img.draggable = true;

            slot.innerHTML="";
            slot.appendChild(img);

            return;
        }

        // 枠から枠へ
        if(draggedImage && draggedSlot){

            if(slot===draggedSlot)return;

            // 枠から枠へ
if (draggedImage && draggedSlot) {

    if (slot === draggedSlot) return;

    const targetImage = slot.querySelector("img");

    // 元の枠を空にする
    draggedSlot.innerHTML = "";

    // 移動先に画像があった場合
    if (targetImage) {

        // 相手を元の枠へ移動
        draggedSlot.appendChild(targetImage);

    }

    // ドラッグ中の画像を移動先へ
    slot.innerHTML = "";
slot.appendChild(img);

saveBoard();
    draggedSlot = null;
    draggedImage = null;

}

            draggedSlot=null;

        }

    });

}

//========================
// 最初の5個
//========================

document.querySelectorAll(".slot").forEach(slot=>{

    setupSlot(slot);

});

//========================
// 画像読み込み
//========================

input.addEventListener("change",(e)=>{

    imageList.innerHTML="";

    [...e.target.files].forEach(file=>{

        const img=document.createElement("img");

        const reader = new FileReader();

reader.onload = function () {

    img.src = reader.result;

};

reader.readAsDataURL(file);

        img.draggable=true;

        img.addEventListener("dragstart",()=>{

    draggedImage = img;
    draggedSlot = null;

});

        imageList.appendChild(img);

    });

});

//========================
// 枠追加
//========================

addSlot.addEventListener("click",()=>{

    const slot=createSlot(board.children.length+1);

    board.appendChild(slot);

saveBoard();

});

//========================
// 枠削除
//========================

removeSlot.addEventListener("click",()=>{

    if(board.children.length<=1)return;

    board.removeChild(board.lastElementChild);

saveBoard();

});function saveBoard(){

    const data = {

        slotCount: board.children.length,
        slots: []

    };

    board.querySelectorAll(".slot").forEach(slot=>{

        const img = slot.querySelector("img");

        data.slots.push(

            img ? img.src : null

        );

    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

}function loadBoard(){

    const json = localStorage.getItem(STORAGE_KEY);

    if(!json)return;

    const data = JSON.parse(json);

    while(board.children.length < data.slotCount){

        const slot = createSlot(board.children.length+1);

        board.appendChild(slot);

    }

    data.slots.forEach((src,index)=>{

        if(!src)return;

        const img = document.createElement("img");

        img.src = src;
        img.draggable = true;

        img.addEventListener("dragstart",()=>{

            draggedImage = img;
            draggedSlot = null;

        });

        board.children[index].innerHTML="";

        board.children[index].appendChild(img);

    });

}loadBoard();