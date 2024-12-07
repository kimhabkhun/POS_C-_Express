import {
  ProductCreateRequest,
  Production,
  ProductUpdateRequest,
  QueriesType,
} from "@/controllers/types/product.controller.types";
import ProductRepository from "@/database/repositories/product.repo";
class ProductService {
  async createProduct(
    newProduct: ProductCreateRequest
  ): Promise<{ message: string; data: Production }> {
    try {
      const result = await ProductRepository.createProduct(newProduct);
      return { message: "Product has been Created!", data: result };
    } catch (error) {
      console.log("error: ProductService createProduct()", error);
      throw error;
    }
  }
  async updateProduct(
    id: string,
    product: ProductUpdateRequest
  ): Promise<{ message: string; data: Production }> {
    try {
      const result = await ProductRepository.updateProduct(id, product);
      return { message: `Updated Product ${id}`, data: result };
    } catch (error) {
      console.log("error: ProductService updateProduct()", error);
      throw error;
    }
  }
  async deleteProduct(id: string) {
    try {
      await ProductRepository.deleteProduct(id);
    } catch (error) {
      console.log("error: ProductService deleteProduct()", error);
      throw error;
    }
  }
  async getAllProduct(query: QueriesType): Promise<{
    data: Production[];
    currentPage: number;
    totalPages: number;
    limit: number;
    skip: number;
    totalProducts: number;
  }> {
    const { limit = 10, page = 1, search } = query;
    const filter: {
      [key: string]: string | number | { [key: string]: number };
    } = (query.filter && JSON.parse(query.filter)) || {};
    const newFilter: {
      [key: string]: string | number | { [key: string]: number };
    } = {};

    //filter build
    for (let i in filter) {
      if (typeof filter[i] === "object") {
        newFilter[i] = {};
        for (let j in filter[i]) {
          if (j === "min") {
            newFilter[i]["$gte"] = filter[i][j];
          } else if (j == "max") {
            newFilter[i]["$lte"] = filter[i][j];
          }
        }
      } else {
        newFilter[i] = filter[i];
      }
    }
    console.log("filter:::", newFilter);
    console.log(limit, page);

    const sort: {
      [key: string]: string | { [key: string]: string };
    } = (query.sort && JSON.parse(query.sort)) || {};
    const newSort: {
      [key: string]: 1 | -1;
    } = {};
    //sort build
    for (let i in sort) {
      newSort[i] = sort[i] === "asc" ? 1 : -1;
    }
    const skip = (page - 1) * limit;
    console.log("sort:::", newSort);
    try {
      const result = await ProductRepository.getAllProduct({
        filter: newFilter,
        sort: newSort,
        limit,
        page,
        search,
        skip,
      });
      return result;
    } catch (error) {
      console.log("error: ProductService getAllProduct()", error);
      throw error;
    }
  }
}
export default new ProductService();
