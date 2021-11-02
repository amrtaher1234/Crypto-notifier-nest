import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { SendResourceMailDto } from 'src/mail/mail.dto';
import { MailService } from 'src/mail/mail.service';
import { User, UserDocument } from 'src/schemas/user.schema';
import { FinanceService } from 'src/shared/finance/finance.service';
import { Quote } from 'yahoo-finance2/dist/esm/src/modules/quote';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private finance: FinanceService,
    private mailService: MailService,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_11_HOURS)
  handleCron() {
    this.logger.debug('Called every 30 seconds');
    this.handleUsersSubscriptions();
  }

  async handleUsersSubscriptions() {
    let users = await this.userModel
      .find()
      .populate('resources.resource')
      .lean()
      .exec();

    const mappedSymbolsQuotes = {};
    users = users.filter((user) => user.resources && user.resources.length);
    users.forEach((user) => {
      if (user.resources && user.resources.length) {
        user.resources.forEach(
          (resource) =>
            (mappedSymbolsQuotes[resource.resource.symbol] = resource),
        );
      }
    });
    const promises = [
      ...Object.keys(mappedSymbolsQuotes).map((k) =>
        this.finance.getSymbolQuote(k),
      ),
    ];
    const cryptoData = await Promise.all(promises);
    const mappedUsers = {};
    users.forEach((user) => {
      cryptoData.forEach((quote) => {
        if (this.isUserMatched(user, quote)) {
          mappedUsers[user._id]
            ? mappedUsers[user._id].quotes.push(quote)
            : (mappedUsers[user._id] = { user, quotes: [quote] });
          return;
        }
      });
    });

    Object.keys(mappedUsers).forEach((key) => {
      const data: { user: User; quotes: Quote[] } = mappedUsers[key];
      this.sendUserMail(data.user, data.quotes);
    });
  }

  async sendUserMail(user: User, quotes: Quote[]) {
    const sendResourceMailDto: SendResourceMailDto = {
      userEmail: user.email,
      userName: user.name,
      quotes,
    };
    this.mailService
      .sendMailForResouce(sendResourceMailDto)
      .then()
      .catch((err) => console.log(err));
  }

  isUserMatched(user: User, quote: Quote) {
    const currentPrice = quote.regularMarketPrice;
    const resource = user.resources.find(
      (resource) => resource.resource.symbol === quote.symbol,
    );
    if (!resource) {
      return false;
    }
    const { min, max } = resource;
    console.log(
      currentPrice > min && currentPrice < max,
      user.email,
      user.resources[0].min,
      currentPrice,
      user.resources[0].max,
    );
    return !(currentPrice > min && currentPrice < max);
  }
}
