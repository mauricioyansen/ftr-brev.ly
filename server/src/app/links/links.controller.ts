import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { LinksService } from "./links.service";
import { CreateLinkDto, createLinkSchema } from "./dto/create-link.dto";
import { ZodValidationPipe } from "@/infra/pipes/zod-validation.pipe";

@Controller("links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @HttpCode(201)
  create(@Body(new ZodValidationPipe(createLinkSchema)) body: CreateLinkDto) {
    return this.linksService.create(body);
  }

  @Get()
  findAll() {
    return this.linksService.findAll();
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.linksService.delete(id);
  }

  @Post("export")
  @HttpCode(201)
  export() {
    return this.linksService.exportToCsv();
  }

  @Get('code/:code')
  async findOneByCode(@Param('code') code: string) {
    this.linksService.incrementAccessCount(code); 
    return this.linksService.findByCode(code);
  }
}
