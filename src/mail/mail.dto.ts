import { Quote } from 'yahoo-finance2/dist/esm/src/modules/quote';

export class SendResourceMailDto {
  userName: string;
  userEmail: string;
  quotes: Quote[];
}
