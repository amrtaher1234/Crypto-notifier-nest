export class CreateUserDto {
  name: string;
  email: string;
  resource?: CreateResourceDto;
}

export class CreateResourceDto {
  min: number;
  max: number;
  resource: string;
}

export class SubscribeUserDto {
  id: string;
  resourceData: CreateResourceDto;
}
