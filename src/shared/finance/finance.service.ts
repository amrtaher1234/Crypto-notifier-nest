import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import finance from 'yahoo-finance2';
import { Quote } from 'yahoo-finance2/dist/esm/src/modules/quote';
@Injectable()
export class FinanceService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getSymbolQuote(symbol: string) {
    const cachedQuote = await this.cacheManager.get<Quote>(symbol);
    if (cachedQuote) {
      console.log('getting data from cache');
      return cachedQuote;
    } else {
      return finance.quote(symbol).then((quote) => {
        this.cacheManager.set(symbol, quote, { ttl: 10 });
        return quote;
      });
    }
  }
}
