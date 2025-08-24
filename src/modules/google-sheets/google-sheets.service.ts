import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as path from 'path';

@Injectable()
export class GoogleSheetsService {
  private readonly KEYFILEPATH = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'wb-tariffs-service-470010-abcdd295e451.json',
  );
  private readonly SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  private readonly SPREADSHEET_ID = '1BYY7LJXYr2ptUfMFdPLx820g2FenZJKo3ClT7Mkuw2c';
  private readonly logger = new Logger(GoogleSheetsService.name);

  private sheets;

  constructor() {
    this.authorize();
  }

  private authorize(): void {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: this.KEYFILEPATH,
        scopes: this.SCOPES,
      });
      this.sheets = google.sheets({ version: 'v4', auth });
      this.logger.log('Авторизация Google Таблиц успешна!');
    } catch (error) {
      this.logger.error('Ошибка авторизации Google Таблиц: ', error);
    }
  }
}
