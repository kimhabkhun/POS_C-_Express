import ProductService from "@/services/product.service";
import {
  Controller,
  Route,
  Get,
  Tags,
  Queries,
  Post,
  Body,
  Put,
  Path,
  Delete,
} from "tsoa";
import {
  ProductCreateRequest,
  ProductUpdateRequest,
  QueriesType,
} from "./types/product.controller.types";

@Route("/v1/product")
@Tags("Product")
export class ProductController extends Controller {
  @Post("/")
  @Tags("Create Product")
  async createProduct(@Body() body: ProductCreateRequest) {
    try {
      const res = await ProductService.createProduct(body);
      this.setStatus(201);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Put("/{id}")
  @Tags("Update Product")
  async updateProduct(@Path() id: string, @Body() body: ProductUpdateRequest) {
    try {
      const res = await ProductService.updateProduct(id, body);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Delete("/{id}")
  async deleteProduct(@Path() id: string) {
    try {
      await ProductService.deleteProduct(id);
    } catch (error) {
      throw error;
    }
  }
  @Get("/")
  @Tags("Get Product All")
  public async getAllProduct(@Queries() query: QueriesType) {
    try {
      const res = await ProductService.getAllProduct(query);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
