import { Controller, Get } from '@nestjs/common';

// |##| static Route dan dynamic pada nest.js : * SELALU LETAKKAN STATIC ROUTE DI ATAS DYNAMIC AGAR TIDAK MEMAKAN ROUTE STATIC
// @Get('all')          // GET /user/all
// @Get(':id)           // GET /user/:id - dynamic segment
// @Post()              // POST /user
// @Put(':id')          // PUT /user/:id
// @Delete(':id')       // DELETE /user/:id

@Controller('user')
export class UserController {
  // GET /user
  @Get()
  getUser() {
    return [
      { id: 1, name: 'John Doe' },
      { id: 1, name: 'Hakim' },
    ];
  }
}
