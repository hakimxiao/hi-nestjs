## |##| static Route dan dynamic pada nest.js : * SELALU LETAKKAN STATIC ROUTE DI ATAS DYNAMIC AGAR TIDAK MEMAKAN ROUTE STATIC

- @Get('all') // GET /user/all
- @Get(':id) // GET /user/:id - dynamic segment
- @Post() // POST /user
- @Put(':id') // PUT /user/:id
- @Delete(':id') // DELETE /user/:id

## Query = https://www.cariaja.com/buku?tahun=2020

- Jika ingin membuat query pada kolom pencarian maka kita menggunakan Query() yang di panggil pada parameter function METHOD
- Untuk deklarasinya pertama kita deklarasikan key dengan string didalam parameter Query kemudian memberikan type dari Query tersebut sesuai key untuk typesafe
