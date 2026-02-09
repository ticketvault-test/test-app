export class PerformerAPI {
  Id: number;
  Name: string;
}

export class Performer {
  id: number;
  name: string;

  public static getDataFromAPI(data: PerformerAPI): Performer {
    return {
      id: data.Id,
      name: data.Name,
    };
  }
}
