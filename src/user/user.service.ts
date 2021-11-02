import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Quote } from 'yahoo-finance2/dist/esm/src/modules/quote';
import finance from 'yahoo-finance2';
import { CreateUserDto, CreateResourceDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getSymbolData(symbol: string): Promise<Quote> {
    return finance.quote(symbol);
  }
  async getAllUsers() {
    return this.userModel.find().populate('resources.resource').lean().exec();
  }
  async createUser(createUser: CreateUserDto) {
    return (
      await this.userModel.create({
        ...createUser,
        resources: createUser.resource || [],
      })
    ).save();
  }
  async subscribeUser(id: string, createResource: CreateResourceDto) {
    const pullPhase = await this.userModel.findByIdAndUpdate(id, {
      $pull: {
        resources: { resource: { $in: [createResource.resource] } },
      },
    });
    const pushPhase = await this.userModel.findByIdAndUpdate(id, {
      $push: {
        resources: createResource,
      },
    });
    await pullPhase.save();
    await pushPhase.save();
  }
}
