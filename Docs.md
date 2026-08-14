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

# ValidationPipe, class-validator, dan ParseIntPipe

## Apa yang Dipelajari

Pada materi ini saya mempelajari **validasi input dan parsing parameter** pada NestJS menggunakan `ValidationPipe`, `class-validator`, `class-transformer`, dan `ParseIntPipe`.

Tujuan utamanya adalah memastikan data yang masuk ke aplikasi sudah memiliki bentuk dan nilai yang sesuai **sebelum mencapai controller dan business logic**.

Sebelumnya, service harus mempercayai bahwa data yang diterima sudah benar. Setelah menggunakan validation pipe, NestJS dapat melakukan validasi secara otomatis berdasarkan aturan yang didefinisikan pada DTO.

---

## Konsep Utama

Ada tiga konsep penting yang dipelajari:

```text
Request Body
    ↓
ValidationPipe
    ↓
DTO + class-validator
    ↓
Controller
    ↓
Service
```

Sedangkan untuk parameter seperti ID:

```text
GET /users/10
       ↓
ParseIntPipe
       ↓
id: number
       ↓
Controller
```

Dengan demikian, **validasi body** dan **parsing parameter route** dapat ditangani pada layer masing-masing.

---

## 1. ValidationPipe

`ValidationPipe` digunakan untuk mengaktifkan validasi otomatis pada request.

Pada `main.ts`, pipe didaftarkan secara global:

```ts id="w5pxh6"
app.useGlobalPipes(new ValidationPipe());
```

Karena bersifat global, pipe ini dapat digunakan oleh seluruh endpoint aplikasi.

Artinya, setiap request yang menggunakan DTO dengan decorator validasi akan diperiksa secara otomatis sebelum masuk ke controller.

---

## 2. DTO dan class-validator

DTO (_Data Transfer Object_) digunakan untuk mendefinisikan bentuk data yang boleh diterima oleh endpoint.

Contoh `CreateUserDto`:

```ts id="8x24eq"
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEmail()
  email!: string;
}
```

Dekorator dari `class-validator` digunakan untuk mendefinisikan aturan validasi.

### `@IsString()`

Memastikan nilai `name` berupa string.

```ts id="2bqy0w"
@IsString()
name!: string;
```

### `@MinLength(3)`

Memastikan panjang string minimal tiga karakter.

```ts id="jceq1x"
@MinLength(3)
name!: string;
```

### `@IsEmail()`

Memastikan nilai `email` memiliki format email yang valid.

```ts id="a4f9cc"
@IsEmail()
email!: string;
```

---

## Contoh Request Valid

```json id="d9m5hj"
{
  "name": "Abu",
  "email": "abu@example.com"
}
```

Request tersebut memenuhi aturan DTO sehingga dapat diteruskan ke controller.

---

## Contoh Request Tidak Valid

```json id="x1z9ag"
{
  "name": "Ab",
  "email": "bukan-email"
}
```

Request akan ditolak karena:

```text id="dd1brw"
name  → kurang dari 3 karakter
email → format tidak valid
```

Controller tidak perlu melakukan pengecekan manual karena `ValidationPipe` menangani proses tersebut.

---

## 3. Mengapa Validasi Dilakukan Sebelum Controller?

Salah satu tujuan utama validation pipe adalah mencegah data yang tidak valid masuk ke business logic.

Alurnya:

```text id="d8p0s4"
Client
  ↓
Request
  ↓
ValidationPipe
  ↓
❌ Invalid → HTTP 400
  │
  └── tidak diteruskan

  ↓
✅ Valid
  ↓
Controller
  ↓
Service
```

Hal ini membuat service dapat berfokus pada business logic tanpa harus mengulang validasi dasar pada setiap method.

---

## 4. ParseIntPipe

Selain validasi request body, NestJS juga menyediakan pipe untuk melakukan parsing parameter.

