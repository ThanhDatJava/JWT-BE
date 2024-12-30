import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DrinkDocument = HydratedDocument<Drink>;

@Schema({ timestamps: true })
export class Drink {
  @Prop()
  name: string;
  @Prop()
  drink: string;
  @Prop()
  description: string;
  @Prop()
  descriptionMore: string;
  @Prop()
  price: string;
  @Prop()
  image: string;
}

export const DrinkSchema = SchemaFactory.createForClass(Drink);
