// Function untuk menampilkan data barang
getData();
async function getData() {
  const response = await fetch('/read-barang ');
  const json = await response.json();
  console.log(json);
  showData(json);
}

const btnSave = document.getElementById('btn_save');
btnSave.addEventListener('click', async event => {
  const action = btnSave.textContent;
  const kdBarang = document.getElementById('kdBarang').value;
  const namaBarang = document.getElementById('namaBarang').value;
  const qty = document.getElementById('qty').value;
  const price = document.getElementById('price').value;

  let data = {
    kdBarang: kdBarang,
    namaBarang: namaBarang,
    qty: qty,
    price: price,
    action: action
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const response = await fetch('/api-barang', options);
  const json = await response.json();
  console.log(json);

  getData();
  $('#exampleModal').modal('hide');

  if (action === 'Simpan') {
    $.alert('Data berhasil ditambah!');
  } else {
    $.alert('Data berhasil diubah!');
  }
});

// Function untuk menampilkan data di tabel
function showData(json) {
  let tr = '';
  $('#databody').html('');
  let no;
  for (let i = 0; i < json.length; i++) {
    no = i + 1;
    tr = $('<tr/>');
    tr.append("<td>" + no + "</td>");
    tr.append("<td>" + json[i].kdBarang + "</td>");
    tr.append("<td>" + json[i].namaBarang + "</td>");
    tr.append("<td>" + json[i].qty + "</td>");
    tr.append("<td>" + json[i].price + "</td>");
    tr.append("<td>" + json[i].dtCreate + "</td>");
    tr.append("<td>" + json[i].dtChange + "</td>");
    tr.append(`
      <td>
        <button type="button" class="badge badge-primary badge-pill btnEdit" data-kdbarang="`+ json[i].kdBarang +`">
          Edit
        </button>
        <button type="button" class="badge badge-danger badge-pill btnHapus" data-kdbarang="`+ json[i].kdBarang +`">
          Hapus
        </button>
      </td>`
    );
    $('#databody').append(tr);
  }

  // Event Listener untuk tambah dan edit data
  $('.btnTambahData').on('click', function() {
    document.getElementById('kdBarang').readOnly = false;
    document.getElementById('kdBarang').value = '';
    document.getElementById('namaBarang').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('price').value = '';

    $('#exampleModalLabel').html('Tambah Data Barang');
    $('.modal-footer button[id=btn_save]').html('Simpan');
  });

  // Event Listener untuk edit data
  $('.btnEdit').on('click', async function() {
    let kdBarang = $(this).data('kdbarang');
    console.log(kdBarang);

    const url = `/read-barangbyno/${kdBarang}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json[0].kdBarang);

    document.getElementById('kdBarang').readOnly = true;
    document.getElementById('kdBarang').value = json[0].kdBarang;
    document.getElementById('namaBarang').value = json[0].namaBarang;
    document.getElementById('qty').value = json[0].qty;
    document.getElementById('price').value = json[0].price;

    $('#exampleModalLabel').html('Ubah Data Barang');
    $('.modal-footer button[id=btn_save]').html('Ubah Data');
    $('#exampleModal').modal('show');
  });

  // Event Listener untuk hapus data
  $('.btnHapus').on('click', async function() {
    let kdBarang = $(this).data('kdbarang');
    console.log(`Kode Barang yang akan dihapus: ${kdBarang}`);

    $.confirm({
      title: 'Hapus Data Barang',
      content: 'Apakah Anda Yakin...???',
      buttons: {
        ya: {
          text: 'YA',
          btnClass: 'btn-blue',
          action: async function() {
            const url = `/hapus-barang/${kdBarang}`;
            const response = await fetch(url);
            const json = await response.json();
            $.alert(json.message);
            getData();
          }
        },
        tidak: function() {}
      }
    });
  });
}