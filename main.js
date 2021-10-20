
$(document).ready(function () {

   //input aktifse
   $('.form-giris').focusin(function () {

      let $check = $(this).next().hasClass('click-tooltip');
      if (!$check) {
         $('.my-tooltip').removeClass('click-tooltip');
         $('.form-giris').css({ 'background-color': '#ee4c52 ', 'border': '2px solid #ebebeb' })
         $(this).next().addClass('click-tooltip');
         $(this).css({ 'background-color': '#d1242a', 'border': '2px solid #95080e' });
      }
   })

   //input aktif değilse
   $('.form-giris').focusout(function () {
      $('.my-tooltip').removeClass('click-tooltip');
      $('.form-giris').css({ 'background-color': '#ee4c52 ', 'border': '2px solid #ebebeb' })
   })

   //boşluk karakteri var mı

   $.validator.addMethod('noSpace', function (value, element) {
      return value == '' || value.trim().length != 0
   }, "Boşluk karakterine izin verilmiyor!");

   //şifreyi kontrol etme
   $.validator.addMethod("passCheck", function (value) {
      return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // büyük/küçük harf, sayi,özel karakter
         && /[a-z]/.test(value) // küçük harf içeriyor mu
         && /[A-Z]/.test(value) // büyük harf içeriyor mu
         && /\d/.test(value) // sayi içeriyor mu
         && /[\-@._*]/.test(value)//özel karakter içeriyor mu
   });
   //şifreyi gösterme
   $('#showPass').on('click', function () {
      var password = $("#pass");
      if (password.attr('type') === 'password') {
         password.attr('type', 'text');
      } else {
         password.attr('type', 'password');
      }
   })


   //email formatını kontrol etme
   $.validator.addMethod('isEmail', function (email) {
      var $regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,3})+$/;
      return $regex.test(String(email).toLowerCase());
   })

   //email edu uzantılı mı?   
   var receivedEmail;
   $("#email").keyup(function () {
      receivedEmail = $(this).val();

   });
   var receivedUsername;
   $("#username").keyup(function () {
      receivedUsername = $(this).val();

   });
   var receivedStatus = "Kullanıcı";
   $('#email').focusout(function (e) {
      let check = isEdu(receivedEmail);

      if (check) {
         $.confirm({
            title: false,
            content: 'Öğrenci misiniz?',
            buttons: {
               yes: {
                  keys: ['y'],
                  action: function () {
                     $.alert('Durumu: Ögrenci');
                     receivedStatus = 'Öğrenci';
                  },
               },
               no: {
                  keys: ['N'],
                  action: function () {
                     $.alert('Durumu: Öğretim Görevlisi');
                     receivedStatus = "Öğretim Görevlisi"
                  },

               },
            }
         });
      }
   })

   //edu.tr ile bitiyorsa
   function isEdu(value) {
      let $regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+(edu)+\.+(tr)+$/;
      return $regex.test(String(value).toLowerCase());
   }



   var rowIdx = 0;
   let $form = $('#form');
   var record = 0;

   if ($form.length) {
      $form.validate({
         submitHandler: function (form, e) {
            e.preventDefault();
            record++;
            var existingEntries = JSON.parse(localStorage.getItem("allEntries"));
            if (existingEntries == null) existingEntries = [];
            var entry = {
               isim: receivedUsername,
               durum: receivedStatus,
               email: receivedEmail
            };
            localStorage.setItem("entry", JSON.stringify(entry));
            existingEntries.push(entry);
            localStorage.setItem("allEntries", JSON.stringify(existingEntries));
            var allEntries = JSON.parse(localStorage.getItem("allEntries"));

            allEntries.forEach(element => {
               $('#tbody').append(`
               <tr id="R${++rowIdx}">
                  <td class="row-index text-center"><p>${element.isim}</p></td>
                  <td class="row-index text-center"><p>${element.durum}</p></td>
                  <td class="row-index text-center"><p>${element.email}</p></td>
               </tr>`);
            });

            $('#form').trigger('reset');

            function timer() {
               count++;
               if (count <= 10) {
                  if (record == 2) {
                     $('.form-giris').attr("disabled", "true");
                     $('#submit').attr("disabled", "true");
                     alert('10 saniye sonra tekrar deneyiniz')
                     record++;
                  }
               }
               //20 saniye sonra form elemanları aktif olucak
               else if (count == 20) {
                  $('.form-giris').removeAttr('disabled');
                  $('#submit').removeAttr('disabled');
                  clearInterval(id);
                  count = 0;
                  record = 0;
               }

            }

            var count = 0;
            var id = setInterval(() => {
               timer();
            }, 1000);


         },

         rules: {
            username: {
               required: true,
               noSpace: true
            },
            email: {
               required: true,
               isEmail: true,
               noSpace: true
            },
            pass: {
               required: true,
               noSpace: true,
               minlength: 8,
               passCheck: true
            },
            passAgain: {
               required: true,
               noSpace: true,
               minlength: 8,
               passCheck: true,
               equalTo: "#pass"
            }

         },

         messages: {
            username: {
               required: 'Lütfen Adınızı ve Soyadınızı yazınız!'
            },
            email: {
               required: 'Lütfen E-Postanızı yazınız!',
               isEmail: 'Lütfen E-Posta adresinizi kontrol edinizi!'
            },
            pass: {
               required: 'Lütfen şifrenizi giriniz',
               minlength: 'Lütfen 8 haneli olarak giriniz',
               passCheck: 'Lütfen en az 8 karakterli bir şifre oluşturunuz. Bir büyük, bir küçük ve bir özel karakter(- @ . _ *) içermeli '
            },
            passAgain: {
               required: 'Lütfen şifrenizi tekrar giriniz',
               minlength: 'Lütfen 8 haneli olarak giriniz',
               passCheck: 'Lütfen en az 8 karakterli bir şifre oluşturunuz. Bir büyük, bir küçük ve bir özel karakter(- @ . _ *) içermeli ',
               equalTo: "Girilen şifre yukardaki şifre ile eşleşmiyor"
            }

         }
      })
   }


})