Contohnya pada endpoint `getUserById`:

```ts id="w9h4pg"
@Get(':id')
getUserById(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.userService.findUserById(id);
}
```

Parameter URL pada HTTP pada dasarnya diterima sebagai string.

Misalnya:

```text id="4p1p2s"
GET /users/10
```

Nilai:

```ts id="w7y04j"
id;
```

awalnya merupakan:

```ts id="qmbz3d"
'10';
```

Dengan `ParseIntPipe`, NestJS mengubahnya menjadi:

```ts id="d5r8ax"
10;
```

sehingga controller dapat bekerja dengan tipe:

```ts id="2i3m3k"
id: number;
```

---

## Apa yang Terjadi Jika ID Bukan Angka?

Misalnya client mengirim:

```text id="5i4w8q"
GET /users/abc
```

`ParseIntPipe` akan gagal melakukan parsing dan NestJS akan menghasilkan error response secara otomatis.

Dengan demikian request tidak diteruskan ke service.

Ini lebih baik dibandingkan membiarkan nilai `"abc"` masuk ke business logic dan baru menyebabkan error di kemudian hari.

---

## ValidationPipe vs ParseIntPipe

Keduanya sama-sama merupakan **Pipe**, tetapi memiliki tanggung jawab yang berbeda.

| Pipe             | Fungsi                                             |
| ---------------- | -------------------------------------------------- |
| `ValidationPipe` | Memvalidasi request berdasarkan DTO                |
| `ParseIntPipe`   | Mengubah dan memvalidasi parameter menjadi integer |

Contohnya:

```text id="n7v1ks"
POST /users
      ↓
ValidationPipe
      ↓
CreateUserDto
      ↓
Controller
```

Sedangkan:

```text id="x2k5jr"
GET /users/10
       ↓
ParseIntPipe
       ↓
id: number
       ↓
Controller
```

---

## 5. class-validator dan class-transformer

Implementasi ini menambahkan dua dependency:

```json id="5h2n4g"
{
  "class-validator": "^0.15.1",
  "class-transformer": "^0.5.1"
}
```

### class-validator

Digunakan untuk menyediakan decorator validasi seperti:

```ts id="h3j0kt"
@IsString()
@MinLength()
@IsEmail()
```

### class-transformer

Digunakan bersama mekanisme transformasi object yang dibutuhkan oleh `ValidationPipe` dan ekosistem DTO NestJS.

Secara sederhana:

```text id="h5z8af"
class-validator
      ↓
Menentukan aturan validasi

class-transformer
      ↓
Membantu proses transformasi object

ValidationPipe
      ↓
Mengintegrasikan keduanya ke dalam request pipeline
```

---

## 6. Definite Assignment Assertion

Pada DTO digunakan tanda `!`:

```ts id="3s2h3c"
name!: string;
email!: string;
```

Tanda `!` disebut **definite assignment assertion**.

TypeScript strict mode dapat menganggap property tersebut belum diinisialisasi pada constructor.

Dengan `!`, kita memberi informasi kepada TypeScript bahwa property tersebut akan tersedia ketika object digunakan.

Ini bukan berarti `!` melakukan validasi.

Validasi tetap dilakukan oleh:

```ts id="3r1k8x"
@IsString()
@MinLength(3)
@IsEmail()
```

---

## 7. Perubahan Konfigurasi TypeScript

Konfigurasi TypeScript juga disesuaikan:

```text id="3d2fmx"
nodenext → node16
```

pada:

```text id="6jckgk"
module
moduleResolution
```

Beberapa opsi seperti:

```text id="5a8pjq"
resolvePackageJsonExports
isolatedModules
```

juga disesuaikan untuk menghindari konflik dengan dependency dan module resolution yang digunakan oleh `class-validator`.

Perubahan ini bukan bagian dari business logic, tetapi merupakan penyesuaian lingkungan TypeScript agar dependency validasi dapat bekerja dengan konfigurasi project.

