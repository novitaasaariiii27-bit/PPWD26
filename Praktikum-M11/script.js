/* =====================================================
   Rosaria Florist - script.js
   Efek jQuery: slideDown/slideUp, fadeIn/fadeOut, animate
   Plus: navigasi tab, smooth scroll, jQuery Validation Plugin
   ===================================================== */

// Nonaktifkan animasi otomatis jika sistem pengguna meminta reduced motion
jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {

  // ----- Fungsi bantu: toast (Effect: fadeIn / delay / fadeOut) -----
  function tampilkanToast(pesan, tipe) {
    $('#toast')
      .stop(true, true)
      .removeClass('success error')
      .addClass(tipe)
      .text(pesan)
      .fadeIn(250)
      .delay(2500)
      .fadeOut(400);
  }

  // ----- Fungsi bantu: scroll halus ke sebuah bagian (Effect: animate) -----
  function scrollKe(selector) {
    const $tujuan = $(selector);
    if ($tujuan.length === 0) return;
    $('html, body').stop(true).animate({ scrollTop: $tujuan.offset().top - 80 }, 500);
  }

  // ----- 1. DROPDOWN NAVBAR (Event: mouseenter/mouseleave/click, Effect: slideDown/slideUp) -----
  const layarSentuh = window.matchMedia('(hover: none)').matches;

  $('.dropdown')
    .on('mouseenter', function () {
      if (layarSentuh) return;
      $(this).find('.dropdown-menu').stop(true, true).slideDown(200);
    })
    .on('mouseleave', function () {
      if (layarSentuh) return;
      $(this).find('.dropdown-menu').stop(true, true).slideUp(200);
    });

  // Di layar sentuh (tidak ada hover), dropdown dibuka dengan klik
  $('.dropdown-btn').on('click', function () {
    if (!layarSentuh) return;
    $(this).siblings('.dropdown-menu').stop(true, true).slideToggle(200);
  });

  // ----- 2. HERO SLIDER (Event: click + timer, Effect: fadeIn/fadeOut) -----
  const $slides = $('.hero-slide');
  const $dots = $('.dot');
  let slideAktif = 0;
  let timerSlide = null;

  function tampilkanSlide(ke) {
    if (ke === slideAktif) return;
    $slides.stop(true, true);
    $slides.eq(slideAktif).fadeOut(300, function () {
      $slides.eq(ke).fadeIn(400);
    });
    $dots.removeClass('aktif').eq(ke).addClass('aktif');
    slideAktif = ke;
  }

  function mulaiOtomatis() {
    hentikanOtomatis();
    timerSlide = setInterval(function () {
      tampilkanSlide((slideAktif + 1) % $slides.length);
    }, 5000);
  }
  function hentikanOtomatis() {
    if (timerSlide) clearInterval(timerSlide);
    timerSlide = null;
  }

  $dots.on('click', function () {
    tampilkanSlide($(this).data('ke'));
    mulaiOtomatis();
  });
  $('.hero').on('mouseenter', hentikanOtomatis).on('mouseleave', mulaiOtomatis);
  mulaiOtomatis();

  // ----- 3. NAVIGASI TAB KATALOG (Event: click, Effect: fadeIn) -----
  $('.tab-panel').hide().first().show();

  function aktifkanTab(target) {
    const $tab = $('.tab[data-target="' + target + '"]');
    if ($tab.length === 0 || $tab.hasClass('aktif')) return;
    $('.tab').removeClass('aktif');
    $tab.addClass('aktif');
    $('.tab-panel').stop(true, true).hide();
    $(target).fadeIn(300);
  }

  $('.tab').on('click', function () {
    aktifkanTab($(this).data('target'));
  });

  // ----- 4. KARTU PRODUK MELAYANG (Event: mouseenter/mouseleave, Effect: animate) -----
  $('.produk')
    .on('mouseenter', function () {
      $(this).stop(true).animate({ top: '-8px' }, 150);
    })
    .on('mouseleave', function () {
      $(this).stop(true).animate({ top: '0px' }, 150);
    });

  // ----- 5. FAVORIT & KERANJANG (Event: click, Effect: animate + toast) -----
  $('.fav').on('click', function () {
    const $btn = $(this);
    $btn.toggleClass('aktif');
    const suka = $btn.hasClass('aktif');
    $btn.text(suka ? '♥' : '♡');
    tampilkanToast(suka ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit', 'success');
  });

  let jumlahKeranjang = 0;
  $('.btn-keranjang').on('click', function () {
    jumlahKeranjang++;
    $('#jumlahKeranjang').text(jumlahKeranjang);
    $('#btnKeranjang')
      .stop(true, true)
      .animate({ top: '-5px' }, 100)
      .animate({ top: '0px' }, 100);
    tampilkanToast($(this).data('nama') + ' masuk ke keranjang', 'success');
  });

  $('#btnKeranjang').on('click', function () {
    if (jumlahKeranjang === 0) {
      tampilkanToast('Keranjang masih kosong', 'error');
      return;
    }
    tampilkanToast('Isi form pemesanan untuk melanjutkan', 'success');
    scrollKe('#pesan');
  });

  // ----- 6. TOMBOL BACK TO TOP (Event: scroll, Effect: fadeIn/fadeOut & animate) -----
  const $btnTop = $('#backToTop');
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      $btnTop.fadeIn(200);
    } else {
      $btnTop.fadeOut(200);
    }
  });
  $btnTop.on('click', function () {
    $('html, body').stop(true).animate({ scrollTop: 0 }, 500);
  });

  // ----- 7. SMOOTH SCROLL UNTUK LINK INTERNAL (Effect: animate) -----
  $('a[href^="#"]').on('click', function (e) {
    const href = $(this).attr('href');
    e.preventDefault();
    if (href.length < 2 || $(href).length === 0) return;

    const tabTujuan = $(this).data('tab');
    if (tabTujuan) aktifkanTab(tabTujuan);

    $(this).closest('.dropdown-menu').stop(true, true).slideUp(150);
    scrollKe(href);
  });

  // ----- 8. VALIDASI FORM PEMESANAN (jQuery Validation Plugin + Custom Method) -----
  const sekarang = new Date();
  const hariIni = sekarang.getFullYear() + '-' +
    String(sekarang.getMonth() + 1).padStart(2, '0') + '-' +
    String(sekarang.getDate()).padStart(2, '0');
  $('#tanggal').attr('min', hariIni);

  const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
    'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  function formatTanggal(iso) {
    const bagian = iso.split('-');
    return parseInt(bagian[2], 10) + ' ' + namaBulan[parseInt(bagian[1], 10) - 1] + ' ' + bagian[0];
  }

  $.validator.addMethod('nomorHp', function (value, element) {
    return this.optional(element) || /^[0-9]{10,13}$/.test(value);
  }, 'Nomor HP harus 10-13 digit angka');

  $.validator.addMethod('tanggalValid', function (value, element) {
    return this.optional(element) || value >= hariIni;
  }, 'Tanggal pengiriman tidak boleh sebelum hari ini');

  const validator = $('#formPesan').validate({
    rules: {
      nama:    { required: true, minlength: 3 },
      email:   { required: true, email: true },
      hp:      { required: true, nomorHp: true },
      jenis:   { required: true },
      tanggal: { required: true, tanggalValid: true },
      jumlah:  { required: true, digits: true, min: 1, max: 20 },
      alamat:  { required: true, minlength: 10 },
      kartu:   { maxlength: 120 },
      setuju:  { required: true }
    },
    messages: {
      nama:    { required: 'Nama wajib diisi', minlength: 'Nama minimal 3 karakter' },
      email:   { required: 'Email wajib diisi', email: 'Format email tidak valid' },
      hp:      { required: 'Nomor HP wajib diisi' },
      jenis:   { required: 'Silakan pilih buket' },
      tanggal: { required: 'Tanggal pengiriman wajib diisi' },
      jumlah:  { required: 'Jumlah wajib diisi', digits: 'Jumlah harus berupa angka', min: 'Jumlah minimal 1', max: 'Jumlah maksimal 20' },
      alamat:  { required: 'Alamat wajib diisi', minlength: 'Alamat minimal 10 karakter' },
      kartu:   { maxlength: 'Pesan kartu maksimal 120 karakter' },
      setuju:  { required: 'Anda harus menyetujui terlebih dahulu' }
    },
    errorElement: 'div',
    errorClass: 'pesan-error',
    errorPlacement: function (error, element) {
      if (element.attr('type') === 'checkbox') {
        error.insertAfter(element.closest('label'));
      } else {
        error.insertAfter(element);
      }
    },
    highlight: function (el) {
      $(el).addClass('is-error').removeClass('is-valid');
    },
    unhighlight: function (el) {
      $(el).removeClass('is-error').addClass('is-valid');
    },
    submitHandler: function (form) {
      const nama = $('#nama').val().trim();
      const jenis = $('#jenis').val();
      const jumlah = $('#jumlah').val().trim();
      const tanggal = $('#tanggal').val();

      // .text() dipakai (bukan .html()) karena data berasal dari pengguna
      $('#suksesNama').text(nama);
      $('#suksesDetail').text(jumlah + ' x ' + jenis + ' akan dikirim pada ' + formatTanggal(tanggal) + '.');

      tampilkanToast('Terima kasih, ' + nama + '! Pesanan berhasil dikirim.', 'success');
      $('#sukses').stop(true, true).slideDown(300).delay(6000).slideUp(300);

      form.reset();
      validator.resetForm();
      $('#formPesan input, #formPesan select, #formPesan textarea').removeClass('is-error is-valid');
    }
  });

  // ----- 9. VALIDASI FORM NEWSLETTER KECIL -----
  const validatorPromo = $('#formPromo').validate({
    rules: { emailPromo: { required: true, email: true } },
    messages: { emailPromo: { required: 'Email wajib diisi', email: 'Format email tidak valid' } },
    errorElement: 'div',
    errorClass: 'pesan-error',
    errorPlacement: function (error, element) {
      error.insertAfter(element.closest('.promo-input'));
    },
    highlight: function (el) { $(el).addClass('is-error').removeClass('is-valid'); },
    unhighlight: function (el) { $(el).removeClass('is-error').addClass('is-valid'); },
    submitHandler: function (form) {
      tampilkanToast('Kode promo FIRST10 dikirim ke email Anda!', 'success');
      form.reset();
      validatorPromo.resetForm();
      $(form).find('input').removeClass('is-error is-valid');
    }
  });

});