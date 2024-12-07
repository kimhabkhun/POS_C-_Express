import {
  ProductCreateRequest,
  Production,
  ProductUpdateRequest,
} from "@/controllers/types/product.controller.types";
import { ProductionModel } from "../model/product.model";
interface GetAllProductType {
  skip: number;
  filter:
    | {
        [key: string]:
          | string
          | number
          | {
              [key: string]: number;
            };
      }
    | {};
  sort:
    | {
        [key: string]: 1 | -1;
      }
    | {};
  limit: number;
  page: number;
  search?: string;
}
class ProductRepository {
  async createProduct(newProduct: ProductCreateRequest): Promise<Production> {
    try {
      const result = await new ProductionModel(newProduct).save();
      return result as unknown as Production;
    } catch (error) {
      //@ts-ignore
      if (error.code === 11000) {
        throw new Error("Confliect");
      }
      console.log("error: ProductRepository createProduct()", error);
      throw error;
    }
  }
  async updateProduct(
    id: string,
    product: ProductUpdateRequest
  ): Promise<Production> {
    try {
      const updatedProduct = await ProductionModel.findByIdAndUpdate(
        id,
        product,
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error(`No Product: ${id} Found!`);
      }
      return updatedProduct as unknown as Production;
    } catch (error) {
      console.log("error: ProductRepository updateProduct()", error);
      throw error;
    }
  }
  async deleteProduct(id: string) {
    try {
      const deleteProduct = await ProductionModel.findByIdAndDelete(id);
      if (!deleteProduct) {
        throw new Error(`No Product: ${id} Found!`);
      }
    } catch (error) {
      console.log("error: ProductRepository deleteProduct()", error);
      throw error;
    }
  }
  async getAllProduct({
    filter,
    sort,
    limit,
    page,
    search,
    skip,
  }: GetAllProductType): Promise<{
    data: Production[];
    currentPage: number;
    totalPages: number;
    limit: number;
    skip: number;
    totalProducts: number;
  }> {
    try {
      //todo: search
      console.log(search);

      const productResult = await ProductionModel.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(skip);
      const totalProducts = await ProductionModel.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      if (productResult.length === 0) {
        throw new Error("No any product");
      }
      return {
        data: productResult as unknown as Production[],
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        skip,
      };
    } catch (error) {
      console.log("error: ProductRepository getAllProduct()", error);
      throw error;
    }
  }
}
export default new ProductRepository();
