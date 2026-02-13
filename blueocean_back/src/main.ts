import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/error/error.filter';
import cookieParser from 'cookie-parser';
import { loggerConfig } from './common/log/logConfig';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  console.log("start :: 1")
  try {
    const app = await NestFactory.create(AppModule, {logger: loggerConfig});
    console.log("start :: 2")
    app.use(cookieParser());
    app.useGlobalFilters(new AllExceptionFilter());
    app.enableCors(
      {    origin: ['https://blueoceanad.kr', 'http://localhost:3300'], // Next.js 프론트엔드 URL http://3.35.25.105:3300
           credentials: true, // 쿠키를 허용합니다.
      }
    )
    await app.listen(3000);
    console.log("start :: 3")
  } catch (error) {
    console.log(error)
  }


    // 특정 도메인에서만 허용하는 CORS 설정
    // app.enableCors({
    //   origin: 'http://example.com', // 허용할 도메인
    //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
    //   credentials: true, // 쿠키 허용 여부
    // });

  //app.setGlobalPrefix('boa')



  // Private Network Access 헤더 추가
  // app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Private-Network', 'true');
  //   next();
  // });


}
bootstrap();
