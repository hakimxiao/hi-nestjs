## |##| static Route dan dynamic pada nest.js : * SELALU LETAKKAN STATIC ROUTE DI ATAS DYNAMIC AGAR TIDAK MEMAKAN ROUTE STATIC

- @Get('all') // GET /user/all
- @Get(':id) // GET /user/:id - dynamic segment
- @Post() // POST /user
- @Put(':id') // PUT /user/:id
- @Delete(':id') // DELETE /user/:id

## Query = https://www.cariaja.com/buku?tahun=2020

- Jika ingin membuat query pada kolom pencarian maka kita menggunakan Query() yang di panggil pada parameter function METHOD
- Untuk deklarasinya pertama kita deklarasikan key dengan string didalam parameter Query kemudian memberikan type dari Query tersebut sesuai key untuk typesafe

## Param (Adalah metode untuk mengambil value dari sebuah dynamic route)

- Sama seperti query dia di gunakan didalam parameter function dari Method dan memberikan type berdasarkan key yang ada beda nya dia menggunakan @Params

## Body dan Type DTO

- Untuk mengirimkan body pada saat http request kita menggunakan @Body tetapi di tahap key value object yang kita kirim kita menggunakan DTO, DTO sama seperti interface beda nya DTO adalah class kenapa mengguakan class karena DTO akan tetap disimpan sampai tahap akhir sedangkan interface di hapus.
- Untuk membuat dto kita membuat folder baru di dalam model User, kemudian mendeklarasikan jenis DTO, ingat ini berkaitan dengan body contoh nya create user dan update user dengan menggunakan update-user.dto.ts. DST
