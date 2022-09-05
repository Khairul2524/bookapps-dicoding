const databuku = []
const RENDER_EVENT = "render-buku"
const SAVED_EVENT = 'saved-buku';
const STORAGE_KEY = 'BUKU_APPS';


// fungsi untuk men-generet id buku
function generateId() {
    return +new Date();
}
// fungsi untuk membuat object baru dengan parameter yang sdah ditentukan
function generatebukuObject(id, nama_penulis, judul_buku, tahun_terbit, baca_buku) {
    return {
        id,
        nama_penulis,
        judul_buku,
        tahun_terbit,
        baca_buku,
    }
}

function findbukuIndex(bukuid) {
    for (const index in databuku) {
        if (databuku[index].id === bukuid) {
        return index;
        }
    }
    return -1;
}
function findbuku(bukuid) {
    for (const bukuItem of databuku) {
    if (bukuItem.id === bukuid) {
        return bukuItem;
    }
    }
    return null;
}

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(databuku);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const buku of data) {
        databuku.push(buku);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makebuku(bukuObject) {
    const teksjudulbuku = document.createElement('h3');
    teksjudulbuku.innerText = bukuObject.judul_buku;

    const teksnamapenulis = document.createElement('p');
    teksnamapenulis.innerText = 'Penulis : '+ bukuObject.nama_penulis;
    const tekstahunterbit = document.createElement('p');
    tekstahunterbit.innerText = 'Tahun Terbit : '+ bukuObject.tahun_terbit;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append( teksjudulbuku, teksnamapenulis , tekstahunterbit);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `buku-${bukuObject.id}`);


    if (bukuObject.baca_buku) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undobukusudahdibaca(bukuObject.id);
        });
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removebukusudahdibaca(bukuObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
            addbukukesudahbaca(bukuObject.id);
        });
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removebukusudahdibaca(bukuObject.id);
        });
        container.append(checkButton, trashButton);
    }
    return container;
}
// fungsi Untuk menambah Buku
function addbuku() {
    const nama_penulis = document.getElementById('nama_penulis').value;
    const judul_buku = document.getElementById('judul_buku').value;
    const tahun_terbit = document.getElementById('tahun_terbit').value;
    const sudah_baca = document.getElementById('sudah_baca').checked;

    const generatedID = generateId();
    if (sudah_baca) {
        const bukuObject = generatebukuObject(generatedID, nama_penulis, judul_buku, tahun_terbit, true);
        databuku.push(bukuObject);
    }else{
        const bukuObject = generatebukuObject(generatedID, nama_penulis, judul_buku, tahun_terbit, false);
        databuku.push(bukuObject);
    }
   

    document.dispatchEvent(new Event(RENDER_EVENT));
    // menyimpan data ke storage web
    saveData(); 
}

function addbukukesudahbaca (bukuid) {
    const bukuTarget = findbuku(bukuid);

    if (bukuTarget == null) return;

    bukuTarget.baca_buku= true;
    document.dispatchEvent(new Event(RENDER_EVENT))

    saveData();
}



function removebukusudahdibaca(bukuid) {
    alert('Apakah Anda Yakin akan Menghapus Data ini ?')
    const bukuTarget = findbukuIndex(bukuid);
    if (bukuTarget === -1) return;
    databuku.splice(bukuTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undobukusudahdibaca(bukuid) {
    const bukuTarget = findbuku(bukuid);   
    if (bukuTarget == null) return;
    bukuTarget.baca_buku= false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}


document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addbuku();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    alert('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
    const listbukubelumbaca = document.getElementById('buku');
    listbukubelumbaca.innerHTML = '';

    const listbukusudahbaca = document.getElementById('buku_dibaca');
    listbukusudahbaca.innerHTML = '';

    for (const bukuitem of databuku) {
        const bukuElement = makebuku(bukuitem);
        if (bukuitem.baca_buku) {
            listbukusudahbaca.append(bukuElement)
        }else{
            listbukubelumbaca.append(bukuElement);
        }
    }    
});








