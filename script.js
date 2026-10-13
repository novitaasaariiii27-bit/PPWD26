/* ============================================================
      TOKO MINI - JQUERY SCRIPT
      Praktikum Pemrograman Web Dasar
      ============================================================ */
$(document).ready(function () {

    /* ========================================================
          1. DATA PRODUK
          ======================================================== */
    const produkData = [
        { id: 1,  nama: 'Buku Tulis',      harga: 12000,  kategori: 'alat-tulis',  icon: '📓', desc: 'Buku tulis 58 lembar',           badge: 'Best Seller', badgeType: 'hot' },
        { id: 2,  nama: 'Pulpen Gel',      harga: 8000,   kategori: 'alat-tulis',  icon: '🖊️', desc: 'Tinta gel halus 0,5 mm',         badge: 'Favorit',     badgeType: '' },
        { id: 3,  nama: 'Pensil 2B',       harga: 5000,   kategori: 'alat-tulis',  icon: '✏️', desc: 'Pensil untuk menulis dan sketsa', badge: '',            badgeType: '' },
        { id: 4,  nama: 'Penggaris 30 cm', harga: 6000,   kategori: 'alat-tulis',  icon: '📏', desc: 'Penggaris plastik bening',       badge: 'Baru',        badgeType: '' },
        { id: 5,  nama: 'Tas Ransel',      harga: 150000, kategori: 'aksesoris',   icon: '🎒', desc: 'Ransel kapasitas 20 liter',      badge: 'Best Seller', badgeType: 'hot' },
        { id: 6,  nama: 'Tas Selempang',   harga: 85000,  kategori: 'aksesoris',   icon: '👜', desc: 'Selempang ringan anti air',      badge: 'Favorit',     badgeType: '' },
        { id: 7,  nama: 'Dompet Lipat',    harga: 35000,  kategori: 'aksesoris',   icon: '👛', desc: 'Dompet kecil muat banyak kartu', badge: '',            badgeType: '' },
        { id: 8,  nama: 'Botol Minum',     harga: 45000,  kategori: 'aksesoris',   icon: '🧴', desc: 'Botol 600 ml bebas BPA',         badge: 'Baru',        badgeType: '' },
        { id: 9,  nama: 'Mouse Wireless',  harga: 75000,  kategori: 'elektronik',  icon: '🖱️', desc: 'Mouse nirkabel hemat baterai',   badge: '',            badgeType: '' },
        { id: 10, nama: 'Headset',         harga: 120000, kategori: 'elektronik',  icon: '🎧', desc: 'Headset dengan mikrofon jernih', badge: 'Best Seller', badgeType: 'hot' },
        { id: 11, nama: 'Power Bank',      harga: 110000, kategori: 'elektronik',  icon: '🔋', desc: 'Power bank 10.000 mAh',          badge: 'Favorit',     badgeType: '' },
        { id: 12, nama: 'Flashdisk 32 GB', harga: 65000,  kategori: 'elektronik',  icon: '💾', desc: 'Penyimpanan data ringkas',       badge: 'Baru',        badgeType: '' }
    ];

    /* ========================================================
          2. STATE (Variabel Global)
          ======================================================== */
    let cart = [];              // Array keranjang belanja
    let currentFilter = 'all';  // Filter kategori aktif
    let searchKeyword = '';     // Kata kunci pencarian

    const rp = n => 'Rp ' + n.toLocaleString('id-ID');
    const hitungQty = () => cart.reduce((sum, item) => sum + item.qty, 0);
    // Total akhir (sudah termasuk diskon 10% jika > Rp 100.000)
    const hitungTotal = () => {
        const t = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        return t > 100000 ? t * 0.9 : t;
    };

    /* ========================================================
          3. FUNGSI RENDER PRODUK
          ======================================================== */
    function renderProduk() {
        const $grid = $('#produkGrid');
        $grid.empty();

        const filtered = produkData.filter(function (p) {
            const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
            const kw = searchKeyword.toLowerCase();
            const matchSearch = p.nama.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw);
            return matchKategori && matchSearch;
        });

        if (filtered.length === 0) {
            $grid.html(`
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #bbb;">
                    <i class="fas fa-search" style="font-size: 3.5rem; color: #ffe4ec; margin-bottom: 20px; display: block;"></i>
                    <h3 style="color: #999; font-weight: 600; margin-bottom: 8px;">Produk tidak ditemukan</h3>
                    <p style="font-size: 0.9rem;">Coba kata kunci atau kategori lain</p>
                </div>`);
            return;
        }

        filtered.forEach(function (p) {
            const badgeHtml = p.badge ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>` : '';
            $grid.append(`
                <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
                    ${badgeHtml}
                    <div class="produk-img">${p.icon}</div>
                    <div class="produk-info">
                        <h3>${p.nama}</h3>
                        <p class="desc">${p.desc}</p>
                        <div class="produk-footer">
                            <div class="produk-price">${rp(p.harga)}<small>per pcs</small></div>
                            <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>`);
        });
    }

    /* ========================================================
          4 & 5. EVENT: FILTER KATEGORI (Navbar & Tombol)
          ======================================================== */
    $('.nav-link').click(function () {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('filter');
        $('.filter-btn').removeClass('active');
        $(`.filter-btn[data-cat="${currentFilter}"]`).addClass('active');
        renderProduk();
    });

    $('.filter-btn').click(function () {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('cat');
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-filter="${currentFilter}"]`).addClass('active');
        renderProduk();
    });

    /* ========================================================
          6. EVENT: PENCARIAN REAL-TIME
          ======================================================== */
    $('#searchProduk').on('input', function () {
        searchKeyword = $(this).val();
        renderProduk();
    });

    /* ========================================================
          7. EVENT: TAMBAH KE KERANJANG
          ======================================================== */
    $(document).on('click', '.btn-add-cart', function (e) {
        e.stopPropagation();
        const id = $(this).data('id');
        const produk = produkData.find(p => p.id === id);
        if (!produk) return;

        const existing = cart.find(item => item.id === id);
        if (existing) { existing.qty += 1; }
        else { cart.push({ id: produk.id, nama: produk.nama, harga: produk.harga, icon: produk.icon, qty: 1 }); }

        updateCartUI();
        showToast(`${produk.icon} ${produk.nama} ditambahkan!`);

        $(this).css('transform', 'rotate(90deg) scale(1.3)');
        setTimeout(() => $(this).css('transform', ''), 300);
        $('#cartBadge').css('transform', 'scale(1.4)');
        setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
    });

    /* ========================================================
          8. FUNGSI UPDATE UI KERANJANG (+ LATIHAN 1: DISKON)
          ======================================================== */
    function updateCartUI() {
        const $cartItems = $('#cartItems');
        $('#cartBadge').text(hitungQty());

        // LATIHAN 1: Diskon 10% jika total > Rp 100.000
        let totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
        $('#cartTotal').text(rp(totalHarga));
        if (totalHarga > 100000) {
            const diskon = totalHarga * 0.1;
            totalHarga -= diskon;
            $('#cartTotal').html(`
                <small>${rp(totalHarga + diskon)}</small>
                ${rp(totalHarga)}<span class="diskon-badge">Hemat ${rp(diskon)}</span>
            `);
        }

        if (cart.length === 0) {
            $cartItems.html(`
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Keranjang masih kosong</p>
                    <small>Yuk pilih produk dulu!</small>
                </div>`);
            return;
        }

        let html = '';
        cart.forEach(function (item) {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-icon">${item.icon}</div>
                    <div class="cart-item-info">
                        <h5>${item.nama}</h5>
                        <div class="price">${rp(item.harga * item.qty)}</div>
                        <div class="qty-control">
                            <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>`;
        });
        $cartItems.html(html);
    }

    /* ========================================================
          9. EVENT: KONTROL QTY (Plus/Minus)
          ======================================================== */
    $(document).on('click', '.qty-btn', function () {
        const action = $(this).data('action');
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (!item) return;
        if (action === 'plus') { item.qty += 1; }
        else if (action === 'minus') {
            item.qty -= 1;
            if (item.qty <= 0) { cart = cart.filter(i => i.id !== id); }
        }
        updateCartUI();
    });

    /* ========================================================
          10. EVENT: HAPUS ITEM DARI KERANJANG
          ======================================================== */
    $(document).on('click', '.cart-item-remove', function () {
        const id = $(this).data('id');
        const item = cart.find(i => i.id === id);
        if (item) { showToast(`${item.icon} ${item.nama} dihapus dari keranjang`); }
        cart = cart.filter(i => i.id !== id);
        updateCartUI();
    });

    /* ========================================================
          11. EVENT: BUKA/TUTUP KERANJANG
          ======================================================== */
    $('#cartBtn').click(function () {
        $('#cartSidebar').addClass('open');
        $('#cartOverlay').fadeIn(300);
    });
    $('#cartClose, #cartOverlay').click(function () {
        $('#cartSidebar').removeClass('open');
        $('#cartOverlay').fadeOut(300);
    });

    /* ========================================================
          LATIHAN 2: RIWAYAT DI LOCALSTORAGE
          ======================================================== */
    function simpanRiwayat(total, qty) {
        const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
        riwayat.push({ tanggal: new Date().toISOString(), total, qty });
        localStorage.setItem('riwayat', JSON.stringify(riwayat));
    }
    function tampilRiwayat() {
        const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
        const $ul = $('#riwayatList').empty();
        if (riwayat.length === 0) { $ul.html('<li>Belum ada transaksi.</li>'); return; }
        riwayat.slice().reverse().forEach(function (r) {
            const tgl = new Date(r.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
            $ul.append(`<li>${tgl}<br>${r.qty} item · <strong>${rp(r.total)}</strong></li>`);
        });
    }
    $('#btnRiwayat').click(function () {
        tampilRiwayat();
        $('#riwayatList').slideToggle(250);
    });

    /* ========================================================
          12. EVENT: CHECKOUT + LATIHAN 3 (MODAL & VALIDASI)
          ======================================================== */
    $('#btnCheckout').click(function () {
        if (cart.length === 0) { showToast('❌ Keranjang masih kosong!'); return; }
        $('#buyerForm')[0].reset();
        $('#buyerForm .err').hide();
        $('#buyerForm input, #buyerForm textarea').removeClass('valid invalid');
        $('#checkoutModal').fadeIn(250);
        $('#bNama').focus();
    });

    const rules = [
        { el: '#bNama',   err: '#errNama',   ok: v => v.trim().length >= 3 },
        { el: '#bAlamat', err: '#errAlamat', ok: v => v.trim().length >= 10 },
        { el: '#bHp',     err: '#errHp',     ok: v => /^08\d{8,11}$/.test(v.trim()) }
    ];
    function cek(r) {
        const good = r.ok($(r.el).val());
        $(r.err).toggle(!good);
        $(r.el).toggleClass('invalid', !good).toggleClass('valid', good);
        return good;
    }
    $.each(rules, function (_, r) { $(r.el).on('input', function () { cek(r); }); });

    function tutupModal() { $('#checkoutModal').fadeOut(200); }
    $('#btnBatal').click(tutupModal);
    $(document).keydown(function (e) { if (e.key === 'Escape') tutupModal(); });

    $('#buyerForm').submit(function (e) {
        e.preventDefault();
        let valid = true;
        $.each(rules, function (_, r) { if (!cek(r)) valid = false; });
        if (!valid) return;

        const total = hitungTotal();
        const totalQty = hitungQty();
        const nama = $('#bNama').val().trim();

        // Animasi loading
        const $btn = $('#btnBayar');
        $btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);

        setTimeout(function () {
            $btn.html('<i class="fas fa-check-circle"></i> Bayar Sekarang').prop('disabled', false);
            simpanRiwayat(total, totalQty);   // Latihan 2
            cart = [];
            updateCartUI();
            tampilRiwayat();
            tutupModal();
            $('#cartSidebar').removeClass('open');
            $('#cartOverlay').fadeOut(300);
            showToast(`✅ Terima kasih, ${nama}! ${totalQty} item · ${rp(total)}`);
        }, 1500);
    });

    /* ========================================================
          13. FUNGSI TOAST NOTIFICATION
          ======================================================== */
    let toastTimer;
    function showToast(message) {
        clearTimeout(toastTimer);
        $('#toastMsg').text(message);
        $('#toast').addClass('show');
        toastTimer = setTimeout(function () { $('#toast').removeClass('show'); }, 2500);
    }

    /* ========================================================
          14. EVENT: HAMBURGER MENU (Mobile)
          ======================================================== */
    $('#hamburger').click(function () {
        $('#navMenu').toggleClass('show');
        const icon = $(this).find('i');
        if ($('#navMenu').hasClass('show')) { icon.removeClass('fa-bars').addClass('fa-times'); }
        else { icon.removeClass('fa-times').addClass('fa-bars'); }
    });
    $('.nav-link').click(function () {
        if (window.innerWidth <= 768) {
            $('#navMenu').removeClass('show');
            $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
        }
    });

    /* ========================================================
          15. INISIALISASI APLIKASI
          ======================================================== */
    renderProduk();
    updateCartUI();
    console.log('%c🛍️ Toko Mini - Siap!', 'color:#ff6b9d;font-size:16px;font-weight:bold;');
    console.log('%cTotal produk: ' + produkData.length, 'color:#2d1b3d;font-size:12px;');
});