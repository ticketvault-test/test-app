export class SearchEvent {
  id: number;
  name: string;

  public static getDataFromAPI(data: SearchEventAPI): SearchEvent {
    return {
      id: data.Id,
      name: data.Name,
    };
  }
}

export class SearchEventAPI {
  Id: number;
  Name: string;
}
