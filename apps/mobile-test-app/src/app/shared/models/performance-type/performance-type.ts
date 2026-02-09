export class PerformanceType {
  id: number;
  name: string;

  // FE only
  isChecked: boolean;

  public static getDataFromAPI(data: PerformanceTypeAPI): PerformanceType {
    return {
      id: data.Id,
      name: data.Name,
      isChecked: false,
    };
  }
}

export class PerformanceTypeAPI {
  Id: number;
  Name: string;
}
