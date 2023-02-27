import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import configuration from 'config/configuration'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle("Thoughtful API")
		.setDescription("The Thoughtful API description")
		.setVersion("1.0")
		.addTag("thoughtful")
        .addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	await app.listen(configuration.port);
}
bootstrap();
