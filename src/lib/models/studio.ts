export interface Studio {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudioWithCount {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    animes: number;
  };
  animeCount: number;
}

export class StudioModel {
  constructor(
    public id: string,
    public name: string,
    public description?: string | null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static fromDatabase(data: any): StudioModel {
    return new StudioModel(
      data.id,
      data.name,
      data.description,
      data.createdAt,
      data.updatedAt
    );
  }

  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static createNew(name: string, description?: string): StudioModel {
    return new StudioModel(crypto.randomUUID(), name, description);
  }
}
