import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RewardDocument = HydratedDocument<Reward>;

@Schema({ timestamps: true })
export class Reward {
  @Prop()
  prizes: string;
  @Prop()
  colors: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