---

## Separation of Concerns

Dengan adanya Pipe, tanggung jawab aplikasi menjadi semakin terpisah.

```text id="h8p2p7"
                Request
                   ↓
        ┌─────────────────────┐
        │       Pipes         │
        │ Validation / Parse  │
        └─────────────────────┘
                   ↓
              Controller
                   ↓
               Service
                   ↓
             Business Logic
```

Setiap layer memiliki tanggung jawab yang berbeda:

```text id="j9s6qw"
Pipe       → Validasi & transformasi input
Controller → Routing & request handling
Service    → Business logic
Interceptor→ Transformasi response
Exception  → Penanganan error
```

Ini merupakan perkembangan penting dari struktur NestJS yang sebelumnya sudah dipelajari.

---

## Hubungan dengan Materi Sebelumnya

Struktur aplikasi sekarang mulai membentuk request lifecycle yang lebih lengkap:

```text id="l5j7k2"
                    HTTP Request
                         ↓
                  ┌─────────────┐
                  │    Pipes    │
                  │ Validation  │
                  │   Parsing   │
                  └──────┬──────┘
                         ↓
                    Controller
                         ↓
                      Service
                         ↓
                Business Logic
                         ↓
                  NotFoundException
                         │
                         ↓
                Exception Handler
                         ↓
                  TransformInterceptor
                         ↓
                  Standard Response
```

Materi yang sudah dipelajari sebelumnya:

- **Provider & Dependency Injection**
- **Service Layer**
- **`@Injectable()`**
- **Separation of Concerns**
- **Exception Handling**
- **`NotFoundException`**
- **Interceptor**
- **Response Transformation**

Materi baru:

- **Pipe**
- **ValidationPipe**
- **class-validator**
- **class-transformer**
- **ParseIntPipe**
- **DTO Validation**

---

## Dampak Perubahan

### Keuntungan

- Input tidak valid dapat ditolak lebih awal.
- Mengurangi validasi manual di service.
- Meningkatkan integritas data.
- Parameter route memiliki tipe yang lebih konsisten.
- Error validation ditangani otomatis oleh NestJS.
- Controller dan service menjadi lebih bersih.
- Aturan validasi dapat didefinisikan langsung pada DTO.

### Breaking Change

Penambahan property `email` yang wajib divalidasi dapat menyebabkan client lama gagal mengirim request apabila belum menyertakan email.

Selain itu, request dengan `name` kurang dari tiga karakter atau ID yang bukan integer sekarang akan ditolak.

---

## Kesimpulan

Pada materi ini saya mempelajari bahwa **Pipe merupakan bagian penting dari request lifecycle NestJS** yang dapat digunakan untuk validasi dan transformasi data sebelum request mencapai controller.

`ValidationPipe` bekerja bersama DTO dan `class-validator` untuk memastikan body request memenuhi aturan yang telah ditentukan, sedangkan `ParseIntPipe` digunakan untuk mengubah parameter route dari string menjadi integer sekaligus memastikan nilainya valid.

Dengan adanya Pipe, validasi input tidak lagi perlu dilakukan secara manual di setiap controller atau service sehingga arsitektur aplikasi menjadi lebih bersih, aman, dan mengikuti prinsip **Separation of Concerns**.

# Middleware dan Autentikasi API Key

## Apa yang Dipelajari

Pada materi ini saya mempelajari **Middleware pada NestJS** dan bagaimana middleware dapat digunakan untuk membuat layer keamanan sebelum request mencapai controller.

Implementasi yang dibuat adalah middleware autentikasi sederhana berbasis **API Key**. Setiap request menuju `UserController` harus menyertakan header `x-api-key` dengan nilai API key yang sesuai.

Konsep utama yang dipelajari:

