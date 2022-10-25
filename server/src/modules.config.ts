import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis.module';
import { JwtModule } from '@nestjs/jwt';

export const redisModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule (app.module.ts)');

    return {
      connectionOptions: {
        host: configService.get('REDIS_HOST'),
        port: parseInt(configService.get('REDIS_PORT'), 10),
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (error) => {
          logger.error('Redis client error', error);
        });

        client.on('connect', () => {
          logger.log(
            `Redis client connected to ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  inject: [ConfigService],
});
