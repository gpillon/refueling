import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refueling } from './entities/refueling.entity';
import { CreateRefuelingDto } from './dto/create-refueling.dto';
import { UpdateRefuelingDto } from './dto/update-refueling.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { VehicleService } from '../vehicle/vehicle.service';

@Injectable()
export class RefuelingService {
  constructor(
    @InjectRepository(Refueling)
    private refuelingRepository: Repository<Refueling>,
    private vehicleService: VehicleService,
  ) {}

  async create(createRefuelingDto: CreateRefuelingDto): Promise<Refueling> {
    const vehicle = await this.vehicleService.findOne(
      createRefuelingDto.vehicleId,
    );
    const refueling = this.refuelingRepository.create({
      ...createRefuelingDto,
      vehicle,
    });
    return this.refuelingRepository.save(refueling);
  }

  async findAll(params: QueryParamsDto): Promise<Refueling[]> {
    const { vehicleId, startDate, endDate } = params;
    const query = this.refuelingRepository.createQueryBuilder('refueling');

    if (vehicleId) {
      query.andWhere('refueling.vehicle.id = :vehicleId', { vehicleId });
    }

    if (startDate) {
      query.andWhere('refueling.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('refueling.date <= :endDate', { endDate });
    }
    try {
      return query.getMany();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Refueling> {
    return this.refuelingRepository.findOne({
      where: { id },
      relations: ['vehicle'],
      select: ['id', 'date', 'liters', 'cost', 'kilometers',],
    });
  }

  async update(
    id: number,
    updateRefuelingDto: UpdateRefuelingDto,
  ): Promise<Refueling> {
    const vehicle = await this.vehicleService.findOne(
      updateRefuelingDto.vehicleId,
    );
    const updatedRefueling = { ...updateRefuelingDto, vehicle };
    await this.refuelingRepository.update(id, updatedRefueling);
    console.log(updatedRefueling);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.refuelingRepository.delete(id);
  }
}