- `NestMiddleware`
- `MiddlewareConsumer`
- `NestModule`
- `configure()`
- `forRoutes()`
- `next()`
- `UnauthorizedException`
- Request lifecycle NestJS
- Middleware sebagai layer autentikasi

---

## 1. Mengenal Middleware

Middleware merupakan fungsi yang dijalankan pada proses request sebelum request diteruskan ke handler berikutnya.

Secara sederhana:

```text id="8qj4p2"
HTTP Request
     ↓
 Middleware
     ↓
 Controller
     ↓
 Service
     ↓
 Response
```

Middleware dapat digunakan untuk berbagai kebutuhan yang berkaitan dengan request, seperti:

- Authentication
- Logging
- Request modification
- Validasi tertentu
- CORS
- Menambahkan informasi ke request
- Filtering request

Pada materi ini middleware digunakan untuk **autentikasi API Key**.

---

## 2. Membuat ApiKeyMiddleware

File baru:

```text id="3k3v1z"
src/middleware/api-key.middleware.ts
```

Middleware mengimplementasikan interface:

```ts id="y6w5t8"
NestMiddleware;
```

Contoh struktur:

```ts id="3m4k2f"
@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== 'secret-key-123') {
      throw new UnauthorizedException('Invalid API key');
    }

    next();
  }
}
```

---

## 3. Memeriksa Header `x-api-key`

Client harus mengirim API key melalui HTTP header:

```http id="u7p5sa"
x-api-key: secret-key-123
```

Middleware mengambil nilai tersebut:

```ts id="9h3k5x"
const apiKey = req.headers['x-api-key'];
```

Kemudian dibandingkan dengan API key yang diharapkan.

Jika salah:

```ts id="b3r7wq"
throw new UnauthorizedException('Invalid API key');
```

Jika benar:

```ts id="j2k9sx"
next();
```

---

## 4. Mengenal `next()`

`next()` merupakan bagian penting dari middleware.

Fungsinya adalah memberitahu NestJS bahwa middleware telah selesai memproses request dan request boleh diteruskan.

Alurnya:

```text id="9n4m6k"
Request
   ↓
ApiKeyMiddleware
   ↓
   ├── API Key Salah
   │      ↓
   │  UnauthorizedException
   │      ↓
   │  HTTP 401
   │
   └── API Key Benar
          ↓
        next()
          ↓
      Controller
```

Jika `next()` tidak dipanggil dan tidak ada response/error yang diberikan, request dapat berhenti di middleware.

---

## 5. UnauthorizedException

Ketika API key tidak valid, middleware melempar:

```ts id="0x5v1q"
throw new UnauthorizedException('Invalid API key');
```

NestJS kemudian menangani exception tersebut dan menghasilkan HTTP `401 Unauthorized`.

Hal ini berhubungan dengan materi sebelumnya mengenai **Exception Handling**.

Jadi middleware tidak perlu menulis response HTTP secara manual.

```text id="8b3x4z"
Invalid API Key
      ↓
UnauthorizedException
      ↓
NestJS Exception Handler
      ↓
HTTP 401
```

---

## 6. Mendaftarkan Middleware

Middleware tidak cukup hanya dibuat. Middleware juga harus didaftarkan agar NestJS mengetahui kapan middleware tersebut digunakan.

`AppModule` diubah menjadi:

```ts id="8q7x2m"
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(UserController);
  }
}
```

Beberapa konsep baru terdapat pada kode tersebut.

### `NestModule`

`NestModule` memungkinkan module memiliki konfigurasi middleware melalui method:

```ts id="6z3p5r"
configure();
```

### `MiddlewareConsumer`

`MiddlewareConsumer` digunakan untuk menentukan middleware mana yang digunakan dan route mana yang dilindungi.

### `apply()`

Menentukan middleware yang ingin diterapkan:

```ts id="2h8k4s"
consumer.apply(ApiKeyMiddleware);
```

### `forRoutes()`

Menentukan route yang akan menggunakan middleware:

