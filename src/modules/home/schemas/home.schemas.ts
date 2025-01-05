import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, Matches } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type HomeDocument = HydratedDocument<Home>;

@Schema({ timestamps: true })
export class Home {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: String })
  @IsString() // Ensures it's a string
  @Matches(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
    message: 'Invalid Base64 image format',
  }) // Validates Base64 image format
  image: string;
}

export const HomeSchema = SchemaFactory.createForClass(Home);
