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

# Exception Handling dengan NotFoundException

## Apa yang Dipelajari

Pada materi ini saya mempelajari cara menangani kondisi data tidak ditemukan menggunakan **Exception Handling** yang disediakan oleh NestJS.

Sebelumnya, method `findUserById()` mengembalikan nilai `null` ketika user tidak ditemukan. Pendekatan tersebut mengharuskan controller melakukan pengecekan tambahan untuk menentukan response yang akan dikirim ke client.

Setelah mempelajari Exception Handling, saya mengganti pendekatan tersebut dengan melempar `NotFoundException` sehingga NestJS dapat secara otomatis menghasilkan HTTP Response yang sesuai.

---

## Perubahan yang Dilakukan

### UserService

- Menambahkan `NotFoundException` dari `@nestjs/common`.
- Menghapus logging yang tidak diperlukan pada `findUserById()`.
- Mengubah mekanisme pengembalian data dari `null` menjadi exception.
- Memindahkan tanggung jawab error handling ke service layer.

### Dokumentasi

- Menambahkan pembahasan mengenai Exception Handling pada `Docs.md`.
- Mendokumentasikan penggunaan built-in exception yang tersedia di NestJS.
- Menjelaskan keuntungan penggunaan exception dibandingkan penanganan manual.

---

## Sebelum

Ketika user tidak ditemukan, service hanya mengembalikan `null`.

```ts
findUserById(id: number) {
  const user = this.users.find((user) => user.id === id);

  return user ?? null;
}
```

Controller kemudian harus melakukan pengecekan tambahan.

```ts
const user = this.userService.findUserById(id);

if (!user) {
  return {
    message: 'User not found',
  };
}
```

Pendekatan ini menyebabkan logika validasi tersebar di beberapa layer.

---

## Sesudah

Validasi keberadaan user dilakukan langsung di service.

```ts
findUserById(id: number) {
  const user = this.users.find((user) => user.id === id);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}
```

Controller cukup memanggil service tanpa perlu melakukan pengecekan tambahan.

```ts
return this.userService.findUserById(id);
```

---

## Mengenal NotFoundException

`NotFoundException` merupakan built-in exception yang disediakan oleh NestJS untuk merepresentasikan kondisi ketika resource yang diminta tidak ditemukan.

Contoh penggunaan:

```ts
throw new NotFoundException('User not found');
```

NestJS akan secara otomatis menghasilkan response:

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

Tanpa perlu menuliskan:

```ts
res.status(404).json(...)
```

secara manual.

---

## Built-in Exception yang Disediakan NestJS

Beberapa exception yang sering digunakan:

| Exception                    | HTTP Status |
| ---------------------------- | ----------- |
| BadRequestException          | 400         |
| UnauthorizedException        | 401         |
| ForbiddenException           | 403         |
| NotFoundException            | 404         |
| ConflictException            | 409         |
| InternalServerErrorException | 500         |

Seluruh exception tersebut berasal dari:

```ts
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
```

---

## Konsep Penting

### 1. Exception Handling

Exception digunakan untuk menghentikan proses ketika terjadi kondisi yang tidak valid dan mengirimkan informasi error yang sesuai.

Dengan exception, alur aplikasi menjadi lebih jelas karena kondisi gagal dipisahkan dari kondisi berhasil.

### 2. Service-Level Validation

Aturan bisnis bahwa "user harus ada" merupakan bagian dari business logic.

Karena itu validasi tersebut lebih tepat ditempatkan pada service dibandingkan controller.

### 3. Separation of Concerns

Sebelum:

```text
Controller
 ├── Routing
 ├── Business Logic
 └── Error Handling
```

Sesudah:

```text
Controller
 └── Routing

UserService
 ├── Business Logic
 └── Error Handling
```

Tanggung jawab setiap layer menjadi lebih terpisah dan mudah dipelihara.

### 4. Automatic HTTP Response

NestJS memiliki Exception Filter bawaan yang akan menangkap exception dan mengubahnya menjadi HTTP Response yang sesuai.

Alurnya:

```text
Request
   ↓
Controller
   ↓
UserService
   ↓
NotFoundException
   ↓
NestJS Exception Filter
   ↓
HTTP 404 Response
```

---

## Catatan Teknis

Masih terdapat potensi bug apabila pencarian data menggunakan `filter()`.

Method `filter()` selalu mengembalikan array, termasuk array kosong.

Contoh:

```ts
const user = users.filter((user) => user.id === id);
```

Pengecekan berikut tidak akan bekerja sebagaimana mestinya:

```ts
if (!user)
```

karena array kosong tetap dianggap truthy.

Solusi yang lebih tepat:

```ts
const user = users.find((user) => user.id === id);
```

atau

```ts
if (user.length === 0)
```

apabila memang menggunakan `filter()`.

---

## Dampak Perubahan

- Response API menjadi lebih konsisten.
- User yang tidak ditemukan otomatis menghasilkan HTTP 404.
- Controller menjadi lebih sederhana.
- Mengurangi kebutuhan pengecekan `null` di berbagai tempat.
- Mengikuti best practice NestJS dalam menangani error.
- Mempermudah pengembangan fitur error handling yang lebih kompleks di masa depan.

---

## Kesimpulan

Materi ini memperkenalkan penggunaan Exception Handling pada NestJS melalui `NotFoundException`. Dengan melempar exception langsung dari service layer, aplikasi menjadi lebih bersih, lebih konsisten, dan lebih sesuai dengan prinsip Separation of Concerns. Selain itu, NestJS dapat secara otomatis menghasilkan HTTP Response yang tepat tanpa perlu penanganan manual di controller.
