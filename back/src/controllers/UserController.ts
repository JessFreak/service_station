import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Access } from '../config/security/decorators/Access';
import { UserRequest } from '../config/security/decorators/UserRequest';
import { Role, Vehicle } from '@prisma/client';
import { CreateVehicleDTO, UpdateVehicleDTO } from '../utils/dtos/VehicleDTO';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { CreateUserDTO, RoleDTO, UpdateUserDTO } from '../utils/dtos/UserDTO';
import { OrderService } from '../services/OrderService';
import { OrderQueryDTO } from '../utils/dtos/OrderDTO';
import { UserMapper } from '../utils/mappers/UserMapper';
import { UserResponse } from '../utils/types/UserResponse';
import { OrderResponse } from '../utils/types/OrderResponse';
import { OrderMapper } from '../utils/mappers/OrderMapper';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @Access(Role.ADMIN)
  async create(@Body() body: CreateUserDTO): Promise<UserResponse> {
    const user = await this.authService.register(body);
    return UserMapper.getUserResponse(user);
  }

  @Get()
  @Access(Role.ADMIN)
  async getAll(@Query() role?: RoleDTO): Promise<UserResponse[]> {
    const users = await this.userService.getAllUsers(role);
    return UserMapper.getUsersResponse(users);
  }

  @Patch()
  @Access()
  async update(@UserRequest() user: UserResponse, @Body() body: UpdateUserDTO): Promise<UserResponse> {
    const updatedUser = await this.userService.update(user.id, body);
    return UserMapper.getUserResponse(updatedUser);
  }

  @Post('vehicles')
  @Access()
  addVehicle(@UserRequest() user: UserResponse, @Body() body: CreateVehicleDTO): Promise<Vehicle> {
    return this.userService.addVehicle(user.id, body);
  }

  @Get('vehicles')
  @Access()
  getVehicles (@UserRequest() user: UserResponse): Promise<Vehicle[]> {
    return this.userService.getUserVehicles(user.id);
  }

  @Patch('vehicles/:vehicleId')
  @Access()
  updateVehicle (
    @UserRequest() user: UserResponse,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDTO,
  ): Promise<Vehicle> {
    return this.userService.updateVehicle(user.id, vehicleId, body);
  }

  @Get('orders')
  @Access()
  async getHistory (@UserRequest() user: UserResponse, @Query() query: OrderQueryDTO): Promise<OrderResponse[]> {
    const orders = await this.orderService.getAll({ ...query, userId: user.id });
    return OrderMapper.getOrdersResponse(orders);
  }
}