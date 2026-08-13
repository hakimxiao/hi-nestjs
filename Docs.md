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

# Global Response Interceptor untuk Standardisasi Format API

## Apa yang Dipelajari

Pada materi ini saya mempelajari **Interceptor** di NestJS dan bagaimana menggunakannya untuk menstandarisasi format respons API secara global.

Sebelumnya setiap endpoint mengembalikan data secara langsung sesuai hasil dari controller atau service. Pendekatan tersebut dapat menyebabkan format respons berbeda-beda antar endpoint.

Dengan menggunakan **TransformInterceptor**, seluruh respons API dapat dibungkus ke dalam struktur yang seragam sehingga client memiliki kontrak respons yang konsisten.

---

## Perubahan yang Dilakukan

### TransformInterceptor

Membuat interceptor baru:

```bash id="d8oix6"
nest g interceptor utils/transform --flat
```

Interceptor ini bertugas mentransformasi seluruh respons yang keluar dari aplikasi.

File:

```text id="xk6gnr"
src/utils/transform.interceptor.ts
```

### Global Registration

Mendaftarkan interceptor secara global pada fase bootstrap aplikasi.

File:

```text id="26uxnm"
src/main.ts
```

Dengan pendekatan ini seluruh endpoint otomatis menggunakan interceptor tanpa perlu menambahkan dekorator pada setiap controller.

### Unit Test

Menambahkan unit test dasar untuk memastikan interceptor dapat dibuat dan digunakan dengan benar.

File:

```text id="2wknwm"
src/utils/transform.interceptor.spec.ts
```

### Dokumentasi

Menambahkan dokumentasi perintah CLI NestJS yang digunakan untuk menghasilkan interceptor.

File:

```text id="y4wg0u"
nest-command.sh
```

---

## Sebelum

Controller mengembalikan data secara langsung.

```ts id="6zzyou"
@Get()
findAll() {
  return this.userService.findAllUsers();
}
```

Response:

```json id="ukg4aj"
[
  {
    "id": 1,
    "name": "John"
  }
]
```

Atau endpoint lain mungkin mengembalikan:

```json id="pnwj47"
{
  "users": [...]
}
```

Tidak ada format standar yang mengikat seluruh API.

---

## Sesudah

Controller tetap mengembalikan data seperti biasa.

```ts id="ygk7c9"
@Get()
findAll() {
  return this.userService.findAllUsers();
}
```

Namun sebelum respons dikirim ke client, interceptor akan mentransformasinya menjadi:

```json id="n8g3cl"
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "John"
    }
  ]
}
```

Seluruh endpoint akan mengikuti format yang sama.

---

## Mengenal Interceptor

Interceptor adalah salah satu fitur utama NestJS yang digunakan untuk menangani **cross-cutting concerns**.

Cross-cutting concern adalah logika yang digunakan oleh banyak bagian aplikasi dan tidak termasuk business logic utama.

Contoh penggunaan interceptor:

- Transformasi response
- Logging
- Caching
- Timeout
- Monitoring
- Performance tracking
- Data serialization

Interceptor berada di antara request dan response.

Alur sederhananya:

```text id="pj1xj6"
Request
   ↓
Controller
   ↓
Service
   ↓
Interceptor
   ↓
Response
```

---

## Implementasi TransformInterceptor

Interceptor mengimplementasikan interface:

```ts id="kh2hzc"
NestInterceptor;
```

dan method utama:

```ts id="m31g5g"
intercept();
```

Contoh struktur dasar:

```ts id="m0bkhw"
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle();
  }
}
```

---

## Menggunakan RxJS Operator map()

NestJS menggunakan RxJS untuk memproses aliran data response.

Interceptor memanfaatkan operator:

```ts id="0k0cdz"
map();
```

untuk mengubah data sebelum dikirim ke client.

Contoh:

```ts id="1cgqjv"
return next.handle().pipe(
  map((data) => ({
    statusCode: response.statusCode,
    message: 'Success',
    data,
  })),
);
```

Konsep ini mirip seperti:

```js id="e3n8de"
array.map(...)
```

namun digunakan pada Observable.

---

## Mengenal ExecutionContext