```ts id="w5x3c9"
.forRoutes(UserController);
```

Pada implementasi ini middleware hanya diterapkan pada `UserController`.

---

## 7. Mengapa Tidak Menggunakan Global Middleware?

Middleware dapat diterapkan secara global maupun spesifik.

Jika diterapkan ke seluruh aplikasi:

```text id="j3q8a1"
Semua Request
     ↓
ApiKeyMiddleware
```

Namun implementasi saat ini menggunakan:

```ts id="n5s7y2"
.forRoutes(UserController);
```

Sehingga:

```text id="4k7c9p"
UserController
     ↓
ApiKeyMiddleware
     ↓
Controller
```

Sedangkan controller lain tidak terkena middleware tersebut.

Pendekatan ini memberikan fleksibilitas.

Misalnya di masa depan terdapat:

```text id="1w3m8k"
AuthController
PublicController
UserController
AdminController
```

Kita dapat menentukan controller mana yang membutuhkan autentikasi tanpa memengaruhi endpoint lainnya.

---

## 8. Middleware dalam Request Lifecycle

Middleware merupakan salah satu bagian dari request lifecycle NestJS.

Secara konseptual:

```text id="m4v9k2"
HTTP Request
     ↓
Middleware
     ↓
Guards
     ↓
Interceptors
     ↓
Pipes
     ↓
Controller
     ↓
Service
     ↓
Response
```

Middleware dapat digunakan untuk melakukan pemeriksaan awal sebelum request diproses lebih jauh.

Dalam kasus API Key:

```text id="k2s8x4"
Request
   ↓
API Key Middleware
   ↓
Valid?
 ┌─┴──────────┐
 │            │
No           Yes
 │            │
 ↓            ↓
401         Guards
              ↓
          Interceptors
              ↓
             Pipes
              ↓
          Controller
              ↓
           Service
```

Hal ini membuat middleware cocok untuk kebutuhan pemeriksaan request yang bersifat umum atau berada di awal lifecycle.

---

## 9. Middleware vs Materi Sebelumnya

Dengan materi sebelumnya, sekarang mulai terlihat perbedaan tanggung jawab masing-masing fitur NestJS.

| Fitur       | Tanggung Jawab                                    |
| ----------- | ------------------------------------------------- |
| Middleware  | Memproses request sebelum masuk lebih jauh        |
| Guard       | Menentukan apakah request boleh mengakses handler |
| Pipe        | Validasi dan transformasi input                   |
| Controller  | Routing dan request handling                      |
| Service     | Business logic                                    |
| Interceptor | Transformasi response / cross-cutting concern     |
| Exception   | Menangani kondisi error                           |

Contohnya pada aplikasi saat ini:

```text id="2v5k8n"
Request
   ↓
Middleware
   │
   └── Cek API Key
   ↓
Pipe
   │
   └── Validasi Input
   ↓
Controller
   ↓
Service
   │
   └── Business Logic
   ↓
Interceptor
   │
   └── Format Response
   ↓
Client
```

---

## 10. Perbaikan Bug pada `createUser()`

Selain middleware, terdapat perbaikan kecil pada `UserService`.

Sebelumnya:

```ts id="7c1m4x"
{
  id: this.users.length + 1,
  email: '',
  ...dto,
}
```

Property `email` kosong tersebut sebenarnya tidak diperlukan karena `email` sudah berasal dari DTO.

Implementasi diperbaiki menjadi:

```ts id="x6q2p9"
{
  id: this.users.length + 1,
  ...dto,
}
```

Dengan demikian data email langsung berasal dari:

```ts id="j8m4s3"
CreateUserDto;
```

Perubahan ini juga mencegah adanya property default yang berpotensi membingungkan ketika digabungkan dengan spread operator.

---

## 11. Unit Test

Nest CLI juga menghasilkan:

```text id="8p3j6x"
src/middleware/api-key.middleware.spec.ts
```

