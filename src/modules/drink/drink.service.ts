import { Injectable } from '@nestjs/common';
import { CreateDrinkDto } from './dto/create-drink.dto';
import { UpdateDrinkDto } from './dto/update-drink.dto';
import { Drink } from './schemas/drink.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DrinkService {
  constructor(
    @InjectModel(Drink.name)
    private DrinkModal: Model<Drink>,
  ) {}
  create(createDrinkDto: CreateDrinkDto) {
    return 'This action adds a new drink';
  }

  findAll() {
    return `This action returns all drink`;
  }

  findOne(id: number) {
    return `This action returns a #${id} drink`;
  }

  update(id: number, updateDrinkDto: UpdateDrinkDto) {
    return `This action updates a #${id} drink`;
  }

  remove(id: number) {
    return `This action removes a #${id} drink`;
  }

  async getDetailDrinkByName(name: string) {
    const drink = await this.DrinkModal.findOne({ name });
    return drink;
  }

  async createDetailDrink(createDrinkDto: CreateDrinkDto) {
    const { name, description, descriptionMore, price, image, drink } =
      createDrinkDto;

    // Kiểm tra nếu các trường cần thiết không tồn tại
    if (!name || !description || !price) {
      throw new Error('Tên, mô tả và giá là bắt buộc.');
    }

    // // Kiểm tra nếu image là chuỗi Base64 hợp lệ (tùy vào định dạng bạn muốn lưu)
    // const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/; // Chỉ định các loại ảnh bạn muốn hỗ trợ
    // if (image && !base64Regex.test(image)) {
    //   throw new Error('Hình ảnh không phải là chuỗi Base64 hợp lệ.');
    // }

    // Tạo món đồ uống trong cơ sở dữ liệu
    const listdrink = await this.DrinkModal.create({
      name,
      drink,
      description,
      descriptionMore,
      price,
      image, // Lưu trực tiếp chuỗi Base64 vào cơ sở dữ liệu
    });

    // Trả về ID và thông tin cơ bản về món đồ uống đã tạo
    return {
      _id: listdrink._id,
      name: listdrink.name,
      price: listdrink.price,
    };
  }

  // async getListDrink(): Promise<any> {
  //   const listdrinksCoffee = await this.DrinkModal.find({ drink: 'Coffee' }) // Filter drinks with name 'coffee'
  //     .select('name') // Selecting only the `name` field
  //     .lean();

  //   const listdrinksTea = await this.DrinkModal.find({ drink: 'Tea' }) // Filter drinks with name 'tea'
  //     .select('name') // Selecting only the `name` field
  //     .lean();

  //   // Return an array of names from both lists
  //   // return [
  //   //   ...listdrinksCoffee.map((drinkCoffee) => drinkCoffee.name),
  //   //   ...listdrinksTea.map((drinkTea) => drinkTea.name),
  //   // ];
  //   return [
  //     "Coffe":[...listdrinksCoffee.map((drinkCoffee) => drinkCoffee.name)],
  //     "Tea":[...listdrinksTea.map((drinkTea) => drinkTea.name)],
  //   ];
  // }

  async getListDrink(): Promise<any> {
    const listdrinksCoffee = await this.DrinkModal.find({ drink: 'Coffee' }) // Filter drinks with name 'coffee'
      .select('name') // Selecting only the `name` field
      .lean();

    const listdrinksTea = await this.DrinkModal.find({ drink: 'Tea' }) // Filter drinks with name 'tea'
      .select('name') // Selecting only the `name` field
      .lean();
    const listdrinksCake = await this.DrinkModal.find({ drink: 'Cake' }) // Filter drinks with name 'tea'
      .select('name') // Selecting only the `name` field
      .lean();

    // Return an object with arrays of names for Coffee and Tea
    return {
      Coffee: listdrinksCoffee.map((drinkCoffee) => drinkCoffee.name),
      Tea: listdrinksTea.map((drinkTea) => drinkTea.name),
      Cake: listdrinksCake.map((drinkCake) => drinkCake.name),
    };
  }
}
