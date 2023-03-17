import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import configuration from 'config/configuration'
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';

async function bootstrap() {

    // TODO make this an env variable
    // initializeApp({credential: cert(
    //     JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii')))
    // });
  
    // use environment variables to initialize the app! 🎉
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // replace `\` and `n` character pairs w/ single `\n` character
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    })
  
    
    // const serviceAccount = require('../firebase_credentials.json');

    // initializeApp({
    //     credential: cert(serviceAccount)
    // });

	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle("Thoughtful API")
		.setDescription("The Thoughtful API description")
		.setVersion("1.0")
		.addTag("thoughtful")
        .addBearerAuth()
		.build();

    app.enableCors({
        origin: "*",
        credentials: true
    });


	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(configuration.port, () => {
        console.log(`Listening on port ${configuration.port}`);
    });
}
bootstrap();