Test saat ini masih sederhana dan digunakan untuk memastikan middleware dapat diinstansiasi.

Contoh:

```ts id="s6k2v9"
describe('ApiKeyMiddleware', () => {
  it('should be defined', () => {
    expect(new ApiKeyMiddleware()).toBeDefined();
  });
});
```

Test ini masih merupakan fondasi.

Test yang lebih lengkap nantinya dapat memverifikasi:

```text id="6x4n8c"
API Key benar
     ↓
next() dipanggil

API Key salah
     ↓
UnauthorizedException

API Key tidak ada
     ↓
UnauthorizedException
```

---

## 12. Keamanan dan Environment Variable

Saat ini API key masih ditulis langsung di source code:

```ts id="3r6m1p"
'secret-key-123';
```

Pendekatan ini masih dapat digunakan untuk pembelajaran atau development sederhana, tetapi **tidak aman untuk production**.

Idealnya API key disimpan di environment variable:

```env id="q8k2s7"
API_KEY=secret-key-123
```

Kemudian aplikasi membaca:

```ts id="5m9x3v"
process.env.API_KEY;
```

Dengan begitu secret tidak perlu disimpan langsung di source code atau repository.

Untuk production, autentikasi API key sederhana seperti ini juga biasanya perlu dikembangkan lebih lanjut, misalnya dengan secret management, rotasi key, hashing/verification yang tepat, rate limiting, dan audit logging sesuai kebutuhan aplikasi.

---

## Dampak Perubahan

### Keuntungan

- Endpoint user sekarang memiliki proteksi autentikasi.
- Request tanpa API key dapat ditolak lebih awal.
- Request dengan API key salah menghasilkan HTTP 401.
- Middleware dapat diterapkan secara selektif pada controller tertentu.
- Tidak perlu menambahkan pengecekan API key berulang kali pada setiap method controller.
- Struktur aplikasi semakin mengikuti prinsip Separation of Concerns.

### Konsekuensi

Client yang sebelumnya melakukan request ke endpoint user harus menambahkan:

```http id="1m5c8v"
x-api-key: secret-key-123
```

Jika header tidak dikirim atau nilainya salah, request akan ditolak.

---

## Hubungan dengan Materi Sebelumnya

Perjalanan konsep NestJS yang sudah dipelajari sekarang semakin lengkap:

```text id="0h6y2p"
                    HTTP Request
                         ↓
                    Middleware
                         ↓
                  API Key Validation
                         ↓
                       Pipes
                         ↓
                  Input Validation
                         ↓
                    Controller
                         ↓
                     Service
                         ↓
                  Business Logic
                         ↓
                  Interceptor
                         ↓
                 Response Formatting
                         ↓
                    HTTP Response
```

Sedangkan ketika terjadi kesalahan:

```text id="2n7x4k"
Middleware
    ↓
UnauthorizedException
    ↓
NestJS Exception Handler
    ↓
HTTP 401
```

Ini menunjukkan bagaimana berbagai fitur NestJS memiliki tanggung jawab masing-masing dan dapat dikombinasikan untuk membangun request lifecycle yang terstruktur.

---

## Kesimpulan

Pada materi ini saya mempelajari **Middleware NestJS** dengan membuat `ApiKeyMiddleware` untuk melindungi endpoint user menggunakan API key.

Saya juga mempelajari bagaimana middleware didaftarkan melalui `NestModule`, dikonfigurasi menggunakan `MiddlewareConsumer`, dan dibatasi menggunakan `forRoutes()`.

Konsep penting lainnya adalah penggunaan `next()` untuk meneruskan request ketika validasi berhasil dan `UnauthorizedException` untuk menghentikan request yang tidak terotorisasi.

Implementasi ini memperkuat pemahaman mengenai **request lifecycle, authentication layer, middleware configuration, dan Separation of Concerns** pada NestJS.