Untuk mendapatkan informasi request atau response saat ini, interceptor menggunakan:

```ts id="hkupgi"
ExecutionContext;
```

Contoh:

```ts id="clj86q"
const response = context.switchToHttp().getResponse();
```

Melalui objek tersebut interceptor dapat mengakses:

- Status code HTTP
- Request object
- Response object
- Header
- Informasi konteks lainnya

Pada implementasi ini digunakan untuk mengambil:

```ts id="2pn5f4"
response.statusCode;
```

agar nilai status code selalu sesuai dengan respons aktual.

---

## Global Interceptor

NestJS memungkinkan interceptor diterapkan pada tiga level:

### 1. Method Level

```ts id="1z8tkx"
@UseInterceptors(TransformInterceptor)
```

Hanya berlaku pada satu endpoint.

### 2. Controller Level

```ts id="q5f06l"
@UseInterceptors(TransformInterceptor)
@Controller('users')
```

Berlaku untuk seluruh endpoint dalam controller.

### 3. Global Level

```ts id="4zsn56"
app.useGlobalInterceptors(new TransformInterceptor());
```

Berlaku untuk seluruh aplikasi.

Pada implementasi ini digunakan pendekatan global agar format respons selalu konsisten.

---

## Konsep Penting

### 1. API Response Contract

Client dan server harus memiliki kontrak yang jelas mengenai bentuk data yang dikirim.

Sebelum:

```text id="sgm3gu"
Endpoint A → [...]
Endpoint B → {...}
Endpoint C → {...}
```

Sesudah:

```text id="k6kjjj"
Endpoint A → { statusCode, message, data }
Endpoint B → { statusCode, message, data }
Endpoint C → { statusCode, message, data }
```

Kontrak API menjadi lebih konsisten.

### 2. Separation of Concerns

Sebelumnya:

```text id="oee3k8"
Controller
 ├── Routing
 ├── Business Logic
 └── Response Formatting
```

Sesudah:

```text id="jlwm7r"
Controller
 ├── Routing
 └── Business Logic

Interceptor
 └── Response Formatting
```

Tanggung jawab transformasi respons dipindahkan ke layer yang lebih tepat.

### 3. Cross-Cutting Concern

Format response adalah kebutuhan yang digunakan oleh seluruh endpoint.

Karena itu implementasinya lebih tepat ditempatkan pada interceptor dibandingkan menulis kode yang sama berulang kali di controller.

---

## Dampak Perubahan

### Keuntungan

- Format respons menjadi konsisten.
- Mengurangi duplikasi kode.
- Controller menjadi lebih bersih.
- Client lebih mudah melakukan parsing data.
- Mudah menambahkan metadata tambahan di masa depan.

Contoh:

```json id="mxxg8k"
{
  "statusCode": 200,
  "message": "Success",
  "timestamp": "2026-08-14T10:00:00Z",
  "data": {}
}
```

### Konsekuensi

- Merupakan breaking change bagi client lama.
- Frontend dan mobile perlu menyesuaikan parsing response.
- Seluruh endpoint perlu diuji ulang untuk memastikan format baru diterapkan dengan benar.

---

## Hubungan dengan Materi Sebelumnya

Perjalanan arsitektur NestJS yang telah dipelajari:

```text id="vl1ebm"
Controller
      ↓
Service
      ↓
Exception Handling
      ↓
Interceptor
      ↓
HTTP Response
```

Sebelumnya saya mempelajari:

- Provider
- Dependency Injection
- Service Layer
- NotFoundException

Pada materi ini saya mempelajari bahwa NestJS menyediakan **Interceptor** untuk memodifikasi data sebelum dikirim ke client tanpa mengubah business logic yang ada.

---

## Kesimpulan

TransformInterceptor digunakan untuk menstandarisasi format respons API secara global. Dengan mendaftarkannya melalui `app.useGlobalInterceptors()`, seluruh endpoint otomatis mengembalikan struktur respons yang konsisten berupa `statusCode`, `message`, dan `data`.

Pendekatan ini mengikuti best practice NestJS dalam menangani cross-cutting concerns dan membantu menjaga konsistensi kontrak API di seluruh aplikasi.
