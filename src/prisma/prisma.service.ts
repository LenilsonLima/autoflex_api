import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is missing in environment variables.');
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}