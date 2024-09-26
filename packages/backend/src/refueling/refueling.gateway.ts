import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { RefuelingService } from './refueling.service';
import { CreateRefuelingDto } from './dto/create-refueling.dto';
import { UpdateRefuelingDto } from './dto/update-refueling.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@WebSocketGateway()
export class RefuelingGateway {
  constructor(private readonly refuelingService: RefuelingService) {}

  @SubscribeMessage('createRefueling')
  create(@MessageBody() createRefuelingDto: CreateRefuelingDto) {
    return this.refuelingService.create(createRefuelingDto);
  }

  @SubscribeMessage('findAllRefueling')
  findAll(@MessageBody() params: QueryParamsDto) {
    return this.refuelingService.findAll(params);
  }

  @SubscribeMessage('findOneRefueling')
  findOne(@MessageBody() id: number) {
    return this.refuelingService.findOne(id);
  }

  @SubscribeMessage('updateRefueling')
  update(@MessageBody() updateRefuelingDto: UpdateRefuelingDto) {
    return this.refuelingService.update(
      updateRefuelingDto.id,
      updateRefuelingDto,
    );
  }

  @SubscribeMessage('removeRefueling')
  remove(@MessageBody() id: number) {
    return this.refuelingService.remove(id);
  }
}
