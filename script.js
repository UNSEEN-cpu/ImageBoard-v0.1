//========================
// ImageBoard Ver2
//========================

// 保存キー
const STORAGE_KEY = "ImageBoard_Save";

// 要素取得
const input = document.getElementById("imageInput");
const imageList = document.getElementById("imageList");
const board = document.querySelector(".board");
const addSlot = document.getElementById("addSlot");
const removeSlot = document.getElementById("removeSlot");

// ドラッグ情報
let draggedImage = null;
let draggedSourceSlot = null;

//========================
// 初期化
//========================

window.addEventListener("DOMContentLoaded", () => {

    // 最初からある枠を有効化
    document.querySelectorAll(".slot").forEach(slot => {

        setupSlot(slot);

    });

    // 保存データ読込
    loadBoard();

});//========================
// 画像読み込み
//========================

input.addEventListener("change", (e) => {

    imageList.innerHTML = "";

    [...e.target.files].forEach(file => {

        const reader = new FileReader();

        reader.onload = function () {

            const img = document.createElement("img");

            img.src = reader.result;
            img.draggable = true;

            // サムネイルからドラッグ開始
            img.addEventListener("dragstart", () => {

                draggedImage = img;
                draggedSourceSlot = null;

            });

            imageList.appendChild(img);

        };

        reader.readAsDataURL(file);

    });

});//========================
// 枠設定
//========================

function setupSlot(slot){

    // ドラッグできるようにする
    slot.addEventListener("dragover",(e)=>{
        e.preventDefault();
    });

    // 枠内画像をドラッグ開始
    slot.addEventListener("dragstart",(e)=>{

        if(e.target.tagName==="IMG"){

            draggedImage = e.target;
            draggedSourceSlot = slot;

        }

    });

    // ドロップ
slot.addEventListener("drop",(e)=>{

    e.preventDefault();

    if(!draggedImage) return;

    //========================
    // サムネイルから
    //========================
    if(draggedSourceSlot===null){

        const newImg = draggedImage.cloneNode();

        newImg.draggable = true;

        newImg.addEventListener("dragstart",()=>{

            draggedImage = newImg;
            draggedSourceSlot = slot;

        });

        slot.innerHTML="";
        slot.appendChild(newImg);

        saveBoard();

        return;

    }

    //========================
    // 枠から枠へ
    //========================

    if(slot===draggedSourceSlot) return;

    const targetImage = slot.querySelector("img");

    // 相手がいないなら移動
    if(!targetImage){

        slot.appendChild(draggedImage);

    }
    // 相手がいるなら交換
    else{

        draggedSourceSlot.appendChild(targetImage);

        slot.appendChild(draggedImage);

    }

    saveBoard();

    draggedImage = null;
    draggedSourceSlot = null;

});
}//========================
// 保存
//========================


function saveBoard(){

    const data = {
        slotCount: board.children.length,
        slots: []
    };

    document.querySelectorAll(".slot").forEach(slot => {

        const img = slot.querySelector("img");

        data.slots.push(img ? img.src : null);

    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

}//========================
// 読み込み
//========================

function loadBoard(){

    const save = localStorage.getItem(STORAGE_KEY);

if(!save) return;

const data = JSON.parse(save);
// 足りない枠を追加
while(board.children.length < data.slotCount){

    const slot = createSlot();

    board.appendChild(slot);

}

    const slots = document.querySelectorAll(".slot");

    data.slots.forEach((src,index)=>{

        if(!src) return;

        const img = document.createElement("img");

        img.src = src;
        img.draggable = true;

        img.addEventListener("dragstart",()=>{

            draggedImage = img;
            draggedSourceSlot = slots[index];

        });

        slots[index].innerHTML="";

        slots[index].appendChild(img);

    });

}//========================
// 枠作成
//========================

function createSlot(){

    const slot = document.createElement("div");

    slot.className = "slot";

    setupSlot(slot);

    return slot;

}//========================
// 枠追加
//========================

addSlot.addEventListener("click",()=>{

    const slot = createSlot();

    board.appendChild(slot);

    saveBoard();

});//========================
// 枠削除
//========================

removeSlot.addEventListener("click",()=>{

    if(board.children.length<=1) return;

    board.removeChild(board.lastElementChild);

    saveBoard();

});