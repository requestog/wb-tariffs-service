import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import * as path from 'path';
import * as process from 'node:process';

@Injectable()
export class GoogleSheetsService {
  private readonly KEYFILEPATH = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'wb-tariffs-service-470010-1eda689b218f.json',
  );
  private readonly SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  private readonly SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  private readonly logger = new Logger(GoogleSheetsService.name);

  private sheets: sheets_v4.Sheets | null = null;

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

  async updateSheet(data: any[][]): Promise<void> {
    if (!this.sheets) {
      this.logger.error(
        'API Google Таблиц не инициализирован. Пожалуйста, проверь ключ и права доступа.',
      );
      return;
    }

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.SPREADSHEET_ID,
        range: 'stocks_coefs!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: data,
        },
      });
      this.logger.log('Данные успешно обновлены в Google Таблице');
    } catch (error) {
      this.logger.error(
        'Ошибка при обновлении данных в Google Таблицах:',
        (error as Error).message,
        (error as Error).stack,
      );
    }
  }
}
