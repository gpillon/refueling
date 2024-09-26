import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@WebSocketGateway()
export class VehicleGateway {
  constructor(private readonly vehicleService: VehicleService) {}

  @SubscribeMessage('createVehicle')
  create(@MessageBody() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @SubscribeMessage('findAllVehicle')
  findAll() {
    return this.vehicleService.findAll();
  }

  @SubscribeMessage('findOneVehicle')
  findOne(@MessageBody() id: number) {
    return this.vehicleService.findOne(id);
  }

  @SubscribeMessage('updateVehicle')
  update(@MessageBody() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(updateVehicleDto.id, updateVehicleDto);
  }

  @SubscribeMessage('removeVehicle')
  remove(@MessageBody() id: number) {
    return this.vehicleService.remove(id);
  }
}
