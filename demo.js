function timer() {
   count++;
   if (count < 10) {
      if (record == 2) {
         console.log('lorem ipsum');
         record++;
      }
   }
   else if (count == 10) {
      console.log('merhaba ')
      clearInterval(id);
      count = 0;
      record = 0;

   }

}

var count = 0;
var record = 2;
var id = setInterval(() => {
   timer();
}, 1000);